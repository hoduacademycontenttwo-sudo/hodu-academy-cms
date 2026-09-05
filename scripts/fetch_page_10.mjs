import fs from 'fs';
import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching https://hoduacademy.com/mod/page/view.php?id=10 ...');
  const html = await fetchUrl('https://hoduacademy.com/mod/page/view.php?id=10');
  fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_id_10.html', html);
  console.log(`Saved raw_id_10.html (Length: ${html.length} chars)`);
}

run().catch(console.error);
