// src/data/poses.ts
export interface Pose {
  id: string;
  label: string;
  sublabel: string;
  img: string;
  category: string;
  description: string;
}

export interface PoseCategory {
  id: string;
  label: string;
}

export const WOMEN_POSES: Pose[] = [
  { id:"front-view", label:"Front View", sublabel:"Standing neutral", img:"/images/poses/women/front_view.jpg", category:"catalog", description:"Classic straight-on front angle showcasing full outfit silhouette." },
  { id:"side-turn", label:"Side Turn", sublabel:"90° Profile view", img:"/images/poses/women/side_turn.jpg", category:"catalog", description:"Sharp 90-degree lateral side view highlighting contours and fit." },
  { id:"angle-45", label:"45° Angle", sublabel:"Three-quarter stance", img:"/images/poses/women/angle_45.jpg", category:"profile", description:"Flattering 45-degree three-quarter turn adding depth and dimension." },
  { id:"hands-on-waist", label:"Hands on Waist", sublabel:"Editorial power pose", img:"/images/poses/women/hands_on_waist.jpg", category:"editorial", description:"Confident power stance with both hands on waist." },
  { id:"cross-arm", label:"Cross Arm", sublabel:"Confident poise", img:"/images/poses/women/cross_arm.jpg", category:"editorial", description:"Poised arms crossed stance, ideal for blazers and jackets." },
  { id:"walking", label:"Walking", sublabel:"Dynamic runway stride", img:"/images/poses/women/walking.jpg", category:"motion", description:"Dynamic mid-stride runway walk showcasing fabric drape and flow." },
  { id:"over-shoulder", label:"Over the Shoulder", sublabel:"Turned gaze", img:"/images/poses/women/over_shoulder.jpg", category:"editorial", description:"Model turned with head looking over shoulder, ideal for back designs." },
  { id:"back-view", label:"Back View", sublabel:"180° Rear detail", img:"/images/poses/women/back_view.jpg", category:"catalog", description:"Full rear angle showing back neckline, zippers, and tailoring." },
  { id:"seated-pose", label:"Seated Pose", sublabel:"Minimalist block", img:"/images/poses/women/seated_pose.jpg", category:"seated", description:"Graceful seated pose for lifestyle and luxury lookbooks." },
  { id:"casual-lean", label:"Casual Lean", sublabel:"Hand in pocket", img:"/images/poses/women/casual_lean.jpg", category:"motion", description:"Relaxed casual stance perfect for denim, co-ords, and everyday wear." },
];

export const MEN_POSES: Pose[] = [
  { id:"men-front-view", label:"Front View", sublabel:"Standing neutral", img:"/images/poses/men/front_view.jpg", category:"catalog", description:"Standing neutral front angle." },
  { id:"men-angle-45", label:"45° Angle", sublabel:"Three-quarter turn", img:"/images/poses/men/angle_45.jpg", category:"profile", description:"Three-quarter turn." },
  { id:"men-side-turn", label:"Side Turn", sublabel:"Profile silhouette", img:"/images/poses/men/side_turn.jpg", category:"catalog", description:"Profile silhouette side turn." },
  { id:"men-back-view", label:"Back View", sublabel:"Standing back", img:"/images/poses/men/back_view.jpg", category:"catalog", description:"Standing back view." },
  { id:"men-hands-pocket", label:"Hands in Pocket", sublabel:"Modern relaxed", img:"/images/poses/men/hands_in_pocket.jpg", category:"catalog", description:"Modern relaxed hands in pocket." },
  { id:"men-cross-arm", label:"Cross Arm", sublabel:"Tailored confidence", img:"/images/poses/men/cross_arm.jpg", category:"editorial", description:"Tailored confidence crossed arms." },
  { id:"men-relaxed-lean", label:"Relaxed Lean", sublabel:"Casual vibe", img:"/images/poses/men/relaxed_lean.jpg", category:"motion", description:"Casual vibe relaxed lean." },
  { id:"men-walking", label:"Walking", sublabel:"Natural movement", img:"/images/poses/men/walking.jpg", category:"motion", description:"Natural movement walking stride." },
  { id:"men-seated", label:"Seated", sublabel:"Calm & composed", img:"/images/poses/men/seated.jpg", category:"seated", description:"Calm and composed seated pose." },
  { id:"men-hands-behind-head", label:"Hands Behind Head", sublabel:"Confident & relaxed", img:"/images/poses/men/hands_behind_head.jpg", category:"editorial", description:"Confident and relaxed pose." },
  { id:"men-looking-down", label:"Looking Down", sublabel:"Thoughtful", img:"/images/poses/men/looking_down.jpg", category:"profile", description:"Thoughtful looking down pose." },
  { id:"men-adjusting-jacket", label:"Adjusting Jacket", sublabel:"Polished look", img:"/images/poses/men/adjusting_jacket.jpg", category:"editorial", description:"Polished look adjusting jacket." },
  { id:"men-over-shoulder", label:"Over Shoulder", sublabel:"Candid look", img:"/images/poses/men/over_shoulder.jpg", category:"editorial", description:"Candid look over the shoulder." },
];

export const POSE_CATEGORIES: PoseCategory[] = [
  { id:"all", label:"All Poses" },
  { id:"catalog", label:"Catalog Essentials" },
  { id:"editorial", label:"Editorial & Power" },
  { id:"profile", label:"360° & Profile" },
  { id:"motion", label:"Walking & Motion" },
  { id:"seated", label:"Seated & Lifestyle" },
];
