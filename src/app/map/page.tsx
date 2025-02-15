"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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
      <Link href="/report" className="absolute bottom-6 right-6">
        <Button className="h-14 w-14 rounded-full shadow-lg border-2 border-black bg-white hover:bg-black/10 transition-colors duration-200">
          <Plus className="h-6 w-6 text-black" />
          <span className="sr-only">Add accident report</span>
        </Button>
      </Link>
    </div>
  )
}

