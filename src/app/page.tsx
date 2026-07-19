"use client";

import dynamic from "next/dynamic";
import { LayoutOverlay } from "@/components/ui/LayoutOverlay";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Dynamically import 3D scene to prevent SSR issues
const RoomScene = dynamic(() => import("@/components/3d/RoomScene"), {
  ssr: false,
});

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="relative w-full h-screen overflow-hidden bg-black">
        {/* 3D Environment Layer */}
        <div className="absolute inset-0 z-0">
          <RoomScene />
        </div>

        {/* 2D UI Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <LayoutOverlay />
        </div>
      </main>
    </DndProvider>
  );
}
