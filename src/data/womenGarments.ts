// src/data/womenGarments.ts
// All images served from /public/women-picker/ — dedicated, correctly-matched assets per garment type.

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
  { id: "all",       label: "All",           count: 39 },
  { id: "ethnic",    label: "Ethnic Wear",   count: 6  },
  { id: "tops",      label: "Tops & Shirts", count: 8  },
  { id: "outerwear", label: "Outerwear",     count: 3  },
  { id: "dresses",   label: "Dresses",       count: 5  },
  { id: "bottoms",   label: "Bottoms",       count: 8  },
  { id: "mannequin", label: "3D Drapes",     count: 7  },
];

export const POPULAR_GARMENT_IDS = [
  "crop-top", "saree", "kurti", "blazer", "one-piece-suit",
  "anarkali", "cocktail", "long-frock", "full-sleeve-shirt", "jean",
];

export const WOMEN_GARMENTS: GarmentItem[] = [
  // Ethnic Wear
  { id:"saree",            label:"Saree",              category:"ethnic",    categoryLabel:"Ethnic Wear",   displayStyle:"flat-lay",  img:"/women-picker/saree.jpg",              description:"Royal Kanjivaram silk saree with antique gold zari border.",                              tags:["silk","traditional","kanjivaram","ethnic","wedding"],              isPopular:true  },
  { id:"kurti",            label:"Kurti",              category:"ethnic",    categoryLabel:"Ethnic Wear",   displayStyle:"flat-lay",  img:"/women-picker/kurti.jpg",              description:"Mustard-yellow A-line chanderi silk kurti with delicate mirror work.",                   tags:["chanderi","silk","mirror work","casual"],                          isPopular:true  },
  { id:"kurti-pyjama",     label:"Kurti & Pyjama",     category:"ethnic",    categoryLabel:"Ethnic Wear",   displayStyle:"flat-lay",  img:"/women-picker/kurti-pyjama.jpg",       description:"Sage-green flared kurti with off-white wide-leg palazzo pants.",                        tags:["cotton","palazzo","ethnic set","co-ord"]                                          },
  { id:"anarkali",         label:"Anarkali",           category:"ethnic",    categoryLabel:"Ethnic Wear",   displayStyle:"flat-lay",  img:"/women-picker/anarkali.jpg",           description:"Deep maroon floor-length velvet Anarkali with gold zardozi neckline.",                   tags:["velvet","zardozi","festive","bridal","floor-length"],              isPopular:true  },
  { id:"chudidar",         label:"Chudidar",           category:"ethnic",    categoryLabel:"Ethnic Wear",   displayStyle:"flat-lay",  img:"/women-picker/chudidar.jpg",           description:"Embroidered purple silk kameez with fitted chudidar bottoms and dupatta.",              tags:["silk","churidar","kameez","festive","ethnic"]                                     },
  // Tops & Shirts
  { id:"full-sleeve-shirt",  label:"Full Sleeve Shirt",  category:"tops",    categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/full-sleeve-shirt.jpg",  description:"Crisp ice-blue oversized poplin cotton button-down shirt.",                            tags:["poplin","oversized","button-down","formal"],                       isPopular:true  },
  { id:"half-sleeve-shirt",  label:"Half Sleeve Shirt",  category:"tops",    categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/half-sleeve-shirt.jpg",  description:"Floral-print short-sleeve camp shirt in viscose.",                                     tags:["viscose","camp shirt","floral","blouse"]                                          },
  { id:"full-sleeve-tshirt", label:"Full Sleeve T-shirt",category:"tops",    categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/full-sleeve-tshirt.jpg", description:"Breton-striped heavyweight long-sleeve crewneck cotton t-shirt.",                      tags:["striped","heavyweight","cotton","crewneck"]                                       },
  { id:"half-sleeve-tshirt", label:"Half Sleeve T-shirt",category:"tops",    categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/half-sleeve-tshirt.jpg", description:"Drop-shoulder relaxed-fit washed cotton boxy tee.",                                    tags:["drop-shoulder","boxy","relaxed","t-shirt"]                                        },
  { id:"top",              label:"Top",                category:"tops",      categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/top.jpg",                description:"Cowl-neck bias-cut silk satin sleeveless camisole top.",                               tags:["silk","satin","cowl-neck","sleeveless"]                                           },
  { id:"crop-top",         label:"Crop Top",           category:"tops",      categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/crop-top.jpg",           description:"Ribbed off-the-shoulder puff-sleeve sweetheart crop top.",                             tags:["ribbed","sweetheart","puff-sleeve","crop"],                        isPopular:true  },
  { id:"hoodie",           label:"Hoodie",             category:"tops",      categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/hoodie.jpg",             description:"Heavyweight fleece oversized zip-up pullover hoodie.",                                 tags:["fleece","oversized","zip","hoodie"]                                               },
  { id:"sweatshirt",       label:"Sweatshirt",         category:"tops",      categoryLabel:"Tops & Shirts", displayStyle:"flat-lay",  img:"/women-picker/sweatshirt.jpg",         description:"Vintage crewneck raglan-sleeve sweatshirt in French terry.",                           tags:["french terry","raglan","crewneck","sweatshirt"]                                   },
  // Outerwear
  { id:"blazer",           label:"Blazer",             category:"outerwear", categoryLabel:"Outerwear",     displayStyle:"flat-lay",  img:"/women-picker/blazer.jpg",             description:"Structured double-breasted white wool-blend blazer.",                                  tags:["double-breasted","wool","tailored","formal"],                      isPopular:true  },
  { id:"one-piece-suit",   label:"One Piece Suit",     category:"outerwear", categoryLabel:"Outerwear",     displayStyle:"flat-lay",  img:"/women-picker/one-piece-suit.jpg",     description:"Tailored pink single-breasted blazer with matching trousers.",                         tags:["formal","pink","blazer","suit"],                                   isPopular:true  },
  { id:"two-piece-suit",   label:"Two Piece Suit",     category:"outerwear", categoryLabel:"Outerwear",     displayStyle:"flat-lay",  img:"/women-picker/two-piece-suit.jpg",     description:"Classic grey two-button business suit with straight-leg trousers.",                    tags:["grey","business","formal","two-piece"]                                            },
  // Dresses
  { id:"long-frock",         label:"Long Frock",         category:"dresses", categoryLabel:"Dresses",       displayStyle:"flat-lay",  img:"/women-picker/long-frock.jpg",         description:"Romantic chiffon tiered maxi dress with spaghetti straps.",                           tags:["chiffon","tiered","maxi","romantic"],                             isPopular:true  },
  { id:"cocktail",           label:"Cocktail Dress",     category:"dresses", categoryLabel:"Dresses",       displayStyle:"flat-lay",  img:"/women-picker/cocktail.jpg",           description:"Asymmetric ruffle-tiered organza A-line cocktail dress.",                              tags:["organza","asymmetric","ruffle","cocktail"],                        isPopular:true  },
  { id:"jumpsuit",           label:"Jumpsuit",           category:"dresses", categoryLabel:"Dresses",       displayStyle:"flat-lay",  img:"/women-picker/jumpsuit.jpg",           description:"Tailored wide-leg crepe jumpsuit in khaki.",                                           tags:["jumpsuit","wide-leg","crepe","tailored"]                                          },
  // Bottoms
  { id:"jean",             label:"Jean",               category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/jean.jpg",               description:"Indigo selvedge denim high-rise straight-leg jeans.",                                  tags:["selvedge","denim","high-rise","straight-leg"],                     isPopular:true  },
  { id:"baggy-jean",       label:"Baggy Jean",         category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/baggy-jean.jpg",         description:"Light-wash Y2K oversized baggy wide-leg denim jeans.",                                tags:["y2k","baggy","wide-leg","light-wash"]                                             },
  { id:"trouser",          label:"Trouser",            category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/trouser.jpg",            description:"Wide-leg pleated brown dress trousers in linen-blend.",                                tags:["trouser","wide-leg","linen","formal"]                                             },
  { id:"track",            label:"Track",              category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/track.jpg",              description:"Black fleece jogger sweatpants with drawstring waist.",                                tags:["joggers","sweatpants","fleece","athleisure"]                                      },
  { id:"long-skirt",       label:"Long Skirt",         category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/long-skirt.jpg",         description:"Black satin midi maxi skirt with clean A-line silhouette.",                           tags:["satin","maxi skirt","black","elegant"]                                            },
  { id:"mini-skirt",       label:"Mini Skirt",         category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/mini-skirt.jpg",         description:"Beige suede A-line mini skirt with large button front.",                               tags:["mini skirt","suede","beige","chic"]                                               },
  { id:"short",            label:"Short",              category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/short.jpg",              description:"Distressed light-blue high-rise denim cutoff shorts.",                                 tags:["denim shorts","distressed","high-rise","summer"]                                  },
  { id:"inner-wear",       label:"Inner Wear",         category:"bottoms",   categoryLabel:"Bottoms",       displayStyle:"flat-lay",  img:"/women-picker/inner-wear.jpg",         description:"Black lace bralette and matching high-waist brief set.",                               tags:["lace","lingerie","black","intimates"]                                             },
  // 3D Drapes (Mannequin)
  { id:"saree-mannequin",        label:"Saree on Mannequin",          category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/women-picker/saree-mannequin.jpg",        description:"Traditional Paithani silk saree draped on studio mannequin.",         tags:["paithani","saree","mannequin","heritage"]       },
  { id:"lehenga-mannequin",      label:"Lehenga on Mannequin",        category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/women-picker/lehenga-mannequin.jpg",      description:"Bridal velvet lehenga with antique gold zardozi on mannequin.",      tags:["bridal","lehenga","velvet","wedding"]           },
  { id:"half-saree-mannequin",   label:"Half Saree on Mannequin",     category:"mannequin", categoryLabel:"3D Drapes", displayStyle:"mannequin", img:"/women-picker/half-saree-mannequin.jpg",   description:"South Indian half saree with pleated silk skirt on ghost mannequin.", tags:["half saree","south indian","silk","festive"]    },
];

// Validation
export function validateGarmentItem(item: GarmentItem, expectedGender = "women") {
  const errors: string[] = [];
  if (!item.id    || typeof item.id    !== "string") errors.push("Missing or invalid id");
  if (!item.label || typeof item.label !== "string") errors.push("Missing or invalid label");
  if (!item.category || typeof item.category !== "string") errors.push("Missing or invalid category");
  if (!item.img   || typeof item.img   !== "string") errors.push("Missing or invalid img path");
  if (expectedGender === "women") {
    const banned = ["menswear","male","boy","men_","thumb_black_shirt","thumb_violet_shirt","thumb_beige_suit","model_hoodie"];
    if (banned.some((kw) => item.img.toLowerCase().includes(kw)))
      errors.push(`Gender mismatch: asset "${item.img}" contains male/boy marker`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateCatalog(catalog: GarmentItem[], expectedGender = "women") {
  const results = catalog.map((item) => ({ id: item.id, ...validateGarmentItem(item, expectedGender) }));
  const invalid = results.filter((r) => !r.valid);
  if (invalid.length > 0 && process.env.NODE_ENV !== "production")
    console.warn(`[Catalog Integrity Warning] ${invalid.length} mismatched garments:`, invalid);
  return { total: catalog.length, validCount: catalog.length - invalid.length, invalidCount: invalid.length, invalid };
}

validateCatalog(WOMEN_GARMENTS, "women");
