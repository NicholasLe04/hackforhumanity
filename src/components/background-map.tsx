'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Animation constants
const MOVEMENT_RANGE = 0.004; // How far the map can move from center
const SPRING_STRENGTH = 0.03; // How quickly it bounces back (higher = faster)
const DAMPING = 0.98; // Reduces oscillation (lower = more damping)
const ANIMATION_SPEED = 0.01; // Slower speed for more subtle movement

// Santa Clara University coordinates [longitude, latitude] from API
const SCU_COORDINATES: [number, number] = [-121.952742, 37.34412];

export default function BackgroundMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationFrame = useRef<number | undefined>(undefined);
  const time = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: SCU_COORDINATES,
        zoom: 14.5, // Slightly zoomed out to show more context
        bearing: -30,
        pitch: 60, // More tilted for better perspective
        interactive: false,
        attributionControl: false,
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Add a marker for SCU
        new mapboxgl.Marker({
          color: "#dc2626",
          scale: 0.8
        })
          .setLngLat(SCU_COORDINATES)
          .addTo(map.current);

        // Add a subtle highlight around SCU
        map.current.addSource('scu-area', {
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
        });

        map.current.addLayer({
          id: 'scu-area-fill',
          type: 'fill',
          source: 'scu-area',
          paint: {
            'fill-color': '#dc2626',
            'fill-opacity': 0.1
          }
        });

        // Start the animation loop
        animate();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    const animate = () => {
      if (!map.current) return;

      try {
        time.current += ANIMATION_SPEED;
        
        // Create a more gentle figure-8 pattern
        const targetX = Math.sin(time.current) * Math.cos(time.current * 0.5) * MOVEMENT_RANGE;
        const targetY = Math.sin(time.current * 0.7) * MOVEMENT_RANGE;

        // Apply spring physics
        const springForceX = (targetX - velocity.current.x) * SPRING_STRENGTH;
        const springForceY = (targetY - velocity.current.y) * SPRING_STRENGTH;

        velocity.current.x += springForceX;
        velocity.current.y += springForceY;

        // Apply damping
        velocity.current.x *= DAMPING;
        velocity.current.y *= DAMPING;

        const newLng = SCU_COORDINATES[0] + velocity.current.x;
        const newLat = SCU_COORDINATES[1] - velocity.current.y;

        map.current.setCenter([newLng, newLat]);
        
        // Slowly rotate the bearing for added effect
        const currentBearing = map.current.getBearing();
        map.current.setBearing(currentBearing + 0.02);
      } catch (error) {
        console.error('Animation error:', error);
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: 0.85,
          filter: 'saturate(0.9) brightness(1.1)',
        }}
      />
    </div>
  );
} 