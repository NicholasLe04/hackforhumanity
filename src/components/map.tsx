"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const DEFAULT_CENTER: [number, number] = [-73.9855, 40.7484] // Empire State Building coordinates

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)
  const markerInstance = useRef<mapboxgl.Marker | null>(null)
  const [location, setLocation] = useState<[number, number]>(DEFAULT_CENTER)

  // Cleanup function to properly remove map instance
  const cleanupMap = () => {
    if (markerInstance.current) {
      markerInstance.current.remove()
      markerInstance.current = null
    }
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }
  }

  // Initialize map
  useEffect(() => {
    // Clean up any existing instances first
    cleanupMap()

    if (!mapContainer.current) return

    // Initialize new map
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 15,
    })

    // Add marker after map is initialized
    markerInstance.current = new mapboxgl.Marker()
      .setLngLat(DEFAULT_CENTER)
      .addTo(mapInstance.current)

    // Handle map load and get user location
    mapInstance.current.on('load', () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation: [number, number] = [
              position.coords.longitude,
              position.coords.latitude
            ]
            setLocation(newLocation)

            if (mapInstance.current && markerInstance.current) {
              mapInstance.current.flyTo({
                center: newLocation,
                zoom: 15,
                duration: 2000
              })
              markerInstance.current.setLngLat(newLocation)
            }
          },
          (error) => {
            console.error("Error getting location:", error)
          }
        )
      }
    })

    // Handle window resize
    const resizeMap = () => {
      if (mapInstance.current) {
        mapInstance.current.resize()
      }
    }

    window.addEventListener("resize", resizeMap)

    // Cleanup function
    return () => {
      window.removeEventListener("resize", resizeMap)
      cleanupMap()
    }
  }, []) // Only run once on mount

  return (
    <div 
      ref={mapContainer}
      style={{ 
        width: "100%", 
        height: "100vh",
        position: "relative",
        backgroundColor: "#f0f0f0" // Add background color to prevent flash
      }}
    />
  )
}

