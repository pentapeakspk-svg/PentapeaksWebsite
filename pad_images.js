const fs = require('fs');
let content = fs.readFileSync('data/products.ts', 'utf-8');

const idPattern = /id:\s*["']([^"']+)["'][\s\S]*?images:\s*\[(.*?)\]/g;
content = content.replace(idPattern, (match, id, imagesStr) => {
    // extract individual image strings
    let images = imagesStr.split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(s => s);
    if (images.length === 0) return match;
    
    // pad to 6 images
    let newImages = [...images];
    let i = 0;
    while (newImages.length < 6) {
        newImages.push(images[i % images.length]);
        i++;
    }
    
    // format back
    const newImagesStr = newImages.map(img => `"${img}"`).join(', ');
    return match.replace(imagesStr, newImagesStr);
});

fs.writeFileSync('data/products.ts', content);
