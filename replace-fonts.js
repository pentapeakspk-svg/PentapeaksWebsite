const fs = require('fs');
const path = require('path');

function replaceFonts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceFonts(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            content = content.replace(/@import url\('https:\/\/fonts\.googleapis\.com.*?Outfit.*?'\);/g, '');
            content = content.replace(/@import url\('https:\/\/fonts\.googleapis\.com.*?Playfair\+Display.*?'\);/g, '');
            
            content = content.replace(/'Playfair Display', Georgia, serif/g, "'Calibri', sans-serif");
            content = content.replace(/'Playfair Display', serif/g, "'Calibri', sans-serif");
            content = content.replace(/'Playfair Display',serif/g, "'Calibri', sans-serif");
            content = content.replace(/'Outfit', sans-serif/g, "'Calibri', sans-serif");
            content = content.replace(/'Outfit',sans-serif/g, "'Calibri', sans-serif");
            content = content.replace(/Playfair Display/g, 'Calibri');
            content = content.replace(/Outfit/g, 'Calibri');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated fonts in: ' + fullPath);
            }
        }
    }
}

replaceFonts(path.join(process.cwd(), 'app'));
