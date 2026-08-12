"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useParams, redirect } from "next/navigation"
import { fadeUpVariant, staggerContainer } from "@/lib/animations"
import { ArrowRight, Package, Truck, MapPin, Calendar, ChevronRight, Globe2, ShoppingCart, CheckCircle, ArrowLeft } from "lucide-react"
import { getProductBySlug, getProductsByCategory } from "@/data/products"
import { months, categories } from "@/lib/utils"


function HarvestingCalendar({ harvestMonths }: { harvestMonths: number[] }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(50px,1fr))", gap:"0.6rem" }}>
      {months.map((month, i) => (
        <div key={month} style={{ padding:".5rem .25rem", textAlign:"center", fontSize:".7rem", fontWeight:600, borderRadius:6, background:harvestMonths.includes(i + 1) ? "#1C5230" : "#E8E3DC", color:harvestMonths.includes(i + 1) ? "#fff" : "#8A9E8B", transition:"all .2s" }}>
          {month}
        </div>
      ))}
    </div>
  )
}

function NutritionTable({ data }: { data: { nutrient: string; amount: string }[] }) {
  return (
    <table style={{ width:"100%", borderCollapse:"collapse" }}>
      <thead>
        <tr style={{ borderBottom:"2px solid #E8E3DC" }}>
          <th style={{ textAlign:"left", padding:".8rem", fontSize:".85rem", fontWeight:600, color:"#16261A" }}>Nutrient</th>
          <th style={{ textAlign:"left", padding:".8rem", fontSize:".85rem", fontWeight:600, color:"#16261A" }}>Amount per 100g</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} style={{ borderBottom:"1px solid #E8E3DC" }}>
            <td style={{ textAlign:"left", padding:".8rem", fontSize:".8rem", color:"#4A5D4C" }}>{row.nutrient}</td>
            <td style={{ textAlign:"left", padding:".8rem", fontSize:".8rem", fontWeight:600, color:"#1C5230" }}>{row.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const category = params.category as string

  if (category === "fruits" || category === "vegetables") {
    redirect(`/products/fresh-fruits-and-vegetables/${slug}`)
  }

  const product = getProductBySlug(slug)
  const catInfo = categories.find(c => c.slug === category)
  const catName = catInfo?.name || category
  const relatedProducts = (category === "fresh-fruits-and-vegetables"
    ? [...getProductsByCategory("fruits"), ...getProductsByCategory("vegetables")]
    : getProductsByCategory(category)
  ).filter(p => p.slug !== slug).slice(0, 3)

  // State for Daraz-style checkout (gloves & salt-lamps)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", variety: product?.varieties?.[0] || ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (product?.varieties && product?.images) {
      const index = product.varieties.indexOf(formData.variety)
      if (index !== -1 && product.images[index]) {
        setSelectedImage(product.images[index])
      }
    }
  }, [formData.variety, product])

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product?.name,
          productSlug: product?.slug,
          quantity,
          unitPrice: 0, // No pricing
          totalPrice: 0,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to place order")
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const catImages: Record<string, string> = {
    rice: "/images/product-rice.webp",
    "fresh-fruits-and-vegetables": "/images/product-potatoes.webp",
    fruits: "/images/product-mangoes.webp",
    vegetables: "/images/product-potatoes.webp",
    grains: "/images/product-corn.webp",
    "animal-feed": "/images/product-corn.webp",
    seeds: "/images/product-salt.webp",
    meat: "/images/Beef03.webp",
  }

  const categoryBanners: Record<string, string> = {
    rice: "/images/RiceBanner.webp",
    "animal-feed": "/images/AnimalFeedBanner.webp",
    fruits: "/images/fruitBanner.webp",
    vegetables: "/images/Vegetablebanner.webp",
    "fresh-fruits-and-vegetables": "/images/Vegetablebanner.webp",
    grains: "/images/GrainsBanner.webp",
    seeds: "/images/Seaseamsbanner.webp",
    meat: "/images/Beef Banner.webp",
  }

  const productBanners: Record<string, string> = {
    "kinnow-mandarin": "/images/KinnowMandarinBanner.webp",
    "chaunsa-mango": "/images/chaunsaMangoBanner.webp",
    "fresh-lemon": "/images/LemonBanner.webp",
    "green-chilli": "/images/ChilliBanner.webp",
    "pakistani-wheat": "/images/wheat.webp",
    "yellow-corn-maize": "/images/cornbanner.webp",
    "sesame-seeds": "/images/Seaseamsbanner.webp",
    "premium-beef": "/images/Beef Banner.webp",
    "premium-mutton": "/images/MuttonBanner.webp",
    "premium-chicken": "/images/chickenBanner.webp",
  }

  const bannerImage = productBanners[slug] || categoryBanners[category] || (product && product.images && product.images[0])

  const splitSectionDetails: Record<string, {
    tag: string;
    title: string;
    italicTitle: string;
    desc: string;
    pills: string[];
    image: string;
    conceptLabel: string;
    conceptItalic: string;
  }> = {
    // Rice
    "1121-basmati-double-steam": {
      tag: "Premium Basmati Rice",
      title: "1121 Extra Long Grain",
      italicTitle: "& Double Steam Process",
      desc: "Procured from the fertile beds of Punjab and Sindh, our 1121 Double Steam Basmati is aged to perfection. The double steaming process locks in natural nutrients, elongates kernels post-cooking, and guarantees pristine separation.",
      pills: ["Extra Long Grain", "Exceptional Aroma", "Double Steamed", "Aged 12+ Months", "Moisture < 12.5%"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Punjab Fields • Milling",
      conceptItalic: "Sifting • Sorting",
    },
    "1121-golden-sella": {
      tag: "Parboiled Basmati Sella",
      title: "1121 Golden Sella",
      italicTitle: "& Premium Parboiling",
      desc: "Our parboiled 1121 Golden Sella rice is steamed under pressure before milling. This locks in essential vitamins and starch structure, delivering an ultra-nutritious grain that cooks perfectly separate with a beautiful golden sheen.",
      pills: ["Golden Hue", "High Nutrition", "Non-Sticky Texture", "Catering Choice", "Volume Elongation"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Steaming • Hulling",
      conceptItalic: "Milling • Packaging",
    },
    "irri-6-long-grain": {
      tag: "Non-Basmati Long Grain",
      title: "IRRI-6 Export Grade",
      italicTitle: "& Bulk Global Supplies",
      desc: "IRRI-6 is Pakistan's largest volume non-basmati export grain, sourced from the expansive flat farms of Sindh. An ideal and highly cost-effective everyday long grain preferred by importers in Africa and East Asia.",
      pills: ["Long Grain", "Cost-Effective", "Pristine Milling", "Jumbo Bulk Bags", "FCL Logistics"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Sindh Farms • Sorting",
      conceptItalic: "Bulk Packing • FOB",
    },
    "irri-9-fine-grain": {
      tag: "Fine Grain Export",
      title: "IRRI-9 Fine Grain",
      italicTitle: "& Consistent Sizing",
      desc: "A premium medium-long non-basmati grain with exceptional cooking attributes and highly uniform kernel sizing. Sourced from Sindhi growers, it delivers premium table texture at everyday economical rates.",
      pills: ["Fine Grain", "Uniform Sizing", "Low Broken Ratio", "Economic Premium", "Export Standard"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Harvesting • Cleaning",
      conceptItalic: "Hulling • Ship Container",
    },
    "super-kernel-basmati": {
      tag: "Pure Basmati Heritage",
      title: "Super Kernel Basmati",
      italicTitle: "& Legendary Aroma",
      desc: "Considered the gold standard of Pakistani basmati, Super Kernel Basmati is renowned for its slender grains and unparalleled aroma. Aged traditionally to achieve deep, rich flavor notes and supreme fluffy texture.",
      pills: ["Legendary Aroma", "Slender Grains", "Aged Traditionally", "Pristine White", "High Elongation"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Aged Crops • Traditional",
      conceptItalic: "Milling • Quality Lab",
    },
    "pk-386-economy": {
      tag: "Economical Basmati",
      title: "PK-386 Economy Rice",
      italicTitle: "& Everyday Rozana Grade",
      desc: "PK-386 offers a fragrant everyday basmati experience at a highly competitive price point. Sourced from North Punjab's fertile valleys, it provides wonderful grain separation and classic basmati texture.",
      pills: ["Rozana Grade", "Fragrant Grain", "Budget-Friendly", "Punjab Crop", "Custom Packaging"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Sourcing • Polishing",
      conceptItalic: "Sorting • Packing",
    },
    "1509-basmati": {
      tag: "Early Crop Basmati",
      title: "1509 Basmati Rice",
      italicTitle: "& Fast Cooking Premium",
      desc: "1509 Basmati is an early crop variety with long grains that cook quickly while maintaining excellent elongation and fluffy separation. A cost-effective premium option bridging traditional basmati and economy grades, favored by commercial kitchens and retail consumers in GCC and European markets.",
      pills: ["Long Grain", "Fast Cooking", "Early Crop", "Excellent Elongation", "GCC & Europe Markets"],
      image: "/images/RiceImportExport.webp",
      conceptLabel: "Punjab Harvest • Aging",
      conceptItalic: "Milling • Export Packing",
    },
    // Fruits
    "kinnow-mandarin": {
      tag: "Premium Citrus Export",
      title: "Sargodha Citrus Belt",
      italicTitle: "& Cold-Chain Logistics",
      desc: "Penta Peaks is a leading exporter of Pakistan's world-famous Kinnow Mandarins. Sourced from the premium orchards of Sargodha, we manage the entire cold chain - from waxing and sorting to refrigerated shipping and custom packaging.",
      pills: ["Small (55-60mm)", "Medium (61-70mm)", "Large (71-80mm)", "Reefer Cold Chain", "SGS Inspected"],
      image: "/images/KinnowMandarinsection.webp",
      conceptLabel: "Punjab Groves • Waxing",
      conceptItalic: "Sorting • Calibration",
    },
    "chaunsa-mango": {
      tag: "The King of Mangoes",
      title: "Multan & Mirpur Khas",
      italicTitle: "& Premium Air-Freight",
      desc: "Sourced from Multan's legendary orchards, our premium Chaunsa Mangoes are renowned for their fiber-free pulp, rich honey-sweet taste, and intense aroma. We specialize in hot-water treatment (HWT) and fast air-freight logistics for maximum freshness.",
      pills: ["White Chaunsa", "Sindhri Mangoes", "Anwar Ratol", "Hot Water Treated", "Air & Sea Freight"],
      image: "/images/chaunsaMangoSectionimagewebp.webp",
      conceptLabel: "Orchards • Treatment",
      conceptItalic: "HWT • Packing",
    },
    "fresh-lemon": {
      tag: "High Juice Citrus",
      title: "Zesty & Juicy Lemons",
      italicTitle: "& Standard Ventilation",
      desc: "Our premium fresh lemons are loaded with vitamin C and high citric juice content. Grown in the sun-drenched orchards of Punjab and Sindh, every batch is picked at optimal ripeness and calibrated for export.",
      pills: ["High Juice Content", "Skins & Rind Grade", "Standardized Sizing", "Mesh Bag Packing", "Reefer Freshness"],
      image: "/images/LemonSectionimage.webp",
      conceptLabel: "Fresh Pick • Washing",
      conceptItalic: "Juiciness • Sorting",
    },
    "green-chilli": {
      tag: "Spice & Heat Premium",
      title: "Fresh Green Chillies",
      italicTitle: "& Direct Air Shipment",
      desc: "Vibrant, spicy, and perfectly fresh. Sourced from selective spice farms, our green chillies are sorted, pre-cooled, and packed in ventilated export cartons to maintain their crisp texture and pungent heat upon arrival.",
      pills: ["Pungent & Spicy", "Vibrant Green color", "Calibrated Sizes", "Pre-Cooled Transit", "Ventilated Cartons"],
      image: "/images/chilliSectionimage.webp",
      conceptLabel: "Farm Fresh • Sorting",
      conceptItalic: "Pre-Cooling • Export",
    },
    // Vegetables
    "red-onion": {
      tag: "Premium Onion Export",
      title: "Dehydrated & Fresh Red Onions",
      italicTitle: "& Standard Ventilation",
      desc: "Sourced directly from farmers in Sindh & Balochistan, our red onions boast a beautiful dark red color, highly pungent aroma, and incredibly firm layers. Ideal for overseas transport with low weight loss.",
      pills: ["Firm Red Layers", "Pungent Flavor", "Well-Dried Necks", "Ventilated Containers", "SGS Inspected"],
      image: "/images/product-potatoes.webp",
      conceptLabel: "Sindh Crops • Drying",
      conceptItalic: "Sorting • Grading",
    },
    "fresh-potatoes": {
      tag: "Grade-A Potato Supply",
      title: "Mozika & Sante Potatoes",
      italicTitle: "& Temperature Reefers",
      desc: "Direct farm sourcing of premium Mozika (ideal for French fries) and Sante (best for roasting) potatoes. Handled with absolute care, washed, calibrated, and shipped in high-performance reefer containers.",
      pills: ["Mozika (Fry Grade)", "Sante (Roasting)", "No Hollow Hearts", "Cold Reefer Shipping", "Uniform Calibre"],
      image: "/images/product-potatoes.webp",
      conceptLabel: "Farms Sourcing • Calibration",
      conceptItalic: "Washing • Reefer Packing",
    },
    "fresh-garlic": {
      tag: "Allicin-Rich Garlic",
      title: "Premium Pakistani Garlic",
      italicTitle: "& Air-Dried Preservation",
      desc: "Our premium garlic features large firm cloves with strong flavor profiles and high allicin content. Expertly cured and cleaned to maximize shelf life, preventing mold and sprouting during overseas shipment.",
      pills: ["Strong Pungency", "Large Bulbs (4-6cm)", "Fully Cured & Dry", "Anti-Sprout Curing", "Grade-A Export"],
      image: "/images/product-potatoes.webp",
      conceptLabel: "Balochistan Crops • Curing",
      conceptItalic: "Hulling • Mesh Packing",
    },
    "turmeric": {
      tag: "Golden Grade Curcumin",
      title: "Sindh Premium Turmeric",
      italicTitle: "& Whole Finger Grade",
      desc: "Grown in the hot agricultural lands of Sindh, our whole turmeric fingers are sun-dried, polished, and processed to maintain their high curcumin content and deep yellow color. Ideal for spice manufacturers globally.",
      pills: ["High Curcumin", "Sun-Dried Fingers", "Polished & Clean", "Intense Golden Hue", "Bulk PP Sacks"],
      image: "/images/product-potatoes.webp",
      conceptLabel: "Sindh Orchards • Polishing",
      conceptItalic: "Drying • Quality Lab",
    },
    // Grains
    "pakistani-wheat": {
      tag: "High Protein Milling",
      title: "Hard Red Pakistani Wheat",
      italicTitle: "& Global Flour Milling",
      desc: "Grown in Punjab's fertile fields, our wheat contains optimal gluten levels and 12-13% protein, making it ideal for standard bread flours and baking. Every FCL load undergoes strict phytosanitary testing.",
      pills: ["12-13% Protein", "Low Moisture (<12.5%)", "High Gluten Strength", "Clean Bulk Packing", "Phytosanitary Clean"],
      image: "/images/wheatSectionimage.webp",
      conceptLabel: "Punjab Fields • Silos",
      conceptItalic: "Quality Testing • Port Load",
    },
    "yellow-corn-maize": {
      tag: "Golden Poultry Grade",
      title: "Yellow Corn Maize",
      italicTitle: "& High-Starch Animal Feed",
      desc: "Our premium yellow corn is harvested at peak maturity, dried to optimal moisture levels, and sifted to ensure highly uniform kernels. Rich in energy and nutrients, perfect for poultry feed and starch producers.",
      pills: ["High Energy Starch", "Low Moisture (<14%)", "Uniform Kernel Size", "Aflatoxin Certified", "Jumbo Bulk Bags"],
      image: "/images/cornsectionimage.webp",
      conceptLabel: "Corn Fields • Drying",
      conceptItalic: "Sifting • Bulk Sacks",
    },
    // Animal Feed
    "rhode-grass-hay": {
      tag: "High Protein Forage",
      title: "Rhode Grass Hay Bales",
      italicTitle: "& Double-Compressed Packing",
      desc: "Our Rhodes Grass is grown under pivot irrigation, harvested at optimal pre-flowering maturity, and double-compressed to ensure premium green color, high protein levels, and maximum shipping efficiency.",
      pills: ["High Digestible Fiber", "Pivot Irrigated", "Double Compressed", "Moisture < 12%", "Dairy Feed Choice"],
      image: "/images/AnimalFeedBanner.webp",
      conceptLabel: "Hay Harvest • Compression",
      conceptItalic: "Moisture Check • Reefer Shipping",
    },
    "corn-silage": {
      tag: "Fermented High Energy Feed",
      title: "Premium Corn Silage Bales",
      italicTitle: "& Vacuum Seal Packing",
      desc: "Packed with energy and starch, our corn silage is fermented under rigorous anaerobic conditions and vacuum-sealed in heavy-duty poly-woven bags to guarantee peak nutritional value for dairy livestock.",
      pills: ["Starch Rich Feed", "Vacuum Sealed Bales", "Anaerobic Ferment", "Dairy Growth Boost", "High Shelf Stability"],
      image: "/images/AnimalFeedBanner.webp",
      conceptLabel: "Harvest Chop • Baling",
      conceptItalic: "Vacuum Wrapping • Container",
    },
    "wheat-straw": {
      tag: "Economical Forage & Bedding",
      title: "Compressed Wheat Straw",
      italicTitle: "& Clean Dry Bedding",
      desc: "Premium quality wheat straw gathered post-harvest, thoroughly dried, and compressed into compact, heavy-duty bales. Ideal as a cost-effective fiber supplement and dry, clean bedding for livestock stables.",
      pills: ["Sun-Dried Fiber", "Compact Balings", "Dust & Mold Free", "Highly Absorbent", "Economic Sourcing"],
      image: "/images/AnimalFeedBanner.webp",
      conceptLabel: "Post-Harvest Baling • Drying",
      conceptItalic: "Quality Inspection • High Cube loading",
    },
    "peanut-straw": {
      tag: "Legume Rich Protein Forage",
      title: "Premium Peanut Straw",
      italicTitle: "& Highly Nutritious Ruminant Feed",
      desc: "Sourced from major peanut-producing hubs, our peanut straw hay contains high digestible protein and leaf-to-stem ratios. Rich in essential minerals, offering a premium and sweet legume alternative for livestock.",
      pills: ["Legume Protein", "Highly Digestible", "Leafy Compact Bales", "Sweet Fragrant Forage", "SGS Inspected"],
      image: "/images/AnimalFeedBanner.webp",
      conceptLabel: "Legume Drying • Packing",
      conceptItalic: "Fibre Grading • Bulk load",
    },
    // Seeds
    "sesame-seeds": {
      tag: "High Oil Oleaginous",
      title: "White & Natural Sesame Seeds",
      italicTitle: "& Triple-Cleaned Premium Purity",
      desc: "Penta Peaks sesame seeds are triple-cleaned and color-sorted to achieve 99.9% purity. High in natural oil content (50-52%), they are ideal for tahini makers, commercial bakers, and premium seed oil extraction.",
      pills: ["99.9% Purity", "High Oil Content", "Color Sorted", "Natural & Hulled", "Grade-A Retail Packs"],
      image: "/images/Seasemesectionimage.webp",
      conceptLabel: "Seed Sorting • Purity Cleaning",
      conceptItalic: "Colour Sorting • Dry Containers",
    },
    // Supplements
    "himalayan-shilajit": {
      tag: "85+ Trace Mineral resin",
      title: "Gold Grade Pure Shilajit",
      italicTitle: "& Himalayan High Altitude Sourcing",
      desc: "Sourced from the pristine high-altitude peaks of Gilgit-Baltistan at 16,000+ feet, our Shilajit undergoes organic water purification to ensure maximum fulvic acid concentration and complete heavy metal elimination.",
      pills: ["85+ Trace Minerals", "60-80% Fulvic Acid", "Lab Certified Purity", "Gilgit Altitude Source", "Glass Jar Retail Packs"],
      image: "/images/product-salt.webp",
      conceptLabel: "Peak Harvesting • Traditional Purification",
      conceptItalic: "Curative Filtration • Metal Testing",
    },
    // Meat
    "premium-beef": {
      tag: "100% Halal Certified",
      title: "Premium Export Beef",
      italicTitle: "& Precision Cuts",
      desc: "Sourced from healthy, grass-fed cattle in Pakistan. Our export-grade beef is processed in state-of-the-art abattoirs ensuring the highest hygiene and Halal compliance. Available chilled or frozen with customized cuts.",
      pills: ["100% Halal", "Grass-Fed Cattle", "Custom Cuts", "Chilled & Frozen", "Strict Hygiene"],
      image: "/images/Beef03.webp",
      conceptLabel: "Abattoir Processing • Cold Chain",
      conceptItalic: "Halal Slitting • Packaging",
    },
    "premium-mutton": {
      tag: "100% Halal Certified",
      title: "Premium Halal Mutton",
      italicTitle: "& Export Grade Quality",
      desc: "Our tender mutton is carefully sourced from the finest sheep and goats. Processed and exported with a strict unbroken cold chain to ensure peak freshness upon arrival at any global destination.",
      pills: ["Tender Meat", "100% Halal", "Unbroken Cold Chain", "Chilled & Frozen", "Export Certified"],
      image: "/images/Mutton02.webp",
      conceptLabel: "Sourcing • Halal Processing",
      conceptItalic: "Cold Storage • Reefer Shipping",
    },
    "premium-chicken": {
      tag: "Disease-Free Poultry",
      title: "Halal Poultry & Chicken",
      italicTitle: "& Instant Freezing",
      desc: "Premium quality poultry processed under strict international standards. From whole chicken to boneless cuts, we guarantee 100% Halal processing and instant freezing to lock in tenderness and flavor.",
      pills: ["Disease-Free", "100% Halal", "Instant Frozen", "Whole & Cuts", "SGS Inspected"],
      image: "/images/chicken01.webp",
      conceptLabel: "Farm Sourcing • Processing",
      conceptItalic: "Instant Freezing • Loading",
    }
  }

  if (!product) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <h1 style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(2rem,5vw,3.5rem)", color:"#1C5230", marginBottom:"1rem" }}>Product Not Found</h1>
          <Link href="/products" style={{ background:"#0B1A0E", color:"#fff", padding:".8rem 1.5rem", borderRadius:6, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:".5rem", fontSize:".7rem", fontWeight:600, letterSpacing:".16em", textTransform:"uppercase" }}>Back to Products</Link>
        </div>
      </div>
    )
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description[0],
    brand: { "@type": "Brand", name: "Penta Peaks International" },
    countryOfOrigin: "Pakistan",
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
  }

  if (category === "gloves" || category === "salt-lamps" || category === "supplements" || category === "sports-goods-and-apparel") {
    return (
      <div className="bg-gray-bg min-h-screen">
        <style>{`
          .ticker { background: #0D2B4A; border-top: 1px solid rgba(200,150,62,0.2); border-bottom: 1px solid rgba(200,150,62,0.2); overflow: hidden; padding: 0.75rem 0; }
          .ticker-inner { display: flex; gap: 0; white-space: nowrap; animation: tickerScroll 28s linear infinite; }
          .ticker-inner:hover { animation-play-state: paused; }
          .ticker-item { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0 2.5rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
          .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #C8963E; flex-shrink: 0; }
          @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="sec-wrap pt-32 pb-12">
          <Link href={`/products/${category}`} className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {catName}
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              <div className="p-8 lg:p-12 bg-primary-pale/30 border-b lg:border-b-0 lg:border-r border-border-light">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4 shadow-md bg-white">
                  <Image 
                    src={
                      selectedImage ||
                      ((product.slug === 'premium-leather-gloves' && formData.variety === 'Working Gloves') ? "/images/Products/Gloves.jpeg" :
                      (product.slug === 'premium-leather-gloves' && formData.variety === 'Welding Gloves') ? "/images/Products/Gloves02.jpeg" :
                      (product.slug === 'premium-leather-gloves' && formData.variety === 'Driving Gloves') ? "/images/Products/Gloves04.jpeg" :
                      (product.slug === 'premium-leather-gloves' && formData.variety === 'Winter Gloves') ? "/images/Products/Gloves06.jpeg" :
                      (product.slug === 'premium-leather-gloves' && formData.variety === 'Mechanic Gloves') ? "/images/Products/Gloves08.jpeg" :
                      (product.images[0] || catImages[product.category] || "/images/product-rice.webp"))
                    } 
                    alt={`${product.name} - ${formData.variety || 'Default'}`} 
                    fill 
                    className="object-contain p-4"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                    {product.images.map((img, idx) => {
                      const isSelected = selectedImage === img || (!selectedImage && idx === 0);
                      return (
                        <button 
                          key={idx} 
                          onClick={() => setSelectedImage(img)}
                          className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        >
                          <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-contain bg-white" />
                        </button>
                      )
                    })}
                  </div>
                )}
                <span className="inline-block px-3 py-1 bg-white border border-border-light rounded-full text-xs font-bold text-accent tracking-wider uppercase mb-4">
                  {product.category.replace("-", " ")}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-4">
                  {product.name}
                </h1>
                
                <div className="space-y-4 text-text-body">
                  <p>{product.description[0]}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-light">
                    <div>
                      <span className="block text-xs text-text-muted uppercase tracking-wider font-bold mb-1">HS Code</span>
                      <span className="font-medium text-text-dark">{product.hsCode}</span>
                    </div>
                    {product.moq && (
                      <div>
                        <span className="block text-xs text-text-muted uppercase tracking-wider font-bold mb-1">MOQ</span>
                        <span className="font-medium text-text-dark">{product.moq}</span>
                      </div>
                    )}
                  </div>
                  {product.slug === 'himalayan-shilajit' && (
                    <div className="mt-8 pt-6 border-t border-border-light">
                      <h3 className="text-lg font-bold text-text-dark mb-3">Lab Test Report</h3>
                      <p className="text-sm text-text-muted mb-4">Certified for purity, heavy metals, and fulvic acid content.</p>
                      <div className="relative w-full h-80 rounded-lg overflow-hidden border border-border-light shadow-sm">
                        <Image 
                          src="/images/shilajit-test-report.jpg" 
                          alt="Shilajit Lab Test Report" 
                          fill 
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Form Side */}
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary" /> Checkout
                </h2>

                {success ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center h-full flex flex-col justify-center items-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Order Placed!</h3>
                    <p className="text-green-700 mb-6">
                      Thank you, {formData.name}. Your order for {quantity}x {product.name} has been successfully placed. We will contact you shortly regarding shipping and payment details.
                    </p>
                    <button onClick={() => window.location.href = `/products/${category}`} className="btn-primary">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
                    
                    {product.varieties && product.varieties.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-text-dark mb-2">Select Variety</label>
                        <select 
                          className="input-field"
                          value={formData.variety}
                          onChange={(e) => setFormData({...formData, variety: e.target.value})}
                          required
                        >
                          {product.varieties.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-text-dark mb-2">Quantity</label>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">-</button>
                        <input 
                          type="number" 
                          min="1" 
                          value={quantity} 
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center input-field !mb-0"
                        />
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">+</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-text-dark mb-2">Full Name</label>
                        <input required type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-dark mb-2">Email</label>
                        <input required type="email" className="input-field" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-dark mb-2">Phone Number</label>
                      <input required type="tel" className="input-field" placeholder="+1 234 567 8900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-dark mb-2">Shipping Address</label>
                      <textarea required className="input-field min-h-[100px]" placeholder="Full delivery address including country" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                    </div>

                    <div className="pt-6 border-t border-border-light">
                      <button type="submit" disabled={submitting} className="btn-primary w-full text-lg py-4 flex justify-center items-center gap-2">
                        {submitting ? "Processing..." : (
                          <><ShoppingCart className="w-5 h-5" /> Place Order Securely</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="mt-12 bg-white rounded-2xl p-6 md:p-10 border border-border-light shadow-sm">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-6">Product Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {product.images.map((img, idx) => (
                    <div key={idx} className="relative h-40 md:h-48 rounded-xl overflow-hidden border border-border-light shadow-sm group">
                       <Image src={img} alt={`${product.name} gallery ${idx + 1}`} fill className="object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>



        {/* ══════ RELATED PRODUCTS ══════ */}
        {relatedProducts.length > 0 && (
          <div className="sec-wrap pb-20">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-dark mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/products/${(rp.category === "fruits" || rp.category === "vegetables") ? "fresh-fruits-and-vegetables" : rp.category}/${rp.slug}`} className="group bg-white rounded-xl border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-all block hover:-translate-y-1">
                  <div className="relative h-36 md:h-48 w-full overflow-hidden bg-white">
                    <Image 
                      src={rp.images[0] || catImages[rp.category] || "/images/product-rice.webp"} 
                      alt={rp.name} 
                      fill 
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 md:p-6 border-t border-border-light">
                    <span className="text-[0.65rem] font-bold text-accent tracking-wider uppercase mb-1 block">HS: {rp.hsCode}</span>
                    <h3 className="text-sm md:text-lg font-bold text-text-dark mb-2">{rp.name}</h3>
                    <span className="text-primary text-[0.7rem] md:text-xs font-semibold flex items-center gap-1">View Details <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    )
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --ivory:  #FAF8F4; --cream: #F2EDE4; --forest: #0B1A0E;
          --green:  #1C5230; --leaf:  #2A7A4B; --gold:   #C8963E;
          --border: #DDD8CF; --dk:    #16261A; --md:     #4A5D4C; --lt: #8A9E8B;
        }
        body { font-family: 'Calibri', sans-serif; background: var(--ivory); margin: 0; }

        .serif  { font-family: 'Calibri', sans-serif; }
        .tag    { font-size: clamp(.54rem,1.4vw,.62rem); font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: var(--gold); }
        .body   { color: var(--md); line-height: 1.8; font-weight: 300; }

        .wrap   { max-width: 1300px; margin: 0 auto; padding: 0 clamp(1rem,5vw,4rem); }
        .sec    { padding: clamp(3rem,7vw,6.5rem) 0; }

        .hero-bg {
          background: var(--forest);
          position: relative; overflow: hidden;
          padding: clamp(3rem,9vw,6rem) 0 clamp(2rem,5vw,3.5rem);
        }

        .breadcrumb { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .breadcrumb a { color: rgba(255,255,255,.65); text-decoration: none; font-size: .82rem; transition: color .2s; }
        .breadcrumb a:hover { color: #fff; }
        .breadcrumb span { color: rgba(255,255,255,.35); }
        .breadcrumb .current { color: var(--gold); }

        .split-2col { display: grid; grid-template-columns: 1fr; gap: clamp(2rem,5vw,4rem); }
        @media(min-width:900px){ .split-2col { grid-template-columns: 1fr 1fr; } }

        .btn-dark { display: inline-flex; align-items: center; gap: .5rem;
          background: var(--forest); color: #fff;
          font-size: clamp(.6rem,1.4vw,.68rem); font-weight: 600; letter-spacing: .16em;
          text-transform: uppercase; padding: clamp(.75rem,2vw,.95rem) clamp(1.1rem,3vw,1.8rem);
          border: 1px solid var(--forest); border-radius: 7px; text-decoration: none;
          transition: all .3s ease; white-space: nowrap; }
        .btn-dark:hover { background: var(--green); border-color: var(--green); transform: translateY(-2px); }

        .g-rule { display: block; width: 2.25rem; height: 1px; background: var(--gold); margin-bottom: 1.25rem; }

        .prod-grid { display: grid; gap: clamp(.75rem,2vw,1.5rem);
                     grid-template-columns: repeat(2,1fr); }
        @media(min-width:640px){ .prod-grid { grid-template-columns: repeat(3,1fr); } }

        .prod-card { display: block; text-decoration: none; border-radius: 14px;
                     overflow: hidden; border: 1px solid var(--border);
                     background: #fff; transition: box-shadow .35s ease, transform .35s ease; }
        .prod-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(11,26,14,.11); }
        .prod-card:hover .prod-img { transform: scale(1.06); }

        .prod-img-wrap { position: relative; height: clamp(120px,20vw,180px); overflow: hidden; }
        .prod-img { position: absolute; inset: 0; transition: transform .7s cubic-bezier(.25,.46,.45,.94); }

        .prod-content { padding: clamp(1rem,2.5vw,1.3rem); }
        .prod-hs { font-size: .68rem; color: var(--gold); font-weight: 600; }
        .prod-name { font-family: 'Calibri', sans-serif; font-size: clamp(.95rem,1.8vw,1.15rem); font-weight: 700; color: var(--dk); margin: .35rem 0 .3rem; }
        .prod-link { color: var(--green); text-decoration: none; font-size: .78rem; font-weight: 600; display: inline-flex; align-items: center; gap: .3rem; margin-top: .6rem; }

        .spec-list { display: flex; flex-direction: column; gap: .8rem; }
        .spec-item { display: flex; align-items: flex-start; gap: .75rem; }
        .spec-icon { width: 20px; height: 20px; color: var(--green); flex-shrink: 0; margin-top: .2rem; }
        .spec-text { font-size: .85rem; color: var(--md); line-height: 1.6; }

        .btn-quote { background: var(--green); color: #fff; padding: clamp(1rem,2vw,1.3rem) clamp(1.5rem,4vw,2.5rem);
                     border-radius: 7px; text-decoration: none; font-weight: 600;
                     font-size: clamp(.65rem,1.4vw,.75rem); letter-spacing: .16em; text-transform: uppercase;
                     display: inline-flex; align-items: center; gap: .5rem; transition: all .3s; border: 1px solid var(--green); }
        .btn-quote:hover { background: var(--forest); border-color: var(--forest); transform: translateY(-2px); }

        /* ── ORIGIN SPLIT FOR RICE ── */
        .origin-split {
          display:grid; grid-template-columns:1fr;
        }
        @media(min-width:1024px){ .origin-split { grid-template-columns:1fr 1fr; min-height:560px; } }
        .origin-map-side {
          background:var(--forest); position:relative;
          overflow:hidden; min-height:340px;
          display:flex; align-items:center; justify-content:center;
        }
        .origin-text-side {
          background:var(--forest);
          padding:clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem);
          display:flex; flex-direction:column; justify-content:center;
          position:relative; overflow:hidden;
        }
        .region-pill {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.45rem 1rem; border-radius:24px;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15);
          font-size:.65rem; font-weight:500; letter-spacing:.08em;
          color:rgba(255,255,255,.75); transition:background .3s;
          white-space:nowrap;
        }
        .region-pill:hover { background:rgba(200,150,62,.2); border-color:rgba(200,150,62,.4); color:var(--gold); }

        /* ── RICE PAGES HERO & TICKER ALIGNMENT ── */
        .rice-hero {
          height: 95svh !important;
          min-height: 560px !important;
          max-height: 900px !important;
          display: flex !important;
          align-items: center !important;
          position: relative !important;
          overflow: hidden !important;
          padding: 0 !important;
        }

        .ticker { 
          background: #0D2B4A; 
          border-top: 1px solid rgba(200,150,62,.2); 
          border-bottom: 1px solid rgba(200,150,62,.2); 
          overflow: hidden; 
          padding: .75rem 0; 
          position: relative;
          z-index: 10;
        }
        .ticker-inner { display: flex; gap: 0; white-space: nowrap; animation: tickerScroll 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
        .ticker-item { display: inline-flex; align-items: center; gap: .75rem; padding: 0 2.5rem; font-size: .65rem; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.75); }
        .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #C8963E; flex-shrink: 0; }
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══════ HERO ══════ */}
      <section className="hero-bg rice-hero">
        {bannerImage && (
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src={bannerImage} alt={product.name} fill className="object-cover" priority sizes="100vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.9) 0%,rgba(11,26,14,.7) 100%)" }} />
          </div>
        )}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)", zIndex:4 }} />
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(to bottom,transparent,#C8963E,transparent)", zIndex:4 }} />

        <div className="wrap" style={{ position:"relative", zIndex:5 }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>
            <div className="breadcrumb">
              <Link href="/" style={{ color:"rgba(255,255,255,.65)", textDecoration:"none", fontSize:".82rem" }}>Home</Link>
              <span style={{ color:"rgba(255,255,255,.35)" }}>/</span>
              <Link href="/products" style={{ color:"rgba(255,255,255,.65)", textDecoration:"none", fontSize:".82rem" }}>Products</Link>
              <span style={{ color:"rgba(255,255,255,.35)" }}>/</span>
              <Link href={`/products/${category}`} style={{ color:"rgba(255,255,255,.65)", textDecoration:"none", fontSize:".82rem" }}>{catName}</Link>
              <span style={{ color:"rgba(255,255,255,.35)" }}>/</span>
              <span className="current">{product.name}</span>
            </div>

            <span style={{ fontFamily:"'Calibri', sans-serif", fontSize:".82rem", color:"var(--gold)" }}>HS Code: {product.hsCode}</span>
            <h1 className="serif" style={{ fontSize:"clamp(1.8rem,5vw,4rem)", fontWeight:300, color:"#fff", lineHeight:1.1, margin:".75rem 0 .5rem", textTransform:"uppercase" }}>
              {product.name}
            </h1>
            {product.scientificName && <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:".9rem", color:"rgba(255,255,255,.65)", fontStyle:"italic", margin:0 }}>{product.scientificName}</p>}
          </motion.div>
        </div>
      </section>

      {/* ══ TICKER BAND ══ */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(2)].map((_, rep) => (
            ["Basmati Rice Export", "Himalayan Pink Salt", "Mango & Citrus", "Farm-to-Port Logistics", "TDAP Certified", "LC & TT Payments", "15+ Countries", "500+ Students Trained"].map((item, i) => (
              <span key={`${rep}-${i}`} className="ticker-item">
                <span className="ticker-dot" />
                {item}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ══════ PRODUCT GALLERY ══════ */}
      {product.images && product.images.length > 1 && (
        <section className="sec" style={{ background: "#FAF8F4", padding: "clamp(2rem,4vw,4rem) 0", borderBottom: "1px solid var(--border)" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span className="tag" style={{ display: "inline-block", marginBottom: ".5rem" }}>Visual Showcase</span>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#1C5230", margin: 0, lineHeight: 1.1 }}>
                Product <em style={{ fontStyle: "italic", color: "#C8963E" }}>Gallery</em>
              </h2>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)"
            }}>
              {product.images.map((img, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    position: "relative",
                    height: "clamp(220px, 25vw, 300px)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 10px 30px rgba(11,26,14,.08)"
                  }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(11,26,14,.15)" }}
                >
                  <Image src={img} alt={`${product.name} Image ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ UNIFIED SOURCING & SUPPLY CHAIN SPLIT SECTION ══════ */}
      {splitSectionDetails[slug] && (
        <section className="origin-split" style={{ borderBottom: "1px solid var(--border)" }}>
          {/* text side */}
          <motion.div className="origin-text-side"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: .85 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Calibri', sans-serif", fontSize: "clamp(6rem,14vw,14rem)", fontWeight: 700, color: "rgba(255,255,255,.02)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }} aria-hidden>EXPORTS</div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
                {splitSectionDetails[slug].tag}
              </span>
              <div style={{ height: "1rem" }} />
              <h2 className="serif" style={{ fontSize: "clamp(1.9rem,4vw,3.25rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                {splitSectionDetails[slug].title} <em style={{ fontStyle: "italic", color: "#C8963E" }}><br />{splitSectionDetails[slug].italicTitle}</em>
              </h2>
              <div style={{ width: "2.5rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
              <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".95rem", color: "rgba(255,255,255,.65)", lineHeight: 1.9, fontWeight: 300, marginBottom: "2rem", maxWidth: 440 }}>
                {splitSectionDetails[slug].desc}
              </p>

              {/* capabilities pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "2.25rem" }}>
                {splitSectionDetails[slug].pills.map(r => (
                  <span key={r} className="region-pill">{r}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn-dark" style={{ background: "#C8963E", borderColor: "#C8963E" }}>Contact Our Team <ArrowRight style={{ width: 13, height: 13 }} /></Link>
                <Link href="/products" className="btn-dark" style={{ background: "transparent", borderColor: "rgba(255,255,255,.2)" }}>View Catalog</Link>
              </div>
            </div>
          </motion.div>

          {/* image side */}
          <div className="origin-map-side">
            <div style={{ position: "absolute", inset: 0 }}>
              <Image src={splitSectionDetails[slug].image} alt={product.name} fill className="object-cover" sizes="50vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(11,26,14,.8) 0%,rgba(11,26,14,.4) 100%)" }} />
            </div>

            <motion.div initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: .8 }}
              style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(200,150,62,.15)", border: "1px solid rgba(200,150,62,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Globe2 style={{ width: 32, height: 32, color: "#C8963E" }} />
              </div>
              <p className="serif" style={{ fontSize: "clamp(2rem,5vw,3.75rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, letterSpacing: ".04em" }}>
                {splitSectionDetails[slug].conceptLabel.split(" • ")[0]} • {splitSectionDetails[slug].conceptLabel.split(" • ")[1]}<br />
                <em style={{ fontStyle: "italic", color: "#C8963E", fontWeight: 300 }}>{splitSectionDetails[slug].conceptItalic}</em><br />
                Global Ports
              </p>
              <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".7rem", fontWeight: 300, color: "rgba(255,255,255,.5)", marginTop: "1rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
                Complete Export Sourcing
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════ PRODUCT DETAILS ══════ */}
      <section className="sec" style={{ background:"#fff" }}>
        <div className="wrap">
          <div className="split-2col">
            {/* image */}
            <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7 }}>
              <div style={{ position:"relative", height:"clamp(260px,35vw,450px)", borderRadius:14, overflow:"hidden", border:"1px solid var(--border)" }}>
                <Image src={product.images[0] || catImages[category] || "/images/product-rice.webp"} alt={product.name} fill className="object-cover" />
              </div>
            </motion.div>

            {/* details */}
            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
                {product.description.map((para, i) => (
                  <p key={i} className="body" style={{ fontSize:"clamp(.84rem,1.8vw,.95rem)" }}>{para}</p>
                ))}

                {product.varieties && product.varieties.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily:"'Calibri', sans-serif", fontSize:".95rem", fontWeight:600, color:"var(--dk)", marginBottom:".6rem" }}>Available Varieties</h3>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:".6rem" }}>
                      {product.varieties.map((v) => (
                        <span key={v} style={{ padding:".4rem .75rem", background:"rgba(28,82,48,.08)", border:"1px solid rgba(28,82,48,.2)", borderRadius:20, fontSize:".8rem", color:"var(--dk)" }}>{v}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="spec-list">
                  <div className="spec-item">
                    <MapPin className="spec-icon" />
                    <div>
                      <span style={{ fontWeight:600, color:"var(--dk)", fontSize:".85rem" }}>Origin</span>
                      <p className="spec-text" style={{ margin:".2rem 0 0" }}>{product.origin}</p>
                    </div>
                  </div>

                  {product.moq && (
                    <div className="spec-item">
                      <Package className="spec-icon" />
                      <div>
                        <span style={{ fontWeight:600, color:"var(--dk)", fontSize:".85rem" }}>Minimum Order Quantity</span>
                        <p className="spec-text" style={{ margin:".2rem 0 0" }}>{product.moq}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/buyer" className="btn-quote">
                  Request Quote <ArrowRight style={{ width:14, height:14 }} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══ GLOBAL SEA & AIR LOGISTICS SECTION ══ */}
      <section className="sec" style={{ background: "#fff", borderTop: "1px solid #E8E3DC" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3.75rem)" }}>
            <p className="tag" style={{ marginBottom: ".85rem" }}>Global Delivery Infrastructure</p>
            <h2 className="serif" style={{ fontSize: "clamp(1.7rem,4vw,3.2rem)", fontWeight: 400, color: "var(--dk)", marginBottom: ".9rem" }}>
              Export <em style={{ fontStyle: "italic", color: "#1C5230" }}>Logistics</em>
            </h2>
            <span className="g-rule-c" />
            <p className="body" style={{ maxWidth: 460, margin: "1rem auto 0", fontSize: "clamp(.82rem,1.8vw,.92rem)" }}>
              Weekly sea and express air dispatches for {product.name} directly from our processing plants to your destination.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {/* Sea Sourcing Card */}
            <div className="origin-split" style={{ background: "#0B1A0E", borderRadius: 16, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr", minHeight: "unset", border: "1px solid rgba(255,255,255,.05)" }}>
              <style>{`
                @media(min-width:900px){
                  .origin-split.card-grid { grid-template-columns: 1fr 1fr !important; }
                }
              `}</style>
              <div className="origin-split card-grid" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9 }} className="origin-text-side" style={{ padding: "clamp(2rem,4vw,3.5rem)" }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E" }}>
                      Ocean Routing
                    </span>
                    <div style={{ height: ".5rem" }} />
                    <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
                      Sea Container <em style={{ fontStyle: "italic", color: "#C8963E" }}>Freight</em>
                    </h3>
                    <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
                    <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".9rem", color: "rgba(255,255,255,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                      Our heavy-duty ocean logistics bridge {product.name} to any port globally. Dispatched in standard FCL dry containers or refrigerated containers (reefers) to preserve chemical composition, freshness, and moisture bounds.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                      {["Seaport dispatches from Karachi Ports","Moisture-controlled secure container loading","Full SGS inspection & phytosanitary clearance"].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "rgba(255,255,255,.7)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8963E" }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/buyer" className="btn-dark" style={{ background: "#C8963E", borderColor: "#C8963E", alignSelf: "flex-start" }}>
                      Ocean Freight Quote <ArrowRight style={{ width: 13, height: 13 }} />
                    </Link>
                  </div>
                </motion.div>
                <div className="origin-map-side" style={{ minHeight: "320px", position: "relative" }}>
                  <Image src="/images/Export9.webp" alt="Ocean shipping vessel" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 60%, #0B1A0E)", opacity: .2 }} />
                </div>
              </div>
            </div>

            {/* Air Sourcing Card */}
            <div className="origin-split" style={{ background: "#0B1A0E", borderRadius: 16, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr", minHeight: "unset", border: "1px solid rgba(255,255,255,.05)" }}>
              <div className="origin-split card-grid" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <div className="origin-map-side" style={{ minHeight: "320px", position: "relative", order: 2 }}>
                  <Image src="/images/AirExport3.webp" alt="Express air cargo loading" fill className="object-cover" sizes="(max-width:900px) 100vw,50vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #0B1A0E)", opacity: .2 }} />
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .9 }} className="origin-text-side" style={{ padding: "clamp(2rem,4vw,3.5rem)", order: 1 }}>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <span style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".6rem", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C8963E" }}>
                      Express Dispatch
                    </span>
                    <div style={{ height: ".5rem" }} />
                    <h3 className="serif" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
                      Express Air <em style={{ fontStyle: "italic", color: "#C8963E" }}>Freight</em>
                    </h3>
                    <div style={{ width: "2.25rem", height: 1, background: "#C8963E", marginBottom: "1.5rem" }} />
                    <p style={{ fontFamily: "'Calibri', sans-serif", fontSize: ".9rem", color: "rgba(255,255,255,.7)", lineHeight: 1.8, fontWeight: 300, marginBottom: "1.5rem" }}>
                      For rapid market entries, urgent custom blends, and delicate sample shipments of {product.name}, our direct air freight delivers inside critical transit windows.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                      {["Direct flight space allocations","Rapid air dispatch to any global airport","Cold chain temperature logging for freshness"].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".82rem", color: "rgba(255,255,255,.7)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8963E" }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/buyer" className="btn-dark" style={{ background: "#C8963E", borderColor: "#C8963E", alignSelf: "flex-start" }}>
                      Air Freight Quote <ArrowRight style={{ width: 13, height: 13 }} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════ HARVESTING CALENDAR ══════ */}
      <section className="sec" style={{ background:"#FAF8F4", borderTop:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.5rem" }}>
              <Calendar style={{ width:24, height:24, color:"var(--green)" }} />
              <h2 className="serif" style={{ fontSize:"clamp(1.5rem,3.5vw,2.6rem)", fontWeight:300, color:"var(--dk)", margin:0 }}>Harvest <em style={{ fontStyle:"italic", color:"var(--green)" }}>Calendar</em></h2>
            </div>
            <span className="g-rule" />
            <div style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:12, padding:"clamp(1.5rem,3vw,2.5rem)" }}>
              <HarvestingCalendar harvestMonths={product.harvestMonths} />
              <p className="body" style={{ fontSize:".82rem", marginTop:"1rem" }}>
                <span style={{ background:"#1C5230", display:"inline-block", width:12, height:12, borderRadius:2, marginRight:".6rem", verticalAlign:"middle" }}></span>
                Peak harvest season for {product.name}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ NUTRITIONAL SPECS ══════ */}
      {product.nutritionPer100g.length > 0 && (
        <section className="sec" style={{ background:"#fff", borderTop:"1px solid #E8E3DC" }}>
          <div className="wrap">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}>
              <h2 className="serif" style={{ fontSize:"clamp(1.5rem,3.5vw,2.6rem)", fontWeight:300, color:"var(--dk)", marginBottom:"1.5rem" }}>Nutritional <em style={{ fontStyle:"italic", color:"var(--green)" }}>Specifications</em></h2>
              <span className="g-rule" />
              <div style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", maxWidth:500 }}>
                <NutritionTable data={product.nutritionPer100g} />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════ PACKAGING & LOGISTICS ══════ */}
      <section className="sec" style={{ background:"#FAF8F4", borderTop:"1px solid #E8E3DC" }}>
        <div className="wrap">
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"clamp(2rem,5vw,4rem)" }}>
            {/* Packaging */}
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.5rem" }}>
                <Package style={{ width:24, height:24, color:"var(--green)" }} />
                <h3 className="serif" style={{ fontSize:"clamp(1.3rem,2.5vw,1.8rem)", fontWeight:300, color:"var(--dk)", margin:0 }}>Packaging</h3>
              </div>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:".8rem" }}>
                {product.packaging.map((p, i) => (
                  <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:".6rem" }}>
                    <ChevronRight style={{ width:16, height:16, color:"var(--green)", marginTop:".2rem", flexShrink:0 }} />
                    <span className="body" style={{ fontSize:".85rem" }}>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Logistics */}
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ delay:.1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.5rem" }}>
                <Truck style={{ width:24, height:24, color:"var(--green)" }} />
                <h3 className="serif" style={{ fontSize:"clamp(1.3rem,2.5vw,1.8rem)", fontWeight:300, color:"var(--dk)", margin:0 }}>Logistics</h3>
              </div>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:".8rem" }}>
                {product.logistics.map((l, i) => (
                  <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:".6rem" }}>
                    <ChevronRight style={{ width:16, height:16, color:"var(--green)", marginTop:".2rem", flexShrink:0 }} />
                    <span className="body" style={{ fontSize:".85rem" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ GET QUOTE CTA ══════ */}
      <section style={{ background:"#0B1A0E", position:"relative", overflow:"hidden", padding:"clamp(3rem,6vw,5rem) 0" }}>
        <div style={{ position:"absolute", inset:0, background:"url('/images/hero-banner.webp') center/cover no-repeat", opacity:.04 }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#C8963E 40%,transparent)" }} />
        <div className="wrap" style={{ position:"relative", zIndex:2, textAlign:"center" }}>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:.8 }}>
            <h2 className="serif" style={{ fontSize:"clamp(1.6rem,4vw,3.2rem)", fontWeight:300, color:"#fff", marginBottom:".8rem", lineHeight:1.1 }}>
              Interested in <em style={{ fontStyle:"italic", color:"#C8963E" }}>{product.name}</em>?
            </h2>
            <p style={{ fontFamily:"'Calibri', sans-serif", fontSize:"clamp(.82rem,1.5vw,1rem)", color:"rgba(255,255,255,.72)", maxWidth:480, margin:"0 auto 2rem", lineHeight:1.7 }}>
              Submit an inquiry and our team will respond with pricing, availability, and shipping details within 24 hours.
            </p>
            <Link href="/buyer" className="btn-quote" style={{ background:"#C8963E", borderColor:"#C8963E", display:"inline-flex", fontSize:"clamp(.65rem,1.3vw,.72rem)" }}>
              Submit Inquiry <ArrowRight style={{ width:14, height:14 }} />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ══════ RELATED PRODUCTS ══════ */}
      {relatedProducts.length > 0 && (
        <section className="sec" style={{ background:"#fff", borderTop:"1px solid #E8E3DC" }}>
          <div className="wrap">
            <h2 className="serif" style={{ fontSize:"clamp(1.5rem,3.5vw,2.6rem)", fontWeight:300, color:"var(--dk)", marginBottom:"clamp(1.5rem,3vw,2.5rem)" }}>Related <em style={{ fontStyle:"italic", color:"var(--green)" }}>Products</em></h2>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} className="prod-grid">
              {relatedProducts.map((rp) => (
                <motion.div key={rp.id} variants={fadeUpVariant}>
                  <Link href={`/products/${(rp.category === "fruits" || rp.category === "vegetables") ? "fresh-fruits-and-vegetables" : rp.category}/${rp.slug}`} className="prod-card">
                    <div className="prod-img-wrap">
                      <div className="prod-img">
                        <Image src={rp.images[0] || catImages[rp.category] || "/images/product-rice.webp"} alt={rp.name} fill className="object-cover" />
                      </div>
                    </div>
                    <div className="prod-content">
                      <span className="prod-hs">HS: {rp.hsCode}</span>
                      <h3 className="prod-name">{rp.name}</h3>
                      <span className="prod-link">View Details <ArrowRight style={{ width:12, height:12 }} /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
