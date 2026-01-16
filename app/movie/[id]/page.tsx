import { prisma } from "@/lib/prisma"
import { allMovies } from "@/lib/all-movies-data"
import MoviePageClient from "./movie-page-client"
import type { Movie } from "@/lib/types"

export async function generateStaticParams() {
  return allMovies.map((movie) => ({
    id: movie.id,
  }))
}

async function getMovieById(id: string): Promise<Movie | null> {
  try {
    // Validate if ID looks like a MongoDB ObjectID (24 hex chars)
    if (!/^[0-9a-f]{24}$/.test(id)) {
      // Invalid ObjectID format, skip database call and use static data
      return allMovies.find((m) => m.id === id) || null
    }

    // First try to find in database (with proper ObjectID)
    const dbMovie = await prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          select: {
            time: true,
          },
        },
      },
    })

    if (dbMovie) {
      return {
        id: dbMovie.id,
        title: dbMovie.title,
        genre: dbMovie.genre,
        duration: dbMovie.duration,
        rating: dbMovie.rating,
        image: dbMovie.image,
        description: dbMovie.description,
        language: dbMovie.language,
        cities: dbMovie.cities ? dbMovie.cities.split(",") : [],
        showtimes: dbMovie.showtimes.map(st => st.time),
      } as Movie
    }

    // Fallback to static data for numeric IDs
    const staticMovie = allMovies.find((m) => m.id === id)
    return staticMovie || null
  } catch (error) {
    // Silently fallback to static data for any database errors
    return allMovies.find((m) => m.id === id) || null
  }
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = await getMovieById(id)

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <h2 className="text-lg font-semibold text-destructive">Movie Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sorry, we couldn't find the movie you're looking for.</p>
          <a href="/movies" className="mt-4 inline-block text-primary hover:underline">
            ← Back to Movies
          </a>
        </div>
      </div>
    )
  }

  return <MoviePageClient movie={movie} />
}

