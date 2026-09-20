// src/data/girlsGarments.ts
import type { GarmentItem } from "./womenGarments";

export const GIRLS_GARMENTS: GarmentItem[] = [
  { id:"girls-floral-dress", label:"Floral Dress", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/showcase/kids_girl_floral_dress.jpg", description:"A-line cotton floral print dress with puff sleeves.", tags:["floral","cotton","puff-sleeve","casual"], isPopular:true },
  { id:"girls-party-frock", label:"Party Frock", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/showcase/kids_girl_party_dress.jpg", description:"Tulle-skirt party frock with satin bodice and bow detail.", tags:["tulle","satin","party","bow"], isPopular:true },
  { id:"girls-lehenga-choli", label:"Lehenga Choli", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/showcase/kids_girl_lehenga.jpg", description:"Festive silk lehenga choli with embroidered border and dupatta.", tags:["lehenga","silk","ethnic","festive"] },
  { id:"girls-sharara-set", label:"Sharara Set", category:"ethnic", categoryLabel:"Ethnic Wear", displayStyle:"flat-lay", img:"/showcase/kids_girl_sharara.jpg", description:"Embroidered crop top with flared sharara pants.", tags:["sharara","embroidered","crop","ethnic"] },
  { id:"girls-long-frock", label:"Long Frock", category:"dresses", categoryLabel:"Dresses", displayStyle:"flat-lay", img:"/vz_thumb_dress.jpg", description:"Casual maxi frock with smocked bodice and tiered skirt.", tags:["maxi","smocked","tiered","casual"] },
];
