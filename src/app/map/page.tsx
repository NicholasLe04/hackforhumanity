"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Map from "@/components/map"
import Sidebar from "@/components/sidebar"

export default function MapPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  return (
    <div className="flex h-[100vh] w-full overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <div className="flex-1 relative">
        <Map />
      </div>
      <Link href="/report" className="absolute bottom-6 right-6 group">
        <Button className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-[0_8px_30px_rgb(245,158,11,0.2)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.4)] backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300">
          <AlertTriangle className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="sr-only">Report an incident</span>
        </Button>
      </Link>
    </div>
  )
}