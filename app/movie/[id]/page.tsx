"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { movies } from "@/lib/mock-data"
import { useBooking } from "@/lib/booking-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Star, MapPin, Building2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <MoviePageClient id={id} />
}

function MoviePageClient({ id }: { id: string }) {
  const router = useRouter()
  const { setMovie, setShowtime, selectedCity, selectedTheater, setCity, setTheater } = useBooking()
  const [selectedShowtime, setSelectedShowtime] = useState<string>("")
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showTheaterDropdown, setShowTheaterDropdown] = useState(false)

  const movie = movies.find((m) => m.id === id)

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]
  const theaters = {
    Mumbai: ["PVR Phoenix Palladium", "INOX Nariman Point", "Cinépolis Andheri", "PVR ICON Juhu"],
    Delhi: ["PVR Select CITYWALK", "PVR Priya", "INOX Nehru Place", "Cinépolis DLF Place"],
    Bangalore: ["PVR Vega City", "INOX Garuda Mall", "Cinépolis Royal Meenakshi", "PVR Forum Mall"],
    Hyderabad: ["PVR Nexus Mall", "INOX GVK One", "Asian Cinemas", "PVR Irrum Manzil"],
    Chennai: ["PVR Ampa Skywalk", "INOX The Marina Mall", "Sathyam Cinemas", "PVR Grand Galada"],
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Movie not found</p>
      </div>
    )
  }

  const handleContinue = () => {
    if (!selectedShowtime || !selectedCity || !selectedTheater) return
    setMovie(movie)
    setShowtime(selectedShowtime)
    router.push(`/booking/${movie.id}/seats`)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Dramatic lighting effect */}
      <div className="cinematic-spotlight" style={{ top: "-10%", left: "20%" }} />
      <div className="cinematic-spotlight" style={{ bottom: "-10%", right: "20%", animationDelay: "4s" }} />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <Link href="/movies">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold text-foreground">{movie.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.duration}</span>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {movie.genre}
                    </span>
                  </div>
                </div>

                <p className="text-pretty leading-relaxed text-muted-foreground">{movie.description}</p>
              </div>
            </div>
          </div>

          {/* Booking Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Select Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* City Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown)
                      setShowTheaterDropdown(false)
                    }}
                    className="w-full justify-start gap-3"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{selectedCity || "Select City"}</span>
                  </Button>
                  {showCityDropdown && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-card p-2 shadow-2xl">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setCity(city)
                            setShowCityDropdown(false)
                          }}
                          className="w-full rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Theater Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      if (selectedCity) {
                        setShowTheaterDropdown(!showTheaterDropdown)
                        setShowCityDropdown(false)
                      }
                    }}
                    disabled={!selectedCity}
                    className="w-full justify-start gap-3 disabled:opacity-50"
                  >
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>{selectedTheater || "Select Theater"}</span>
                  </Button>
                  {showTheaterDropdown && selectedCity && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-card p-2 shadow-2xl">
                      {theaters[selectedCity as keyof typeof theaters].map((theater) => (
                        <button
                          key={theater}
                          onClick={() => {
                            setTheater(theater)
                            setShowTheaterDropdown(false)
                          }}
                          className="w-full rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {theater}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Showtime Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Select Showtime
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {movie.showtimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedShowtime(time)}
                      className={cn(
                        "rounded-lg border-2 p-3 text-sm font-medium transition-all",
                        selectedShowtime === time
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-border bg-card hover:border-primary/50 hover:bg-accent",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!selectedShowtime || !selectedCity || !selectedTheater}
                  className="w-full"
                  size="lg"
                >
                  Continue to Seat Selection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
