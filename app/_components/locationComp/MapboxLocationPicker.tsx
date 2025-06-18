"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Navigation } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Replace with your Mapbox access token
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xvY2F0aW9udG9rZW4ifQ.123456789"

interface MapboxLocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
}

const MapboxLocationPicker = ({ onLocationSelect }: MapboxLocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState("")
  const [gettingLocation, setGettingLocation] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    })

    map.current.on("load", () => {
      setLoading(false)

      // Add marker at initial position
      marker.current = new mapboxgl.Marker({ color: "#10b981", draggable: true })
        .setLngLat([lng, lat])
        .addTo(map.current!)

      // Get address for initial position
      fetchAddress(lng, lat)

      // Update marker position and address when dragged
      marker.current.on("dragend", () => {
        const { lng, lat } = marker.current!.getLngLat()
        setLng(lng)
        setLat(lat)
        fetchAddress(lng, lat)
      })
    })

    map.current.on("move", () => {
      if (!map.current) return
      const center = map.current.getCenter()
      setLng(Number.parseFloat(center.lng.toFixed(4)))
      setLat(Number.parseFloat(center.lat.toFixed(4)))
      setZoom(Number.parseFloat(map.current.getZoom().toFixed(2)))
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  const fetchAddress = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
      )
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name)
      } else {
        setAddress("Unknown location")
      }
    } catch (error) {
      console.error("Error fetching address:", error)
      setAddress("Error fetching address")
    }
  }

  const getUserLocation = () => {
    setGettingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setLng(longitude)
          setLat(latitude)

          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              essential: true,
            })
          }

          if (marker.current) {
            marker.current.setLngLat([longitude, latitude])
          }

          fetchAddress(longitude, latitude)
          setGettingLocation(false)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setGettingLocation(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser")
      setGettingLocation(false)
    }
  }

  const handleConfirm = () => {
    onLocationSelect({
      lat,
      lng,
      address,
    })
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Select Location</h2>
        <Button variant="outline" size="sm" onClick={getUserLocation} disabled={gettingLocation}>
          {gettingLocation ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 mr-2" />
          )}
          My Location
        </Button>
      </div>

      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        )}

        <div ref={mapContainer} className="h-full w-full" />

        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-slate-900 p-3 rounded-md shadow-lg">
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Selected Location</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 break-words">
                {address || "Loading address..."}
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleConfirm}
            disabled={!address}
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MapboxLocationPicker
