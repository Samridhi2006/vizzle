// src/data/womenGarments.ts
export interface GarmentCategory {
  id: string;
  label: string;
  count: number;
}

export interface GarmentItem {
  id: string;
  label: string;
  category: string;
  categoryLabel: string;
  displayStyle: "flat-lay" | "mannequin";
  img: string;
  description: string;
  tags: string[];
  isPopular?: boolean;
}

export const GARMENT_CATEGORIES: GarmentCategory[] = [
  { id: "all", label: "All", count: 38 },
  { id: "ethnic", label: "Ethnic Wear", count: 6 },
  { id: "tops", label: "Tops & Shirts", count: 8 },
  { id: "outerwear", label: "Outerwear", count: 3 },
  { id: "dresses", label: "Dresses", count: 5 },
  { id: "bottoms", label: "Bottoms", count: 8 },
  { id: "mannequin", label: "3D Drapes", count: 8 },
];

export const POPULAR_GARMENT_IDS = [
  "crop-top","saree","kurti","blazer","suit",
  "anarkali","cocktail","long-frock","full-sleeve-shirt","jean",
];

export const WOMEN_GARMENTS: GarmentItem[] = [
  { id:"saree", label:"Saree", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/garments/women/saree.jpg", description:"Royal emerald-green Kanjivaram silk saree with antique gold zari border.", tags:["silk","traditional","kanjivaram","ethnic","wedding"], isPopular:true },
  { id:"chudidar", label:"Chudidar", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/gallery/col3_extra_anarkali.jpg", description:"Lavender embroidered georgette straight kameez with churidar bottoms.", tags:["georgette","churidar","kameez","ethnic"] },
  { id:"kurti", label:"Kurti", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/garments/women/kurti.jpg", description:"Mustard-yellow A-line chanderi silk kurti with delicate mirror work.", tags:["chanderi","silk","mirror work","casual"], isPopular:true },
  { id:"kurti-pyjama", label:"Kurti & Pyjama", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/brand_seated_wrap.jpg", description:"Sage-green flared kurti with off-white wide-leg palazzo pants.", tags:["cotton","palazzo","ethnic set","co-ord"] },
  { id:"anarkali", label:"Anarkali", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/garments/women/anarkali.jpg", description:"Deep maroon floor-length velvet Anarkali with gold zardozi neckline.", tags:["velvet","zardozi","festive","bridal","floor-length"], isPopular:true },
  { id:"coord-set", label:"Co-Ord Set", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/showcase/western_beige_coord.jpg", description:"Textured linen-blend 3-piece co-ord set.", tags:["linen","3-piece","modern","co-ord"] },
  { id:"full-sleeve-shirt", label:"Full Sleeve Shirt", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/garments/women/full_sleeve_shirt.jpg", description:"Crisp ice-blue oversized poplin cotton button-down shirt.", tags:["poplin","oversized","button-down","formal"], isPopular:true },
  { id:"half-sleeve-shirt", label:"Half Sleeve Shirt", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/gallery/col1_blouse.jpg", description:"Vintage camp shirt in cream viscose with botanical leaf embroidery.", tags:["viscose","camp shirt","botanical","blouse"] },
  { id:"full-sleeve-tshirt", label:"Full Sleeve T-shirt", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/garments/women/full_sleeve_shirt.jpg", description:"Soft Breton-striped heavyweight long-sleeve crewneck cotton t-shirt.", tags:["striped","heavyweight","cotton","crewneck"] },
  { id:"half-sleeve-tshirt", label:"Half Sleeve T-shirt", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/vz_thumb_burgundy_top.jpg", description:"Washed drop-shoulder relaxed-fit heavyweight cotton t-shirt.", tags:["drop-shoulder","boxy","relaxed","t-shirt"] },
  { id:"top", label:"Top", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/vz_thumb_burgundy_top.jpg", description:"Cowl-neck bias-cut silk satin sleeveless camisole top.", tags:["silk","satin","cowl-neck","sleeveless"] },
  { id:"crop-top", label:"Crop Top", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/garments/women/crop_top.jpg", description:"Ribbed terracotta off-the-shoulder puff-sleeve sweetheart crop top.", tags:["terracotta","ribbed","sweetheart","puff-sleeve","crop"], isPopular:true },
  { id:"hoodie", label:"Hoodie", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/vz_flatlay_hoodie.jpg", description:"Heavyweight fleece oversized pullover hoodie.", tags:["fleece","oversized","pullover","hoodie"] },
  { id:"sweatshirt", label:"Sweatshirt", category:"tops", categoryLabel:"Tops & Shirts", displayStyle:"flat-lay", img:"/vz_flatlay_hoodie.jpg", description:"Vintage crewneck raglan-sleeve sweatshirt in French terry.", tags:["french terry","raglan","crewneck","sweatshirt"] },
  { id:"jacket", label:"Jacket", category:"outerwear", categoryLabel:"Outerwear", displayStyle:"flat-lay", img:"/showcase/western_leather_jacket.jpg", description:"Genuine tailored trucker jacket with silver zip hardware.", tags:["trucker","outerwear","jacket","winter"] },
  { id:"blazer", label:"Blazer", category:"outerwear", categoryLabel:"Outerwear", displayStyle:"flat-lay", img:"/garments/women/blazer.jpg", description:"Structured double-breasted houndstooth wool-blend blazer.", tags:["houndstooth","double-breasted","wool","tailored"], isPopular:true },
  { id:"suit", label:"Suit", category:"outerwear", categoryLabel:"Outerwear", displayStyle:"flat-lay", img:"/garments/women/suit.jpg", description:"Minimalist chalk-stripe slim-fit three-piece power suit.", tags:["chalk-stripe","slim-fit","formal","three-piece"], isPopular:true },
  { id:"long-frock", label:"Long Frock", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/garments/women/long_frock.jpg", description:"Romantic chiffon tiered maxi dress.", tags:["chiffon","tiered","maxi","romantic"], isPopular:true },
  { id:"mini-frock", label:"Mini Frock", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/garments/women/long_frock.jpg", description:"Ribbed knit mini dress with balconette neckline.", tags:["knit","mini","ribbed","trendy"] },
  { id:"cocktail", label:"Cocktail Dress", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/garments/women/cocktail.jpg", description:"Asymmetric ruffle-tiered organza A-line cocktail dress.", tags:["organza","asymmetric","ruffle","cocktail"], isPopular:true },
  { id:"jumpsuit", label:"Jumpsuit", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/step1_jumpsuit_flatlay.jpg", description:"Tailored wide-leg crepe jumpsuit.", tags:["jumpsuit","wide-leg","crepe","tailored"] },
  { id:"dress", label:"Casual Dress", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/vz_thumb_dress.jpg", description:"Breezy linen smocked midi dress.", tags:["linen","smocked","midi","summer"] },
  { id:"jean", label:"Jeans", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/garments/women/jean.jpg", description:"Indigo selvedge denim high-rise straight-leg jeans.", tags:["selvedge","denim","high-rise","straight-leg"], isPopular:true },
  { id:"lehenga", label:"Lehenga", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/showcase/kids_girl_lehenga.jpg", description:"Banarasi silk flared bridal lehenga skirt.", tags:["banarasi","silk","bridal","lehenga"] },
  { id:"baggy-jean", label:"Baggy Jean", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/gallery/col5_female_denim.jpg", description:"Y2K oversized baggy wide-leg denim jeans.", tags:["y2k","baggy","wide-leg","denim"] },
  { id:"trouser", label:"Trouser", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/brand_vest_trousers.jpg", description:"Tailored wide-leg pleated cream linen-blend trousers.", tags:["trouser","pleated","linen","workwear"] },
  { id:"track", label:"Track", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/gallery/col5_female_denim.jpg", description:"Heavyweight cotton fleece relaxed sweatpants joggers.", tags:["joggers","sweatpants","fleece","athleisure"] },
  { id:"long-skirt", label:"Long Skirt", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/brand_floral_saree.jpg", description:"Tiered bohemian A-line maxi skirt.", tags:["boho","maxi skirt","tiered","skirt"] },
  { id:"mini-skirt", label:"Mini Skirt", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/brand_chocolate_dress.jpg", description:"Classic tweed A-line mini skirt with pearl buttons.", tags:["tweed","mini skirt","chic"] },
  { id:"short", label:"Short", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/gallery/col5_female_denim.jpg", description:"High-rise cutoff denim shorts with frayed raw hem.", tags:["denim shorts","high-rise","summer"] },
  { id:"inner-wear", label:"Inner wear", category:"bottoms", categoryLabel:"Bottoms", displayStyle:"flat-lay", img:"/garments/women/crop_top.jpg", description:"Minimalist seamless microfiber bra and brief set.", tags:["seamless","microfiber","basics"] },
  { id:"saree-mannequin", label:"Saree on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/garments/women/saree_mannequin.jpg", description:"Traditional Paithani silk saree draped on studio mannequin.", tags:["paithani","saree","mannequin","3d drape"] },
  { id:"cocktail-mannequin", label:"Cocktail on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/showcase/western_black_cocktail.jpg", description:"Sculptural draped asymmetrical cocktail gown on mannequin.", tags:["cocktail","gown","mannequin"] },
  { id:"half-saree-mannequin", label:"Half Saree on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/garments/women/half_saree_mannequin.jpg", description:"South Indian half saree with pleated silk skirt and zari dupatta.", tags:["langa voni","half saree","south indian"] },
  { id:"lehenga-mannequin", label:"Lehenga on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/garments/women/lehenga_mannequin.jpg", description:"Bridal velvet lehenga with antique gold zardozi on mannequin.", tags:["bridal","lehenga","velvet","wedding"] },
  { id:"long-frock-mannequin", label:"Long Frock on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/brand_evening_gown.jpg", description:"Floor-length evening gown with micro-sequin embellishments.", tags:["sequin","evening gown","floor-length"] },
  { id:"mini-frock-mannequin", label:"Mini Frock on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/vz_thumb_dress.jpg", description:"Smocked linen mini babydoll dress on dressmaker form.", tags:["babydoll","linen","mannequin"] },
  { id:"kurti-mannequin", label:"Kurti on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/garments/women/kurti.jpg", description:"Hand-block-printed Angrakha kurti with tie-up tassels.", tags:["angrakha","block-print","mannequin"] },
  { id:"chudidar-mannequin", label:"Chudidar on Mannequin", category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/gallery/col5_extra_lehenga.jpg", description:"Festive raw silk chudidar suit with organza dupatta.", tags:["raw silk","festive","chudidar"] },
];
