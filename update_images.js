const fs = require('fs');
let content = fs.readFileSync('data/products.ts', 'utf-8');

const updates = [
  // Rice
  { id: 'rice-1121-double-steam', images: 'images:["/images/RicePreviewImage.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"]' },
  { id: 'rice-1121-golden-sella', images: 'images:["/images/1121goldensella.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"]' },
  { id: 'rice-irri6', images: 'images:["/images/irri6LongGrain.webp", "/images/ai-generated/rice_export_1.webp"]' },
  { id: 'rice-irri9', images: 'images:["/images/irri9FineGrain.webp", "/images/ai-generated/rice_export_2.webp"]' },
  { id: 'rice-super-kernel', images: 'images:["/images/SuperKarnal.webp", "/images/ai-generated/rice_export_1.webp"]' },
  { id: 'rice-pk386', images: 'images:["/images/PK386.webp", "/images/ai-generated/rice_export_2.webp"]' },
  { id: 'rice-1509-basmati', images: 'images:["/images/1509.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"]' },
  
  // Fruits
  { id: 'fruit-kinnow', images: 'images:["/images/kinno.webp", "/images/ai-generated/kinnow_export_1.webp"]' },
  { id: 'fruit-lemon', images: 'images:["/images/LemonPreview.webp", "/images/ai-generated/lemon_export_1.webp"]' },
  
  // Veg
  { id: 'veg-red-onion', images: 'images:["/images/product-potatoes.webp", "/images/ai-generated/onion_export_1.webp"]' },
  { id: 'veg-potato', images: 'images:["/images/product-potatoes.webp", "/images/ai-generated/potato_export_1.webp"]' },
  { id: 'veg-garlic', images: 'images:["/images/Garlic.webp", "/images/ai-generated/garlic_export_1.webp"]' },
  { id: 'veg-turmeric', images: 'images:["/images/turmic.webp", "/images/ai-generated/turmeric_export_1.webp"]' },
  
  // Grain & Seed
  { id: 'grain-wheat', images: 'images:["/images/wheat.webp", "/images/ai-generated/wheat_export_1.webp"]' },
  { id: 'grain-corn-maize', images: 'images:["/images/cornpreview.webp", "/images/ai-generated/corn_export_1.webp"]' },
  { id: 'seed-sesame', images: 'images:["/images/seasemeseedspreview.webp", "/images/ai-generated/sesame_export_1.webp"]' },
  
  // Others
  { id: 'fruit-green-chilli', images: 'images:["/images/chillipreviewimage.webp", "/images/ai-generated/chilli_export_1.webp"]' },
  { id: 'himalayan-shilajeet', images: 'images:["/images/shilajeet.webp", "/images/ai-generated/shilajeet_export_1.webp"]' },
  { id: 'himalayan-pink-salt', images: 'images:["/images/pinksalt.jpg", "/images/ai-generated/pinksalt_export_1.webp"]' },
  { id: 'himalayan-salt-lamp', images: 'images:["/images/saltlamp.jpg", "/images/ai-generated/saltlamp_export_1.webp"]' },
  { id: 'leather-gloves', images: 'images:["/images/leathergloves.jpg", "/images/ai-generated/gloves_export_1.webp"]' },
];

for (const update of updates) {
  // Find the block of the product
  const idPattern = new RegExp(`id:\\s*["']${update.id}["'][\\s\\S]*?images:\\s*\\[.*?\\]`, 'g');
  content = content.replace(idPattern, (match) => {
    return match.replace(/images:\s*\[.*?\]/, update.images);
  });
}

fs.writeFileSync('data/products.ts', content);
