"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const DEFAULT_CENTER: [number, number] = [-73.9855, 40.7484] // Empire State Building coordinates

export default function Map() {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude]
          setUserLocation(newLocation)
          
          // Update map center if map exists
          if (map.current) {
            map.current.setCenter(newLocation)
            new mapboxgl.Marker()
              .setLngLat(newLocation)
              .addTo(map.current)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser")
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    // Initialize map with default center
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 15,
    })

    // Add marker if we already have user location
    if (userLocation) {
      new mapboxgl.Marker()
        .setLngLat(userLocation)
        .addTo(map.current)
      map.current.setCenter(userLocation)
    }

    const resizeMap = () => {
      if (map.current) {
        map.current.resize()
      }
    }

    window.addEventListener("resize", resizeMap)

    return () => {
      window.removeEventListener("resize", resizeMap)
      if (map.current) map.current.remove()
    }
  }, []) // Only run on mount

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0"
      style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
    />
  )
}

