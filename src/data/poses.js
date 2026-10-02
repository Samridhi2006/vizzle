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
  // ── Screenshot 1 Poses (Top 10 visible in main studio grid) ──
  {
    id: "men-pose-01",
    label: "Hands Clasped",
    sublabel: "Standing neutral",
    img: "/images/poses/men/screenshot_pose_01.jpg",
    category: "catalog",
    description: "Neutral standing pose with hands gently clasped in front."
  },
  {
    id: "men-pose-02",
    label: "Gentle Turn",
    sublabel: "Slight angle turn",
    img: "/images/poses/men/screenshot_pose_02.jpg",
    category: "catalog",
    description: "Slight turn with hands loosely clasped."
  },
  {
    id: "men-pose-03",
    label: "Front Neutral",
    sublabel: "Hands at sides",
    img: "/images/poses/men/screenshot_pose_03.jpg",
    category: "catalog",
    description: "Classic straight-on front angle with hands relaxed at sides."
  },
  {
    id: "men-pose-04",
    label: "Chin Touch",
    sublabel: "Thoughtful poise",
    img: "/images/poses/men/screenshot_pose_04.jpg",
    category: "editorial",
    description: "Thoughtful pose with one hand touching the chin."
  },
  {
    id: "men-pose-05",
    label: "Open Gesture",
    sublabel: "One hand pocket",
    img: "/images/poses/men/screenshot_pose_05.jpg",
    category: "catalog",
    description: "One hand in pocket with open hand gesture."
  },
  {
    id: "men-pose-06",
    label: "Collar Touch",
    sublabel: "Casual confidence",
    img: "/images/poses/men/screenshot_pose_06.jpg",
    category: "editorial",
    description: "Hand touching collar, one hand in pocket."
  },
  {
    id: "men-pose-07",
    label: "Arms Crossed",
    sublabel: "Confident poise",
    img: "/images/poses/men/screenshot_pose_07.jpg",
    category: "editorial",
    description: "Poised arms crossed stance, ideal for tees and jackets."
  },
  {
    id: "men-pose-08",
    label: "Hands in Pockets",
    sublabel: "Modern relaxed",
    img: "/images/poses/men/screenshot_pose_08.jpg",
    category: "catalog",
    description: "Modern relaxed stance with both hands in pockets."
  },
  {
    id: "men-pose-09",
    label: "One Hand Pocket",
    sublabel: "Casual stance",
    img: "/images/poses/men/screenshot_pose_09.jpg",
    category: "catalog",
    description: "Relaxed casual stance with one hand tucked in pocket."
  },
  {
    id: "men-pose-10",
    label: "Neck Touch",
    sublabel: "Sensual poise",
    img: "/images/poses/men/screenshot_pose_10.jpg",
    category: "editorial",
    description: "Hand at back of neck with direct gaze."
  },

  // ── Screenshot 2 Poses (11-20) ──
  {
    id: "men-pose-11",
    label: "Relaxed Stance",
    sublabel: "Hands in pockets",
    img: "/images/poses/men/screenshot_pose_11.jpg",
    category: "catalog",
    description: "Relaxed catalog stance with hands in pockets."
  },
  {
    id: "men-pose-12",
    label: "Side Profile",
    sublabel: "Profile silhouette",
    img: "/images/poses/men/screenshot_pose_12.jpg",
    category: "profile",
    description: "Sharp profile silhouette looking to the side."
  },
  {
    id: "men-pose-13",
    label: "Direct Gaze",
    sublabel: "Frontal focus",
    img: "/images/poses/men/screenshot_pose_13.jpg",
    category: "catalog",
    description: "Direct frontal focus with one hand in pocket."
  },
  {
    id: "men-pose-14",
    label: "Casual Pocket",
    sublabel: "Everyday wear",
    img: "/images/poses/men/screenshot_pose_14.jpg",
    category: "catalog",
    description: "Everyday relaxed posture with hands at pockets."
  },
  {
    id: "men-pose-15",
    label: "Subtle Lean",
    sublabel: "Hip shift",
    img: "/images/poses/men/screenshot_pose_15.jpg",
    category: "editorial",
    description: "Subtle hip shift with hands in pockets."
  },
  {
    id: "men-pose-16",
    label: "Turned Gaze",
    sublabel: "Three-quarter look",
    img: "/images/poses/men/screenshot_pose_16.jpg",
    category: "profile",
    description: "Head turned gazing away with hands in pockets."
  },
  {
    id: "men-pose-17",
    label: "Confident Front",
    sublabel: "Classic posture",
    img: "/images/poses/men/screenshot_pose_17.jpg",
    category: "catalog",
    description: "Strong classic posture with hands in pockets."
  },
  {
    id: "men-pose-18",
    label: "Three-Quarter",
    sublabel: "Depth angle",
    img: "/images/poses/men/screenshot_pose_18.jpg",
    category: "profile",
    description: "Three-quarter turn adding depth and structure."
  },
  {
    id: "men-pose-19",
    label: "Sensual Touch",
    sublabel: "Hand on neck",
    img: "/images/poses/men/screenshot_pose_19.jpg",
    category: "editorial",
    description: "Hand gently touching neck with relaxed posture."
  },
  {
    id: "men-pose-20",
    label: "Hands Forward",
    sublabel: "Natural stance",
    img: "/images/poses/men/screenshot_pose_20.jpg",
    category: "catalog",
    description: "Natural catalog stance with hands held gently in front."
  },

  // ── Screenshot 3 Poses (21-30) ──
  {
    id: "men-pose-21",
    label: "Full Body Lean",
    sublabel: "Shifted weight",
    img: "/images/poses/men/screenshot_pose_21.jpg",
    category: "full-body",
    description: "Full body view with weight shifted and one hand in pocket."
  },
  {
    id: "men-pose-22",
    label: "Focused Stance",
    sublabel: "Steeple hands",
    img: "/images/poses/men/screenshot_pose_22.jpg",
    category: "catalog",
    description: "Hands clasped firmly with focused gaze."
  },
  {
    id: "men-pose-23",
    label: "Classic Front",
    sublabel: "One hand pocket",
    img: "/images/poses/men/screenshot_pose_23.jpg",
    category: "catalog",
    description: "Classic frontal stance with one hand in pocket."
  },
  {
    id: "men-pose-24",
    label: "Collar Hold",
    sublabel: "Polished look",
    img: "/images/poses/men/screenshot_pose_24.jpg",
    category: "editorial",
    description: "Hand at neck collar with one hand in pocket."
  },
  {
    id: "men-pose-25",
    label: "Full Body Neutral",
    sublabel: "Head-to-toe",
    img: "/images/poses/men/screenshot_pose_25.jpg",
    category: "full-body",
    description: "Full body head-to-toe shot showing complete silhouette."
  },
  {
    id: "men-pose-26",
    label: "Full Body Neck Touch",
    sublabel: "Editorial full",
    img: "/images/poses/men/screenshot_pose_26.jpg",
    category: "full-body",
    description: "Full body posture with hand at neck."
  },
  {
    id: "men-pose-27",
    label: "Full Body Pockets",
    sublabel: "Casual full",
    img: "/images/poses/men/screenshot_pose_27.jpg",
    category: "full-body",
    description: "Full body stance with both hands in pockets."
  },
  {
    id: "men-pose-28",
    label: "Full Body Classic",
    sublabel: "Clean catalog",
    img: "/images/poses/men/screenshot_pose_28.jpg",
    category: "full-body",
    description: "Clean full-body catalog posture."
  },
  {
    id: "men-pose-29",
    label: "Side Step Walk",
    sublabel: "Walking motion",
    img: "/images/poses/men/screenshot_pose_29.jpg",
    category: "motion",
    description: "Dynamic side-step walking motion."
  },
  {
    id: "men-pose-30",
    label: "Full Body Clasp",
    sublabel: "Formal poise",
    img: "/images/poses/men/screenshot_pose_30.jpg",
    category: "full-body",
    description: "Full body poise with hands gently clasped."
  },

  // ── Screenshot 4 Poses (31-40) ──
  {
    id: "men-pose-31",
    label: "Shifted Weight",
    sublabel: "Full body stride",
    img: "/images/poses/men/screenshot_pose_31.jpg",
    category: "full-body",
    description: "Full body shot with natural weight shift."
  },
  {
    id: "men-pose-32",
    label: "Formal Stance",
    sublabel: "Hand at neck",
    img: "/images/poses/men/screenshot_pose_32.jpg",
    category: "full-body",
    description: "Formal full-body stance with hand at collar."
  },
  {
    id: "men-pose-33",
    label: "Casual Stride",
    sublabel: "Relaxed motion",
    img: "/images/poses/men/screenshot_pose_33.jpg",
    category: "motion",
    description: "Relaxed motion stride showing trousers and fit."
  },
  {
    id: "men-pose-34",
    label: "Walking Stride",
    sublabel: "Runway stride",
    img: "/images/poses/men/screenshot_pose_34.jpg",
    category: "motion",
    description: "Dynamic forward walking stride."
  },
  {
    id: "men-pose-35",
    label: "One Hand Pocket Full",
    sublabel: "Head-to-toe relaxed",
    img: "/images/poses/men/screenshot_pose_35.jpg",
    category: "full-body",
    description: "Head-to-toe view with one hand casually in pocket."
  },
  {
    id: "men-pose-36",
    label: "Arms Crossed Full",
    sublabel: "Confident full",
    img: "/images/poses/men/screenshot_pose_36.jpg",
    category: "full-body",
    description: "Full body arms-crossed confident stance."
  },
  {
    id: "men-pose-37",
    label: "Classic Stance",
    sublabel: "Even feet",
    img: "/images/poses/men/screenshot_pose_37.jpg",
    category: "full-body",
    description: "Even-footed classic full body stance."
  },
  {
    id: "men-pose-38",
    label: "Relaxed Head Touch",
    sublabel: "Lifestyle full",
    img: "/images/poses/men/screenshot_pose_38.jpg",
    category: "editorial",
    description: "Lifestyle full-body shot with hand touching back of head."
  },
  {
    id: "men-pose-39",
    label: "Forward Step",
    sublabel: "Walking forward",
    img: "/images/poses/men/screenshot_pose_39.jpg",
    category: "motion",
    description: "Forward stepping movement showcasing garment movement."
  },
  {
    id: "men-pose-40",
    label: "Cross Step",
    sublabel: "Lateral stride",
    img: "/images/poses/men/screenshot_pose_40.jpg",
    category: "motion",
    description: "Lateral cross step showing pant drape."
  },

  // ── Screenshot 5 Poses (41-50) ──
  {
    id: "men-pose-41",
    label: "Dynamic Walk",
    sublabel: "Full body step",
    img: "/images/poses/men/screenshot_pose_41.jpg",
    category: "motion",
    description: "Dynamic full-body walk with hand in pocket."
  },
  {
    id: "men-pose-42",
    label: "Wide Stance",
    sublabel: "Firm posture",
    img: "/images/poses/men/screenshot_pose_42.jpg",
    category: "full-body",
    description: "Firm posture with feet shoulder-width apart."
  },
  {
    id: "men-pose-43",
    label: "Crossed Leg Lean",
    sublabel: "Editorial cross",
    img: "/images/poses/men/screenshot_pose_43.jpg",
    category: "editorial",
    description: "Crossed leg lean posture adding casual flair."
  },
  {
    id: "men-pose-44",
    label: "Hand on Chest",
    sublabel: "Expressive stance",
    img: "/images/poses/men/screenshot_pose_44.jpg",
    category: "editorial",
    description: "Expressive hand-on-chest catalog stance."
  },
  {
    id: "men-pose-45",
    label: "Upright Pockets",
    sublabel: "Direct posture",
    img: "/images/poses/men/screenshot_pose_45.jpg",
    category: "full-body",
    description: "Upright posture with hands in pockets."
  },
  {
    id: "men-pose-46",
    label: "Side Glance Walk",
    sublabel: "Turned gaze walk",
    img: "/images/poses/men/screenshot_pose_46.jpg",
    category: "motion",
    description: "Walking forward with head turned gazing sideways."
  },
  {
    id: "men-pose-47",
    label: "Approaching Walk",
    sublabel: "Confident approach",
    img: "/images/poses/men/screenshot_pose_47.jpg",
    category: "motion",
    description: "Approaching the camera with a confident stride."
  },
  {
    id: "men-pose-48",
    label: "Editorial Neutral",
    sublabel: "Balanced stance",
    img: "/images/poses/men/screenshot_pose_48.jpg",
    category: "full-body",
    description: "Balanced full-body stance with hands in pockets."
  },
  {
    id: "men-pose-49",
    label: "Relaxed Frontal",
    sublabel: "Clean finish",
    img: "/images/poses/men/screenshot_pose_49.jpg",
    category: "full-body",
    description: "Clean finish catalog shot with relaxed posture."
  },
  {
    id: "men-pose-50",
    label: "Mid-Stride Motion",
    sublabel: "Walking motion",
    img: "/images/poses/men/screenshot_pose_50.jpg",
    category: "motion",
    description: "Mid-stride forward motion showing silhouette flow."
  },

  // ── Existing 13 Men Poses Preserved ──
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
  // ── Screenshot 1: 10 Poses (Default Studio Grid Display) ──
  { id: "boy-pose-01", label: "Crossed Arms", sublabel: "Classic folded arms", img: "/images/poses/boys/screenshot_boy_pose_01.jpg", category: "editorial", description: "Front-facing waist-up pose with arms crossed." },
  { id: "boy-pose-02", label: "Relaxed Folded Arms", sublabel: "Comfortable stance", img: "/images/poses/boys/screenshot_boy_pose_02.jpg", category: "editorial", description: "Relaxed arms-crossed pose with confident expression." },
  { id: "boy-pose-03", label: "Hand on Chest", sublabel: "Casual grip", img: "/images/poses/boys/screenshot_boy_pose_03.jpg", category: "catalog", description: "Frontal pose with right hand resting on chest." },
  { id: "boy-pose-04", label: "Neck Touch", sublabel: "Thoughtful gesture", img: "/images/poses/boys/screenshot_boy_pose_04.jpg", category: "editorial", description: "Editorial waist-up pose with hand touching neck." },
  { id: "boy-pose-05", label: "Chin Touch", sublabel: "Contemplative posture", img: "/images/poses/boys/screenshot_boy_pose_05.jpg", category: "editorial", description: "Angled pose with hand touching chin and collar." },
  { id: "boy-pose-06", label: "Relaxed Hand", sublabel: "Natural catalog", img: "/images/poses/boys/screenshot_boy_pose_06.jpg", category: "catalog", description: "Natural standing front pose with relaxed hand." },
  { id: "boy-pose-07", label: "Chest Accent", sublabel: "Front portrait", img: "/images/poses/boys/screenshot_boy_pose_07.jpg", category: "catalog", description: "Front catalog pose with hand placed on chest." },
  { id: "boy-pose-08", label: "Quarter Turn", sublabel: "Side angle fold", img: "/images/poses/boys/screenshot_boy_pose_08.jpg", category: "profile", description: "Three-quarter profile turn with crossed arms." },
  { id: "boy-pose-09", label: "Hand on Hip", sublabel: "Cheerful smile", img: "/images/poses/boys/screenshot_boy_pose_09.jpg", category: "editorial", description: "Lively pose with hand on hip and warm smile." },
  { id: "boy-pose-10", label: "Over Shoulder", sublabel: "Turned profile look", img: "/images/poses/boys/screenshot_boy_pose_10.jpg", category: "profile", description: "Side profile with head turned looking back over shoulder." },

  // ── Screenshot 2: Poses 11 - 20 ──
  { id: "boy-pose-11", label: "Side Profile Standing", sublabel: "Clean profile", img: "/images/poses/boys/screenshot_boy_pose_11.jpg", category: "profile", description: "Full side profile standing straight." },
  { id: "boy-pose-12", label: "Pocket Stance", sublabel: "Casual pocket lean", img: "/images/poses/boys/screenshot_boy_pose_12.jpg", category: "catalog", description: "Front-facing pose with hand in pocket." },
  { id: "boy-pose-13", label: "Open Palms", sublabel: "Welcoming shrug", img: "/images/poses/boys/screenshot_boy_pose_13.jpg", category: "editorial", description: "Expressive open-hands welcoming gesture." },
  { id: "boy-pose-14", label: "Neutral Stance", sublabel: "Clean catalog front", img: "/images/poses/boys/screenshot_boy_pose_14.jpg", category: "catalog", description: "Simple relaxed front-facing catalogue stance." },
  { id: "boy-pose-15", label: "Walking Stride", sublabel: "Motion side walk", img: "/images/poses/boys/screenshot_boy_pose_15.jpg", category: "motion", description: "Dynamic side walking stride with arms in motion." },
  { id: "boy-pose-16", label: "Stride Glance", sublabel: "Turned walking look", img: "/images/poses/boys/screenshot_boy_pose_16.jpg", category: "motion", description: "Walking pose with gaze directed towards camera." },
  { id: "boy-pose-17", label: "Hands Behind Head", sublabel: "Relaxed posture", img: "/images/poses/boys/screenshot_boy_pose_17.jpg", category: "editorial", description: "Casual relaxed posture with hands behind head." },
  { id: "boy-pose-18", label: "Point at Camera", sublabel: "Direct engagement", img: "/images/poses/boys/screenshot_boy_pose_18.jpg", category: "editorial", description: "Youthful energetic gesture pointing forward." },
  { id: "boy-pose-19", label: "Thinking Chin Rest", sublabel: "Playful smile", img: "/images/poses/boys/screenshot_boy_pose_19.jpg", category: "editorial", description: "Smiling pose with finger touching chin thoughtfully." },
  { id: "boy-pose-20", label: "Peace Sign", sublabel: "Victory gesture", img: "/images/poses/boys/screenshot_boy_pose_20.jpg", category: "editorial", description: "Playful pose showing two-finger peace sign." },

  // ── Screenshot 3: Poses 21 - 30 ──
  { id: "boy-pose-21", label: "Thumbs Up", sublabel: "Positive approval", img: "/images/poses/boys/screenshot_boy_pose_21.jpg", category: "editorial", description: "Arms crossed with enthusiastic thumbs up gesture." },
  { id: "boy-pose-22", label: "Single Thumb Up", sublabel: "Energetic smile", img: "/images/poses/boys/screenshot_boy_pose_22.jpg", category: "editorial", description: "Warm smiling front pose with right thumb up." },
  { id: "boy-pose-23", label: "Hands in Pockets", sublabel: "Friendly warm look", img: "/images/poses/boys/screenshot_boy_pose_23.jpg", category: "catalog", description: "Relaxed pose with hands in pockets and a friendly smile." },
  { id: "boy-pose-24", label: "Chest Touch Glance", sublabel: "Polished portrait", img: "/images/poses/boys/screenshot_boy_pose_24.jpg", category: "catalog", description: "Polished upright pose with hand resting on chest." },
  { id: "boy-pose-25", label: "Relaxed Hand by Hip", sublabel: "Front catalog pose", img: "/images/poses/boys/screenshot_boy_pose_25.jpg", category: "catalog", description: "Clean catalog stance with hands resting casually." },
  { id: "boy-pose-26", label: "Hands on Hips", sublabel: "Confident power stance", img: "/images/poses/boys/screenshot_boy_pose_26.jpg", category: "catalog", description: "Confident front pose with both hands on hips." },
  { id: "boy-pose-27", label: "Steepled Hands", sublabel: "Focused posture", img: "/images/poses/boys/screenshot_boy_pose_27.jpg", category: "editorial", description: "Centered stance with fingertips pressed together." },
  { id: "boy-pose-28", label: "Collar Touch Pocket", sublabel: "Editorial casual", img: "/images/poses/boys/screenshot_boy_pose_28.jpg", category: "editorial", description: "Hand near collar with one hand in pocket." },
  { id: "boy-pose-29", label: "Three-Quarter Turn", sublabel: "Angle profile", img: "/images/poses/boys/screenshot_boy_pose_29.jpg", category: "profile", description: "Three-quarter turn gazing forward." },
  { id: "boy-pose-30", label: "Turned Side Glance", sublabel: "Over-shoulder angle", img: "/images/poses/boys/screenshot_boy_pose_30.jpg", category: "profile", description: "Side angle pose with glance directed forward." },

  // ── Screenshot 4: Poses 31 - 40 (Full Body) ──
  { id: "boy-pose-31", label: "Full Body Lean", sublabel: "Black sneakers stance", img: "/images/poses/boys/screenshot_boy_pose_31.jpg", category: "full-body", description: "Full-body catalogue view in black sneakers." },
  { id: "boy-pose-32", label: "Full Body Neck Touch", sublabel: "White sneakers casual", img: "/images/poses/boys/screenshot_boy_pose_32.jpg", category: "full-body", description: "Full-body relaxed pose in white sneakers with hand at neck." },
  { id: "boy-pose-33", label: "Full Body Steepled", sublabel: "Symmetric standing", img: "/images/poses/boys/screenshot_boy_pose_33.jpg", category: "full-body", description: "Full-body frontal stance with steepled fingers." },
  { id: "boy-pose-34", label: "Full Body Collar Touch", sublabel: "White sneakers pocket", img: "/images/poses/boys/screenshot_boy_pose_34.jpg", category: "full-body", description: "Full-body pose touching collar with hand in pocket." },
  { id: "boy-pose-35", label: "Full Body Side Turn", sublabel: "Profile catalog standing", img: "/images/poses/boys/screenshot_boy_pose_35.jpg", category: "full-body", description: "Full-body standing angled profile." },
  { id: "boy-pose-36", label: "Full Body Angled Look", sublabel: "Relaxed three-quarter", img: "/images/poses/boys/screenshot_boy_pose_36.jpg", category: "full-body", description: "Full-body relaxed three-quarter catalog view." },
  { id: "boy-pose-37", label: "Full Body Frontal", sublabel: "Classic catalog stance", img: "/images/poses/boys/screenshot_boy_pose_37.jpg", category: "full-body", description: "Full-body straight-on catalog presentation." },
  { id: "boy-pose-38", label: "Full Body Chest Grip", sublabel: "Modern apparel fit", img: "/images/poses/boys/screenshot_boy_pose_38.jpg", category: "full-body", description: "Full-body pose highlighting upper and lower fit." },
  { id: "boy-pose-39", label: "Full Body Neck Rest", sublabel: "Casual pocket lean", img: "/images/poses/boys/screenshot_boy_pose_39.jpg", category: "full-body", description: "Full-body casual lean with hand at neck." },
  { id: "boy-pose-40", label: "Full Body Thumb Point", sublabel: "Directional gesture", img: "/images/poses/boys/screenshot_boy_pose_40.jpg", category: "full-body", description: "Full-body stance pointing thumb to the side." },

  // ── Screenshot 5: Poses 41 - 50 (Full Body) ──
  { id: "boy-pose-41", label: "Full Body Pointing", sublabel: "Direct engagement", img: "/images/poses/boys/screenshot_boy_pose_41.jpg", category: "full-body", description: "Full-body frontal stance pointing directly at camera." },
  { id: "boy-pose-42", label: "Full Body Chin Thought", sublabel: "Reflective standing", img: "/images/poses/boys/screenshot_boy_pose_42.jpg", category: "full-body", description: "Full-body standing pose with finger at chin." },
  { id: "boy-pose-43", label: "Full Body Peace Sign", sublabel: "Two-finger victory", img: "/images/poses/boys/screenshot_boy_pose_43.jpg", category: "full-body", description: "Full-body youthful pose showing peace sign." },
  { id: "boy-pose-44", label: "Full Body Thumbs Up", sublabel: "Folded arm thumb", img: "/images/poses/boys/screenshot_boy_pose_44.jpg", category: "full-body", description: "Full-body confident stance with thumbs up." },
  { id: "boy-pose-45", label: "Full Body Head Rest", sublabel: "Casual hand behind head", img: "/images/poses/boys/screenshot_boy_pose_45.jpg", category: "full-body", description: "Full-body relaxed pose with hand behind head." },
  { id: "boy-pose-46", label: "Full Body Leg Cross", sublabel: "Playful thumb up", img: "/images/poses/boys/screenshot_boy_pose_46.jpg", category: "full-body", description: "Full-body playful crossed-leg pose with thumbs up." },
  { id: "boy-pose-47", label: "Full Body Pocket Smile", sublabel: "Warm friendly smile", img: "/images/poses/boys/screenshot_boy_pose_47.jpg", category: "full-body", description: "Full-body relaxed standing pose with hands in pockets." },
  { id: "boy-pose-48", label: "Full Body Walking Turn", sublabel: "Candid movement walk", img: "/images/poses/boys/screenshot_boy_pose_48.jpg", category: "motion", description: "Full-body candid turning walk with smile." },
  { id: "boy-pose-49", label: "Full Body Side Stance", sublabel: "Chest touch lean", img: "/images/poses/boys/screenshot_boy_pose_49.jpg", category: "full-body", description: "Full-body three-quarter stance with hand on chest." },
  { id: "boy-pose-50", label: "Full Body Frontal Grip", sublabel: "Clean apparel showcase", img: "/images/poses/boys/screenshot_boy_pose_50.jpg", category: "full-body", description: "Full-body centered stance showcasing outfit fit." },

  // ── Preserved Existing Boys' Poses ──
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

