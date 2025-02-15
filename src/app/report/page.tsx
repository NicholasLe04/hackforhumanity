"use client"

import type React from "react"

import Image from "next/image"
import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Link from "next/link"
import { ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [locationType, setLocationType] = useState<"auto" | "manual">("auto")
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")

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
            <Select value={locationType} onValueChange={(value: "auto" | "manual") => setLocationType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="auto">Use Current Location</SelectItem>
                <SelectItem value="manual">Enter Coordinates Manually</SelectItem>
              </SelectContent>
            </Select>
            {locationType === "manual" && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
                <Input type="text" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="Longitude" />
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
              <p className="text-sm text-muted-foreground">Click or drag to replace image</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Click or drag and drop to upload image</p>
              <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WEBP</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
