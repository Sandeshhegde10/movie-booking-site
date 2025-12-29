"use server"

import { stripe } from "@/lib/stripe"

export async function startCheckoutSession(amount: number, description: string, metadata: Record<string, string>) {
  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const amountInINR = Math.round(amount * 83 * 100) // Convert to paise

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "inr", // INR currency
          product_data: {
            name: "Movie Booking",
            description: description,
          },
          unit_amount: amountInINR,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: metadata,
  })

  return session.client_secret
}
