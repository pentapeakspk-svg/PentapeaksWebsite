const fs = require('fs');
const content = fs.readFileSync('data/products.ts', 'utf-8');
const lines = content.split('\n');

let currentId = '';
let currentName = '';
let currentImages = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const idMatch = line.match(/id:\s*`([^`]+)`|id:\s*"([^"]+)"|id:\s*'([^']+)'/);
    if (idMatch) {
        if (currentId) {
            console.log(currentId + ' | ' + currentName + ' | ' + currentImages.length + ' images');
        }
        currentId = idMatch[1] || idMatch[2] || idMatch[3];
        currentImages = [];
    }
    
    const nameMatch = line.match(/name:\s*"([^"]+)"/);
    if (nameMatch) currentName = nameMatch[1];
    
    const imagesMatch = line.match(/images:\s*\[(.*?)\]/);
    if (imagesMatch) {
        currentImages = imagesMatch[1].split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(s => s);
    }
}
if (currentId) console.log(currentId + ' | ' + currentName + ' | ' + currentImages.length + ' images');
