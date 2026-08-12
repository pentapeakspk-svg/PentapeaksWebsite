const fs = require('fs');

let content = fs.readFileSync('data/products.ts', 'utf-8');

const pools = {
    rice: ["/images/product-rice.webp", "/images/Rice.webp", "/images/RiceImportExport.webp", "/images/RiceBanner.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"],
    veg: ["/images/Vegetablebanner.webp", "/images/Export2.webp", "/images/Export5.webp", "/images/Ship_PortContainer.webp", "/images/Port.webp"],
    fruit: ["/images/fruitBanner.webp", "/images/hero-fruits.webp", "/images/Fruits.webp", "/images/Export3.webp", "/images/Export6.webp", "/images/Ship_PortContainer.webp"],
    grain: ["/images/wheat.webp", "/images/cornpreview.webp", "/images/seasemeseedspreview.webp", "/images/ai-generated/wheat_export_1.webp", "/images/ai-generated/corn_export_1.webp", "/images/ai-generated/sesame_export_1.webp", "/images/Export4.webp"],
    feed: ["/images/WheatStraw.webp", "/images/peanut straw.webp", "/images/RhodesGrassHey.webp", "/images/cornSilage.webp", "/images/Haybale.webp", "/images/Export5.webp"],
    meat: ["/images/Beef Banner.webp", "/images/beef.webp", "/images/MuttonBanner.webp", "/images/chicken.webp", "/images/Export7.webp", "/images/Export8.webp"],
    fallback: ["/images/Export2.webp", "/images/Export3.webp", "/images/Export4.webp", "/images/Export5.webp", "/images/Ship_PortContainer.webp", "/images/Port.webp", "/images/AirExport1.webp", "/images/AirExport2.webp"]
};

function getPool(id) {
    if (id.includes('rice')) return pools.rice;
    if (id.includes('veg') || id.includes('onion') || id.includes('potato') || id.includes('garlic') || id.includes('turmeric')) return pools.veg;
    if (id.includes('fruit') || id.includes('mango') || id.includes('lemon') || id.includes('kinnow') || id.includes('chilli')) return pools.fruit;
    if (id.includes('grain') || id.includes('seed')) return pools.grain;
    if (id.includes('feed') || id.includes('straw') || id.includes('silage') || id.includes('grass')) return pools.feed;
    if (id.includes('meat') || id.includes('beef') || id.includes('mutton') || id.includes('chicken')) return pools.meat;
    return pools.fallback;
}

const idPattern = /id:\s*["']([^"']+)["'][\s\S]*?images:\s*\[(.*?)\]/g;
content = content.replace(idPattern, (match, id, imagesStr) => {
    // extract individual image strings
    let images = imagesStr.split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(s => s);
    if (images.length === 0) return match;
    
    // Remove duplicates
    let uniqueImages = [...new Set(images)];
    
    // Pad to 6 using the category pool
    let pool = getPool(id);
    let i = 0;
    while (uniqueImages.length < 6 && i < pool.length) {
        if (!uniqueImages.includes(pool[i])) {
            uniqueImages.push(pool[i]);
        }
        i++;
    }
    
    // If still less than 6, use fallback pool
    i = 0;
    while (uniqueImages.length < 6 && i < pools.fallback.length) {
        if (!uniqueImages.includes(pools.fallback[i])) {
            uniqueImages.push(pools.fallback[i]);
        }
        i++;
    }

    // limit to 8 just in case, but at least 6 unique
    const newImagesStr = uniqueImages.map(img => `"${img}"`).join(', ');
    return match.replace(imagesStr, newImagesStr);
});

fs.writeFileSync('data/products.ts', content);
