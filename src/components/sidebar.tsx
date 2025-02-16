"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, LogOut, AlertTriangle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useAuthContext } from "@/context/AuthContext";
import signInWithGoogle from "@/supabase/auth/signIn";
import signOut from "@/supabase/auth/signOut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Post } from "@/supabase/schema";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  posts: Post[];
  onIncidentClick?: (latitude: number, longitude: number) => void;
}

export default function Sidebar({
  isExpanded,
  setIsExpanded,
  posts,
  onIncidentClick,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts); // Initialize with all posts
  const { user } = useAuthContext() as { user: User | null };

  useEffect(() => {
    // Filter posts whenever searchQuery or posts changes
    const newFilteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(newFilteredPosts);
  }, [searchQuery, posts]);

  return (
    <div
      className={`fixed top-0 left-0 h-1/2 p-4 flex flex-col transition-all duration-500 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200/20 p-4 flex flex-col h-full transition-all duration-500 ease-in-out ${
          !isExpanded ? "items-center" : ""
        }`}
      >
        {/* Header with logo and close button */}
        <div
          className={`flex items-center h-auto justify-between ${
            isExpanded ? "mb-3" : "mb-3 flex-col gap-3"
          }`}
        >
          {isExpanded ? (
            <Link href="/" className="flex items-center justify-center group">
              <AlertTriangle className="h-5 w-5 text-red-600 group-hover:text-red-700 transition-colors" />
              <span className="ml-2 text-xl font-bold text-black">
                <span className="relative">
                  lmk
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 group-hover:bg-red-700 transform -rotate-2 transition-colors"></span>
                </span>
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center group">
              <AlertTriangle className="h-5 w-5 text-red-600 group-hover:text-red-700 transition-colors" />
            </Link>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 border-black border-2 text-black rounded-xl transition-colors"
          >
            {isExpanded ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Search bar */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-1.5 pr-8 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50 text-black"
              />
              <Search className="absolute right-2 top-2 text-gray-400" size={16} />
            </div>

            {/* Recent Incidents */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                Recent Incidents
              </h2>
              <div className="space-y-1.5 overflow-y-auto max-h-[calc(50vh-180px)]">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-white transition-colors border border-gray-200/10 shadow-sm cursor-pointer"
                    onClick={() => onIncidentClick?.(post.latitude, post.longitude)}
                  >
                    <p className="text-sm text-gray-900">{post.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign in button at bottom */}
            {!user && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  onClick={signInWithGoogle}
                  className="w-full py-1 text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                >
                  Sign In with Google
                </Button>
              </div>
            )}
          </>
        )}

        {/* Collapsed state sign in button */}
        {!isExpanded && !user && (
          <div className="mt-auto">
            <Button
              onClick={signInWithGoogle}
              className="w-8 h-8 p-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Minimal user profile when logged in */}
        {user && (
          <div className="mt-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-8 h-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-full"
            >
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
