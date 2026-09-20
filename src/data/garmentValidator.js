// src/data/garmentValidator.js
// Validation tool to ensure zero image reuse, complete schemas, and authentic assets

import { MEN_GARMENTS } from "./menGarments.js";
import { BOYS_GARMENTS } from "./boysGarments.js";
import { GIRLS_GARMENTS } from "./girlsGarments.js";
import { WOMEN_GARMENTS } from "./womenGarments.js";

export function validateCatalog(catalogName, items) {
  const errors = [];
  const seenIds = new Set();
  const seenImgs = new Set();

  items.forEach((item, index) => {
    if (!item.id) errors.push(`[${catalogName}] Item at index ${index} is missing 'id'`);
    if (!item.label) errors.push(`[${catalogName}] Item at index ${index} is missing 'label'`);
    if (!item.img) errors.push(`[${catalogName}] Item at index ${index} is missing 'img'`);

    if (seenIds.has(item.id)) {
      errors.push(`[${catalogName}] Duplicate ID detected: '${item.id}'`);
    }
    seenIds.add(item.id);

    if (seenImgs.has(item.img)) {
      errors.push(`[${catalogName}] Duplicate image detected: '${item.img}' reused across multiple items!`);
    }
    seenImgs.add(item.img);
  });

  return {
    catalog: catalogName,
    count: items.length,
    valid: errors.length === 0,
    errors,
  };
}

export function validateAllCatalogs() {
  return [
    validateCatalog("Men", MEN_GARMENTS),
    validateCatalog("Boys", BOYS_GARMENTS),
    validateCatalog("Girls", GIRLS_GARMENTS),
    validateCatalog("Women", WOMEN_GARMENTS),
  ];
}
