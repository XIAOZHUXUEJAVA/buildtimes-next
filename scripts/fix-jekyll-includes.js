const fs = require('fs');
const path = require('path');
const glob = require('glob');

const postsDir = path.join(__dirname, '../content/posts');

// Function to convert Jekyll includes to MDX-compatible syntax
function convertJekyllIncludes(content) {
  // Convert image includes
  content = content.replace(
    /{% include helpers\/image\.html name:"([^"]+)"(?:\s+caption:"([^"]*)")?(?:\s+frame:(?:true|false))?\s*%}/g,
    (match, imageName, caption) => {
      const altText = caption || imageName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      return `![${altText}](/assets/images/${imageName})`;
    }
  );

  // Convert video embeds
  content = content.replace(
    /{% include helpers\/video-embed\.html url:"([^"]+)"(?:\s+width:"(\d+)")?(?:\s+height:"(\d+)")?\s*%}/g,
    (match, url, width = '560', height = '315') => {
      return `<iframe width="${width}" height="${height}" src="${url}" frameBorder="0" allowFullScreen></iframe>`;
    }
  );

  // Convert other common Jekyll includes to comments or remove them
  content = content.replace(
    /{% include [^%]+%}/g,
    (match) => {
      console.log(`Removing Jekyll include: ${match}`);
      return `<!-- ${match} -->`;
    }
  );

  return content;
}

// Process all markdown files
const markdownFiles = glob.sync('**/*.md', { cwd: postsDir });

console.log(`Processing ${markdownFiles.length} markdown files...`);

let processedCount = 0;
let errorCount = 0;

markdownFiles.forEach(file => {
  const filePath = path.join(postsDir, file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const convertedContent = convertJekyllIncludes(content);
    
    if (originalContent !== convertedContent) {
      fs.writeFileSync(filePath, convertedContent, 'utf8');
      console.log(`✓ Processed: ${file}`);
      processedCount++;
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
    errorCount++;
  }
});

console.log(`\nCompleted! Processed ${processedCount} files with ${errorCount} errors.`);
