// src/data/poses.js
// Official Studio Catalogue Poses Roster for Vizzle Studio

export const WOMEN_POSES = [
  // ── Original Classic Catalogue Poses (10) ──────────────────────────────────
  { id: "front-view", label: "Front View", sublabel: "Standing neutral", img: "/images/poses/women/front_view.jpg", category: "catalog", description: "Classic straight-on front angle showcasing full outfit silhouette." },
  { id: "side-turn", label: "Side Turn", sublabel: "90° Profile view", img: "/images/poses/women/side_turn.jpg", category: "catalog", description: "Sharp 90-degree lateral side view highlighting contours and fit." },
  { id: "angle-45", label: "45° Angle", sublabel: "Three-quarter stance", img: "/images/poses/women/angle_45.jpg", category: "profile", description: "Flattering 45-degree three-quarter turn adding depth and dimension." },
  { id: "hands-on-waist", label: "Hands on Waist", sublabel: "Editorial power pose", img: "/images/poses/women/hands_on_waist.jpg", category: "editorial", description: "Confident power stance with both hands on waist." },
  { id: "cross-arm", label: "Cross Arm", sublabel: "Confident poise", img: "/images/poses/women/cross_arm.jpg", category: "editorial", description: "Poised arms crossed stance, ideal for blazers and jackets." },
  { id: "walking", label: "Walking", sublabel: "Dynamic runway stride", img: "/images/poses/women/walking.jpg", category: "motion", description: "Dynamic mid-stride runway walk showcasing fabric drape and flow." },
  { id: "over-shoulder", label: "Over the Shoulder", sublabel: "Turned gaze", img: "/images/poses/women/over_shoulder.jpg", category: "editorial", description: "Model turned with head looking over shoulder, ideal for back designs." },
  { id: "back-view", label: "Back View", sublabel: "180° Rear detail", img: "/images/poses/women/back_view.jpg", category: "catalog", description: "Full rear angle showing back neckline, zippers, and tailoring." },
  { id: "seated-pose", label: "Seated Pose", sublabel: "Minimalist block", img: "/images/poses/women/seated_pose.jpg", category: "seated", description: "Graceful seated pose for lifestyle and luxury lookbooks." },
  { id: "casual-lean", label: "Casual Lean", sublabel: "Hand in pocket", img: "/images/poses/women/casual_lean.jpg", category: "motion", description: "Relaxed casual stance perfect for denim, co-ords, and everyday wear." },

  // ── Upper Body & Portrait Poses (1-20) ──────────────────────────────────
  {
    id: "women-pose-01",
    label: "Front Neutral",
    sublabel: "Standing neutral",
    img: "/images/poses/women/women_pose_01.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Classic straight-on front angle with hands folded gently at waist."
  },
  {
    id: "women-pose-02",
    label: "Hand on Hip Smile",
    sublabel: "Warm catalog look",
    img: "/images/poses/women/women_pose_02.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Warm friendly smiling pose with one hand resting on the hip."
  },
  {
    id: "women-pose-03",
    label: "Relaxed Front",
    sublabel: "Casual confidence",
    img: "/images/poses/women/women_pose_03.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Relaxed frontal stance with hands resting naturally at sides."
  },
  {
    id: "women-pose-04",
    label: "Hair Touch Glamour",
    sublabel: "Chic editorial",
    img: "/images/poses/women/women_pose_04.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Elegant look with hand gently touching hair, perfect for beauty & accessories."
  },
  {
    id: "women-pose-05",
    label: "Crossed Arms Angle",
    sublabel: "Editorial poise",
    img: "/images/poses/women/women_pose_05.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Poised three-quarter angle with crossed arms and focused gaze."
  },
  {
    id: "women-pose-06",
    label: "Playful Hand Gesture",
    sublabel: "Casual expression",
    img: "/images/poses/women/women_pose_06.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Lively playful expression with one hand raised, ideal for summer tops."
  },
  {
    id: "women-pose-07",
    label: "Open Palm Stance",
    sublabel: "Dynamic gesture",
    img: "/images/poses/women/women_pose_07.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Dynamic angle with open palm presentation and candid glance."
  },
  {
    id: "women-pose-08",
    label: "Hand on Waist Power",
    sublabel: "Confident poise",
    img: "/images/poses/women/women_pose_08.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Confident stance with right hand firmly on waist and beaming smile."
  },
  {
    id: "women-pose-09",
    label: "Three-Quarter Lean",
    sublabel: "Flattering 45° turn",
    img: "/images/poses/women/women_pose_09.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Flattering three-quarter angle emphasizing neckline and tailoring."
  },
  {
    id: "women-pose-10",
    label: "Double Hip Balance",
    sublabel: "Athletic posture",
    img: "/images/poses/women/women_pose_10.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Direct frontal pose with relaxed hands framing the waistline."
  },
  {
    id: "women-pose-11",
    label: "Side Profile Turn",
    sublabel: "90° Lateral silhouette",
    img: "/images/poses/women/women_pose_11.jpg",
    category: "upper-body",
    secondaryCategory: "profile",
    viewType: "upper",
    description: "Lateral side view highlighting contours, side seams, and fit."
  },
  {
    id: "women-pose-12",
    label: "Natural Smile Front",
    sublabel: "Approachability",
    img: "/images/poses/women/women_pose_12.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Warm and engaging commercial smile with neutral arm stance."
  },
  {
    id: "women-pose-13",
    label: "Chic Hand Wave",
    sublabel: "Spontaneous charm",
    img: "/images/poses/women/women_pose_13.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Spontaneous charm with hand raised slightly in greeting."
  },
  {
    id: "women-pose-14",
    label: "Folded Wrists Poise",
    sublabel: "Graceful commercial",
    img: "/images/poses/women/women_pose_14.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Graceful crossed wrists in front with gentle eye contact."
  },
  {
    id: "women-pose-15",
    label: "Clean Symmetrical",
    sublabel: "Direct e-commerce",
    img: "/images/poses/women/women_pose_15.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Symmetrical catalog standard ideal for marketplace hero images."
  },
  {
    id: "women-pose-16",
    label: "Fingers in Hair",
    sublabel: "Lifestyle casual",
    img: "/images/poses/women/women_pose_16.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Relaxed lifestyle stance running fingers through hair with warm smile."
  },
  {
    id: "women-pose-17",
    label: "Left Hip Rest",
    sublabel: "Structured stance",
    img: "/images/poses/women/women_pose_17.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Solid stance with left hand positioned on waist, showing sleeve structure."
  },
  {
    id: "women-pose-18",
    label: "Side Hair Sweep",
    sublabel: "Editorial movement",
    img: "/images/poses/women/women_pose_18.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Effortless glam sweeping locks behind shoulder."
  },
  {
    id: "women-pose-19",
    label: "Candid Laugh Turn",
    sublabel: "Radiant joy",
    img: "/images/poses/women/women_pose_19.jpg",
    category: "upper-body",
    secondaryCategory: "editorial",
    viewType: "upper",
    description: "Candid radiant smile turning slightly away from camera."
  },
  {
    id: "women-pose-20",
    label: "Subtle Hip Touch",
    sublabel: "Modern classic",
    img: "/images/poses/women/women_pose_20.jpg",
    category: "upper-body",
    secondaryCategory: "catalog",
    viewType: "upper",
    description: "Subtle hand placement framing garment lower hemline."
  },

  // ── Full Body Standing Poses (21-40) ────────────────────────────────────
  {
    id: "women-pose-21",
    label: "Full Body Hip Pop",
    sublabel: "Classic catalog stance",
    img: "/images/poses/women/women_pose_21.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Full-body straight-on view with hand on hip and feet planted evenly."
  },
  {
    id: "women-pose-22",
    label: "Elongated Neck Touch",
    sublabel: "Graceful verticality",
    img: "/images/poses/women/women_pose_22.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "Full-body posture with hand at neck and weight shifted to right foot."
  },
  {
    id: "women-pose-23",
    label: "Parallel Foot Stance",
    sublabel: "Head-to-toe neutral",
    img: "/images/poses/women/women_pose_23.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Head-to-toe neutral view displaying total outfit length and drape."
  },
  {
    id: "women-pose-24",
    label: "Over-Ear Hair Adjust",
    sublabel: "Candid full body",
    img: "/images/poses/women/women_pose_24.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "Full-body pose adjusting hair with clean barefoot studio look."
  },
  {
    id: "women-pose-25",
    label: "Clasped Hands Front",
    sublabel: "Balanced symmetry",
    img: "/images/poses/women/women_pose_25.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Clean symmetrical stance with hands clasped in front of waist."
  },
  {
    id: "women-pose-26",
    label: "Runway Walking Stride",
    sublabel: "Dynamic flow",
    img: "/images/poses/women/women_pose_26.jpg",
    category: "full-body",
    secondaryCategory: "motion",
    viewType: "full",
    description: "Active runway walk capturing fluid drape, trouser silhouette, and stride."
  },
  {
    id: "women-pose-27",
    label: "Crossed Arms Relaxed",
    sublabel: "Modern lifestyle",
    img: "/images/poses/women/women_pose_27.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Relaxed full-length stance with arms casually folded."
  },
  {
    id: "women-pose-28",
    label: "Confident Walk Forward",
    sublabel: "Paced stride",
    img: "/images/poses/women/women_pose_28.jpg",
    category: "full-body",
    secondaryCategory: "motion",
    viewType: "full",
    description: "Forward motion showcasing active wear and trouser hem flow."
  },
  {
    id: "women-pose-29",
    label: "Complete 90° Profile",
    sublabel: "Full lateral silhouette",
    img: "/images/poses/women/women_pose_29.jpg",
    category: "full-body",
    secondaryCategory: "profile",
    viewType: "full",
    description: "Side-profile head-to-toe silhouette highlighting fit and back drape."
  },
  {
    id: "women-pose-30",
    label: "Gentle Three-Quarter",
    sublabel: "Angles & dimension",
    img: "/images/poses/women/women_pose_30.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Three-quarter full-body angle adding dimension and depth to the garment."
  },
  {
    id: "women-pose-31",
    label: "Straight Front Hand on Hip",
    sublabel: "Firm catalog poise",
    img: "/images/poses/women/women_pose_31.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Direct full-body eye contact with crisp hand-on-hip definition."
  },
  {
    id: "women-pose-32",
    label: "High Head Rest",
    sublabel: "Fashion editorial",
    img: "/images/poses/women/women_pose_32.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "High-fashion pose with hand touching back of head, popping opposite hip."
  },
  {
    id: "women-pose-33",
    label: "Direct Commercial Stance",
    sublabel: "Clean marketplace look",
    img: "/images/poses/women/women_pose_33.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Standard Amazon / Myntra front hero full-body pose with warm smile."
  },
  {
    id: "women-pose-34",
    label: "Over-Shoulder Twist",
    sublabel: "Dynamic contour",
    img: "/images/poses/women/women_pose_34.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "Full-body turned stance looking back over shoulder with hands on hips."
  },
  {
    id: "women-pose-35",
    label: "Wide Confident Stance",
    sublabel: "Athletic wear poise",
    img: "/images/poses/women/women_pose_35.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Wider balanced leg placement ideal for loungewear, bottoms, and sets."
  },
  {
    id: "women-pose-36",
    label: "Soft Chest Hand Rest",
    sublabel: "Delicate feminine",
    img: "/images/poses/women/women_pose_36.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "Delicate feminine posture with hand resting near chest line."
  },
  {
    id: "women-pose-37",
    label: "Neck & Hip Dual Hold",
    sublabel: "Haute couture poise",
    img: "/images/poses/women/women_pose_37.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "Dual hand placement emphasizing silhouette geometry."
  },
  {
    id: "women-pose-38",
    label: "Confident Gaze Stance",
    sublabel: "Strong power stance",
    img: "/images/poses/women/women_pose_38.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Strong catalog posture with one hand on waist and piercing gaze."
  },
  {
    id: "women-pose-39",
    label: "Crown Hair Touch",
    sublabel: "Playful chic",
    img: "/images/poses/women/women_pose_39.jpg",
    category: "full-body",
    secondaryCategory: "editorial",
    viewType: "full",
    description: "Playful chic posture touching crown of hair with relaxed smile."
  },
  {
    id: "women-pose-40",
    label: "Natural Head-to-Toe",
    sublabel: "Clean finish",
    img: "/images/poses/women/women_pose_40.jpg",
    category: "full-body",
    secondaryCategory: "catalog",
    viewType: "full",
    description: "Natural finish catalog shot with balanced posture and open expression."
  },
];

