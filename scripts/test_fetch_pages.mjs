import fs from 'fs';
import https from 'https';
import http from 'http';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function test() {
  const ids = ['806', '807', '677', '707', '712', '11'];
  for (const id of ids) {
    const url = `https://hoduacademy.com/mod/page/view.php?id=${id}`;
    const { status, data } = await fetchUrl(url);
    const titleMatch = data.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace('Hodu Academy: ', '').replace(' | Hodu Academy', '').trim() : 'Unknown';
    console.log(`ID ${id} [${status}]: ${title} (length: ${data.length})`);
  }
}

test();
