"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MovieCard } from "@/components/movie-card"
import { allMovies } from "@/lib/all-movies-data"
import { Button } from "@/components/ui/button"
import { Film, Filter } from "lucide-react"

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>("all")

  // Group movies by genre
  const genres = ["all", "action", "thriller", "horror", "drama", "comedy", "romance", "sci-fi"]

  const getMoviesByGenre = (genre: string) => {
    if (genre === "all") return allMovies
    return allMovies.filter((movie) => movie.genre.toLowerCase().includes(genre))
  }

  const genreMovies = getMoviesByGenre(selectedGenre)

  return (
    <div className="min-h-screen">
      <Header />

      <div className="relative bg-gradient-to-b from-background via-background/95 to-background">
        {/* Cinematic background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="cinematic-spotlight" />
          <div className="film-grain" />
        </div>

        <div className="container relative mx-auto px-4 py-20">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 backdrop-blur">
              <Film className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold tracking-wide">Now Showing</span>
            </div>

            <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              <span className="gradient-text neon-glow">Latest Movies</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explore 30+ blockbusters from Bollywood and Hollywood
            </p>
          </div>

          {/* Genre Filter */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Filter by Genre</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className={`rounded-full px-6 capitalize ${
                    selectedGenre === genre
                      ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-600/30"
                      : ""
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Movies by Genre Sections */}
          {selectedGenre === "all" ? (
            <div className="space-y-16">
              {genres.slice(1).map((genre) => {
                const movies = getMoviesByGenre(genre)
                if (movies.length === 0) return null

                return (
                  <section key={genre}>
                    <div className="mb-6 flex items-center gap-3">
                      <h2 className="text-3xl font-bold capitalize">{genre}</h2>
                      <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold">
                        {movies.length} movies
                      </span>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <section>
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold capitalize">{selectedGenre} Movies</h2>
                <p className="mt-2 text-muted-foreground">{genreMovies.length} movies available</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {genreMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
