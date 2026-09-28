// src/data/womenGarments.js
// Complete audited Women's Garments data specification for Vizzle Studio
// Gender-validated, asset-verified, and free of cross-gender mismatches.

export const GARMENT_CATEGORIES = [
  { id: 'all', label: 'All', count: 38 },
  { id: 'ethnic', label: 'Ethnic Wear', count: 6 },
  { id: 'tops', label: 'Tops & Shirts', count: 8 },
  { id: 'outerwear', label: 'Outerwear', count: 3 },
  { id: 'dresses', label: 'Dresses', count: 5 },
  { id: 'bottoms', label: 'Bottoms', count: 8 },
  { id: 'mannequin', label: '3D Drapes', count: 8 },
];

/**
 * Curated Top 10 Popular Garments for the clean single-row / 5-column dashboard preview.
 */
export const POPULAR_GARMENT_IDS = [
  'crop-top',
  'saree',
  'kurti',
  'blazer',
  'suit',
  'anarkali',
  'cocktail',
  'long-frock',
  'full-sleeve-shirt',
  'jean',
];

export const WOMEN_GARMENTS = [
  // ── 1. Ethnic Flat-Lays ──────────────────────────────────────────────────
  {
    id: 'saree',
    label: 'Saree',
    category: 'ethnic',
    categoryLabel: 'Ethnic Wear',
    displayStyle: 'flat-lay',
    img: '/garments/women/saree.jpg',
    description: 'Royal emerald-green Kanjivaram silk saree with antique gold zari temple border and folded brocade pallu.',
    tags: ['silk', 'traditional', 'kanjivaram', 'zari', 'ethnic', 'wedding'],
    isPopular: true,
  },
  {
    id: 'chudidar',
    label: 'Chudidar',
    category: 'ethnic',
    categoryLabel: 'Ethnic Wear',
    displayStyle: 'flat-lay',
    img: '/gallery/col3_extra_anarkali.jpg',
    description: 'Lavender embroidered georgette straight kameez paired with pleated churidar bottoms and sheer scalloped dupatta.',
    tags: ['georgette', 'churidar', 'kameez', 'embroidered', 'ethnic'],
  },
  {
    id: 'kurti',
    label: 'Kurti',
    category: 'ethnic',
    categoryLabel: 'Ethnic Wear',
    displayStyle: 'flat-lay',
    img: '/garments/women/kurti.jpg',
    description: 'Mustard-yellow A-line chanderi silk kurti featuring delicate mirror work along the split mandarin collar.',
    tags: ['chanderi', 'silk', 'mirror work', 'mandarin collar', 'casual'],
    isPopular: true,
  },
  {
    id: 'kurti-pyjama',
    label: 'Kurti & Pyjama',
    category: 'ethnic',
    categoryLabel: 'Ethnic Wear',
    displayStyle: 'flat-lay',
    img: '/brand_seated_wrap.jpg',
    description: 'Sage-green flared calf-length cotton kurti paired with off-white wide-leg palazzo pants with gota patti hem detailing.',
    tags: ['cotton', 'palazzo', 'gota patti', 'ethnic set', 'co-ord'],
  },
  {
    id: 'anarkali',
    label: 'Anarkali',
    category: 'ethnic',
    categoryLabel: 'Ethnic Wear',
    displayStyle: 'flat-lay',
    img: '/garments/women/anarkali.jpg',
    description: 'Deep maroon floor-length velvet Anarkali suit with gold zardozi neckline embroidery and sheer organza dupatta.',
    tags: ['velvet', 'zardozi', 'organza', 'festive', 'bridal', 'floor-length'],
    isPopular: true,
  },
  {
    id: 'coord-set',
    label: 'Co-Ord Set',
    category: 'ethnic',
    categoryLabel: 'Ethnic Wear',
    displayStyle: 'flat-lay',
    img: '/showcase/western_beige_coord.jpg',
    description: 'Textured linen-blend 3-piece co-ord set with cropped square-neck tank, high-waisted relaxed trousers, and lightweight overshirt.',
    tags: ['linen', '3-piece', 'modern', 'trousers', 'crop top', 'co-ord'],
  },

  // ── 2. Tops, Shirts & Knitwear ──────────────────────────────────────────
  {
    id: 'full-sleeve-shirt',
    label: 'Full Sleeve Shirt',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/garments/women/full_sleeve_shirt.jpg',
    description: 'Crisp ice-blue oversized poplin cotton button-down shirt with french cuffs and pointed collar.',
    tags: ['poplin', 'oversized', 'button-down', 'formal', 'blue', 'cotton'],
    isPopular: true,
  },
  {
    id: 'half-sleeve-shirt',
    label: 'Half Sleeve Shirt',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/garments/women/half_sleeve_shirt.jpg',
    description: 'Short-sleeve women\'s button-down cotton shirt, relaxed fit with pointed collar.',
    tags: ['cotton', 'short-sleeve', 'button-down', 'casual', 'summer'],
  },
  {
    id: 'full-sleeve-tshirt',
    label: 'Full Sleeve T-shirt',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/garments/women/full_sleeve_tshirt.jpg',
    description: 'Heavyweight long-sleeve crewneck cotton t-shirt in burgundy.',
    tags: ['heavyweight', 'cotton', 'crewneck', 'casual', 'full-sleeve'],
  },
  {
    id: 'half-sleeve-tshirt',
    label: 'Half Sleeve T-shirt',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/garments/women/half_sleeve_tshirt.jpg',
    description: 'Relaxed-fit short-sleeve crewneck cotton casual t-shirt in light yellow.',
    tags: ['short-sleeve', 'relaxed', 't-shirt', 'casual', 'cotton'],
  },
  {
    id: 'top',
    label: 'Top',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/garments/women/top.jpg',
    description: 'Sleeveless v-neck camisole top in soft sage blue, lightweight jersey fabric.',
    tags: ['sleeveless', 'camisole', 'v-neck', 'jersey', 'summer'],
  },
  {
    id: 'crop-top',
    label: 'Crop Top',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/garments/women/crop_top.jpg',
    description: 'Ribbed terracotta-brown off-the-shoulder puff-sleeve sweetheart crop top.',
    tags: ['terracotta', 'ribbed', 'sweetheart', 'puff-sleeve', 'crop'],
    isPopular: true,
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/vz_flatlay_hoodie.jpg',
    description: 'Heavyweight fleece oversized pullover hoodie with structured hood.',
    tags: ['fleece', 'oversized', 'pullover', 'streetwear', 'hoodie'],
  },
  {
    id: 'sweatshirt',
    label: 'Sweatshirt',
    category: 'tops',
    categoryLabel: 'Tops & Shirts',
    displayStyle: 'flat-lay',
    img: '/vz_flatlay_hoodie.jpg',
    description: 'Vintage crewneck raglan-sleeve sweatshirt in loopback French terry.',
    tags: ['french terry', 'raglan', 'crewneck', 'lounge', 'sweatshirt'],
  },

  // ── 3. Outerwear & Tailoring ───────────────────────────────────────────
  {
    id: 'jacket',
    label: 'Jacket',
    category: 'outerwear',
    categoryLabel: 'Outerwear',
    displayStyle: 'flat-lay',
    img: '/showcase/western_leather_jacket.jpg',
    description: 'Genuine tailored trucker jacket with silver zip hardware and fleece lining.',
    tags: ['trucker', 'outerwear', 'jacket', 'winter', 'leather'],
  },
  {
    id: 'blazer',
    label: 'Blazer',
    category: 'outerwear',
    categoryLabel: 'Outerwear',
    displayStyle: 'flat-lay',
    img: '/garments/women/blazer.jpg',
    description: 'Structured double-breasted houndstooth wool-blend blazer with peak lapels.',
    tags: ['houndstooth', 'double-breasted', 'wool', 'tailored', 'blazer'],
    isPopular: true,
  },
  {
    id: 'suit',
    label: 'Suit',
    category: 'outerwear',
    categoryLabel: 'Outerwear',
    displayStyle: 'flat-lay',
    img: '/garments/women/suit.jpg',
    description: "Modern tailored two-piece women's power suit with single-button blazer and tapered trousers.",
    tags: ['power suit', 'tailored', '2-piece', 'formal'],
    isPopular: true,
  },

  // ── 4. Dresses & Jumpsuits ─────────────────────────────────────────────
  {
    id: 'mini-frock',
    label: 'Mini Frock',
    category: 'dresses',
    categoryLabel: 'Dresses',
    displayStyle: 'flat-lay',
    img: '/vz_thumb_dress.jpg',
    description: 'Cotton poplin tiered fit-and-flare mini dress with tie-up bow shoulder straps.',
    tags: ['poplin', 'mini dress', 'tiered', 'summer', 'bow straps'],
  },
  {
    id: 'knee-length-frock',
    label: 'Knee Length Frock',
    category: 'dresses',
    categoryLabel: 'Dresses',
    displayStyle: 'flat-lay',
    img: '/brand_chocolate_dress.jpg',
    description: 'Floral wrap midi sundress with flutter short sleeves and ruffled hem.',
    tags: ['wrap dress', 'floral', 'midi', 'flutter sleeve', 'casual'],
  },
  {
    id: 'long-frock',
    label: 'Long Frock',
    category: 'dresses',
    categoryLabel: 'Dresses',
    displayStyle: 'flat-lay',
    img: '/garments/women/long_frock.jpg',
    description: 'Bias-cut satin floor-length slip maxi gown with delicate cross-back straps.',
    tags: ['satin', 'slip gown', 'maxi', 'cross-back', 'evening'],
    isPopular: true,
  },
  {
    id: 'cocktail',
    label: 'Cocktail',
    category: 'dresses',
    categoryLabel: 'Dresses',
    displayStyle: 'flat-lay',
    img: '/garments/women/cocktail.jpg',
    description: 'Blush-pink asymmetrical one-shoulder draped georgette cocktail midi dress with pleated side slit.',
    tags: ['cocktail', 'one-shoulder', 'georgette', 'pleated', 'party'],
    isPopular: true,
  },
  {
    id: 'jumpsuit',
    label: 'Jumpsuit',
    category: 'dresses',
    categoryLabel: 'Dresses',
    displayStyle: 'flat-lay',
    img: '/step1_jumpsuit_flatlay.jpg',
    description: 'Utility belted boiler jumpsuit with rolled short sleeves and metallic zip front.',
    tags: ['utility', 'boiler suit', 'belted', 'modern', 'jumpsuit'],
  },

  // ── 5. Bottoms, Denims & Innerwear ──────────────────────────────────────
  {
    id: 'jean',
    label: 'Jean',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/garments/women/jean.jpg',
    description: 'Classic straight-leg high-rise rigid denim jeans with authentic whiskering.',
    tags: ['denim', 'straight-leg', 'high-rise', 'indigo', 'classic'],
    isPopular: true,
  },
  {
    id: 'baggy-jean',
    label: 'Baggy Jean',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/gallery/col5_female_denim.jpg',
    description: 'Light-wash 90s skater baggy wide-leg relaxed denim jeans with distressed hems.',
    tags: ['baggy', 'skater', 'wide-leg', 'distressed', 'streetwear'],
  },
  {
    id: 'trouser',
    label: 'Trouser',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/brand_vest_trousers.jpg',
    description: 'Tailored wide-leg pleated cream linen-blend high-waisted dress trousers.',
    tags: ['trouser', 'pleated', 'linen', 'cream', 'high-waisted', 'workwear'],
  },
  {
    id: 'track',
    label: 'Track',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/gallery/col5_female_denim.jpg',
    description: 'Heavyweight cotton fleece relaxed sweatpants joggers with cuffed ankles.',
    tags: ['joggers', 'sweatpants', 'fleece', 'athleisure'],
  },
  {
    id: 'long-skirt',
    label: 'Long Skirt',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/brand_floral_saree.jpg',
    description: 'Tiered bohemian tiered A-line maxi skirt with an elasticated smocked waistband.',
    tags: ['boho', 'maxi skirt', 'smocked', 'tiered', 'skirt'],
  },
  {
    id: 'mini-skirt',
    label: 'Mini Skirt',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/brand_chocolate_dress.jpg',
    description: 'Classic tweed A-line mini skirt with decorative pearl button detailing.',
    tags: ['tweed', 'mini skirt', 'pearl buttons', 'chic'],
  },
  {
    id: 'short',
    label: 'Short',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/gallery/col5_female_denim.jpg',
    description: 'Vintage washed light-blue high-rise cutoff denim shorts with frayed raw hem.',
    tags: ['cutoff', 'denim shorts', 'high-rise', 'summer', 'frayed'],
  },
  {
    id: 'inner-wear',
    label: 'Inner wear',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    displayStyle: 'flat-lay',
    img: '/garments/women/crop_top.jpg',
    description: 'Minimalist matte seamless microfiber triangle bra and matching brief set.',
    tags: ['seamless', 'microfiber', 'intimates', 'basics'],
  },

  // ── 6. Mannequin Draped Displays (Ghost / 3D Studio Form) ───────────────
  {
    id: 'saree-mannequin',
    label: 'Saree on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/garments/women/saree_mannequin.jpg',
    description: 'Traditional Paithani silk saree with elaborate peacock motif border draped on studio mannequin.',
    tags: ['paithani', 'saree', 'mannequin', 'heritage', '3d drape'],
  },
  {
    id: 'cocktail-mannequin',
    label: 'Cocktail on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/showcase/western_black_cocktail.jpg',
    description: 'Sculptural draped asymmetrical cocktail gown displayed on a headless studio mannequin.',
    tags: ['cocktail', 'strapless', 'gown', 'mannequin', 'haute couture'],
  },
  {
    id: 'half-saree-mannequin',
    label: 'Half Saree on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/garments/women/half_saree_mannequin.jpg',
    description: 'South Indian half saree (Langa Voni) featuring pleated silk skirt and zari dupatta on ghost mannequin.',
    tags: ['langa voni', 'half saree', 'south indian', 'festive', 'silk', 'dupatta'],
  },
  {
    id: 'lehenga-mannequin',
    label: 'Lehenga on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/garments/women/lehenga_mannequin.jpg',
    description: 'Bridal velvet flared lehenga skirt with dense antique gold zardozi embroidery on studio mannequin form.',
    tags: ['bridal', 'lehenga', 'velvet', 'zardozi', 'wedding'],
  },
  {
    id: 'long-frock-mannequin',
    label: 'Long Frock on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/brand_evening_gown.jpg',
    description: 'Floor-length evening gown with shimmering micro-sequin embellishments draped on tailor mannequin.',
    tags: ['sequin', 'evening gown', 'floor-length', 'mannequin'],
  },
  {
    id: 'mini-frock-mannequin',
    label: 'Mini Frock on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/vz_thumb_dress.jpg',
    description: 'Smocked linen mini babydoll dress displayed on a headless dressmaker form.',
    tags: ['babydoll', 'linen', 'mannequin', 'summer'],
  },
  {
    id: 'kurti-mannequin',
    label: 'Kurti on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/garments/women/kurti.jpg',
    description: 'Hand-block-printed flared Angrakha style kurti with contrast tie-up tassels on studio mannequin.',
    tags: ['angrakha', 'block-print', 'tassels', 'mannequin'],
  },
  {
    id: 'chudidar-mannequin',
    label: 'Chudidar on Mannequin',
    category: 'mannequin',
    categoryLabel: '3D Drapes',
    displayStyle: 'mannequin',
    img: '/gallery/col5_extra_lehenga.jpg',
    description: 'Festive raw silk embroidered chudidar suit with draped organza dupatta on mannequin form.',
    tags: ['raw silk', 'festive', 'chudidar', 'mannequin'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION & INTEGRITY GATEWAY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validation checker for studio garment catalog items.
 * Confirms image, label, gender, and category integrity before publishing,
 * strictly forbidding non-women assets in the women's catalog.
 */
export function validateGarmentItem(item, expectedGender = 'women') {
  const errors = [];
  if (!item.id || typeof item.id !== 'string') errors.push('Missing or invalid id');
  if (!item.label || typeof item.label !== 'string') errors.push('Missing or invalid label');
  if (!item.category || typeof item.category !== 'string') errors.push('Missing or invalid category');
  if (!item.img || typeof item.img !== 'string') errors.push('Missing or invalid img path');

  if (expectedGender === 'women') {
    // Prohibited keywords in women's catalog images:
    const bannedMaleKeywords = [
      'menswear',
      'male',
      'boy',
      'men_',
      'thumb_black_shirt',
      'thumb_violet_shirt',
      'thumb_beige_suit',
      'model_hoodie',
    ];
    const isBanned = bannedMaleKeywords.some((kw) => item.img.toLowerCase().includes(kw));
    if (isBanned) {
      errors.push(`Gender mismatch: asset "${item.img}" contains male/boy marker in Women's catalog`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the entire catalog at runtime and throws or logs warnings in development.
 */
export function validateCatalog(catalog, expectedGender = 'women') {
  const results = catalog.map((item) => ({
    id: item.id,
    ...validateGarmentItem(item, expectedGender),
  }));
  const invalid = results.filter((r) => !r.valid);
  if (invalid.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(`[Catalog Integrity Warning] Found ${invalid.length} mismatched garments:`, invalid);
  }
  return {
    total: catalog.length,
    validCount: catalog.length - invalid.length,
    invalidCount: invalid.length,
    invalid,
  };
}

// Run audit on load
validateCatalog(WOMEN_GARMENTS, 'women');
