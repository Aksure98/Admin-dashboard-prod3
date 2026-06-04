"use client";
/// <reference types="@types/google.maps" />
import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface TripMapProps {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

const TripMap: React.FC<TripMapProps> = ({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !mapRef.current ||
      !pickupLat ||
      !pickupLng ||
      !dropoffLat ||
      !dropoffLng
    )
      return;

    const initMap = async () => {
      // Configure the API key once using the new functional API
      setOptions({
        //@ts-expect-error will work on it
        apiKey: GOOGLE_MAPS_API_KEY!,
        version: "weekly",
      });

      const { Map } = (await importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      const pickup = { lat: pickupLat, lng: pickupLng };
      const dropoff = { lat: dropoffLat, lng: dropoffLng };

      const map = new Map(mapRef.current!, {
        zoom: 13,
        center: {
          lat: (pickupLat + dropoffLat) / 2,
          lng: (pickupLng + dropoffLng) / 2,
        },
        mapId: GOOGLE_MAPS_MAP_ID,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Pickup marker (green)
      new AdvancedMarkerElement({
        position: pickup,
        map,
        title: "Pickup",
        content: new PinElement({
          background: "#16a34a",
          borderColor: "#ffffff",
          glyphColor: "#ffffff",
        }).element,
      });

      // Dropoff marker (red)
      new AdvancedMarkerElement({
        position: dropoff,
        map,
        title: "Drop Off",
        content: new PinElement({
          background: "#dc2626",
          borderColor: "#ffffff",
          glyphColor: "#ffffff",
        }).element,
      });

      // Route line between pickup and dropoff
      new google.maps.Polyline({
        path: [pickup, dropoff],
        geodesic: true,
        strokeColor: "#0077b6",
        strokeOpacity: 1,
        strokeWeight: 3,
        map,
      });

      // Fit map to show both markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickup);
      bounds.extend(dropoff);
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    };

    initMap();
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  return <div ref={mapRef} className="w-full h-full rounded-2xl bg-grey-100" />;
};

export default TripMap;
