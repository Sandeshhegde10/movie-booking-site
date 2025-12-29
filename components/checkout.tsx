"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  amount: number
  description: string
  metadata: Record<string, string>
  onSuccess?: () => void
}

export default function Checkout({ amount, description, metadata }: CheckoutProps) {
  const fetchClientSecret = useCallback(
    () => startCheckoutSession(amount, description, metadata),
    [amount, description, metadata],
  )

  return (
    <div id="checkout" className="w-full rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
