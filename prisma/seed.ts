import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { allMovies } from "../lib/all-movies-data"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Clear existing data
  await prisma.showtime.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.user.deleteMany()

  for (const movieData of allMovies) {
    console.log(`Creating movie: ${movieData.title}`)
    
    // Create the movie (let MongoDB auto-generate the ID)
    const movie = await prisma.movie.create({
      data: {
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

  // Create test users
  console.log("Creating test users...")
  const testUsers = [
    { email: "user@example.com", name: "John Doe", password: "password123" },
    { email: "test@test.com", name: "Test User", password: "test123" },
  ]

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      },
    })
    console.log(`✅ Created user: ${userData.email} (password: ${userData.password})`)
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
