"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Navigation, Search, Target, Clock, Star, Building, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Custom emerald marker icon
const createEmeraldIcon = () => {
    return L.divIcon({
        className: "custom-emerald-marker",
        html: `
      <div class="relative">
        <svg viewBox="0 0 24 24" width="32" height="32" class="drop-shadow-lg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#10b981" stroke="#065f46" strokeWidth="2"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })
}

// Types for search results
interface SearchResult {
    place_id: string
    display_name: string
    lat: string
    lon: string
    type: string
    importance: number
    icon?: string
    class?: string
}

// Popular locations for quick access
const popularLocations = [
    { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357, type: "city" },
    { name: "Alexandria, Egypt", lat: 31.2001, lng: 29.9187, type: "city" },
    { name: "Giza, Egypt", lat: 30.0131, lng: 31.2089, type: "city" },
    { name: "New York, USA", lat: 40.7128, lng: -74.006, type: "city" },
    { name: "London, UK", lat: 51.5074, lng: -0.1278, type: "city" },
    { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, type: "city" },
]

// Map controller component
const MapController = ({
    onPositionChange,
    position,
    shouldFlyTo,
}: {
    onPositionChange: (lat: number, lng: number, address?: string) => void
    position: [number, number]
    shouldFlyTo: boolean
}) => {
    const map = useMap()

    // Fly to position when it changes externally
    useEffect(() => {
        if (shouldFlyTo) {
            map.flyTo(position, 15, {
                duration: 1.5,
                easeLinearity: 0.25,
            })
        }
    }, [position, map, shouldFlyTo])

    // Handle map click events
    useMapEvents({
        click: async (e) => {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng]

            // Reverse geocoding to get address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos[0]}&lon=${newPos[1]}&zoom=18&addressdetails=1`,
                )
                const data = await response.json()
                const address = data.display_name || `${newPos[0].toFixed(4)}, ${newPos[1].toFixed(4)}`
                onPositionChange(newPos[0], newPos[1], address)
            } catch (error) {
                onPositionChange(newPos[0], newPos[1])
            }
        },
    })

    return null
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

interface EnhancedLocationPickerProps {
    onLocationChange?: (location: { lat: number; lng: number; address?: string }) => void
    initialPosition?: [number, number]
    className?: string
}

