"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_CENTER: [number, number] = [-73.9855, 40.7484]; // Empire State Building coordinates

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerInstance = useRef<mapboxgl.Marker | null>(null);

  const cleanupMap = () => {
    if (markerInstance.current) {
      markerInstance.current.remove();
      markerInstance.current = null;
    }
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
  };

  useEffect(() => {
    cleanupMap();

    if (!mapContainer.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 15,
    });

    markerInstance.current = new mapboxgl.Marker()
      .setLngLat(DEFAULT_CENTER)
      .addTo(mapInstance.current);

    mapInstance.current.on("load", () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation: [number, number] = [
              position.coords.longitude,
              position.coords.latitude,
            ];

            if (mapInstance.current && markerInstance.current) {
              mapInstance.current.flyTo({
                center: newLocation,
                zoom: 15,
                duration: 2000,
              });
              markerInstance.current.setLngLat(newLocation);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    });

    // Handle window resize
    const resizeMap = () => {
      if (mapInstance.current) {
        mapInstance.current.resize();
      }
    };

    window.addEventListener("resize", resizeMap);

    const observer = new ResizeObserver((entries) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of entries) {
        if (mapInstance.current) {
          mapInstance.current.resize();
        }
      }
    });

    observer.observe(mapContainer.current);

    return () => {
      window.removeEventListener("resize", resizeMap);
      observer.disconnect();
      cleanupMap();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundColor: "#f0f0f0",
      }}
    />
  );
}
