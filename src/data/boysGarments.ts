// src/data/boysGarments.ts
import type { GarmentItem } from "./womenGarments";

export const BOYS_GARMENTS: GarmentItem[] = [
  { id:"boys-kurta-set", label:"Kurta Set", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/showcase/kids_boy_kurta.jpg", description:"Festive cotton kurta with churidar pyjama set for boys.", tags:["kurta","ethnic","festive","boys"], isPopular:true },
  { id:"boys-nehru-kurta", label:"Nehru Kurta Set", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/showcase/kids_boy_nehru.jpg", description:"Classic Nehru collar kurta with straight trousers.", tags:["nehru","kurta","collar","ethnic"] },
  { id:"boys-polo-shorts", label:"Polo & Shorts", category:"casual", categoryLabel:"Casual Wear", displayStyle:"flat-lay", img:"/showcase/kids_boy_polo.jpg", description:"Sporty polo shirt with chino shorts co-ord.", tags:["polo","shorts","sporty","casual"], isPopular:true },
  { id:"boys-denim-jacket", label:"Denim & Jacket", category:"casual", categoryLabel:"Casual Wear", displayStyle:"flat-lay", img:"/gallery/col5_boy_denim.jpg", description:"Washed denim jacket paired with cargo pants.", tags:["denim","jacket","cargo","streetwear"] },
  { id:"boys-hoodie", label:"Hoodie", category:"casual", categoryLabel:"Casual Wear", displayStyle:"flat-lay", img:"/vz_flatlay_hoodie.jpg", description:"Heavyweight pullover hoodie with kangaroo pocket.", tags:["hoodie","pullover","streetwear","casual"] },
];