export default function EnhancedLocationPicker({
    onLocationChange,
    initialPosition = [30.0444, 31.2357], // Cairo, Egypt default
    className,
}: EnhancedLocationPickerProps) {
    const {
        setValue,
    } = useFormContext()

    const [position, setPosition] = useState<[number, number]>(initialPosition)
    const [address, setAddress] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [shouldFlyTo, setShouldFlyTo] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const searchInputRef = useRef<HTMLInputElement>(null)
    // const suggestionsRef = useRef<HTMLDivElement>(null)


    // Debounced search query
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentLocationSearches")
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved))
            } catch (error) {
                console.error("Error loading recent searches:", error)
            }
        }
    }, [])

    // Save recent searches to localStorage
    const saveRecentSearch = (query: string) => {
        const updated = [query, ...recentSearches.filter((item) => item !== query)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem("recentLocationSearches", JSON.stringify(updated))
    }

    // Search for locations with debouncing
    useEffect(() => {
        if (debouncedSearchQuery.length >= 2) {
            searchLocations(debouncedSearchQuery)
        } else {
            setSearchResults([])
            setShowSuggestions(false)
        }
    }, [debouncedSearchQuery])

    // Handle position changes
    const handlePositionChange = (lat: number, lng: number, newAddress?: string) => {
        const newPos: [number, number] = [lat, lng]
        setPosition(newPos)
        if (newAddress) {
            setAddress(newAddress)
        }
        onLocationChange?.({ lat, lng, address: newAddress })
        setShouldFlyTo(false)
    }

    // Search for locations
    const searchLocations = async (query: string) => {
        if (!query.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query,
                )}&limit=8&addressdetails=1&extratags=1`,
            )
            const data = await response.json()

            if (data && data.length > 0) {
                setSearchResults(data)
                setShowSuggestions(true)
                setSelectedIndex(-1)
            } else {
                setSearchResults([])
                setShowSuggestions(false)
            }
        } catch (error) {
            console.error("Search error:", error)
            setSearchResults([])
            setShowSuggestions(false)
        }

        setIsLoading(false)
    }

    // Select a location from search results
    const selectLocation = async (result: SearchResult | { name: string; lat: number; lng: number; type: string }) => {
        let lat: number, lng: number, displayName: string

        if ("place_id" in result) {
            // Search result
            lat = Number.parseFloat(result.lat)
            lng = Number.parseFloat(result.lon)
            displayName = result.display_name
            saveRecentSearch(displayName)
        } else {
            // Popular location
            lat = result.lat
            lng = result.lng
            displayName = result.name
            saveRecentSearch(result.name)
        }

        setPosition([lat, lng])
        console.log({
            displayName
        })
        setAddress(displayName)
        setSearchQuery(displayName.split(",")[0]) // Show just the main location name
        setShowSuggestions(false)
        setShouldFlyTo(true)
        onLocationChange?.({ lat, lng, address: displayName })
    }

    // Get current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.")
            return
        }

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude]

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos[0]}&lon=${newPos[1]}&zoom=18&addressdetails=1`,
                    )
                    const data = await response.json()
                    const currentAddress = data.display_name || "Current Location"

                    setPosition(newPos)
                    setAddress(currentAddress)
                    setSearchQuery("Current Location")
                    setShouldFlyTo(true)
                    onLocationChange?.({ lat: newPos[0], lng: newPos[1], address: currentAddress })
                } catch (error) {
                    setPosition(newPos)
                    setAddress("Current Location")
                    setSearchQuery("Current Location")
                    setShouldFlyTo(true)
                    onLocationChange?.({ lat: newPos[0], lng: newPos[1], address: "Current Location" })
                }

                setIsLoading(false)
            },
            (error) => {
                console.error("Error getting location:", error)
                alert("Unable to retrieve your location. Please check your browser settings.")
                setIsLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        )
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev))
                break
            case "ArrowUp":
                e.preventDefault()
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                break
            case "Enter":
                e.preventDefault()
                if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                    selectLocation(searchResults[selectedIndex])
                }
                break
            case "Escape":
                setShowSuggestions(false)
                setSelectedIndex(-1)
                break
        }
    }

    // Get icon for location type
    const getLocationIcon = (type: string, className?: string) => {
        switch (type) {
            case "city":
            case "town":
            case "village":
                return <Building className={cn("w-4 h-4", className)} />
            case "country":
                return <Globe className={cn("w-4 h-4", className)} />
            default:
                return <MapPin className={cn("w-4 h-4", className)} />
        }
    }

    useEffect(() => {
        const parts = address.split(',').map(p => p.trim());
      
      if(!address) return;
        const dd = {
            street: [parts[0], parts[1]].filter(Boolean).join(" "), // skips undefined/null
            city: parts[2] ?? "",
            state: parts[3] ?? "",
            zip: parts[4] ?? "",
            country: parts[5] ?? "",
        };

    

        setValue("location", dd)

    }, [address, setValue])


    return (
        <div className={cn("space-y-4", className)}>
            {/* Enhanced Search Bar with Suggestions */}
            <div className="relative ">
                <div className="flex gap-2 h-full">
                    <div className="flex-1 relative">
                        <Search className="  absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                if (e.target.value.length >= 2) {
                                    setShowSuggestions(true)
                                }
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (searchQuery.length >= 2 || recentSearches.length > 0) {
                                    setShowSuggestions(true)
                                }
                            }}
                            onBlur={() => {
                                // Delay hiding suggestions to allow clicking
                                setTimeout(() => setShowSuggestions(false), 200)
                            }}
                            placeholder="Search for a location..."
                            className="pl-10 h-10 border-2 focus:border-emerald-400 focus:ring-emerald-200"
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={getCurrentLocation}
                        disabled={isLoading}
                        variant="outline"
                        className="h-10 px-4 border-2 hover:border-emerald-300"
                    >
                        <Navigation className="w-4 h-4" />
                    </Button>
                </div>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-50 border-2 border-emerald-100 shadow-xl">
                        <CardContent className="p-0">
                            <ScrollArea className="max-h-80">
                                <div className="py-2">
                                    {/* Recent Searches */}
                                    {searchQuery.length < 2 && recentSearches.length > 0 && (
                                        <>
                                            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                                                Recent Searches
                                            </div>
                                            {recentSearches.map((recent, index) => (
                                                <button
                                                    key={`recent-${index}`}
                                                    onClick={() => {
                                                        setSearchQuery(recent)
                                                        searchLocations(recent)
                                                    }}
                                                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-sm"
                                                >
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span className="truncate">{recent}</span>
                                                </button>
                                            ))}
                                            <div className="border-b" />
                                        </>
                                    )}

                                    {/* Popular Locations */}
                                    {searchQuery.length < 2 && (
                                        <>
                                            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Popular Locations</div>
                                            {popularLocations.map((location, index) => (
                                                <button
                                                    key={`popular-${index}`}
                                                    onClick={() => selectLocation(location)}
                                                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-sm"
                                                >
                                                    <Star className="w-4 h-4 text-emerald-500" />
                                                    <span className="truncate">{location.name}</span>
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    {/* Search Results */}
                                    {searchResults.length > 0 && (
                                        <>
                                            {searchQuery.length >= 2 && (
                                                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                                                    Search Results
                                                </div>
                                            )}
                                            {searchResults.map((result, index) => (
                                                <button
                                                    key={result.place_id}
                                                    onClick={() => selectLocation(result)}
                                                    className={cn(
                                                        "w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-sm transition-colors",
                                                        selectedIndex === index && "bg-emerald-50",
                                                    )}
                                                >
                                                    {getLocationIcon(result.type || result.class || "place", "text-emerald-600")}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="truncate font-medium">{result.display_name.split(",")[0]}</div>
                                                        <div className="truncate text-xs text-muted-foreground">
                                                            {result.display_name.split(",").slice(1).join(",").trim()}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    {/* No Results */}
                                    {searchQuery.length >= 2 && searchResults.length === 0 && !isLoading && (
                                        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                            No locations found for &quot;{searchQuery}&quot;
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Compact Map */}
            <Card className=" border-2 h-[70%] border-emerald-100 shadow-lg overflow-hidden">
                <CardContent className="p-0 h-full">
                    <div className="relative h-full w-full">
                        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} className="z-0">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={position} icon={createEmeraldIcon()}>
                                <Popup>
                                    <div className="space-y-2 min-w-48">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            <span className="font-medium text-sm">Selected Location</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <p>Lat: {position[0].toFixed(6)}</p>
                                            <p>Lng: {position[1].toFixed(6)}</p>
                                        </div>
                                        {address && <p className="text-xs text-gray-700 border-t pt-2">{address}</p>}
                                    </div>
                                </Popup>
                            </Marker>
                            <MapController onPositionChange={handlePositionChange} position={position} shouldFlyTo={shouldFlyTo} />
                        </MapContainer>

                        {/* Overlay Instructions */}
                        <div className="absolute top-2 left-2 z-10">
                            <Badge variant="secondary" className="bg-white/90 text-emerald-700 border border-emerald-200">
                                <Target className="w-3 h-3 mr-1" />
                                Click to select location
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Location Info */}
            {address && (
                <Card className="border border-emerald-100 bg-emerald-50">
                    <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-emerald-800">Selected Location</p>
                                <p className="text-xs text-emerald-700 break-words">{address}</p>
                                <p className="text-xs text-emerald-600 mt-1">
                                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
