"use client"

import { useState } from "react"
import Map from "@/components/map"
import Sidebar from "@/components/sidebar"

export default function MapLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  return (
    <div className="flex h-[100vh] w-full overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <div className="flex-1 relative">
        <Map />
      </div>
    </div>
  )
}

