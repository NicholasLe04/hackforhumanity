"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Make sure token is properly set
if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  console.error("Mapbox token is not set!");
}

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
console.log("Token available:", !!token);
mapboxgl.accessToken = token;

// Santa Clara University coordinates (longitude, latitude)
const SCU_CENTER: [number, number] = [-121.952742, 37.34412];

// Movement constraints
const MOVEMENT_RANGE = 0.004;
const SMOOTHING_FACTOR = 0.05;

export default function BackgroundMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const requestRef = useRef<number>(0);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing map...");
    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }

    try {
      console.log("Creating map instance...");
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: SCU_CENTER,
        zoom: 15.5,
        interactive: false,
        bearing: -30,
        pitch: 45,
        attributionControl: false,
      });

      mapInstance.current.on('load', () => {
        console.log('Map loaded successfully');
        if (mapInstance.current) {
          // Add a subtle highlight around SCU
          mapInstance.current.addLayer({
            id: 'campus-boundary',
            type: 'fill',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [-121.954742, 37.34612],
                    [-121.950742, 37.34612],
                    [-121.950742, 37.34212],
                    [-121.954742, 37.34212],
                    [-121.954742, 37.34612]
                  ]]
                }
              }
            },
            paint: {
              'fill-color': '#dc2626',
              'fill-opacity': 0.15
            }
          });

          // Add the marker
          new mapboxgl.Marker({
            color: "#dc2626",
            scale: 0.8
          })
            .setLngLat(SCU_CENTER)
            .addTo(mapInstance.current);

          // Force resize
          mapInstance.current.resize();
        }
      });

      mapInstance.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map');
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map');
      return;
    }

    const animate = () => {
      if (mapInstance.current && mousePosition.current) {
        try {
          const center = mapInstance.current.getCenter();
          const targetLng = SCU_CENTER[0] + (mousePosition.current.x - 0.5) * MOVEMENT_RANGE;
          const targetLat = SCU_CENTER[1] + (mousePosition.current.y - 0.5) * MOVEMENT_RANGE;
          const newLng = center.lng + (targetLng - center.lng) * SMOOTHING_FACTOR;
          const newLat = center.lat + (targetLat - center.lat) * SMOOTHING_FACTOR;
          const constrainedLat = Math.max(-85, Math.min(85, newLat));
          mapInstance.current.setCenter([newLng, constrainedLat]);
          mapInstance.current.setBearing(((mousePosition.current.x - 0.5) * 20));
        } catch (error) {
          console.error('Animation error:', error);
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mapContainer.current) {
        const rect = mapContainer.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        mousePosition.current = { x, y };
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    // Force resize after a delay
    const resizeTimer = setTimeout(() => {
      console.log("Forcing resize...");
      if (mapInstance.current) {
        mapInstance.current.resize();
      }
    }, 1000);

    return () => {
      clearTimeout(resizeTimer);
      document.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  if (mapError) {
    console.error(mapError);
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-screen">
      <div 
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          opacity: 0.8
        }}
      />
    </div>
  );
} 