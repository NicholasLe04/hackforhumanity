"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Post } from "@/supabase/schema";
import { Home, AlertTriangle, Eye, EyeOff, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PersonIcon from "../../public/person-icon.svg";
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';

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
  const [showCircles, setShowCircles] = useState(true);

  const toggleCircleVisibility = () => {
    if (!mapInstance.current) return;
    
    setShowCircles(!showCircles);
    
    // Toggle visibility of warning circles layer
    mapInstance.current.setLayoutProperty(
      'warning-circles',
      'visibility',
      !showCircles ? 'visible' : 'none'
    );
    
    // Toggle visibility of individual circle fill layers
    posts.forEach((_, index) => {
      mapInstance.current!.setLayoutProperty(
        `circle-fill-${index}`,
        'visibility',
        !showCircles ? 'visible' : 'none'
      );
    });
  };

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

    // Add circle layers for warning radius
    mapInstance.current.on('load', () => {
      // Create a GeoJSON source with all posts
      const geojsonData: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: posts.map((post, index): Feature<Point> => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [post.longitude, post.latitude],
          },
          properties: {
            id: index,
            urgency: post.urgency,
            lat: post.latitude,
          },
        })),
      };

      // Add the source FIRST
      mapInstance.current!.addSource('warning-areas', {
        type: 'geojson',
        data: geojsonData,
      });

      // Add a layer for the warning circles using fill-extrusion
      mapInstance.current!.addLayer({
        id: 'warning-circles',
        type: 'fill-extrusion',
        source: 'warning-areas',
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'urgency'],
            'Red', 'rgba(255, 0, 0, 0.2)',    // Red with opacity
            'Orange', 'rgba(255, 165, 0, 0.2)', // Orange with opacity
            'Yellow', 'rgba(255, 255, 0, 0.2)', // Yellow with opacity
            'rgba(0, 0, 0, 0)'              // Default nothing (no opacity)
          ],
          'fill-extrusion-height': 0,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.6
        },
        filter: ['==', '$type', 'Point']
      });

      // Add a source for the actual circles
      posts.forEach((post, index) => {
        if (post.latitude && post.longitude) {
          const center: [number, number] = [post.longitude, post.latitude];
          // Convert radius from miles to meters (1 mile = 1609.34 meters)
          const radiusInMeters = (parseFloat(post.radius) || 10) * 1609.34;
          const circlePoints = 64; // Number of points to make the circle smooth
          const circle = createGeoJSONCircle(center, radiusInMeters, circlePoints);
          
          mapInstance.current!.addSource(`circle-${index}`, {
            type: 'geojson',
            data: circle
          });

          // Add fill layer for each circle
          mapInstance.current!.addLayer({
            id: `circle-fill-${index}`,
            type: 'fill',
            source: `circle-${index}`,
            paint: {
              'fill-color': [
                'match',
                ['literal', post.urgency],
                'Red', 'rgba(255, 0, 0, 0.2)',    // Red with opacity
                'Orange', 'rgba(255, 165, 0, 0.2)', // Orange with opacity
                'Yellow', 'rgba(255, 255, 0, 0.2)', // Yellow with opacity
                'rgba(0, 0, 0, 0)'              // Default nothing (no opacity)
              ],
              'fill-opacity': 0.6
            }
          });
        }
      });

      // Helper function to create a GeoJSON circle
      function createGeoJSONCircle(center: [number, number], radiusInMeters: number, points: number): Feature<Polygon> {
        const coords: Feature<Polygon> = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          },
          properties: {}
        };

        const km = radiusInMeters / 1000;
        const distanceX = km / (111.320 * Math.cos(center[1] * Math.PI / 180));
        const distanceY = km / 110.574;

        const steps = points;
        const angle = 360 / steps;

        for(let i = 0; i < steps; i++) {
          const theta = (i * angle * Math.PI) / 180;
          const x = center[0] + (distanceX * Math.cos(theta));
          const y = center[1] + (distanceY * Math.sin(theta));
          (coords.geometry.coordinates[0] as number[][]).push([x, y]);
        }
        
        (coords.geometry.coordinates[0] as number[][]).push((coords.geometry.coordinates[0] as number[][])[0]);

        return coords;
      }

      // marker for each post based on their lat lon
      posts.forEach((post) => {
        if (post.latitude && post.longitude) {
          const marker = new mapboxgl.Marker({ color: post.urgency.toLowerCase() })
            .setLngLat([post.longitude, post.latitude])
            .addTo(mapInstance.current!);

          // Add click handler to marker
          marker.getElement().addEventListener('click', () => {
            onMarkerClick?.(post);
          });

          markerInstances.current.push(marker);
        }
      });

      // Get user location and add marker
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude]

            setUserLocation(newLocation)
            const el = document.createElement("div")
            el.className = "custom-marker"
            el.style.backgroundImage = `url(${PersonIcon.src})`
            el.style.width = "20px"
            el.style.height = "20px"
            el.style.backgroundSize = "100%"

            const userMarker = new mapboxgl.Marker(el).setLngLat(newLocation).addTo(mapInstance.current!)

            userMarkerInstance.current = userMarker

            if (mapInstance.current) {
              mapInstance.current.flyTo({
                center: newLocation,
                zoom: 5,
                duration: 2000,
              })
            }
          },
          (error) => {
            console.error("Error getting location:", error)
          },
        )
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

  // jump to incident
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
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div ref={mapContainer} className="w-full h-full" />

      {/* action buttons */}
      <div className="absolute top-4 right-6 bg-white rounded-full shadow-lg p-2 flex flex-col gap-2 z-50">
        <Button
          className="w-12 h-12 p-0 rounded-full hover:bg-gray-100 transition-all duration-300"
          onClick={() => {
            if (userLocation && mapInstance.current) {
              mapInstance.current.flyTo({
                center: userLocation,
                zoom: 15,
                duration: 2000,
              });
            }
          }}
        >
          <Home className="h-5 w-5 text-red-600" />
        </Button>
        <div className="w-[1px] bg-gray-200 my-2" />
        <Button
          className="w-12 h-12 p-0 rounded-full hover:bg-gray-100 transition-all duration-300"
          onClick={toggleCircleVisibility}
        >
          {showCircles ? (
            <EyeOff className="h-5 w-5 text-red-600" />
          ) : (
            <Eye className="h-5 w-5 text-red-600" />
          )}
        </Button>
        <div className="w-[1px] bg-gray-200 my-2" />
        <Button asChild className="w-12 h-12 p-0 rounded-full hover:bg-gray-100 transition-all duration-300">
          <Link href="/report">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </Link>
        </Button>
        <div className="w-[1px] bg-gray-200 my-2" />
        <Button asChild className="w-12 h-12 p-0 rounded-full hover:bg-gray-100 transition-all duration-300">
          <Link href="/summary">
            <FileText className="h-5 w-5 text-red-600" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
