export interface SareePose {
  id: string;
  name: string;
  imagePath: string;
  label?: string;
  img?: string;
  sublabel?: string;
  category?: string;
  description?: string;
}

export { sareeSpecificPoses, isSareeGarment, SAREE_GARMENT_IDS } from "../../src/data/sareePoses";
export { default } from "../../src/studio/PoseSelector";
