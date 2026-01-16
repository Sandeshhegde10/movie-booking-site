"use server"

import { prisma } from "@/lib/prisma"
import { allMovies } from "@/lib/all-movies-data"
import type { Movie } from "@/lib/types"
import { unstable_cache } from 'next/cache'

const getCachedMovies = unstable_cache(
    async () => {
        try {
            const dbMovies = await prisma.movie.findMany({
                select: {
                    id: true,
                    title: true,
                    genre: true,
                    duration: true,
                    rating: true,
                    image: true,
                    description: true,
                    language: true,
                    cities: true,
                },
                take: 100,
            })

            if (dbMovies.length > 0) {
                return dbMovies.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    genre: movie.genre,
                    duration: movie.duration,
                    rating: movie.rating,
                    image: movie.image,
                    description: movie.description,
                    language: movie.language,
                    cities: movie.cities ? movie.cities.split(",") : [],
                    showtimes: [],
                })) as Movie[]
            }

            return allMovies
        } catch (error) {
            console.error("Failed to fetch movies:", error)
            return allMovies
        }
    },
    ['movies'],
    { revalidate: 3600, tags: ['movies'] }
)

export async function getMovies(): Promise<Movie[]> {
    return getCachedMovies()
}
