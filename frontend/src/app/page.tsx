"use client";

import SidebarLayout from "@/components/SidebarLayout";
import StudioLayout from "@/components/studio/StudioLayout";

/**
 * Root page — Studio view (the DAW workspace).
 */
export default function Home() {
  return (
    <SidebarLayout>
      <StudioLayout />
    </SidebarLayout>
  );
}
