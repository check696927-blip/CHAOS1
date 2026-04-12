import { Product } from "@/types";
import { validateCatalog, autoFixProduct } from "@/lib/productValidation";
import pantsOnePieceBlack from "@/assets/products/pants-onepiece-black.jpg";
import pantsSamuraiGray from "@/assets/products/pants-samurai-gray.jpg";
import pantsTigerGray from "@/assets/products/pants-tiger-gray.jpg";
import pantsBaseBlack from "@/assets/products/pants-base-black.jpg";
import teeMalenia1 from "@/assets/products/tee-malenia-1.jpg";
import teeMalenia2 from "@/assets/products/tee-malenia-2.jpg";
import hoodieBerserkFront from "@/assets/products/hoodie-berserk-front.jpg";
import hoodieBerserkBack from "@/assets/products/hoodie-berserk-back.jpg";
import hoodieBerserkVariant from "@/assets/products/hoodie-berserk-variant.jpg";
import beanieBlack from "@/assets/products/beanie-black.jpg";
import beanieWhite from "@/assets/products/beanie-white.jpg";
import beanieBoth from "@/assets/products/beanie-both.jpg";
import pantsOnePieceSkull from "@/assets/products/pants-onepiece-skull.jpg";
import pantsGreenNeon from "@/assets/products/pants-green-neon.jpg";
import pantsGreenWhite from "@/assets/products/pants-green-white.jpg";
import hoodieChainsRed from "@/assets/products/hoodie-chains-red.jpg";
import hoodieSword from "@/assets/products/hoodie-sword.jpg";
import pantsPurpleGhost from "@/assets/products/pants-purple-ghost.jpg";
import pantsFlameWhite from "@/assets/products/pants-flame-white.jpg";
import pantsFlameGray from "@/assets/products/pants-flame-gray.jpg";
import capDevilBlack from "@/assets/products/cap-devil-black.jpg";
import capDevilWhite from "@/assets/products/cap-devil-white.jpg";
import chainSpikeDetail from "@/assets/products/chain-spike-detail.jpg";
import chainSpikeWorn from "@/assets/products/chain-spike-worn.jpg";
import pendantCrossRed from "@/assets/products/pendant-cross-red.jpg";
import pendantCrossFlame from "@/assets/products/pendant-cross-flame.jpg";
import pendantCrossCollection from "@/assets/products/pendant-cross-collection.jpg";
import pendantCrossRedStar from "@/assets/products/pendant-cross-red-star.jpg";
import pendantCrossBlack from "@/assets/products/pendant-cross-black.jpg";
import ringThornSilver from "@/assets/products/ring-thorn-silver.jpg";
import ringRoseSilver from "@/assets/products/ring-rose-silver.jpg";
import ringBranchSilver from "@/assets/products/ring-branch-silver.jpg";

