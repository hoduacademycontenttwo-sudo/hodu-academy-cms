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

function extractCleanContent(rawHtml) {
  // Try matching <div role="main">...</div>
  const mainMatch = rawHtml.match(/<div role="main">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i) ||
                    rawHtml.match(/<div class="box py-3 generalbox">([\s\S]*?)<\/div>/i) ||
                    rawHtml.match(/<div id="region-main"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);

  if (mainMatch) {
    return mainMatch[1];
  }
  return '';
}

async function run() {
  const data = await fetchUrl('https://hoduacademy.com/mod/page/view.php?id=806');
  const clean = extractCleanContent(data);
  console.log('Extracted length for 806:', clean.length);
  console.log('Sample content snippet:');
  console.log(clean.substring(0, 500));
}

run();