export const MEN_POSES = [
  { id: "men-front-view", label: "Front View", sublabel: "Standing neutral", img: "/images/poses/men/front_view.jpg", category: "catalog", description: "Standing neutral front angle." },
  { id: "men-angle-45", label: "45° Angle", sublabel: "Three-quarter turn", img: "/images/poses/men/angle_45.jpg", category: "profile", description: "Three-quarter turn." },
  { id: "men-side-turn", label: "Side Turn", sublabel: "Profile silhouette", img: "/images/poses/men/side_turn.jpg", category: "catalog", description: "Profile silhouette side turn." },
  { id: "men-back-view", label: "Back View", sublabel: "Standing back", img: "/images/poses/men/back_view.jpg", category: "catalog", description: "Standing back view." },
  { id: "men-hands-pocket", label: "Hands in Pocket", sublabel: "Modern relaxed", img: "/images/poses/men/hands_in_pocket.jpg", category: "catalog", description: "Modern relaxed hands in pocket." },
  { id: "men-cross-arm", label: "Cross Arm", sublabel: "Tailored confidence", img: "/images/poses/men/cross_arm.jpg", category: "editorial", description: "Tailored confidence crossed arms." },
  { id: "men-relaxed-lean", label: "Relaxed Lean", sublabel: "Casual vibe", img: "/images/poses/men/relaxed_lean.jpg", category: "motion", description: "Casual vibe relaxed lean." },
  { id: "men-walking", label: "Walking", sublabel: "Natural movement", img: "/images/poses/men/walking.jpg", category: "motion", description: "Natural movement walking stride." },
  { id: "men-seated", label: "Seated", sublabel: "Calm & composed", img: "/images/poses/men/seated.jpg", category: "seated", description: "Calm and composed seated pose." },
  { id: "men-hands-behind-head", label: "Hands Behind Head", sublabel: "Confident & relaxed", img: "/images/poses/men/hands_behind_head.jpg", category: "editorial", description: "Confident and relaxed pose." },
  { id: "men-looking-down", label: "Looking Down", sublabel: "Thoughtful", img: "/images/poses/men/looking_down.jpg", category: "profile", description: "Thoughtful looking down pose." },
  { id: "men-adjusting-jacket", label: "Adjusting Jacket", sublabel: "Polished look", img: "/images/poses/men/adjusting_jacket.jpg", category: "editorial", description: "Polished look adjusting jacket." },
  { id: "men-over-shoulder", label: "Over Shoulder", sublabel: "Candid look", img: "/images/poses/men/over_shoulder.jpg", category: "editorial", description: "Candid look over the shoulder." },
];