export const PRODUCTS: Product[] = [
  // PANTS - Anime Joggers (pants only, multiple styles)
  {
    id: "anime-joggers-001",
    name: "ANIME GRAPHIC JOGGERS",
    productType: "pants",
    price: 95,
    category: "NEW DROPS",
    image: pantsOnePieceBlack,
    images: [],
    variants: [
      {
        id: "black-onepiece",
        name: "One Piece Black",
        images: [pantsOnePieceBlack, pantsBaseBlack],
        inStock: true,
        stockCount: 8
      },
      {
        id: "gray-samurai",
        name: "Samurai Gray",
        images: [pantsSamuraiGray],
        inStock: true,
        stockCount: 12
      },
      {
        id: "gray-tiger",
        name: "Tiger Gray",
        images: [pantsTigerGray],
        inStock: true,
        stockCount: 5
      }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "HOT",
    inStock: true,
    sizeGuide: {
      type: 'clothing',
      measurements: [
        { size: "S", waist: "28-30\"", hips: "38-40\"", length: "40\"" },
        { size: "M", waist: "30-32\"", hips: "40-42\"", length: "41\"" },
        { size: "L", waist: "32-34\"", hips: "42-44\"", length: "42\"" },
        { size: "XL", waist: "34-36\"", hips: "44-46\"", length: "43\"" },
        { size: "2XL", waist: "36-38\"", hips: "46-48\"", length: "44\"" }
      ],
      fitRecommendation: "Oversized relaxed fit. Size down for a more fitted look.",
      modelStats: {
        height: "5'10\"",
        weight: "165 lbs",
        size: "M"
      }
    },
    description: "Premium streetwear joggers with bold anime graphics and Japanese text. Oversized fit with elastic waistband and tapered ankles.",
    features: [
      "High-quality cotton blend fabric",
      "Vibrant anime graphics with neon accents",
      "Elastic waistband with drawstring",
      "Deep side pockets",
      "Tapered ankle cuffs",
      "Oversized streetwear fit"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EvqboB2",
      supplierCost: 38.00,
      profitMargin: 60,
      inventoryCount: 25,
      reorderLevel: 10,
      shippingTime: "7-14 days"
    }
  },

  // PANTS - Neon Flame Joggers (pants only)
  {
    id: "neon-flame-joggers-001",
    name: "NEON FLAME JOGGERS",
    productType: "pants",
    price: 98,
    category: "NEW DROPS",
    image: pantsGreenNeon,
    images: [],
    variants: [
      {
        id: "green-black",
        name: "Green Flame Black",
        images: [pantsGreenNeon],
        inStock: true,
        stockCount: 10
      },
      {
        id: "green-white",
        name: "Green Flame White",
        images: [pantsGreenWhite],
        inStock: true,
        stockCount: 7
      },
      {
        id: "white-flame",
        name: "White Flame Black",
        images: [pantsFlameWhite],
        inStock: true,
        stockCount: 9
      },
      {
        id: "gray-flame",
        name: "Gray Flame",
        images: [pantsFlameGray],
        inStock: true,
        stockCount: 6
      }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "NEW",
    inStock: true,
    description: "Bold neon flame design joggers with dragon graphics. UV-reactive print for nighttime glow effect.",
    features: [
      "UV-reactive neon graphics",
      "Dragon and flame details",
      "Premium cotton fleece",
      "Relaxed baggy fit",
      "Reinforced stitching"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EzMrHVK",
      supplierCost: 42.00,
      profitMargin: 57,
      inventoryCount: 32,
      reorderLevel: 12,
      shippingTime: "7-14 days"
    }
  },

  // PENDANT/CHAIN - Gothic Cross Collection (chains/pendants only)
  {
    id: "cross-chain-collection-001",
    name: "GOTHIC TRIBAL FLAME CROSS CHAIN",
    productType: "chain",
    price: 48,
    category: "NEW DROPS",
    image: pendantCrossFlame,
    images: [],
    variants: [
      {
        id: "cross-flame-silver",
        name: "Tribal Flame Silver",
        images: [pendantCrossFlame],
        inStock: true,
        stockCount: 12
      },
      {
        id: "cross-red-enamel",
        name: "Red Enamel Cross",
        images: [pendantCrossRed],
        inStock: true,
        stockCount: 15
      },
      {
        id: "cross-red-star",
        name: "Red Star Cross",
        images: [pendantCrossRedStar],
        inStock: true,
        stockCount: 18
      },
      {
        id: "cross-black-star",
        name: "Black Star Cross",
        images: [pendantCrossBlack],
        inStock: true,
        stockCount: 20
      }
    ],
    badge: "NEW",
    inStock: true,
    sizeGuide: {
      type: 'jewelry',
      measurements: [
        { size: "S (16\")", diameter: "1.2\"", circumference: "16\"" },
        { size: "M (18\")", diameter: "1.4\"", circumference: "18\"" },
        { size: "L (20\")", diameter: "1.6\"", circumference: "20\"" },
        { size: "XL (24\")", diameter: "1.8\"", circumference: "24\"" }
      ],
      fitRecommendation: "Most popular: 18\" chain sits at collarbone. 20-24\" for layering."
    },
    description: "Premium gothic cross chain collection with tribal flame design and enamel detailing. Sterling silver plated with stainless steel chain included.",
    features: [
      "Sterling silver plated pendant",
      "Tribal flame engravings",
      "Red/black enamel options",
      "Includes stainless steel chain",
      "Detailed gothic craftsmanship",
      "Multiple style variations"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EvN7580",
      supplierCost: 16.50,
      profitMargin: 66,
      inventoryCount: 65,
      reorderLevel: 20,
      shippingTime: "10-18 days"
    }
  },

  // RING - Gothic Ring Collection (rings only)
  {
    id: "gothic-ring-collection-001",
    name: "GOTHIC RING COLLECTION",
    productType: "ring",
    price: 38,
    category: "NEW DROPS",
    image: ringThornSilver,
    images: [],
    variants: [
      {
        id: "ring-thorn-silver",
        name: "Silver Thorn Band",
        images: [ringThornSilver],
        inStock: true,
        stockCount: 16
      },
      {
        id: "ring-rose-silver",
        name: "Silver Rose Ring",
        images: [ringRoseSilver],
        inStock: true,
        stockCount: 13
      },
      {
        id: "ring-branch-silver",
        name: "Silver Branch Design",
        images: [ringBranchSilver],
        inStock: true,
        stockCount: 11
      }
    ],
    sizes: ["6", "7", "8", "9", "10"],
    badge: "POPULAR",
    inStock: true,
    sizeGuide: {
      type: 'jewelry',
      measurements: [
        { size: "6", diameter: "16.5mm", circumference: "51.9mm" },
        { size: "7", diameter: "17.3mm", circumference: "54.4mm" },
        { size: "8", diameter: "18.2mm", circumference: "57.0mm" },
        { size: "9", diameter: "19.0mm", circumference: "59.5mm" },
        { size: "10", diameter: "19.8mm", circumference: "62.1mm" }
      ],
      fitRecommendation: "For best fit, measure your finger at end of day when fingers are largest. Between sizes? Choose larger for comfort."
    },
    description: "Handcrafted gothic ring collection featuring silver thorn bands, rose designs, and intricate branch patterns. 925 sterling silver with oxidized vintage finish.",
    features: [
      "925 sterling silver",
      "Thorn, rose, and branch designs",
      "Oxidized finish for vintage look",
      "Adjustable sizing options",
      "Nature-inspired gothic aesthetic",
      "Unique handcrafted details"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EIZTfAG",
      supplierCost: 12.80,
      profitMargin: 66,
      inventoryCount: 40,
      reorderLevel: 15,
      shippingTime: "12-20 days"
    }
  },

  // CHAIN - Spike Chain Necklace (chains only)
  {
    id: "spike-chain-001",
    name: "SPIKE CHAIN NECKLACE",
    productType: "chain",
    price: 42,
    category: "ACCESSORIES",
    image: chainSpikeDetail,
    images: [chainSpikeDetail, chainSpikeWorn],
    badge: "HOT",
    inStock: true,
    stockCount: 25,
    description: "Edgy spike chain necklace with hanging spike pendants. 316L stainless steel construction.",
    features: [
      "316L stainless steel",
      "Spike pendants",
      "Length: 18\"",
      "Lobster clasp closure",
      "Tarnish resistant",
      "Punk streetwear style"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EvN7580",
      supplierCost: 14.00,
      profitMargin: 67,
      inventoryCount: 25,
      reorderLevel: 10,
      shippingTime: "10-18 days"
    }
  },

  // TEE - Malenia Tee (tees only)
  {
    id: "malenia-tee-001",
    name: "MALENIA BLADE WASHED TEE",
    productType: "tee",
    price: 58,
    category: "BEST SELLERS",
    image: teeMalenia1,
    images: [teeMalenia1, teeMalenia2],
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "FIRE",
    inStock: true,
    stockCount: 22,
    description: "Vintage washed Malenia tee featuring the Blade of Miquella with golden wings and red accents.",
    features: [
      "Vintage acid wash finish",
      "High-quality screen print",
      "Oversized boxy fit",
      "Soft-touch fabric",
      "Ribbed crew neck"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EzMrHVK",
      supplierCost: 22.50,
      profitMargin: 61,
      inventoryCount: 22,
      reorderLevel: 8,
      shippingTime: "7-14 days"
    }
  },

  // HOODIE - Berserk Hoodies (hoodies only)
  {
    id: "berserk-hoodie-001",
    name: "BERSERK WASHED HOODIE",
    productType: "hoodie",
    price: 98,
    category: "BEST SELLERS",
    image: hoodieBerserkFront,
    images: [],
    variants: [
      {
        id: "style-18",
        name: "Style 18 - Demon",
        images: [hoodieBerserkFront, hoodieBerserkBack],
        inStock: true,
        stockCount: 10
      },
      {
        id: "style-19",
        name: "Style 19 - Berserk",
        images: [hoodieBerserkVariant],
        inStock: true,
        stockCount: 7
      }
    ],
    sizes: ["M", "L", "XL", "2XL"],
    badge: "POPULAR",
    inStock: true,
    description: "Vintage washed Berserk hoodie with intricate Japanese graphics. Heavy cotton construction with distressed details.",
    features: [
      "Vintage acid wash finish",
      "Front and back graphic prints",
      "Japanese text and symbols",
      "Heavy 400gsm cotton",
      "Oversized hood with drawstrings",
      "Kangaroo pocket"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EzMrHVK",
      supplierCost: 42.00,
      profitMargin: 57,
      inventoryCount: 17,
      reorderLevel: 6,
      shippingTime: "7-14 days"
    }
  },

  // HOODIE - Chains & Sword Hoodies (hoodies only)
  {
    id: "chains-hoodie-001",
    name: "CHAINS & SWORD HOODIE",
    productType: "hoodie",
    price: 95,
    category: "BEST SELLERS",
    image: hoodieChainsRed,
    images: [],
    variants: [
      {
        id: "chains-red",
        name: "Red Circle Chains",
        images: [hoodieChainsRed],
        inStock: true,
        stockCount: 9
      },
      {
        id: "sword-skeleton",
        name: "Skeleton Sword",
        images: [hoodieSword],
        inStock: true,
        stockCount: 11
      }
    ],
    sizes: ["M", "L", "XL", "2XL"],
    badge: "HOT",
    inStock: true,
    description: "Gothic vintage hoodie with chain and sword graphics. Distressed wash with back print.",
    features: [
      "Front and back graphics",
      "Vintage washed fabric",
      "Oversized relaxed fit",
      "Heavy cotton construction",
      "Pouch pocket"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EzMrHVK",
      supplierCost: 40.00,
      profitMargin: 58,
      inventoryCount: 20,
      reorderLevel: 8,
      shippingTime: "7-14 days"
    }
  },

  // BEANIE - Metal Logo Beanie (beanies only)
  {
    id: "metal-beanie-001",
    name: "METAL LOGO BEANIE",
    productType: "beanie",
    price: 28,
    category: "ACCESSORIES",
    image: beanieBlack,
    images: [],
    variants: [
      {
        id: "black-beanie",
        name: "Black",
        images: [beanieBlack, beanieBoth],
        inStock: true,
        stockCount: 20
      },
      {
        id: "white-beanie",
        name: "White",
        images: [beanieWhite, beanieBoth],
        inStock: true,
        stockCount: 15
      }
    ],
    badge: "BUNDLE",
    inStock: true,
    description: "Warm knit beanie with embroidered metal band logo. Available in classic black and white.",
    features: [
      "Soft acrylic knit",
      "Embroidered logo design",
      "Fold-up cuff",
      "One size fits all",
      "Unisex style"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EvqboB2",
      supplierCost: 8.50,
      profitMargin: 70,
      inventoryCount: 35,
      reorderLevel: 15,
      shippingTime: "10-15 days"
    }
  },

  // CAP - Devil Ear Caps (caps only)
  {
    id: "devil-cap-001",
    name: "DEVIL EAR CHAIN CAP",
    productType: "cap",
    price: 32,
    category: "ACCESSORIES",
    image: capDevilBlack,
    images: [],
    variants: [
      {
        id: "devil-black",
        name: "Black with Chains",
        images: [capDevilBlack],
        inStock: true,
        stockCount: 18
      },
      {
        id: "devil-white",
        name: "White with Chains",
        images: [capDevilWhite],
        inStock: true,
        stockCount: 12
      }
    ],
    badge: "NEW",
    inStock: true,
    description: "Unique baseball cap with 3D devil ears and hanging chain accessories. Adjustable fit.",
    features: [
      "3D devil ear details",
      "Hanging metal chains",
      "Adjustable back strap",
      "Curved brim",
      "Unisex design"
    ],
    supplyChain: {
      source: "aliexpress",
      sourceUrl: "https://a.aliexpress.com/_EvqboB2",
      supplierCost: 11.00,
      profitMargin: 66,
      inventoryCount: 30,
      reorderLevel: 10,
      shippingTime: "10-15 days"
    }
  }
];

// Helper function to get available variant count (only in-stock variants)
export const getAvailableVariantCount = (product: Product): number => {
  if (!product.variants || product.variants.length === 0) return 0;
  return product.variants.filter(v => v.inStock && v.stockCount > 0).length;
};

// Helper function to check if product has any stock
export const hasAnyStock = (product: Product): boolean => {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(v => v.inStock && v.stockCount > 0);
  }
  return product.inStock && (product.stockCount ?? 0) > 0;
};

// Helper function to get total stock across all variants
export const getTotalStock = (product: Product): number => {
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + v.stockCount, 0);
  }
  return product.stockCount ?? 0;
};

