const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = [...walk('app/admin'), ...walk('app/student')];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/bg-dark\b/g, 'bg-gray-bg');
  content = content.replace(/bg-dark\/50/g, 'bg-white border border-border-light');
  content = content.replace(/bg-red-900\/20 border border-red-800/g, 'bg-red-50 border border-red-200 text-red-600');
  content = content.replace(/text-red-400/g, 'text-red-500');
  content = content.replace(/<h1 className="([^"]*)">/g, '<h1 className="$1 text-text-dark">');
  content = content.replace(/<h2 className="([^"]*)">/g, '<h2 className="$1 text-text-dark">');
  content = content.replace(/text-text-dark text-text-dark/g, 'text-text-dark');
  content = content.replace(/text-white/g, 'text-text-dark');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
