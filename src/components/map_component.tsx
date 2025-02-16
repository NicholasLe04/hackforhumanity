"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Post } from "@/supabase/schema";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_CENTER: [number, number] = [-73.9855, 40.7484]; // Empire State Building coordinates

interface MapProps {
  posts: Post[];
  selectedLocation: [number, number] | null;
  onMarkerClick?: (post: Post) => void;
}

export default function Map({ posts, selectedLocation, onMarkerClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerInstances = useRef<mapboxgl.Marker[]>([]);
  const userMarkerInstance = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const cleanupMap = () => {
    markerInstances.current.forEach((marker) => marker.remove());
    markerInstances.current = [];

    if (userMarkerInstance.current) {
      userMarkerInstance.current.remove();
      userMarkerInstance.current = null;
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

    // marker for each post based on their lat lon
    posts.forEach((post) => {
      if (post.latitude && post.longitude) {
        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([post.longitude, post.latitude])
          .addTo(mapInstance.current!);

        // Add click handler to marker
        marker.getElement().addEventListener('click', () => {
          onMarkerClick?.(post);
        });

        markerInstances.current.push(marker);
      }
    });

    // load map, get user location, add user marker
    mapInstance.current.on("load", () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation: [number, number] = [
              position.coords.longitude,
              position.coords.latitude,
            ];

            setUserLocation(newLocation);
            const userMarker = new mapboxgl.Marker({ color: "blue" })
              .setLngLat(newLocation)
              .addTo(mapInstance.current!);

            userMarkerInstance.current = userMarker;

            if (mapInstance.current) {
              mapInstance.current.flyTo({
                center: newLocation,
                zoom: 5,
                duration: 2000,
              });
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    });

    // handle window resize
    const resizeMap = () => {
      if (mapInstance.current) {
        mapInstance.current.resize();
      }
    };

    window.addEventListener("resize", resizeMap);

    // cleanup
    return () => {
      window.removeEventListener("resize", resizeMap);
      cleanupMap();
    };
  }, [posts, onMarkerClick]);

  useEffect(() => {
    if (userLocation && mapInstance.current && userMarkerInstance.current) {
      userMarkerInstance.current.setLngLat(userLocation);
    }
  }, [userLocation]);

  // Add effect to handle selected location changes
  useEffect(() => {
    if (selectedLocation && mapInstance.current) {
      mapInstance.current.flyTo({
        center: selectedLocation,
        zoom: 15,
        duration: 2000,
      });
    }
  }, [selectedLocation]);

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
