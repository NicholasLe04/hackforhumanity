"use client"

import { useState, useEffect } from "react"
import { Search, Menu, X, LogOut, AlertTriangle } from 'lucide-react'
import type { User } from "@supabase/supabase-js"
import { useAuthContext } from "@/context/AuthContext"
import signInWithGoogle from "@/supabase/auth/signIn"
import signOut from "@/supabase/auth/signOut"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Post } from "@/supabase/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface SidebarProps {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
  posts: Post[]
  onIncidentClick?: (latitude: number, longitude: number) => void
}

export default function Sidebar({ isExpanded, setIsExpanded, posts, onIncidentClick }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)
  const [searchMode, setSearchMode] = useState("text") // "text" or "radius"
  const [radius, setRadius] = useState("")
  const { user } = useAuthContext() as { user: User | null }

  useEffect(() => {
    if (searchMode === "text") {
      const newFilteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPosts(newFilteredPosts)
    } else if (searchMode === "radius") {
      const radiusVal = parseFloat(radius)
      if (!isNaN(radiusVal)) {
        const newFilteredPosts = posts.filter(
          (post) => post.distance !== undefined && post.distance <= radiusVal
        )
        setFilteredPosts(newFilteredPosts)
      } else {
        // no valid radius
        setFilteredPosts([])
      }
    }
  }, [searchQuery, posts, searchMode, radius])

  return (
    <div
      className={`fixed top-0 left-0 h-[60vh] p-4 flex flex-col transition-all duration-500 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200/20 p-4 flex flex-col h-full transition-all duration-500 ease-in-out ${
          !isExpanded ? "items-center" : ""
        }`}
      >
        {/* Header with logo and close button */}
        <div className={`flex items-center h-auto justify-between ${isExpanded ? "mb-3" : "mb-3 flex-col gap-3"}`}>
          {isExpanded ? (
            <Link href="/" className="flex items-center justify-center group">
              <span className="ml-2 text-xl font-bold text-black">
                <span className="relative">
                  lmk
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 group-hover:bg-red-700 transform -rotate-2 transition-colors"></span>
                </span>
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center group">
              <span className="px-auto text-md font-bold text-black">
                <span className="relative">
                  lmk
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 group-hover:bg-red-700 transform -rotate-2 transition-colors"></span>
                </span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 border-black border-2 text-black rounded-xl transition-colors"
          >
            {isExpanded ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {isExpanded && (
            <>
              {/* search dropdown mode */}
              <div className="relative mb-3">
                <select
                  value={searchMode}
                  onChange={(e) => {
                    setSearchMode(e.target.value)

                    // reset queries
                    setSearchQuery("")
                    setRadius("")
                  }}
                  className="w-full p-1.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50 text-black"
                >
                  <option value="text">Search posts</option>
                  <option value="radius">Search by Radius (miles)</option>
                </select>
              </div>

              {/* search input */}
              {searchMode === "text" && (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-1.5 pr-8 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50 text-black"
                  />
                  <Search className="absolute right-2 top-2 text-gray-400" size={16} />
                </div>
              )}

              {searchMode === "radius" && (
                <div className="relative mb-3">
                  <input
                    type="number"
                    placeholder="Enter radius in miles"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full p-1.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50 text-black"
                  />
                </div>
              )}
                {/* Recent Incidents */}
                <div className="flex-1 overflow-hidden">
                  <h2 className="text-base font-semibold text-gray-900 mb-2">Recent Incidents</h2>
                  <div className="space-y-1.5 overflow-y-auto max-h-[calc(60vh-220px)] pb-6 pr-2">
                    {filteredPosts.map((post) => {
                      const urgencyBgColor =
                        post.urgency === 'Red'
                          ? 'border-red-500'
                          : post.urgency === 'Yellow'
                          ? 'border-yellow-500'
                          : post.urgency === 'Green'
                          ? 'border-green-500'
                          : 'border-blue-500'

                      const distanceText =
                        post.distance && post.distance < 1
                          ? `${(post.distance * 5280).toFixed(0)}ft`
                          : `${post.distance?.toFixed(2)}mi`

                      return (
                        <div
                          key={post.id}
                          className={`p-2 rounded-xl transition-colors border border-gray-200/10 shadow-sm cursor-pointer
                            ${post.urgency === 'Red'
                              ? 'bg-red-200 hover:bg-red-500'
                              : post.urgency === 'Yellow'
                              ? 'bg-yellow-400 hover:bg-yellow-600'
                              : post.urgency === 'Green'
                              ? 'bg-green-200 hover:bg-green-400'
                              : 'bg-blue-200 hover:bg-blue-400'}`}
                          onClick={() => onIncidentClick?.(post.latitude, post.longitude)}
                        >
                          <div className="flex items-center">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 break-words">
                                {post.title}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className={`border-l-2 h-6 ${urgencyBgColor} mx-2`}></div>
                              <p className="text-sm text-gray-900">{distanceText}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

            </>
          )}
        </div>

        <div className={`mt-3 pt-3 border-t border-gray-200 ${!isExpanded ? "w-full flex justify-center" : ""}`}>
          {user ? (
            <div className={`flex items-center ${isExpanded ? "justify-between w-full" : "justify-center"}`}>
              {isExpanded && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Avatar className={`transition-all duration-500 ${!isExpanded ? "h-10 w-10" : ""}`}>
                      <AvatarImage className="rounded-full" src={user.user_metadata.avatar_url} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.email?.split("@")[0]}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className={`${isExpanded ? "hover:bg-red-50 hover:text-red-600 rounded-full" : "w-8 h-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-full"}`}
              >
                <LogOut size={16} className="text-black" />
              </Button>
            </div>
          ) : isExpanded ? (
            <Button
              onClick={signInWithGoogle}
              className="w-full py-1 text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
            >
              Sign In with Google
            </Button>
          ) : (
            <Button
              onClick={signInWithGoogle}
              className="w-8 h-8 p-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
