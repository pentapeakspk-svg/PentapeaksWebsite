const fs = require('fs');
const path = require('path');

function replaceFonts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceFonts(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content
                .replace(/'Cormorant Garamond',\s*serif/g, "'Calibri', sans-serif")
                .replace(/"'Cormorant Garamond',\s*serif"/g, '"\'Calibri\', sans-serif"')
                .replace(/'DM Sans',\s*sans-serif/g, "'Calibri', sans-serif")
                .replace(/"'DM Sans',\s*sans-serif"/g, '"\'Calibri\', sans-serif"')
                .replace(/Cormorant Garamond/g, "Calibri")
                .replace(/DM Sans/g, "Calibri");
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    }
}

replaceFonts('d:/Sumair Butt Sab/Website/pentapeaks/app');
