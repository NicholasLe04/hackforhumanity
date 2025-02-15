"use client"

import MapLayout from "@/components/map-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function MapPage() {
  return (
    <div className="relative h-[100vh]">
      <MapLayout />
      <Link href="/report" className="absolute bottom-6 right-6">
        <Button className="h-14 w-14 rounded-full shadow-lg border-2 border-black bg-white hover:bg-black/10 transition-colors duration-200">
          <Plus className="h-6 w-6 text-black" />
          <span className="sr-only">Add accident report</span>
        </Button>
      </Link>
    </div>
  )
}

