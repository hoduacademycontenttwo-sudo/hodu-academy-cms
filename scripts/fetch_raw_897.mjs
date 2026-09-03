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

async function run() {
  const html = await fetchUrl('https://hoduacademy.com/mod/page/view.php?id=897');
  console.log('Total raw HTML length:', html.length);
  fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_897.html', html);
  console.log('Saved to scratch/raw_897.html');
}

run();
