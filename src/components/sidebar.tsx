"use client"

import { useState } from "react"
import { Search, Menu, X, User } from "lucide-react"

interface SidebarProps {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
}

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className={`bg-gray-100 transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}>
      <div className="flex items-center justify-between p-4">
        {isExpanded && <h1 className="text-xl font-bold">Map App</h1>}
        <button onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      {isExpanded && (
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <User size={24} />
            <span>Account</span>
          </div>
          {/* Add more sidebar content here */}
        </div>
      )}
    </div>
  )
}

