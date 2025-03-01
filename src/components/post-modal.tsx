import { X } from "lucide-react";
import { Post } from "@/supabase/schema";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const fetchAddress = async () => {
      if (!post) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${post.latitude}&lon=${post.longitude}&zoom=15&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'hackforhumanity-app'
            }
          }
        );
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setAddress(`${post.latitude.toFixed(6)}, ${post.longitude.toFixed(6)}`);
      }
    };

    fetchAddress();
  }, [post]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/20 p-6 max-w-4xl w-full mx-4 z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10"
        >
          <X size={20} color="#000000"/>
        </button>

        <div className="space-y-6">
          {/* img */}
          <div className="flex justify-center rounded-xl overflow-hidden bg-gray-100 -mt-2">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              width={1920}
              height={1080}
              className="max-w-full max-h-[70vh] rounded-xl object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Title</p>
            <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              {post.description}
            </p>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Time</p>
            <p className="text-gray-700">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              {address || "Loading address..."}
            </p>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Urgency</p>
            <p className="text-gray-700">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  post.urgency === "Red"
                    ? "bg-red-100 text-red-800"
                    : post.urgency === "Orange"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {post.urgency.charAt(0).toUpperCase() + post.urgency.slice(1)}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Radius</p>
            <p className="text-gray-700">{post.radius}</p>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-baseline gap-4">
            <p className="text-sm font-medium text-gray-500">Warnings</p>
            <div className="space-y-3">
              <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
                <p className="text-sm font-medium text-red-800 mb-1">If you&rsquo;re close:</p>
                <p className="text-red-700">{post.close_warning}</p>
              </div>
              <div className="bg-yellow-50/50 p-3 rounded-xl border border-yellow-100">
                <p className="text-sm font-medium text-yellow-800 mb-1">If you&rsquo;re far:</p>
                <p className="text-yellow-700">{post.far_warning}</p>
              </div>
            </div>
          </div>
        </div>  
      </div>  
    </div>
  );
}