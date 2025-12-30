"use server"

import { allMovies } from "@/lib/all-movies-data"
import type { Movie } from "@/lib/types"

export async function getMovies(): Promise<Movie[]> {
    try {
        // Return movies directly from static data
        // This works on both local and production without database setup
        return allMovies
    } catch (error) {
        console.error("Failed to fetch movies:", error)
        return []
    }
}
