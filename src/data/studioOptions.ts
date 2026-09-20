export interface Platform {
  id: string;
  name: string;
  color: string;
  letter: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  sub: string;
  w: number;
  h: number;
}

export const PLATFORMS: Platform[] = [
  { id: "amazon",   name: "Amazon",   color: "#FF9900", letter: "A"  },
  { id: "flipkart", name: "Flipkart", color: "#2874F0", letter: "F"  },
  { id: "myntra",   name: "Myntra",   color: "#FF3F6C", letter: "M"  },
  { id: "ajio",     name: "Ajio",     color: "#1C1C1C", letter: "AJ" },
  { id: "meesho",   name: "Meesho",   color: "#9B1FE8", letter: "Me" },
  { id: "nykaa",    name: "Nykaa",    color: "#FC2779", letter: "Nk" },
  { id: "shopify",  name: "Shopify",  color: "#5C6AC4", letter: "Sh" },
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "1:1",    label: "1:1",     sub: "2048 x 2048 px", w: 1,  h: 1  },
  { id: "2:3",    label: "2:3",     sub: "1365 x 2048 px", w: 2,  h: 3  },
  { id: "3:4",    label: "3:4",     sub: "1536 x 2048 px", w: 3,  h: 4  },
  { id: "4:5",    label: "4:5",     sub: "1638 x 2048 px", w: 4,  h: 5  },
  { id: "9:16",   label: "9:16",    sub: "1152 x 2048 px", w: 9,  h: 16 },
  { id: "16:9",   label: "16:9",    sub: "2048 x 1152 px", w: 16, h: 9  },
  { id: "custom", label: "+ Custom", sub: "Enter size",    w: 1,  h: 1  },
];