export const BOYS_POSES = [
  { id: "boy-pose-aarav",   label: "Aarav",   sublabel: "Navy NY Hoodie",       img: "/images/poses/boys/aarav.jpg",   category: "catalog",   description: "Front-facing neutral pose in a navy NY hoodie." },
  { id: "boy-pose-vivaan",  label: "Vivaan",  sublabel: "Crossed arms",          img: "/images/poses/boys/vivaan.jpg",  category: "editorial", description: "Confident arms-crossed pose in olive sweatshirt." },
  { id: "boy-pose-reyansh", label: "Reyansh", sublabel: "Striped hoodie",        img: "/images/poses/boys/reyansh.jpg", category: "catalog",   description: "Relaxed stance in a white & navy striped hoodie." },
  { id: "boy-pose-arjun",   label: "Arjun",   sublabel: "Denim jacket",          img: "/images/poses/boys/arjun.jpg",   category: "catalog",   description: "Casual front pose in a light blue denim jacket." },
  { id: "boy-pose-kabir",   label: "Kabir",   sublabel: "Black hoodie",          img: "/images/poses/boys/kabir.jpg",   category: "editorial", description: "Relaxed pose in a black smiley-logo hoodie." },
  { id: "boy-pose-ishaan",  label: "Ishaan",  sublabel: "New York hoodie",       img: "/images/poses/boys/ishaan.jpg",  category: "catalog",   description: "Standing relaxed in a beige New York hoodie." },
  { id: "boy-pose-aryan",   label: "Aryan",   sublabel: "Plaid shirt",           img: "/images/poses/boys/aryan.jpg",   category: "editorial", description: "Arms crossed in a blue plaid flannel shirt." },
  { id: "boy-pose-vihaan",  label: "Vihaan",  sublabel: "Athletic hoodie",       img: "/images/poses/boys/vihaan.jpg",  category: "catalog",   description: "Hands in pocket in a green Athletic 23 hoodie." },
  { id: "boy-pose-rohan",   label: "Rohan",   sublabel: "Varsity jacket",        img: "/images/poses/boys/rohan.jpg",   category: "editorial", description: "Cool stance in a black & white varsity bomber." },
  { id: "boy-pose-shaurya", label: "Shaurya", sublabel: "Light grey hoodie",     img: "/images/poses/boys/shaurya.jpg", category: "catalog",   description: "Hands in pocket in a plain light grey hoodie." },
];

export const POSE_CATEGORIES = [
  { id: "all", label: "All Poses" },
  { id: "full-body", label: "Full Body" },
  { id: "upper-body", label: "Waist Up / Portrait" },
  { id: "catalog", label: "Catalog Essentials" },
  { id: "editorial", label: "Editorial & Fashion" },
  { id: "motion", label: "Walking & Motion" },
  { id: "profile", label: "360° & Profile" },
];
