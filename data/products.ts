export interface Product {
  id: string; name: string; slug: string;
  category: "rice"|"fruits"|"vegetables"|"meat"|"grains"|"animal-feed"|"seeds"|"supplements"|"salt-lamps"|"gloves"|"sports-goods-and-apparel";
  hsCode: string; scientificName?: string; description: string[];
  varieties?: string[]; origin: string; harvestMonths: number[];
  nutritionPer100g: { nutrient: string; amount: string }[];
  packaging: string[]; logistics: string[]; moq?: string;
  fcl20ft?: string; images: string[]; videos?: string[]; seoKeywords: string[]; featured: boolean;
}

export const products: Product[] = [
  {
    id:"rice-1121-double-steam", name:"1121 Basmati Double Steam Rice",
    slug:"1121-basmati-double-steam", category:"rice", hsCode:"1006.30",
    description:["Pakistani 1121 Basmati Double Steam Rice is renowned globally for its extraordinary grain length, exceptional aroma, and pristine white appearance. Grown in the fertile Punjab and Sindh regions under ideal agro-climatic conditions, this premium variety develops kernels that elongate dramatically upon cooking - often exceeding 22mm.","The double steam process enhances nutritional retention, improves shelf stability, and ensures each grain remains perfectly separate after cooking. Widely preferred in Middle Eastern, European, and North American markets for biryani, pilaf, and premium rice dishes."],
    varieties:["White","Sella","Steam"],
    origin:"Punjab & Sindh, Pakistan", harvestMonths:[10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"~350 kcal"},{nutrient:"Carbohydrates",amount:"~78 g"},{nutrient:"Protein",amount:"~7.5 g"},{nutrient:"Fat",amount:"~0.5 g"},{nutrient:"Moisture",amount:"~13%"},{nutrient:"Broken",amount:"~0-2%"}],
    packaging:["5kg / 10kg / 25kg / 50kg PP woven bags","Custom branded packaging available","Jute bags on request"],
    logistics:["Shipped in 20ft / 40ft dry containers","20ft FCL: approx. 1050 x 25kg bags (26.25 MT)","By air freight for sample quantities"],
    moq:"1 x 20ft FCL", seoKeywords:["1121 basmati rice exporter Pakistan","double steam basmati rice"], featured:true, images:["/images/1121-Basmati-Extra-Long-Grain-Steam-Rice preview.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"]
  },
  {
    id:"rice-1121-golden-sella", name:"1121 Golden Sella Basmati",
    slug:"1121-golden-sella", category:"rice", hsCode:"1006.30",
    description:["1121 Golden Sella is a premium parboiled basmati rice with a distinctive golden hue. The parboiling process locks in nutrients and gives the rice its characteristic color and non-sticky texture after cooking.","Ideal for large-scale cooking and food service, Golden Sella maintains perfect grain separation even when held at serving temperature for extended periods."],
    varieties:["White","Sella","Steam"],
    origin:"Punjab, Pakistan", harvestMonths:[10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"~345 kcal"},{nutrient:"Carbohydrates",amount:"~77 g"},{nutrient:"Protein",amount:"~8 g"},{nutrient:"Fat",amount:"~0.6 g"},{nutrient:"Moisture",amount:"~12.5%"}],
    packaging:["5/10/25/50kg PP woven bags","Custom packaging available"],
    logistics:["20ft / 40ft dry containers","20ft FCL: ~26 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["golden sella basmati Pakistan"], featured:true, images:["/images/1121 Golden Basmati Sella Rice preview.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"]
  },
  {
    id:"rice-irri6", name:"IRRI-6 Long Grain Rice", slug:"irri-6-long-grain",
    category:"rice", hsCode:"1006.30",
    description:["IRRI-6 is Pakistan's most widely exported non-basmati rice variety, known for its medium-long grain and excellent cooking quality. With a maximum 5% broken ratio, it offers outstanding value.","Popular across Africa, Middle East, and Southeast Asian markets for everyday consumption and food manufacturing."],
    varieties:["White","Broken"],
    origin:"Sindh, Pakistan", harvestMonths:[10,11,12],
    nutritionPer100g:[{nutrient:"Energy",amount:"~350 kcal"},{nutrient:"Carbohydrates",amount:"~79 g"},{nutrient:"Protein",amount:"~7 g"},{nutrient:"Fat",amount:"~0.4 g"}],
    packaging:["25/50kg PP bags","Bulk: jumbo bags"],
    logistics:["20ft FCL: ~27 MT","40ft FCL: ~54 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["IRRI-6 rice exporter Pakistan"], featured:false, images:["/images/IRRI-6 Long Grain Rice preview.webp", "/images/ai-generated/rice_export_1.webp"]
  },
  {
    id:"rice-irri9", name:"IRRI-9 Fine Grain Rice", slug:"irri-9-fine-grain",
    category:"rice", hsCode:"1006.30",
    description:["IRRI-9 is a fine-grain non-basmati variety with low broken percentage and consistent quality. Highly sought after in Middle Eastern markets.","Known for its clean milling and versatile cooking applications."],
    varieties:["White","Steam"],
    origin:"Sindh, Pakistan", harvestMonths:[10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"~348 kcal"},{nutrient:"Carbohydrates",amount:"~78 g"},{nutrient:"Protein",amount:"~7.2 g"}],
    packaging:["25/50kg PP bags"], logistics:["20ft FCL: ~27 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["IRRI-9 rice Pakistan"], featured:false, images:["/images/IRRI-9 Fine Grain Rice preview.webp", "/images/ai-generated/rice_export_2.webp"]
  },
  {
    id:"rice-super-kernel", name:"Super Kernel Basmati Rice", slug:"super-kernel-basmati",
    category:"rice", hsCode:"1006.20",
    description:["Super Kernel Basmati is considered the finest basmati variety from Pakistan. With extra-long slender grains and an intense aroma, it represents the pinnacle of Pakistani rice quality.","Each grain cooks to fluffy perfection with excellent elongation, making it the preferred choice for premium retail markets worldwide."],
    origin:"Punjab, Pakistan", harvestMonths:[10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"~352 kcal"},{nutrient:"Carbohydrates",amount:"~78 g"},{nutrient:"Protein",amount:"~8.5 g"},{nutrient:"Moisture",amount:"~12.5%"}],
    packaging:["1/2/5/10/25kg retail & bulk bags"], logistics:["20ft FCL: ~26 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["super kernel basmati Pakistan"], featured:true, images:["/images/Super Kernel Basmati Rice preview.webp", "/images/ai-generated/rice_export_1.webp"]
  },
  {
    id:"rice-pk386", name:"PK-386 Economy Rice", slug:"pk-386-economy",
    category:"rice", hsCode:"1006.30",
    description:["PK-386 is a long grain non-basmati rice with a slight fragrance. Also known as Rozana rice, it is an affordable variety ideal for daily consumption offering good aroma and taste at a competitive price point.","Widely exported to Iraq, Afghanistan, and GCC countries. PK-386 provides wonderful grain separation and classic texture."],
    varieties:["White","Sella","Steam"],
    origin:"Punjab, Pakistan", harvestMonths:[10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"~348 kcal"},{nutrient:"Protein",amount:"~7 g"}],
    packaging:["25/50kg PP bags"], logistics:["20ft FCL: ~27 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["PK-386 rice Pakistan","PK 386 long grain rice exporter"], featured:false, images:["/images/PK-386 Economy Rice preview.webp", "/images/ai-generated/rice_export_2.webp"]
  },
  {
    id:"rice-1509-basmati", name:"1509 Basmati Rice", slug:"1509-basmati",
    category:"rice", hsCode:"1006.30",
    description:["1509 Basmati Rice is an early crop variety renowned for its long grain and fast cooking time. It offers excellent elongation, a subtle aroma, and fluffy non-sticky texture after cooking.","Popular in GCC and European markets, 1509 Basmati is a cost-effective premium option that bridges the gap between traditional basmati and economy varieties. Its quick cooking properties make it a top choice for commercial kitchens and retail consumers alike."],
    varieties:["White","Steam"],
    origin:"Punjab, Pakistan", harvestMonths:[9,10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"~348 kcal"},{nutrient:"Carbohydrates",amount:"~78 g"},{nutrient:"Protein",amount:"~7.5 g"},{nutrient:"Fat",amount:"~0.5 g"},{nutrient:"Moisture",amount:"~12.5%"}],
    packaging:["5/10/25/50kg PP woven bags","Custom branded packaging available"],
    logistics:["20ft / 40ft dry containers","20ft FCL: ~26 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["1509 basmati rice exporter Pakistan","1509 basmati rice","early crop basmati Pakistan"], featured:true, images:["/images/Rice.webp", "/images/ai-generated/rice_export_1.webp", "/images/ai-generated/rice_export_2.webp"]
  },
  {
    id:"fruit-kinnow", name:"Kinnow Mandarin", slug:"kinnow-mandarin",
    category:"fruits", hsCode:"0805.20", scientificName:"Citrus reticulata",
    description:["Pakistani Kinnow Mandarin is a juicy, sweet-tart citrus fruit grown primarily in Punjab's citrus belt. Available in three grades - Small (55-60mm), Medium (61-70mm), and Large (71-80mm).","Rich in Vitamin C and natural antioxidants, Kinnow is Pakistan's largest citrus export and is shipped to over 30 countries worldwide during the winter season."],
    varieties:["Small 55-60mm","Medium 61-70mm","Large 71-80mm"],
    origin:"Punjab, Pakistan", harvestMonths:[11,12,1,2,3],
    nutritionPer100g:[{nutrient:"Energy",amount:"77 kcal"},{nutrient:"Vitamin C",amount:"19.7 mg"},{nutrient:"Sugar",amount:"10.6 g"},{nutrient:"Fiber",amount:"1.8 g"},{nutrient:"Potassium",amount:"166 mg"}],
    packaging:["10-13kg corrugated boxes","4kg / 7kg gift cartons"],
    logistics:["40ft reefer container","Temperature: 4-6°C","Shelf life: 4-6 weeks"],
    moq:"1 x 40ft reefer", seoKeywords:["Pakistani kinnow exporter","kinnow mandarin Pakistan"], featured:true, images:["/images/KinnowMandarinpreview.webp", "/images/ai-generated/kinnow_export_1.webp"]
  },
  {
    id:"fruit-mango", name:"Chaunsa Mango", slug:"chaunsa-mango",
    category:"fruits", hsCode:"0804.50", scientificName:"Mangifera indica",
    description:["The Chaunsa mango is Pakistan's most prized mango variety, renowned for its exceptionally sweet, fiber-free flesh and intoxicating aroma. Grown in the mango belt of Southern Punjab and Sindh.","Available varieties include Sindhri (early season), Chaunsa (mid-season), Anwar Ratol, and Langra. Pakistan is the 5th largest mango producer globally."],
    varieties:["Sindhri","Chaunsa","Anwar Ratol","Langra"],
    origin:"Punjab & Sindh, Pakistan", harvestMonths:[5,6,7,8],
    nutritionPer100g:[{nutrient:"Energy",amount:"60 kcal"},{nutrient:"Sugar",amount:"13.7 g"},{nutrient:"Vitamin C",amount:"36.4 mg"},{nutrient:"Vitamin A",amount:"54 μg"},{nutrient:"Fiber",amount:"1.6 g"}],
    packaging:["5-15kg corrugated boxes","Custom retail packaging"],
    logistics:["By air freight (premium)","40ft reefer (sea)","Temperature: 10-13°C"],
    moq:"1 MT (air) / 1 x 40ft reefer (sea)", seoKeywords:["Pakistani mango exporter","chaunsa mango"], featured:true, images:["/images/ChaunsaMangopreview.webp", "/images/Mango.webp", "/images/Mango01.webp", "/images/Mango02.webp", "/images/Mango03.webp", "/images/Mango04.webp", "/images/Mango05.webp", "/images/Mango06.webp"], videos:["/images/videos/Mango10.MP4"]
  },
  {
    id:"fruit-lemon", name:"Fresh Lemon", slug:"fresh-lemon",
    category:"fruits", hsCode:"0805.50",
    description:["Pakistani lemons are known for their high juice content and vibrant flavor. Sourced from Sindh and Punjab orchards.","Used in culinary, beverage, and industrial applications globally."],
    origin:"Sindh & Punjab, Pakistan", harvestMonths:[1,2,3,7,8,9],
    nutritionPer100g:[{nutrient:"Energy",amount:"29 kcal"},{nutrient:"Vitamin C",amount:"53 mg"}],
    packaging:["5/10/15kg mesh bags or cartons"], logistics:["40ft reefer container"],
    featured:false, seoKeywords:["Pakistan lemon exporter"], images:["/images/LemonPreview.webp", "/images/ai-generated/lemon_export_1.webp"]
  },
  {
    id:"veg-red-onion", name:"Red Onion", slug:"red-onion",
    category:"vegetables", hsCode:"0703.10", scientificName:"Allium cepa L.",
    description:["Pakistani Red Onions from Sindh and Balochistan are prized for their deep red color, firm texture, and pungent flavor. They offer excellent shelf life and are a staple export commodity.","Available year-round with peak harvest in spring and autumn seasons."],
    origin:"Sindh & Balochistan, Pakistan", harvestMonths:[3,4,5,9,10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"40 kcal"},{nutrient:"Vitamin C",amount:"7 mg"},{nutrient:"Potassium",amount:"146 mg"},{nutrient:"Fiber",amount:"1.7 g"},{nutrient:"Sugar",amount:"4.2 g"}],
    packaging:["3/5/8/10/15kg mesh bags","Jute bags on request"],
    logistics:["20ft ventilated container","40ft container: ~28 MT","Temperature: 0-2°C for reefer"],
    moq:"1 x 20ft container", seoKeywords:["Pakistan red onion exporter"], featured:true, images:["/images/ai-generated/onion_export_1.webp"]
  },
  {
    id:"veg-potato", name:"Fresh Potatoes", slug:"fresh-potatoes",
    category:"vegetables", hsCode:"0701.10",
    description:["Pakistani potatoes come in two premium varieties - MOZIKA (large tuber, French fry grade, light-golden skin, oval shape) and SANTE (golden-yellow skin, deep yellow flesh, ideal for boiling/roasting).","Grown in Punjab's fertile plains, Pakistani potatoes meet international quality standards for both food service and retail markets."],
    varieties:["MOZIKA (French Fry Grade)","SANTE (Boiling/Roasting)"],
    origin:"Punjab, Pakistan", harvestMonths:[1,2,3,4,10,11,12],
    nutritionPer100g:[{nutrient:"Energy",amount:"77 kcal"},{nutrient:"Potassium",amount:"425 mg"},{nutrient:"Vitamin C",amount:"19.7 mg"},{nutrient:"Carbohydrates",amount:"17 g"},{nutrient:"Protein",amount:"2 g"}],
    packaging:["5/8/10/15kg mesh bags","25/50kg PP bags"],
    logistics:["40ft reefer container","Temperature: 4-8°C"],
    moq:"1 x 40ft reefer", seoKeywords:["Pakistan potato exporter"], featured:true, images:["/images/product-potatoes.webp", "/images/ai-generated/potato_export_1.webp"]
  },
  {
    id:"veg-garlic", name:"Fresh Garlic", slug:"fresh-garlic",
    category:"vegetables", hsCode:"0703.20",
    description:["Pakistani garlic is characterized by its strong flavor profile and high allicin content. Grown primarily in Balochistan and Sindh.","Available in both white and purple varieties, with bulb sizes ranging from 4-6cm diameter."],
    origin:"Balochistan, Pakistan", harvestMonths:[4,5,6],
    nutritionPer100g:[{nutrient:"Energy",amount:"149 kcal"},{nutrient:"Vitamin C",amount:"31 mg"}],
    packaging:["5/10kg mesh bags or cartons"], logistics:["20ft ventilated container"],
    featured:false, seoKeywords:["Pakistan garlic exporter"], images:["/images/ai-generated/garlic_export_1.webp"]
  },
  {
    id:"veg-turmeric", name:"Turmeric", slug:"turmeric",
    category:"vegetables", hsCode:"0910.30",
    description:["Pakistani turmeric is known for its high curcumin content and vibrant golden color. Used extensively in food, cosmetic, and pharmaceutical industries.","Available in whole finger and powder form."],
    origin:"Sindh, Pakistan", harvestMonths:[1,2,3],
    nutritionPer100g:[{nutrient:"Energy",amount:"312 kcal"},{nutrient:"Curcumin",amount:"~3-5%"}],
    packaging:["25/50kg PP bags"], logistics:["20ft dry container"],
    featured:false, seoKeywords:["Pakistan turmeric exporter"], images:["/images/product-turmeric.webp", "/images/ai-generated/turmeric_export_1.webp"]
  },

  {
    id:"grain-corn-maize", name:"Yellow Corn Maize", slug:"yellow-corn-maize",
    category:"grains", hsCode:"1005", scientificName:"Zea Mays",
    description:["Bright golden yellow corn maize from Pakistan, rich in starch and xanthophylls. Primarily used for poultry feed, animal feed, and industrial starch production.","Meets international quality standards with consistent kernel size and low moisture content."],
    origin:"Punjab, Pakistan", harvestMonths:[9,10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"365 kcal"},{nutrient:"Carbohydrates",amount:"74 g"},{nutrient:"Protein",amount:"9.4 g"},{nutrient:"Fat",amount:"4.7 g"},{nutrient:"Fiber",amount:"7.3 g"}],
    packaging:["25/50kg PP woven bags","Bulk: jumbo bags"],
    logistics:["20ft FCL: 24 MT","40ft FCL: 48 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["Pakistan yellow corn maize"], featured:true, images:["/images/cornpreview.webp", "/images/ai-generated/corn_export_1.webp"]
  },
  {
    id:"seed-sesame", name:"Sesame Seeds", slug:"sesame-seeds",
    category:"seeds", hsCode:"1207.40", scientificName:"Sesamum indicum",
    description:["Premium white hulled sesame seeds from Pakistan with 50-52% oil content and maximum 6% moisture. Known for exceptional purity, uniform size, and nutty flavor.","Available in natural and hulled varieties, widely used in bakery, confectionery, tahini production, and oil extraction."],
    varieties:["Natural (unhulled)","White Hulled","Black Sesame"],
    origin:"Sindh & Punjab, Pakistan", harvestMonths:[9,10,11],
    nutritionPer100g:[{nutrient:"Energy",amount:"573 kcal"},{nutrient:"Fat",amount:"50-52 g"},{nutrient:"Protein",amount:"17.7 g"},{nutrient:"Calcium",amount:"975 mg"},{nutrient:"Iron",amount:"14.6 mg"},{nutrient:"Fiber",amount:"11.8 g"}],
    packaging:["25/50kg PP bags","Vacuum sealed for retail"],
    logistics:["20ft FCL: 18-20 MT"],
    moq:"1 x 20ft FCL", seoKeywords:["Pakistan sesame seeds exporter"], featured:true, images:["/images/seasemeseedspreview.webp", "/images/ai-generated/sesame_export_1.webp"]
  },
  {
    id:"feed-rhode-grass", name:"Rhode Grass Hay", slug:"rhode-grass-hay",
    category:"animal-feed", hsCode:"1214.90",
    description:["Premium quality Rhode Grass hay, sun-dried and baled for animal feed. Rich in fiber and essential nutrients for livestock, dairy cattle, and horses.","Carefully harvested and processed to maintain nutritional value and freshness during transit."],
    origin:"Sindh & Punjab, Pakistan", harvestMonths:[3,4,5,6,7,8,9,10],
    nutritionPer100g:[{nutrient:"Crude Protein",amount:"8-10%"},{nutrient:"Crude Fiber",amount:"30-35%"},{nutrient:"Moisture",amount:"12-15%"}],
    packaging:["15-25kg compressed bales","Container-stuffed bales"],
    logistics:["40ft HC container","Reefer recommended for long transit"],
    moq:"1 x 40ft HC", seoKeywords:["Pakistan rhode grass hay"], featured:false, images:["/images/RhodesGrassHey.webp", "/images/Haybale.webp", "/images/all animal foods.jpeg"]
  },
  {
    id:"feed-corn-silage", name:"Corn Silage", slug:"corn-silage",
    category:"animal-feed", hsCode:"2309.90",
    description:["Fermented corn silage with approximately 65% moisture content. A high-energy feed ideal for dairy cattle and livestock fattening programs.","Vacuum-packed to preserve fermentation quality during international shipping."],
    origin:"Punjab, Pakistan", harvestMonths:[9,10,11],
    nutritionPer100g:[{nutrient:"Crude Protein",amount:"7-8%"},{nutrient:"Moisture",amount:"~65%"},{nutrient:"TDN",amount:"65-70%"}],
    packaging:["20kg vacuum bags","Bulk silage bags"],
    logistics:["40ft reefer container"],
    moq:"1 x 40ft reefer", seoKeywords:["Pakistan corn silage"], featured:false, images:["/images/cornSilage.webp", "/images/Haybale.webp", "/images/All Animal foods (2).jpeg"]
  },
  {
    id:"feed-wheat-straw", name:"Wheat Straw", slug:"wheat-straw",
    category:"animal-feed", hsCode:"1213.00",
    description:["Compressed wheat straw bales for animal bedding and feed supplementation. Clean, dry, and free from mold or contaminants."],
    origin:"Punjab, Pakistan", harvestMonths:[5,6],
    nutritionPer100g:[{nutrient:"Crude Fiber",amount:"38-42%"},{nutrient:"Moisture",amount:"10-12%"}],
    packaging:["20-30kg compressed bales"], logistics:["40ft HC container"],
    moq:"1 x 40ft HC", seoKeywords:["Pakistan wheat straw"], featured:false, images:["/images/WheatStraw.webp", "/images/wheatstraw02.webp", "/images/Wheatstraw05.webp", "/images/Wheatstraw06.webp", "/images/All Animal foods (3).jpeg"]
  },
  {
    id:"feed-peanut-straw", name:"Peanut Straw", slug:"peanut-straw",
    category:"animal-feed", hsCode:"2308.00",
    description:["High-fiber peanut straw used as animal feed supplement. Rich in digestible nutrients and a cost-effective feed alternative for ruminants."],
    origin:"Punjab, Pakistan", harvestMonths:[10,11],
    nutritionPer100g:[{nutrient:"Crude Protein",amount:"10-12%"},{nutrient:"Crude Fiber",amount:"25-30%"}],
    packaging:["20-30kg bales"], logistics:["40ft HC container"],
    moq:"1 x 40ft HC", seoKeywords:["Pakistan peanut straw feed"], featured:false, images:["/images/peanut straw.webp", "/images/PeanutStraw01.webp", "/images/peanut straw02.webp", "/images/peanut straw03.jpeg"]
  },
  {
    id:"feed-wheat-bran", name:"Wheat Bran", slug:"wheat-bran",
    category:"animal-feed", hsCode:"2302.30",
    description:["High-quality Pakistani wheat bran, a byproduct of wheat milling. It is an excellent source of dietary fiber and essential minerals, widely used as a nutritional supplement in poultry, cattle, and aquaculture feed."],
    origin:"Punjab, Pakistan", harvestMonths:[4,5,6],
    nutritionPer100g:[{nutrient:"Crude Protein",amount:"14-16%"},{nutrient:"Crude Fiber",amount:"10-12%"},{nutrient:"Moisture",amount:"10-12%"}],
    packaging:["25/40/50kg PP bags"], logistics:["20ft / 40ft containers"],
    moq:"1 x 20ft container", seoKeywords:["Pakistan wheat bran exporter", "animal feed wheat bran"], featured:true, images:["/images/wheat-bran.png"]
  },
  {
    id:"fruit-green-chilli", name:"Green Chilli", slug:"green-chilli",
    category:"fruits", hsCode:"0904.21",
    description:["Pakistani green chillies are known for their vibrant color and varying heat levels. Used fresh in culinary applications globally.","Available in multiple varieties from mild to extra hot."],
    origin:"Sindh, Pakistan", harvestMonths:[3,4,5,6,7,8,9,10],
    nutritionPer100g:[{nutrient:"Energy",amount:"40 kcal"},{nutrient:"Vitamin C",amount:"242 mg"}],
    packaging:["5/10kg cartons"], logistics:["40ft reefer"],
    featured:false, seoKeywords:["Pakistan green chilli exporter"], images:["/images/chillipreviewimage.webp", "/images/ai-generated/chilli_export_1.webp"]
  },
  {
    id: "himalayan-shilajit",
    name: "Himalayan Shilajit (Gold Grade)",
    slug: "himalayan-shilajit",
    category: "supplements",
    hsCode: "2106.90",
    description: [
      "Pure Himalayan Shilajit sourced from the high-altitude peaks of the Gilgit-Baltistan region. This 'Gold Grade' resin is purified using traditional methods to maintain its 85+ minerals and high fulvic acid content.",
      "Known as the 'Destroyer of Weakness', our Shilajit is laboratory tested for purity and safety. It is a powerful natural supplement for energy, vitality, and cognitive health."
    ],
    origin: "Gilgit-Baltistan, Pakistan",
    harvestMonths: [5, 6, 7, 8],
    nutritionPer100g: [
      { nutrient: "Fulvic Acid", amount: "60-80%" },
      { nutrient: "Minerals", amount: "85+" },
      { nutrient: "Humic Acid", amount: "10-15%" }
    ],
    packaging: ["15g / 30g / 50g glass jars", "Bulk 1kg containers"],
    logistics: ["Air freight worldwide", "Secure express shipping"],
    moq: "500g",
    seoKeywords: ["pure himalayan shilajit", "gold grade shilajit Pakistan", "Gilgit shilajit"],
    featured: true,
    images:["/images/shilajit.webp", "/images/ai-generated/shilajit_export_1.webp"]
  },
  {
    id: "himalayan-pink-salt",
    name: "Himalayan Pink Salt",
    slug: "pink-salt",
    category: "supplements",
    hsCode: "2501.00",
    description: [
      "100% natural Himalayan Pink Salt mined from the foothills of the Himalayas. Rich in 84 trace minerals including calcium, magnesium, potassium, and iron.",
      "Perfect for culinary use, health supplements, and spa applications. Available in fine, medium, and coarse grain sizes."
    ],
    origin: "Khewra, Pakistan",
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutritionPer100g: [
      { nutrient: "Sodium Chloride", amount: "98%" },
      { nutrient: "Minerals (84+ trace)", amount: "2%" }
    ],
    packaging: ["500g pouches", "1kg jars", "25kg bulk bags"],
    logistics: ["20ft dry container", "Air freight for smaller orders"],
    moq: "100kg",
    seoKeywords: ["himalayan pink salt exporter", "pink salt Pakistan", "khewra salt"],
    featured: true,
    images:["/images/pinksalt.jpg", "/images/ai-generated/pinksalt_export_1.webp"]
  },
  {
    id: "himalayan-salt-lamp",
    name: "Himalayan Salt Lamp",
    slug: "salt-lamp",
    category: "supplements",
    hsCode: "2501.00",
    description: [
      "Hand-carved Himalayan Salt Lamps crafted from authentic pink salt crystals. Emits a warm, soothing amber glow and natural negative ions to purify the air.",
      "Available in natural shapes and geometric designs. Includes CE/UL certified cord and bulb assembly."
    ],
    origin: "Khewra, Pakistan",
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutritionPer100g: [],
    packaging: ["Individual retail boxes", "Secure master cartons"],
    logistics: ["20ft dry container"],
    moq: "50 pieces",
    seoKeywords: ["himalayan salt lamp wholesale", "salt lamps Pakistan"],
    featured: true,
    images:["/images/saltlamp.jpg", "/images/ai-generated/saltlamp_export_1.webp"]
  },
  {
    id: "leather-gloves",
    name: "Premium Leather Gloves",
    slug: "leather-gloves",
    category: "supplements",
    hsCode: "4203.29",
    description: [
      "High-quality leather working and winter gloves manufactured in Sialkot, Pakistan. Crafted from genuine cowhide, sheep, and goat leather for durability and comfort.",
      "Suitable for industrial work, driving, fashion, and winter wear. Custom sizing and private labeling available."
    ],
    origin: "Sialkot, Pakistan",
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutritionPer100g: [],
    packaging: ["Poly bags", "Custom retail packaging"],
    logistics: ["Air freight", "20ft dry container"],
    moq: "100 pairs",
    seoKeywords: ["leather gloves manufacturer Pakistan", "industrial gloves wholesale"],
    featured: true,
    images:["/images/leathergloves.jpg", "/images/ai-generated/gloves_export_1.webp"]
  },
  {
    id: "meat-beef",
    name: "Premium Export Beef",
    slug: "premium-beef",
    category: "meat",
    hsCode: "0201.30",
    description: [
      "High-quality, hygienically processed beef sourced from healthy, grass-fed cattle in Pakistan. Processed under strict Halal guidelines.",
      "Available in both chilled and frozen formats, with customized cuts (carcass, forequarter, hindquarter, boneless) tailored for international retail and food service markets."
    ],
    varieties: ["Frozen", "Chilled", "Boneless", "Bone-in"],
    origin: "Pakistan",
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutritionPer100g: [
      { nutrient: "Energy", amount: "250 kcal" },
      { nutrient: "Protein", amount: "26 g" },
      { nutrient: "Fat", amount: "15 g" }
    ],
    packaging: ["Vacuum packed", "Carton packed", "Custom branding"],
    logistics: ["Reefer containers (Frozen: -18°C, Chilled: 0-4°C)", "Air freight for chilled"],
    moq: "1 x 20ft Reefer / 1000kg (Air)",
    seoKeywords: ["halal beef exporter Pakistan", "frozen beef", "chilled beef"],
    featured: true,
    images: ["/images/Beef03.webp", "/images/beef.webp", "/images/Beef01.webp", "/images/Beef02.webp"]
  },
  {
    id: "meat-mutton",
    name: "Premium Halal Mutton",
    slug: "premium-mutton",
    category: "meat",
    hsCode: "0204.20",
    description: [
      "Tender and flavorful mutton sourced from the finest sheep and goats in Pakistan. Handled in modern abattoirs ensuring 100% Halal compliance.",
      "Shipped frozen or chilled to maintain absolute freshness. Ideal for Middle Eastern and global catering markets."
    ],
    varieties: ["Frozen", "Chilled", "Carcass", "Custom Cuts"],
    origin: "Pakistan",
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutritionPer100g: [
      { nutrient: "Energy", amount: "294 kcal" },
      { nutrient: "Protein", amount: "25 g" },
      { nutrient: "Fat", amount: "21 g" }
    ],
    packaging: ["Stockinette wrapped", "Vacuum packed cuts"],
    logistics: ["Reefer containers", "Air freight express for chilled"],
    moq: "1 x 20ft Reefer / 1000kg (Air)",
    seoKeywords: ["halal mutton exporter", "frozen mutton Pakistan", "chilled mutton"],
    featured: true,
    images: ["/images/mutton01.webp", "/images/Mutton02.webp", "/images/Mutton10.webp"]
  },
  {
    id: "meat-chicken",
    name: "Halal Poultry & Chicken",
    slug: "premium-chicken",
    category: "meat",
    hsCode: "0207.12",
    description: [
      "Premium, disease-free poultry processed in state-of-the-art facilities in Pakistan. Hand-slaughtered strictly according to Halal standards.",
      "Available as whole chicken, boneless breast, thighs, and custom cuts. Frozen instantly to lock in natural juices and tenderness."
    ],
    varieties: ["Frozen Whole Chicken", "Chilled", "Boneless Cuts", "Chicken Paws"],
    origin: "Pakistan",
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutritionPer100g: [
      { nutrient: "Energy", amount: "239 kcal" },
      { nutrient: "Protein", amount: "27 g" },
      { nutrient: "Fat", amount: "14 g" }
    ],
    packaging: ["Individually wrapped", "Bulk cartons"],
    logistics: ["Reefer containers (-18°C)"],
    moq: "1 x 40ft Reefer",
    seoKeywords: ["halal chicken exporter", "frozen whole chicken Pakistan", "poultry export"],
    featured: true,
    images: ["/images/chicken.webp", "/images/chicken01.webp", "/images/chicken02.webp", "/images/Chicken03.webp"]
  },
  {
    id: "leather-gloves", name: "Premium Leather Gloves", slug: "premium-leather-gloves",
    category: "gloves", hsCode: "4203.29",
    description: ["Premium leather gloves manufactured in Sialkot, Pakistan. Available in multiple specialized varieties.", "Our range covers everything from heavy-duty industrial and welding work to winter and driving gloves."],
    varieties: ["Working Gloves", "Welding Gloves", "Driving Gloves", "Winter Gloves", "Mechanic Gloves"],
    origin: "Sialkot, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Poly bags", "Custom retail packaging"],
    logistics: ["Air freight", "20ft dry container"], moq: "100 pairs",
    seoKeywords: ["leather working gloves", "leather welding gloves", "sialkot leather gloves"], featured: true,
    images: [
      "/images/Products/Gloves.jpeg", "/images/Products/Gloves01.jpeg", 
      "/images/Products/Gloves02.jpeg", "/images/Products/Gloves03.jpeg",
      "/images/Products/Gloves04.jpeg", "/images/Products/Gloves05.jpeg",
      "/images/Products/Gloves06.jpeg", "/images/Products/Gloves07.jpeg",
      "/images/Products/Gloves08.jpeg", "/images/Products/Gloves09.jpeg"
    ]
  },
  {
    id: "lamp-ball", name: "Ball Candle Holder", slug: "ball-candle-holder",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Ball Candle Holder.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt ball candle holder"], featured: true,
    images: ["/images/Products/Ball candle holder.webp"]
  },
  {
    id: "lamp-bowl", name: "Bowl with Chunks", slug: "bowl-with-chunks",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Bowl with Chunks.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt bowl with chunks"], featured: true,
    images: ["/images/Products/Bowl with chunks.webp", "/images/Products/Iron basket with chunks.webp"]
  },
  {
    id: "lamp-cube", name: "Cube Shape Lamp", slug: "cube-shape-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Cube Shape Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt cube shape lamp"], featured: true,
    images: ["/images/Products/Cube shape lamp.webp", "/images/Products/Cube shape.webp"]
  },
  {
    id: "lamp-cylinder", name: "Cylinder Candle Holder", slug: "cylinder-candle-holder",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Cylinder Candle Holder.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt cylinder candle holder"], featured: true,
    images: ["/images/Products/Cylinder candle holder 01.webp", "/images/Products/Cylinder candle holder.webp", "/images/Products/cylinder shape lamp.webp"]
  },
  {
    id: "lamp-diamond", name: "Diamond Shape Lamp", slug: "diamond-shape-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Diamond Shape Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt diamond shape lamp"], featured: true,
    images: ["/images/Products/Diamond shape.webp"]
  },
  {
    id: "lamp-heart", name: "Heart Shape Candle Holder", slug: "heart-shape-candle-holder",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Heart Shape Candle Holder.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt heart shape candle holder"], featured: true,
    images: ["/images/Products/Heart shape candle holder.webp", "/images/Products/Heart shape.webp"]
  },
  {
    id: "lamp-leaf", name: "Leaf Shape Lamp", slug: "leaf-shape-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Leaf Shape Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt leaf shape lamp"], featured: true,
    images: ["/images/Products/Leaf shape.webp"]
  },
  {
    id: "lamp-natural", name: "Natural Shape Lamp", slug: "natural-shape-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Natural Shape Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt natural shape lamp"], featured: true,
    images: ["/images/Products/Natural shape.webp"]
  },
  {
    id: "lamp-pyramid", name: "Pyramid Shape Lamp", slug: "pyramid-shape-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Pyramid Shape Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt pyramid shape lamp"], featured: true,
    images: ["/images/Products/Pyramid.webp"]
  },
  {
    id: "lamp-raindrop", name: "Rain Drop Shape Lamp", slug: "rain-drop-shape-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Rain Drop Shape Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt rain drop shape lamp"], featured: true,
    images: ["/images/Products/Rain drop.webp"]
  },
  {
    id: "lamp-slab", name: "Serving Slab", slug: "serving-slab",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Serving Slab.", "Perfect for culinary use."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt serving slab"], featured: true,
    images: ["/images/Products/Serving slab.webp"]
  },
  {
    id: "lamp-table", name: "Table Lamp", slug: "table-lamp",
    category: "salt-lamps", hsCode: "2501.00",
    description: ["Hand-carved Himalayan Salt Table Lamp.", "Emits a warm, soothing amber glow."],
    origin: "Khewra, Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [], packaging: ["Individual retail boxes"],
    logistics: ["20ft dry container"], moq: "50 pieces",
    seoKeywords: ["himalayan salt table lamp"], featured: true,
    images: ["/images/Products/Table lamp.webp"]
  },
  {
    id: "sports-soccer-ball", name: "Premium Match-Grade Soccer Ball",
    slug: "premium-match-grade-soccer-ball", category: "sports-goods-and-apparel", hsCode: "9506.62",
    description: ["Our premium match-grade soccer ball is crafted with high-quality aerodynamic panels, ensuring optimal flight stability, superior control, and professional performance on the pitch. Export-ready quality designed for international athletic standards.", "Durable, water-resistant, and suitable for all weather conditions. Perfect for professional clubs, training academies, and tournament matches."],
    varieties: ["Size 5 Match", "Size 4 Training"],
    origin: "Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [],
    packaging: ["Deflated in polybags", "Custom printed cartons"],
    logistics: ["By Air Freight", "LCL/FCL Sea Freight"],
    moq: "500 Pieces", seoKeywords: ["export soccer ball Pakistan", "match grade football"], featured: true, images: [
      "/images/pro_soccer_ball.png",
      "/images/Goods and Appearels/Soccer-ball uniswift-01.png",
      "/images/Goods and Appearels/Soccer-ball uniswift-02.png",
      "/images/Goods and Appearels/Soccer-ball uniswift-03.png",
      "/images/Goods and Appearels/Soccer-ball uniswift-04.png",
      "/images/Goods and Appearels/Soccer-ball uniswift-05.png",
      "/images/Goods and Appearels/Soccer-ball uniswift-06.png"
    ]
  },
  {
    id: "sports-team-uniform", name: "Athletic Team Uniform",
    slug: "athletic-team-uniform", category: "sports-goods-and-apparel", hsCode: "6103.22",
    description: ["High-performance athletic team uniform sets designed for maximum breathability and comfort. Made with premium moisture-wicking fabric that keeps athletes dry and focused during intense gameplay.", "We offer complete customization including team colors, logos, sublimated patterns, and player numbers."],
    varieties: ["Soccer Kits", "Training Gear", "Activewear Sets"],
    origin: "Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [],
    packaging: ["Individual polybag", "Bulk master cartons"],
    logistics: ["Air Freight Express", "Sea Freight"],
    moq: "100 Sets", seoKeywords: ["custom sports uniforms Pakistan", "athletic team wear"], featured: true, images: [
      "/images/Products/soccer_kit_uniform.png",
      "/images/Products/training_gear_tracksuit.png",
      "/images/Products/activewear_set.png"
    ]
  },
  {
    id: "sports-cricket-gear", name: "Professional Cricket Gear",
    slug: "professional-cricket-gear", category: "sports-goods-and-apparel", hsCode: "9506.99",
    description: ["Top-tier professional cricket equipment featuring premium English and Kashmir willow bats, accompanied by high-grade leather cricket balls and safety batting gloves.", "Carefully crafted for balance, ping, and durability, our cricket gear meets professional club and international tournament specifications."],
    varieties: ["English Willow Bats", "Kashmir Willow", "Leather Balls", "Batting Gloves"],
    origin: "Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [],
    packaging: ["Protective sleeves for bats", "Boxed sets"],
    logistics: ["Air Express", "LCL Sea Shipment"],
    moq: "50 Kits", seoKeywords: ["professional cricket gear Pakistan", "willow bat exporter"], featured: true, images: [
      "/images/Products/cricket_bat_english.png",
      "/images/Products/cricket_bat_kashmir.png",
      "/images/Products/cricket_ball_leather.png",
      "/images/Products/cricket_batting_gloves.png"
    ]
  },
  {
    id: "sports-goalkeeper-gloves", name: "Pro Goalkeeper Gloves",
    slug: "pro-goalkeeper-gloves", category: "sports-goods-and-apparel", hsCode: "4203.21",
    description: ["Advanced goalkeeper gloves with high-grip latex technology, providing excellent ball control and impact protection. Ergonomic design ensures a snug fit and maximum flexibility.", "Engineered for elite goalkeepers, with reinforced finger saves and breathable backhand materials."],
    varieties: ["Finger Save", "Negative Cut", "Roll Finger"],
    origin: "Pakistan", harvestMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    nutritionPer100g: [],
    packaging: ["Mesh carry bags", "Retail header cards"],
    logistics: ["Air Cargo", "Sea Cargo"],
    moq: "200 Pairs", seoKeywords: ["goalkeeper gloves export", "latex sports gloves"], featured: true, images: [
      "/images/Products/gk_gloves_fingersave.png",
      "/images/Products/gk_gloves_negativecut.png",
      "/images/Products/gk_gloves_rollfinger.png"
    ]
  }
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function getCategoryCount(category: string): number {
  return products.filter(p => p.category === category).length;
}
