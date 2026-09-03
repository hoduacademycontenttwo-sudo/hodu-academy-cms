import fs from 'fs';
import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function extractCleanContent(rawHtml) {
  const mainMatch = rawHtml.match(/<div role="main">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i) ||
                    rawHtml.match(/<div class="box py-3 generalbox">([\s\S]*?)<\/div>/i) ||
                    rawHtml.match(/<div id="region-main"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);
  return mainMatch ? mainMatch[1].trim() : '';
}

async function run() {
  const html = await fetchUrl('https://hoduacademy.com/mod/page/view.php?id=770');
  const clean = extractCleanContent(html);
  console.log('Length:', clean.length);
  console.log(clean.substring(0, 1500));
}

run();
