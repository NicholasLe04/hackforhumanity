"use client"

import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const DEFAULT_CENTER: [number, number] = [-73.9855, 40.7484] // Empire State Building coordinates

export default function Map() {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_CENTER)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 15,
    })

    marker.current = new mapboxgl.Marker()
      .setLngLat(DEFAULT_CENTER)
      .addTo(map.current)

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
  }, [])

  // Handle location updates
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ]
          setUserLocation(newLocation)
          
          if (map.current && marker.current) {
            map.current.flyTo({
              center: newLocation,
              zoom: 15,
              duration: 2000
            })
            marker.current.setLngLat(newLocation)
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

  return (
    <div>
      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      />
    </div>
  )
}

