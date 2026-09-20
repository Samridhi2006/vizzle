// src/data/aiModels.ts
export interface AIModel {
  id: string;
  name: string;
  img: string;
  tag: string;
  ethnicity: string;
  style: string;
}

export const AI_MODELS: AIModel[] = [
  { id:"meera", name:"Meera", img:"/images/models/headshots/meera.jpg", tag:"Editorial Glam", ethnicity:"South Asian", style:"Luxury / Festive" },
  { id:"zara", name:"Zara", img:"/images/models/headshots/zara.jpg", tag:"High Fashion", ethnicity:"East Asian", style:"Runway / Modern" },
  { id:"naina", name:"Naina", img:"/images/models/headshots/naina.jpg", tag:"Classic Festive", ethnicity:"South Asian", style:"Traditional / Bridal" },
  { id:"priya", name:"Priya", img:"/images/models/headshots/priya.jpg", tag:"Natural Casual", ethnicity:"South Asian", style:"Commercial / Everyday" },
  { id:"anaya", name:"Anaya", img:"/images/models/headshots/anaya.jpg", tag:"Modern Chic", ethnicity:"South Asian", style:"Contemporary / Western" },
  { id:"ishita", name:"Ishita", img:"/images/models/headshots/ishita.jpg", tag:"Commercial Fresh", ethnicity:"South Asian", style:"Catalog / Friendly" },
  { id:"diya", name:"Diya", img:"/images/models/headshots/diya.jpg", tag:"Royal Bridal", ethnicity:"South Asian", style:"Heritage / Couture" },
  { id:"kavya", name:"Kavya", img:"/images/models/headshots/kavya.jpg", tag:"Luxury Evening", ethnicity:"South Asian", style:"Evening / Glamour" },
  { id:"riya", name:"Riya", img:"/images/models/headshots/riya.jpg", tag:"Streetwear Urban", ethnicity:"South Asian", style:"Casual / Denim" },
  { id:"sana", name:"Sana", img:"/images/models/headshots/sana.jpg", tag:"Tailored Runway", ethnicity:"South Asian", style:"Outerwear / Tailored" },
];
