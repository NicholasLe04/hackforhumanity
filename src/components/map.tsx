"use client"

import { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function Map() {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.9857, 40.7589],
      zoom: 9,
    })

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

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0"
      style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
    />
  )
}

