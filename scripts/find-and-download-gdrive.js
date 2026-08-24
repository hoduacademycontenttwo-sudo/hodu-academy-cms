const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

function extractDriveId(url) {
  if (!url || typeof url !== 'string') return null;
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  const match3 = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (match3) return match3[1];
  return null;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function inspectTable(tableName, imageColumns) {
  console.log(`\n--- Inspecting Table: ${tableName} ---`);
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`Error querying ${tableName}:`, error.message);
    return;
  }
  console.log(`Found ${data.length} rows in ${tableName}`);

  for (const row of data) {
    for (const col of imageColumns) {
      let val = row[col];
      if (!val) continue;

      // Also check if JSON string contains drive links
      let isJson = false;
      let parsed = null;
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try {
          parsed = JSON.parse(val);
          isJson = true;
        } catch {}
      }

      if (!isJson && typeof val === 'string') {
        const driveId = extractDriveId(val);
        if (driveId) {
          console.log(`[${tableName}] ID ${row.id} - Col '${col}': Found Drive link ID: ${driveId}`);
          const filename = `drive_${driveId}.png`;
          const destDir = path.join(__dirname, '../public/images/cached');
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          const destPath = path.join(destDir, filename);
          const localUrl = `/images/cached/${filename}`;

          if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 1000) {
            const directUrl = `https://lh3.googleusercontent.com/d/${driveId}`;
            console.log(`  Downloading from ${directUrl} -> ${destPath}...`);
            try {
              await downloadFile(directUrl, destPath);
              console.log(`  Saved ${filename} (${fs.statSync(destPath).size} bytes)`);
            } catch (err) {
              console.error(`  Download error:`, err.message);
            }
          }

          if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
            console.log(`  Updating ${tableName} id=${row.id} ${col} -> ${localUrl}`);
            await supabase.from(tableName).update({ [col]: localUrl }).eq('id', row.id);
          }
        }
      }

      if (isJson && parsed) {
        let changed = false;
        const checkObject = async (obj) => {
          for (const key of Object.keys(obj)) {
            if (typeof obj[key] === 'string') {
              const driveId = extractDriveId(obj[key]);
              if (driveId) {
                console.log(`[${tableName}] JSON ID ${row.id} - Key '${key}': Found Drive link ID: ${driveId}`);
                const filename = `drive_${driveId}.png`;
                const destDir = path.join(__dirname, '../public/images/cached');
                if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
                const destPath = path.join(destDir, filename);
                const localUrl = `/images/cached/${filename}`;

                if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 1000) {
                  const directUrl = `https://lh3.googleusercontent.com/d/${driveId}`;
                  console.log(`  Downloading JSON asset from ${directUrl} -> ${destPath}...`);
                  try {
                    await downloadFile(directUrl, destPath);
                    console.log(`  Saved ${filename} (${fs.statSync(destPath).size} bytes)`);
                  } catch (err) {
                    console.error(`  Download error:`, err.message);
                  }
                }

                if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
                  obj[key] = localUrl;
                  changed = true;
                }
              }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              await checkObject(obj[key]);
            }
          }
        };

        await checkObject(parsed);
        if (changed) {
          console.log(`  Updating ${tableName} JSON id=${row.id} ${col}`);
          await supabase.from(tableName).update({ [col]: JSON.stringify(parsed) }).eq('id', row.id);
        }
      }
    }
  }
}

async function run() {
  await inspectTable('cms_home_sections', ['hero_image_url', 'sections_data', 'custom_data']);
  await inspectTable('cms_gallery', ['image_url', 'caption']);
  await inspectTable('cms_results', ['photo_url']);
  await inspectTable('cms_testimonials', ['photo_url']);
  await inspectTable('cms_courses', ['thumbnail_url', 'syllabus_pdf_url']);
  await inspectTable('cms_faculty', ['photo_url']);
  console.log('\n--- Done scanning & downloading Google Drive assets ---');
}

run();
