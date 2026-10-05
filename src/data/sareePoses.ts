// src/data/sareePoses.js
// Specialized Saree drape poses extracted for Vizzle Studio

export const sareeSpecificPoses = [
  {
    id: "saree-pose-1",
    name: "Classic Front Drape",
    imagePath: "/images/poses/saree_pose_1.jpg",
    label: "Classic Front Drape",
    img: "/images/poses/saree_pose_1.jpg",
    sublabel: "Front drape",
    category: "catalog",
    description: "Classic straight-on front drape showcasing traditional saree pleats and pallu fall."
  },
  {
    id: "saree-pose-2",
    name: "Pallu Shoulder Hold",
    imagePath: "/images/poses/saree_pose_2.jpg",
    label: "Pallu Shoulder Hold",
    img: "/images/poses/saree_pose_2.jpg",
    sublabel: "Shoulder hold",
    category: "editorial",
    description: "Elegant pallu drape held over the shoulder with graceful arm posture."
  },
  {
    id: "saree-pose-3",
    name: "Side Fold Elegance",
    imagePath: "/images/poses/saree_pose_3.jpg",
    label: "Side Fold Elegance",
    img: "/images/poses/saree_pose_3.jpg",
    sublabel: "Side flare",
    category: "profile",
    description: "Flattering side fold elegance highlighting the flowing border and pallu width."
  },
  {
    id: "saree-pose-4",
    name: "Hands Crossed Pallu",
    imagePath: "/images/poses/saree_pose_4.jpg",
    label: "Hands Crossed Pallu",
    img: "/images/poses/saree_pose_4.jpg",
    sublabel: "Folded hands",
    category: "editorial",
    description: "Poised hands crossed pose framing the waist pleats and drape symmetry."
  },
  {
    id: "saree-pose-5",
    name: "Dynamic Walking Drape",
    imagePath: "/images/poses/saree_pose_5.jpg",
    label: "Dynamic Walking Drape",
    img: "/images/poses/saree_pose_5.jpg",
    sublabel: "Walking motion",
    category: "motion",
    description: "Dynamic walking motion capturing fluid drape movement and pallu trail."
  }
];

export const SAREE_POSES = sareeSpecificPoses;

/**
 * Recognized saree variants:
 * - "saree"
 * - "saree-mannequin"
 * - "half-saree"
 * - "half-saree-mannequin"
 */
export const SAREE_GARMENT_IDS = [
  "saree",
  "saree-mannequin",
  "half-saree",
  "half-saree-mannequin"
];

/**
 * Checks whether a given garment ID, object, or name corresponds to a saree garment
 */
export function isSareeGarment(garment?: string | { id?: string; name?: string; label?: string } | null): boolean {
  if (!garment) return false;
  const idOrName = (typeof garment === "string" ? garment : garment.id || garment.name || garment.label || "").toLowerCase();
  return SAREE_GARMENT_IDS.includes(idOrName) || idOrName.includes("saree");
}
