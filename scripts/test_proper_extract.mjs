import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_897.html', 'utf8');

function extractProperMainContent(rawHtml) {
  // Find <div role="main">
  const mainIdx = rawHtml.indexOf('<div role="main">');
  if (mainIdx === -1) return '';

  // The content is inside <div class="box py-3 generalbox center clearfix">
  const boxIdx = rawHtml.indexOf('<div class="box py-3 generalbox', mainIdx);
  if (boxIdx === -1) return '';

  // Find where modified date or footer begins
  const modifiedIdx = rawHtml.indexOf('<div class="modified">', boxIdx);
  const regionMainEndIdx = rawHtml.indexOf('</section>', modifiedIdx > -1 ? modifiedIdx : boxIdx);
  
  // Or match from boxIdx to modifiedIdx
  let content = '';
  if (modifiedIdx > -1) {
    content = rawHtml.substring(boxIdx, modifiedIdx);
  } else {
    // Look for <footer
    const footerIdx = rawHtml.indexOf('<footer', boxIdx);
    content = rawHtml.substring(boxIdx, footerIdx > -1 ? footerIdx : rawHtml.length);
  }

  // Clean trailing wrapper divs
  return content.trim();
}

const fullContent = extractProperMainContent(html);
console.log('Proper full content length:', fullContent.length);
console.log('Snippet of papers and cards:');
console.log(fullContent.substring(fullContent.indexOf('id="papers"'), fullContent.indexOf('id="papers"') + 1500));
