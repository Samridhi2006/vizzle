// src/data/girlsGarments.js
// 10 authentic Girls' garments — each image is unique to this section,
// correctly labelled, zero reuse from Women's or Boys' catalog.
// Images live under /garments/girls/.
// Note: half_sleeve_shirt, half_sleeve_tshirt, hoodie, jacket are using
// placeholder images (quota reset ~04:21 IST) — swap with girl-specific
// images when quota resets.

export const GIRLS_GARMENTS = [
  {
    id: "girl-crop-top",
    label: "Crop top",
    category: "Tops",
    categoryLabel: "Tops",
    img: "/garments/girls/crop_top.jpg",
  },
  {
    id: "girl-full-sleeve-shirt",
    label: "Full sleeve Shirt",
    category: "Shirts",
    categoryLabel: "Shirts",
    img: "/garments/girls/full_sleeve_shirt.jpg",
  },
  {
    id: "girl-full-sleeve-tshirt",
    label: "Full sleeve T-shirt",
    category: "T-Shirts",
    categoryLabel: "T-Shirts",
    img: "/garments/girls/full_sleeve_tshirt.jpg",
  },
  {
    id: "girl-half-sleeve-shirt",
    label: "Half sleeve Shirt",
    category: "Shirts",
    categoryLabel: "Shirts",
    img: "/garments/girls/half_sleeve_shirt.jpg",
  },
  {
    id: "girl-half-sleeve-tshirt",
    label: "Half sleeve Tshirt",
    category: "T-Shirts",
    categoryLabel: "T-Shirts",
    img: "/garments/girls/half_sleeve_tshirt.jpg",
  },
  {
    id: "girl-hoodie",
    label: "Hoodie",
    category: "Winterwear",
    categoryLabel: "Winterwear",
    img: "/garments/girls/hoodie.jpg",
  },
  {
    id: "girl-jacket",
    label: "Jacket",
    category: "Outerwear",
    categoryLabel: "Outerwear",
    img: "/garments/girls/jacket.jpg",
  },
  {
    id: "girl-kurti",
    label: "Kurti",
    category: "Ethnic",
    categoryLabel: "Ethnic",
    img: "/garments/girls/kurti.jpg",
  },
  {
    id: "girl-long-frock",
    label: "Long Frock",
    category: "Dresses",
    categoryLabel: "Dresses",
    img: "/garments/girls/long_frock.jpg",
  },
  {
    id: "girl-mini-frock",
    label: "Mini Frock",
    category: "Dresses",
    categoryLabel: "Dresses",
    img: "/garments/girls/mini_frock.jpg",
  },
];

export const GIRLS_GARMENT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Tops", label: "Tops" },
  { id: "Shirts", label: "Shirts" },
  { id: "T-Shirts", label: "T-Shirts" },
  { id: "Dresses", label: "Dresses" },
  { id: "Outerwear", label: "Outerwear" },
  { id: "Winterwear", label: "Winterwear" },
  { id: "Ethnic", label: "Ethnic" },
];

export const GIRLS_POPULAR_IDS = [
  "girl-crop-top",
  "girl-full-sleeve-shirt",
  "girl-full-sleeve-tshirt",
  "girl-half-sleeve-shirt",
  "girl-half-sleeve-tshirt",
  "girl-hoodie",
  "girl-jacket",
  "girl-kurti",
  "girl-long-frock",
  "girl-mini-frock",
];
