import fs from 'fs';
import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (err) => resolve({ status: 500, error: err.message, data: '' }));
  });
}

async function testFetch() {
  const testIds = [702, 703, 704, 705, 706, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780];
  for (const id of testIds) {
    const res = await fetchUrl(`https://hoduacademy.com/mod/page/view.php?id=${id}`);
    const titleMatch = res.data.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace('Hodu Academy: ', '').replace(' | Hodu Academy', '').trim() : 'Unknown';
    console.log(`ID ${id} [${res.status}]: ${title} (len: ${res.data.length})`);
  }
}

testFetch();
