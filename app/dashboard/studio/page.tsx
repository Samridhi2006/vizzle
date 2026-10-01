"use client";

import React from "react";
import StudioWorkflow from "../../../src/studio/StudioWorkflow";
import PlatformPreview from "../../../components/studio/PlatformPreview";
import PlatformSelector from "../../../components/studio/PlatformSelector";

export default function StudioDashboardPage() {
  return <StudioWorkflow />;
}

export { PlatformPreview, PlatformSelector };
