const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '../public/images/features');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const images = [
  { name: 'structured-courses.png', id: '1AzTuxIg-HLRZK2JLqh_riQ0d0bY6hL3-' },
  { name: 'video-lectures.png', id: '1H2JMkQsAMoq0QnafQ2_9iB3l1pIrWaYU' },
  { name: 'smart-notes.png', id: '1W2WlL-G3mN7yVWem4TvB1GOIgpvYeuR_' },
  { name: 'tests-quizzes.png', id: '145_oBEEZTw7BbW8NFBFj3J6pejDV3KjS' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download, status: ${res.statusCode}`));
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

async function run() {
  for (const img of images) {
    const dest = path.join(dir, img.name);
    const directUrl = `https://lh3.googleusercontent.com/d/${img.id}`;
    console.log(`Downloading ${img.name} from ${directUrl}...`);
    try {
      await downloadFile(directUrl, dest);
      console.log(`Saved: ${dest} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${img.name}:`, e.message);
    }
  }
}

run();
