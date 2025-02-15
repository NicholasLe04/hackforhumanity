"use client"

import type React from "react"
import Image from "next/image"
import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Link from "next/link"
import { ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const geocodeAddress = async (address: string) => {
  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`;
  
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'hackforhumanity-app' // Required by Nominatim ToS
      }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      // Return multiple results for user to choose from
      return data.map((result: any) => ({
        lat: parseFloat(result.lat).toFixed(6),
        lon: parseFloat(result.lon).toFixed(6),
        displayName: result.display_name,
        type: result.type,
        importance: result.importance
      }));
    }
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export default function ReportPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [locationType, setLocationType] = useState<"auto" | "manual" | "address">("auto")
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [address, setAddress] = useState("")
  const [addressResults, setAddressResults] = useState<Array<{
    lat: string;
    lon: string;
    displayName: string;
    type: string;
    importance: number;
  }>>([])
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setSelectedImage(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  })

  useEffect(() => {
    if (locationType === "auto") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(6))
          setLon(position.coords.longitude.toFixed(6))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [locationType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting:", { selectedImage, title, description, lat, lon })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black">
      {/* Left Column - Form */}
      <div className="w-full md:w-1/2 p-8 overflow-y-auto">
        <nav className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/map" className="flex items-center">
              <ChevronDown className="mr-2 h-4 w-4 rotate-90" />
              Back to Map
            </Link>
          </Button>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Report an Incident</h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter incident title"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe incident..."
              className="placeholder-gray-500 placeholder-opacity-100 w-full border border-gray-300 rounded-md text-sm p-2"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Location</label>
            <Select value={locationType} onValueChange={(value: "auto" | "manual" | "address") => setLocationType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="auto">Use Current Location</SelectItem>
                <SelectItem value="manual">Enter Coordinates Manually</SelectItem>
                <SelectItem value="address">Enter Address</SelectItem>
              </SelectContent>
            </Select>

            {locationType === "manual" && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
                <Input type="text" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="Longitude" />
              </div>
            )}

            {locationType === "address" && (
              <div className="space-y-2 mt-2">
                <Input 
                  type="text" 
                  value={address} 
                  onChange={async (e) => {
                    setAddress(e.target.value);
                    setLat("");
                    setLon("");
                    setAddressResults([]);
                    setSelectedAddress(null);
                  }}
                  placeholder="Enter address (e.g., 123 Main St, City, State)"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="w-full mt-2"
                  onClick={async () => {
                    if (address) {
                      const results = await geocodeAddress(address);
                      if (results && results.length > 0) {
                        setAddressResults(results);
                      }
                    }
                  }}
                >
                  Search Address
                </Button>

                {/* Address Results */}
                {addressResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Select the correct address:</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {addressResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedAddress === index 
                              ? 'bg-red-50 border-red-200' 
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                          onClick={() => {
                            setSelectedAddress(index);
                            setLat(result.lat);
                            setLon(result.lon);
                          }}
                        >
                          <p className="text-sm font-medium">{result.displayName}</p>
                          <p className="text-xs text-gray-500 mt-1">Type: {result.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAddress !== null && lat && lon && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Selected Address: {addressResults[selectedAddress].displayName}</p>
                    <p>Coordinates: {lat}, {lon}</p>
                  </div>
                )}
              </div>
            )}

            {locationType === "auto" && (
              <div className="mt-2 text-sm text-muted-foreground">
                {lat && lon ? `Current location: ${lat}, ${lon}` : "Fetching location..."}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full rounded-md cursor-pointer" disabled={!selectedImage || (!title && !description) || (!lat && !lon)}>
            Submit Report
          </Button>
        </form>
      </div>

      {/* Right Column - Image Upload */}
      <div className="w-full md:w-1/2 p-8 bg-gray-50 flex items-center justify-center">
        <div
          {...getRootProps()}
          className={`w-full h-full flex items-center justify-center border border-input rounded-md cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "hover:border-primary"}`}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                width={400}
                height={400}
                style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
              />
              <p className="text-sm text-muted-foreground">Drop a new image to replace</p>       
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              <p>Drag and drop an image here, or click to select</p>
              <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WEBP</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
