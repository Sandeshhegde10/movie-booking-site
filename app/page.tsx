"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Play, MapPin, FilmIcon, Sparkles, Star, MonitorPlay, Armchair, Clapperboard, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useBooking } from "@/lib/booking-context"

export default function Home() {
  const { selectedCity, selectedTheater, setCity, setTheater } = useBooking()
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showTheaterDropdown, setShowTheaterDropdown] = useState(false)

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]

  const theaters = {
    Mumbai: ["PVR Phoenix", "INOX Megaplex", "Cinepolis Andheri", "Carnival Cinema"],
    Delhi: ["PVR Saket", "INOX Nehru Place", "Cinepolis DLF", "Carnival Cinema"],
    Bangalore: ["PVR Forum", "INOX Garuda", "Cinepolis RCB", "Carnival Cinema"],
    Hyderabad: ["PVR Banjara", "INOX GVK", "Cinepolis CCPL", "Carnival Cinema"],
    Chennai: ["PVR Ampa", "INOX Marina", "Cinepolis VR", "Carnival Cinema"],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="cinematic-hero relative overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <Image src="/cinema-lobby.jpg" alt="Cinema Interior" fill className="hero-bg-image" priority />
        </div>

        {/* Dark Overlay with Vignette */}
        <div className="hero-overlay-dark" />

        {/* Premium Features Bar */}
        <div className="hero-content relative">
          <div className="container mx-auto px-4 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Star className="h-5 w-5 text-primary" />
                <span>PREMIUM SOUND</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MonitorPlay className="h-5 w-5 text-primary" />
                <span>4K LASER</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clapperboard className="h-5 w-5 text-primary" />
                <span>VIP LOUNGES</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Armchair className="h-5 w-5 text-primary" />
                <span>RECLINER SEATS</span>
              </div>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="container mx-auto px-4 pb-20 pt-32">
            <div className="mx-auto max-w-5xl text-center">
              {/* Hero Title */}
              <div className="mb-12">
                <h1 className="hero-title mb-4 text-6xl font-extrabold uppercase tracking-tight text-white sm:text-7xl md:text-8xl">
                  <span className="block">CINEMA</span>
                  <span className="gradient-text neon-glow block">REBORN</span>
                </h1>
                <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-gray-400 sm:text-xl">
                  Book tickets, reserve parking, and win rewards with our AI-powered quiz.
                  <br />
                  Experience movies like never before in our state-of-the-art theaters.
                </p>
              </div>

              {/* City and Theater Selectors */}
              <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                {/* City Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown)
                      setShowTheaterDropdown(false)
                    }}
                    className="h-14 min-w-[240px] justify-start gap-3 rounded-full border-border/50 bg-background/30 text-base backdrop-blur-sm hover:bg-background/50"
                  >
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{selectedCity || "Select City"}</span>
                  </Button>
                  {showCityDropdown && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-card/95 p-2 shadow-2xl backdrop-blur-xl">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setCity(city)
                            setTheater(null)
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
                    className="h-14 min-w-[240px] justify-start gap-3 rounded-full border-border/50 bg-background/30 text-base backdrop-blur-sm hover:bg-background/50 disabled:opacity-50"
                  >
                    <FilmIcon className="h-5 w-5 text-primary" />
                    <span>{selectedTheater || "Select Theater"}</span>
                  </Button>
                  {showTheaterDropdown && selectedCity && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-card/95 p-2 shadow-2xl backdrop-blur-xl">
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
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/movies">
                  <Button
                    size="lg"
                    className="group h-16 rounded-full bg-gradient-to-r from-red-600 to-orange-600 px-10 text-lg font-semibold shadow-2xl shadow-red-600/50 transition-all hover:scale-105 hover:from-red-500 hover:to-orange-500 hover:shadow-red-500/70"
                  >
                    <Play className="mr-3 h-6 w-6 fill-current" />
                    Book Now
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 rounded-full border-border/50 bg-background/30 px-10 text-lg font-semibold backdrop-blur-sm transition-all hover:scale-105 hover:bg-background/50"
                  >
                    <Sparkles className="mr-3 h-5 w-5" />
                    Try AI Quiz
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-border/50 bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="cinematic-spotlight left-1/4 top-1/2" />

        <div className="container relative mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Movies Showing */}
            <div className="card-cinematic group rounded-2xl p-8 text-center transition-all hover:scale-105">
              <div className="mb-4 text-6xl font-extrabold">24+</div>
              <h3 className="mb-2 text-xl font-bold">Movies Showing</h3>
              <p className="text-sm text-muted-foreground">Latest blockbusters & indie gems</p>
            </div>

            {/* Happy Customers */}
            <div className="card-cinematic group rounded-2xl p-8 text-center transition-all hover:scale-105">
              <div className="mb-4 text-6xl font-extrabold">50k+</div>
              <h3 className="mb-2 text-xl font-bold">Happy Customers</h3>
              <p className="text-sm text-muted-foreground">Enjoying premium cinema daily</p>
            </div>

            {/* Rewards Given */}
            <div className="card-cinematic group rounded-2xl p-8 text-center transition-all hover:scale-105">
              <div className="mb-4 text-6xl font-extrabold">$1M+</div>
              <h3 className="mb-2 text-xl font-bold">Rewards Given</h3>
              <p className="text-sm text-muted-foreground">In tickets and concessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Watch Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/20 via-background to-background py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-8 font-serif text-6xl font-bold uppercase tracking-wide text-foreground sm:text-7xl">
            Ready to Watch?
          </h2>
          <Link href="/movies">
            <Button
              size="lg"
              variant="outline"
              className="group h-14 rounded-full border-foreground/20 bg-transparent px-8 text-base font-semibold transition-all hover:scale-105 hover:border-primary hover:bg-primary/10"
            >
              Browse Movies
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
