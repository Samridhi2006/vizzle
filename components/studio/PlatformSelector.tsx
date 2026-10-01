import type React from "react";

export interface PlatformItem {
  id: "amazon" | "flipkart" | "myntra" | "ajio" | "meesho" | "nykaa" | "shopify" | string;
  name: string;
  tagline: string;
  color: string;
  badgeBg: string;
  aspectText: string;
  icon?: React.ReactNode;
}

export interface PlatformSelectorProps {
  selectedPlatform?: string;
  onSelectPlatform: (platformId: string) => void;
  platforms?: PlatformItem[];
}

export { default, PLATFORMS_DATA } from "../../src/studio/PlatformSelector";
