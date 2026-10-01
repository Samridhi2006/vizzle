export interface PlatformPreviewProps {
  platform?: "amazon" | "flipkart" | "myntra" | "ajio" | "meesho" | "nykaa" | "shopify" | string;
  previewImage?: string | null;
  garmentLabel?: string;
  modelName?: string;
  generating?: boolean;
  generated?: boolean;
  ratio?: string;
  resolution?: string;
}

export { default } from "../../src/studio/PlatformPreview";
