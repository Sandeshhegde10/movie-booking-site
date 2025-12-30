"use server"

import { prisma } from "@/lib/prisma"

import type { Movie } from "@/lib/types"

export async function getMovies(): Promise<Movie[]> {
    try {
        const movies = await prisma.movie.findMany({
            include: {
                showtimes: true,
            },
        })

        return movies.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            genre: movie.genre,
            duration: movie.duration,
            rating: movie.rating,
            image: movie.image,
            description: movie.description,
            language: movie.language || undefined,
            cities: movie.cities ? movie.cities.split(",") : undefined,
            showtimes: movie.showtimes.map((s: any) => s.time),
        }))
    } catch (error) {
        console.error("Failed to fetch movies:", error)
        return []
    }
}