export const GIRLS_POSES = [
  // ── Screenshot 1: 10 Poses (Default Studio Grid Display) ──
  { id: "girl-pose-01", label: "Hand on Hip Stance", sublabel: "Left hand on hip", img: "/images/poses/girls/screenshot_girl_pose_01.jpg", category: "catalog", description: "Natural catalog standing pose with left hand on hip." },
  { id: "girl-pose-02", label: "Angled Hip Lean", sublabel: "Relaxed hip pop", img: "/images/poses/girls/screenshot_girl_pose_02.jpg", category: "editorial", description: "Angled stance with hand resting on hip." },
  { id: "girl-pose-03", label: "Neck Touch Gesture", sublabel: "Thoughtful glance", img: "/images/poses/girls/screenshot_girl_pose_03.jpg", category: "editorial", description: "Soft waist-up pose touching side of collar." },
  { id: "girl-pose-04", label: "Hand to Mouth", sublabel: "Curious expression", img: "/images/poses/girls/screenshot_girl_pose_04.jpg", category: "editorial", description: "Playful thoughtful gesture with hand near mouth." },
  { id: "girl-pose-05", label: "Side Profile Standing", sublabel: "Side catalog look", img: "/images/poses/girls/screenshot_girl_pose_05.jpg", category: "profile", description: "Side profile catalog posture looking forward." },
  { id: "girl-pose-06", label: "Left Turn Hand on Hip", sublabel: "Casual catalog turn", img: "/images/poses/girls/screenshot_girl_pose_06.jpg", category: "catalog", description: "Frontal turn with hand placed firmly on hip." },
  { id: "girl-pose-07", label: "Relaxed Walk Stance", sublabel: "Gentle step forward", img: "/images/poses/girls/screenshot_girl_pose_07.jpg", category: "motion", description: "Subtle leg crossed step forward stance." },
  { id: "girl-pose-08", label: "Resting Hand", sublabel: "Casual front portrait", img: "/images/poses/girls/screenshot_girl_pose_08.jpg", category: "catalog", description: "Waist-up front facing pose with resting hand." },
  { id: "girl-pose-09", label: "Three-Quarter Turn", sublabel: "Clean profile look", img: "/images/poses/girls/screenshot_girl_pose_09.jpg", category: "profile", description: "Angled profile turn with hand on waist." },
  { id: "girl-pose-10", label: "Front Straight Stance", sublabel: "Neutral catalog", img: "/images/poses/girls/screenshot_girl_pose_10.jpg", category: "catalog", description: "Symmetric upright standing catalog pose." },

  // ── Screenshot 2: Poses 11 - 20 ──
  { id: "girl-pose-11", label: "Hands on Hips", sublabel: "Confident power stance", img: "/images/poses/girls/screenshot_girl_pose_11.jpg", category: "catalog", description: "Upright frontal stance with both hands on hips." },
  { id: "girl-pose-12", label: "Three-Quarter Lean", sublabel: "Natural angle", img: "/images/poses/girls/screenshot_girl_pose_12.jpg", category: "catalog", description: "Angled view showcasing fit and silhouette." },
  { id: "girl-pose-13", label: "Side Glance Hip", sublabel: "One hand on waist", img: "/images/poses/girls/screenshot_girl_pose_13.jpg", category: "catalog", description: "Hand resting on waist with head angled forward." },
  { id: "girl-pose-14", label: "Chin Rest Contemplation", sublabel: "Reflective look", img: "/images/poses/girls/screenshot_girl_pose_14.jpg", category: "editorial", description: "Hand resting under chin with folded arm." },
  { id: "girl-pose-15", label: "Crossed Arms", sublabel: "Classic folded arms", img: "/images/poses/girls/screenshot_girl_pose_15.jpg", category: "editorial", description: "Relaxed frontal stance with crossed arms." },
  { id: "girl-pose-16", label: "Hand on Hip Waist Up", sublabel: "Catalog portrait", img: "/images/poses/girls/screenshot_girl_pose_16.jpg", category: "catalog", description: "Clean waist-up catalog shot with hand on hip." },
  { id: "girl-pose-17", label: "Full Body Hip Stance", sublabel: "White sneakers casual", img: "/images/poses/girls/screenshot_girl_pose_17.jpg", category: "full-body", description: "Full-body view in white sneakers with hand on hip." },
  { id: "girl-pose-18", label: "Full Body Chin Touch", sublabel: "Thoughtful stance", img: "/images/poses/girls/screenshot_girl_pose_18.jpg", category: "full-body", description: "Full-body standing straight touching chin." },
  { id: "girl-pose-19", label: "Full Body Side Profile", sublabel: "Clean profile silhouette", img: "/images/poses/girls/screenshot_girl_pose_19.jpg", category: "profile", description: "Full-body clean side profile." },
  { id: "girl-pose-20", label: "Full Body Angled Stance", sublabel: "Wide casual stance", img: "/images/poses/girls/screenshot_girl_pose_20.jpg", category: "full-body", description: "Full-body pose with feet apart and hand on hip." },

  // ── Screenshot 3: Poses 21 - 30 ──
  { id: "girl-pose-21", label: "Full Body Angled Leg", sublabel: "Relaxed leg lean", img: "/images/poses/girls/screenshot_girl_pose_21.jpg", category: "full-body", description: "Full-body stance with one leg angled out." },
  { id: "girl-pose-22", label: "Full Body Hand to Hair", sublabel: "Playful head touch", img: "/images/poses/girls/screenshot_girl_pose_22.jpg", category: "editorial", description: "Full-body pose touching hair casually." },
  { id: "girl-pose-23", label: "Full Body Symmetrical", sublabel: "Clean center catalog", img: "/images/poses/girls/screenshot_girl_pose_23.jpg", category: "full-body", description: "Full-body centered catalog pose." },
  { id: "girl-pose-24", label: "Full Body Leg Cross", sublabel: "Gentle step cross", img: "/images/poses/girls/screenshot_girl_pose_24.jpg", category: "motion", description: "Full-body relaxed leg-crossed standing posture." },
  { id: "girl-pose-25", label: "Full Body Wide Lean", sublabel: "Hand on hip wide", img: "/images/poses/girls/screenshot_girl_pose_25.jpg", category: "full-body", description: "Full-body stance with hand on waist." },
  { id: "girl-pose-26", label: "Full Body Folded Arm Lean", sublabel: "Thinking chin rest", img: "/images/poses/girls/screenshot_girl_pose_26.jpg", category: "editorial", description: "Full-body folded arms with chin rest." },
  { id: "girl-pose-27", label: "Full Body Heart Hands", sublabel: "Heart sign gesture", img: "/images/poses/girls/screenshot_girl_pose_27.jpg", category: "editorial", description: "Playful heart gesture above head." },
  { id: "girl-pose-28", label: "Full Body Chin Smile", sublabel: "Cute pose", img: "/images/poses/girls/screenshot_girl_pose_28.jpg", category: "editorial", description: "Full-body pose with finger on chin." },
  { id: "girl-pose-29", label: "Full Body Peace Sign", sublabel: "Two-finger victory", img: "/images/poses/girls/screenshot_girl_pose_29.jpg", category: "editorial", description: "Full-body energetic peace sign pose." },
  { id: "girl-pose-30", label: "Full Body Cheeks Rest", sublabel: "Two hands on cheeks", img: "/images/poses/girls/screenshot_girl_pose_30.jpg", category: "editorial", description: "Full-body cute double hand cheek touch." },

  // ── Screenshot 4: Poses 31 - 40 ──
  { id: "girl-pose-31", label: "Full Body Open Hands Up", sublabel: "Excited ten fingers", img: "/images/poses/girls/screenshot_girl_pose_31.jpg", category: "editorial", description: "Full-body cheerful open hands gesture." },
  { id: "girl-pose-32", label: "Full Body Open Palms", sublabel: "Welcoming shrug", img: "/images/poses/girls/screenshot_girl_pose_32.jpg", category: "editorial", description: "Full-body open palms welcoming stance." },
  { id: "girl-pose-33", label: "Full Body Arms Crossed", sublabel: "Confident stance", img: "/images/poses/girls/screenshot_girl_pose_33.jpg", category: "full-body", description: "Full-body centered arms crossed stance." },
  { id: "girl-pose-34", label: "Full Body Hem Hold", sublabel: "Apparel flare showcase", img: "/images/poses/girls/screenshot_girl_pose_34.jpg", category: "catalog", description: "Full-body holding garment hem to show flare." },
  { id: "girl-pose-35", label: "Full Body Hands Clasped", sublabel: "Gentle polite pose", img: "/images/poses/girls/screenshot_girl_pose_35.jpg", category: "catalog", description: "Full-body polite front stance with hands clasped." },
  { id: "girl-pose-36", label: "Full Body Pointing Up", sublabel: "One finger point up", img: "/images/poses/girls/screenshot_girl_pose_36.jpg", category: "editorial", description: "Full-body playful upward pointing gesture." },
  { id: "girl-pose-37", label: "Full Body Hand Behind Head", sublabel: "Relaxed hip lean", img: "/images/poses/girls/screenshot_girl_pose_37.jpg", category: "editorial", description: "Full-body relaxed stance with hand behind head." },
  { id: "girl-pose-38", label: "Full Body Subtle Clasped", sublabel: "Centered posture", img: "/images/poses/girls/screenshot_girl_pose_38.jpg", category: "catalog", description: "Full-body straight-on catalog posture." },
  { id: "girl-pose-39", label: "Full Body Folded Arms Front", sublabel: "Classic catalog fold", img: "/images/poses/girls/screenshot_girl_pose_39.jpg", category: "full-body", description: "Full-body upright crossed-arms stance." },
  { id: "girl-pose-40", label: "Full Body Left Leg Angle", sublabel: "Hand on hip stride", img: "/images/poses/girls/screenshot_girl_pose_40.jpg", category: "full-body", description: "Full-body casual standing pose with hand on hip." },

  // ── Screenshot 5: Poses 41 - 50 ──
  { id: "girl-pose-41", label: "Full Body Hip Stance White Shoes", sublabel: "Clean catalog posture", img: "/images/poses/girls/screenshot_girl_pose_41.jpg", category: "full-body", description: "Full-body catalog stance with hand on waist." },
  { id: "girl-pose-42", label: "Full Body Chin Touch Center", sublabel: "Thoughtful portrait", img: "/images/poses/girls/screenshot_girl_pose_42.jpg", category: "full-body", description: "Full-body centered pose touching chin." },
  { id: "girl-pose-43", label: "Full Body Peace Sign Up", sublabel: "Victory sign pose", img: "/images/poses/girls/screenshot_girl_pose_43.jpg", category: "editorial", description: "Full-body vibrant peace sign posture." },
  { id: "girl-pose-44", label: "Full Body Profile Turn", sublabel: "Side silhouette glance", img: "/images/poses/girls/screenshot_girl_pose_44.jpg", category: "profile", description: "Full-body angled side profile view." },
  { id: "girl-pose-45", label: "Full Body Wide Leg Stance", sublabel: "Firm crossed arms", img: "/images/poses/girls/screenshot_girl_pose_45.jpg", category: "full-body", description: "Full-body wide stance with crossed arms." },
  { id: "girl-pose-46", label: "Full Body Symmetrical Cross", sublabel: "Straight fold", img: "/images/poses/girls/screenshot_girl_pose_46.jpg", category: "full-body", description: "Full-body symmetrical crossed arms pose." },
  { id: "girl-pose-47", label: "Full Body Palm Present", sublabel: "Product showcase palm", img: "/images/poses/girls/screenshot_girl_pose_47.jpg", category: "editorial", description: "Full-body open palm presentation gesture." },
  { id: "girl-pose-48", label: "Full Body Hand on Hip S-Curve", sublabel: "Dynamic hip lean", img: "/images/poses/girls/screenshot_girl_pose_48.jpg", category: "editorial", description: "Full-body dynamic hip posture." },
  { id: "girl-pose-49", label: "Full Body Relaxed Feet Apart", sublabel: "Natural catalog standing", img: "/images/poses/girls/screenshot_girl_pose_49.jpg", category: "full-body", description: "Full-body relaxed straight catalog stance." },
  { id: "girl-pose-50", label: "Full Body Side Peace Sign", sublabel: "Playful head tilt peace", img: "/images/poses/girls/screenshot_girl_pose_50.jpg", category: "editorial", description: "Full-body playful head tilt with peace sign." },
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
