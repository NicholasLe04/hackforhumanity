"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone";
import { ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

import { useAuthContext } from "@/context/AuthContext"; // where you have loading + user
//import { User } from "@supabase/supabase-js";
import signInWithGoogle from "@/supabase/auth/signIn"; // adjust path as needed

const geocodeAddress = async (address: string) => {
  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}&limit=5`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "hackforhumanity-app",
      },
    });
    const data = await response.json();
    if (data && data.length > 0) {
      return data.map(
        (result: {
          lat: string;
          lon: string;
          display_name: string;
          type: string;
          importance: number;
        }) => ({
          lat: parseFloat(result.lat).toFixed(6),
          lon: parseFloat(result.lon).toFixed(6),
          displayName: result.display_name,
          type: result.type,
          importance: result.importance,
        })
      );
    }
    throw new Error("No results found");
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export default function ReportPage() {
  // 1. Call hooks unconditionally
  const { user, loading } = useAuthContext(); // loading + user from your updated AuthContext

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState<"auto" | "manual" | "address">("auto");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [address, setAddress] = useState("");
  const [addressResults, setAddressResults] = useState<
    Array<{
      lat: string;
      lon: string;
      displayName: string;
      type: string;
      importance: number;
    }>
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useDropzone (unconditional)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  // If locationType = auto, get geolocation (unconditional)
  useEffect(() => {
    if (locationType === "auto") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(10));
          setLon(position.coords.longitude.toFixed(10));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [locationType]);

  // 2. If still loading user info, show a loading indicator
  if (loading) {
    return <div className="p-8">Loading user info...</div>;
  }

  // 3. If done loading but there's no user, sign in
  if (!user) {
    signInWithGoogle(); // triggers Supabase OAuth
    return <div className="p-8">Redirecting to sign in...</div>;
  }

  // 4. Otherwise, we have a user. Render the page normally:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { selectedImage, description, lat, lon });

    try {
      setIsLoading(true);
      const data = new FormData();
      data.append("author_id", user.id);
      data.append("title", title);
      data.append("longitude", lon);
      data.append("latitude", lat);
      data.append("description", description);
      if (selectedImage) {
        data.append("image", selectedImage);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.message === "No Danger Detected") {
        toast.error("Report denied.");
      }
      else {
        toast.success("Report successfully submitted!");
      }

      // Clear form
      setSelectedImage(null);
      setImagePreview(null);
      setTitle("");
      setDescription("");
      setLocationType("auto");
      setAddress("");
      setAddressResults([]);
      setSelectedAddress(null);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render the form if user is present
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Column - Form */}
      <div className="w-full md:w-1/2 p-8 lg:p-12 xl:p-16 overflow-y-auto">
        <nav className="mb-12">
          <Button variant="ghost" asChild className="hover:bg-red-50 rounded-full transition-all group">
            <Link href="/map" className="flex items-center text-gray-600 hover:text-red-600">
              <ChevronDown className="mr-2 h-4 w-4 rotate-90 transition-transform group-hover:-translate-x-1" />
              Back to Map
            </Link>
          </Button>
        </nav>

        <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent">
          Report an Incident
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Title Input */}
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter incident title"
              className="rounded-2xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all placeholder:text-gray-300 text-gray-900 font-medium"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe incident..."
              className="rounded-2xl border-gray-200 focus:border-red-400 placeholder:text-gray-300 text-gray-900"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-3">
            <label htmlFor="location" className="block text-sm font-medium text-gray-600">
              Location
            </label>
            <Select
              value={locationType}
              onValueChange={(value: "auto" | "manual" | "address") =>
                setLocationType(value)
              }
            >
              <SelectTrigger className="rounded-2xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all text-gray-900 font-medium">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent className="text-gray-900 bg-white rounded-2xl border-gray-200 shadow-lg">
                <SelectItem value="auto" className="focus:bg-red-50 font-medium">Use Current Location</SelectItem>
                <SelectItem value="manual" className="focus:bg-red-50 font-medium">Enter Coordinates Manually</SelectItem>
                <SelectItem value="address" className="focus:bg-red-50 font-medium">Enter Address</SelectItem>
              </SelectContent>
            </Select>

            {locationType === "manual" && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <Input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Latitude"
                  className="rounded-2xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all placeholder:text-gray-300 text-gray-900 font-medium"
                />
                <Input
                  type="text"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  placeholder="Longitude"
                  className="rounded-2xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all placeholder:text-gray-300 text-gray-900 font-medium"
                />
              </div>
            )}

            {locationType === "address" && (
              <div className="space-y-3 mt-3">
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setLat("");
                      setLon("");
                      setAddressResults([]);
                      setSelectedAddress(null);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && address) {
                        e.preventDefault();
                        const results = await geocodeAddress(address);
                        if (results && results.length > 0) {
                          setAddressResults(results);
                        }
                      }
                    }}
                    placeholder="Enter address (e.g., 123 Main St, City, State)"
                    className="rounded-2xl border-gray-200 focus:border-red-400 focus:ring-red-400/20 transition-all placeholder:text-gray-300 text-gray-900 font-medium pr-16"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 h-10 w-10 text-red-500 hover:text-red-600 transition-all group"
                    onClick={async () => {
                      if (address) {
                        const results = await geocodeAddress(address);
                        if (results && results.length > 0) {
                          setAddressResults(results);
                        }
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 transition-all duration-200 group-hover:rotate-12 group-hover:scale-125"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </Button>
                </div>

                {addressResults.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-900">
                      Select the correct address:
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent">
                      {addressResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            selectedAddress === index
                              ? "bg-red-50 border-red-200 shadow-sm"
                              : "hover:bg-red-50/50 border-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedAddress(index);
                            setLat(result.lat);
                            setLon(result.lon);
                          }}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {result.displayName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Type: {result.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAddress !== null && lat && lon && (
                  <div className="mt-3 text-sm bg-red-50/50 p-4 rounded-2xl border border-red-100">
                    <p className="font-medium text-gray-900">
                      Selected Address: {addressResults[selectedAddress].displayName}
                    </p>
                    <p className="mt-1 text-gray-700">
                      Coordinates: {lat}, {lon}
                    </p>
                  </div>
                )}
              </div>
            )}

            {locationType === "auto" && (
              <div className="mt-3 text-sm bg-red-50/50 p-4 rounded-2xl border border-red-100">
                <p className="text-gray-900 font-medium">
                  {lat && lon
                    ? `Current location: ${lat}, ${lon}`
                    : "Fetching location..."}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full rounded-2xl py-6 font-medium transition-all ${
              isLoading || !selectedImage || (!title && !description) || (!lat && !lon)
                ? "bg-gray-100 text-gray-400"
                : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg hover:shadow-xl hover:shadow-red-100"
            }`}
            disabled={
              isLoading ||
              !selectedImage ||
              (!title && !description) ||
              (!lat && !lon)
            }
          >
            {isLoading ? "Submitting..." : "Submit Report"}
          </Button>
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-red-500" />
            </div>
          )}
        </form>

      </div>

      {/* Right Column - Image Upload */}
      <div className="w-full md:w-1/2 p-8 lg:p-12 xl:p-16 bg-gray-50">
        <div
          {...getRootProps()}
          className={`w-full h-full flex items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
            isDragActive
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-red-300 hover:bg-red-50/30"
          }`}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="flex flex-col items-center gap-6 p-8 w-full">
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-red-100">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-all duration-300 hover:scale-105"
                />
              </div>
              <p className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-red-100">
                Drop a new image to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8 text-center p-12">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm border border-red-100 transition-transform hover:scale-105 hover:border-red-200 hover:shadow-md group">
                <MapPin className="h-10 w-10 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
              <div className="max-w-xs">
                <p className="text-xl font-medium text-gray-700 mb-2">
                  Add Photos
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Drag and drop your images here, or click to browse
                </p>
                <p className="text-xs text-red-400 mt-4">
                  Supports JPG, PNG, GIF, WEBP
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
