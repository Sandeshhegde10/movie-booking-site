"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(email: string, password: string, name: string) {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { success: false, error: "User already exists" }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user in database
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        })

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    } catch (error) {
        console.error("Registration error:", error)
        return { success: false, error: "Failed to create account" }
    }
}

export async function loginUser(email: string, password: string) {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { success: false, error: "Invalid email or password" }
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return { success: false, error: "Invalid email or password" }
        }

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    } catch (error) {
        console.error("Login error:", error)
        return { success: false, error: "Login failed" }
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: {
                        movie: true,
                        showtime: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (!user) {
            return null
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            bookings: user.bookings.map(booking => ({
                id: booking.id,
                movieTitle: booking.movie.title,
                movieImage: booking.movie.image,
                date: booking.createdAt.toISOString().split('T')[0],
                showtime: booking.showtime.time,
                seats: JSON.parse(booking.seats),
                totalAmount: booking.total,
                status: booking.status,
            }))
        }
    } catch (error) {
        console.error("Failed to get user profile:", error)
        return null
    }
}
