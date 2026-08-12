const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx')) results.push(file);
  });
  return results;
}

const files = [...walk('app/admin'), ...walk('app/student')];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/className="max-w-7xl mx-auto px-4"/g, 'className="sec-wrap"');
  
  // Cards
  content = content.replace(/className="bg-white border border-border-light border border-border-light rounded-xl p-6 hover:border-primary\/30 transition-all group"/g, 'className="admin-card group block"');
  content = content.replace(/className="bg-white border border-border-light rounded-xl p-4 text-center hover:border-primary\/30 transition-all group"/g, 'className="admin-card flex flex-col items-center justify-center text-center group block"');
  content = content.replace(/bg-white border border-border-light border border-border-light rounded-xl p-6/g, 'admin-card');
  content = content.replace(/bg-white border border-border-light rounded-xl overflow-x-auto/g, 'admin-card overflow-x-auto p-0 md:p-0');
  content = content.replace(/bg-white border border-border-light rounded-xl p-6/g, 'admin-card');
  content = content.replace(/bg-gray-bg border border-border-light px-3 py-2 text-sm/g, 'bg-gray-bg border border-border-light px-3 py-3 rounded-lg text-sm');
  
  // Grids
  content = content.replace(/gap-6/g, 'gap-[clamp(1rem,2vw,1.5rem)]');
  content = content.replace(/gap-4/g, 'gap-[clamp(0.75rem,1.5vw,1rem)]');

  // Fix padding for table container
  content = content.replace(/className="admin-card overflow-x-auto p-0 md:p-0"/g, 'className="admin-card overflow-x-auto" style={{padding:0}}');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed spacing in: ' + file);
  }
});
