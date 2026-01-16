import { allMovies } from "@/lib/all-movies-data"
import MoviePageClient from "./movie-page-client"

// Generate static paths for all movies at build time
export async function generateStaticParams() {
  return allMovies.map((movie) => ({
    id: movie.id,
  }))
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = allMovies.find((m) => m.id === id)

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Movie not found</p>
      </div>
    )
  }

  return <MoviePageClient movie={movie} />
}

