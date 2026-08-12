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
  
  // Fix badges
  content = content.replace(/bg-blue-900\/30 text-blue-400/g, 'bg-blue-100 text-blue-700');
  content = content.replace(/bg-purple-900\/30 text-purple-400/g, 'bg-purple-100 text-purple-700');
  content = content.replace(/bg-green-900\/30 text-green-400/g, 'bg-green-100 text-green-700');
  content = content.replace(/bg-yellow-900\/30 text-yellow-400/g, 'bg-yellow-100 text-yellow-700');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed badges in: ' + file);
  }
});
