import { PrismaClient } from "@prisma/client"
import { allMovies } from "../lib/all-movies-data"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Clear existing data
  await prisma.showtime.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.movie.deleteMany()

  for (const movieData of allMovies) {
    console.log(`Creating movie: ${movieData.title}`)
    
    // Create the movie
    const movie = await prisma.movie.create({
      data: {
        id: movieData.id,
        title: movieData.title,
        genre: movieData.genre,
        duration: movieData.duration,
        rating: movieData.rating,
        image: movieData.image,
        description: movieData.description,
        language: movieData.language,
        cities: movieData.cities?.join(",") || "",
      },
    })

    // Create showtimes for the movie
    if (movieData.showtimes) {
      for (const time of movieData.showtimes) {
        await prisma.showtime.create({
          data: {
            time: time,
            movieId: movie.id,
          },
        })
      }
    }
  }

  console.log("Seeding finished.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