// AUTO-VALIDATE AND FIX PRODUCTS ON LOAD
const validateAndFixProducts = () => {
  console.log("🔒 Running product validation...");
  
  const catalogValidation = validateCatalog(PRODUCTS);
  
  if (!catalogValidation.valid) {
    console.error(`❌ Product catalog has ${catalogValidation.totalErrors} error(s) and ${catalogValidation.totalWarnings} warning(s)`);
    
    catalogValidation.results.forEach((result, productId) => {
      if (!result.valid) {
        const product = PRODUCTS.find(p => p.id === productId);
        console.error(`Product: ${product?.name || productId}`);
        result.errors.forEach(err => {
          console.error(`  ❌ ${err.field}: ${err.message}`);
        });
      }
      
      if (result.warnings.length > 0) {
        const product = PRODUCTS.find(p => p.id === productId);
        console.warn(`Product: ${product?.name || productId}`);
        result.warnings.forEach(warn => {
          console.warn(`  ⚠️ ${warn.field}: ${warn.message}`);
        });
      }
    });
  } else {
    console.log(`✅ All ${PRODUCTS.length} products validated successfully!`);
    if (catalogValidation.totalWarnings > 0) {
      console.warn(`⚠️ ${catalogValidation.totalWarnings} warning(s) found (non-blocking)`);
    }
  }

  // Auto-fix products where safe
  PRODUCTS.forEach((product, index) => {
    PRODUCTS[index] = autoFixProduct(product);
  });
};

// Run validation on import
validateAndFixProducts();
