"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, Building2, Wallet, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentOptionsProps {
  amount: number
  onPaymentSuccess: (paymentMethod: string, transactionId: string) => void
}

export function PaymentOptions({ amount, onPaymentSuccess }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Card payment state
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  // UPI payment state
  const [upiId, setUpiId] = useState("")

  // Net banking state
  const [selectedBank, setSelectedBank] = useState("")

  // Digital wallet state
  const [selectedWallet, setSelectedWallet] = useState("")

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
  ]

  const wallets = ["Paytm", "PhonePe", "Google Pay", "Amazon Pay", "Mobikwik"]

  const handlePayment = async () => {
    setIsProcessing(true)

    // Validate based on payment method
    if (paymentMethod === "card") {
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        toast({
          title: "Validation error",
          description: "Please fill in all card details",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        toast({
          title: "Validation error",
          description: "Please enter your UPI ID",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }
    } else if (paymentMethod === "netbanking") {
      if (!selectedBank) {
        toast({
          title: "Validation error",
          description: "Please select a bank",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }
    } else if (paymentMethod === "wallet") {
      if (!selectedWallet) {
        toast({
          title: "Validation error",
          description: "Please select a wallet",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate transaction ID
    const transactionId = `TXN${Date.now().toString().slice(-10)}`

    toast({
      title: "Payment successful!",
      description: `Transaction ID: ${transactionId}`,
    })

    setIsProcessing(false)
    onPaymentSuccess(paymentMethod, transactionId)
  }

  return (
    <Card className="card-cinematic">
      <CardHeader>
        <CardTitle>Choose Payment Method</CardTitle>
        <CardDescription>Select your preferred payment option to complete the booking</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">UPI</span>
            </TabsTrigger>
            <TabsTrigger value="netbanking" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Net Banking</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
          </TabsList>

          {/* Card Payment */}
          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardData.number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "")
                  const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                  setCardData({ ...cardData, number: formatted })
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="JOHN DOE"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardData.expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "")
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2, 4)
                    }
                    setCardData({ ...cardData, expiry: value })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={3}
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            </div>
          </TabsContent>

          {/* UPI Payment */}
          <TabsContent value="upi" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your UPI ID to complete the payment. You'll receive a payment request on your UPI app.
            </p>
          </TabsContent>

          {/* Net Banking */}
          <TabsContent value="netbanking" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Your Bank</Label>
              <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                {banks.map((bank) => (
                  <div key={bank} className="flex items-center space-x-2 rounded-lg border border-border p-3">
                    <RadioGroupItem value={bank} id={bank} />
                    <Label htmlFor={bank} className="flex-1 cursor-pointer">
                      {bank}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          {/* Digital Wallet */}
          <TabsContent value="wallet" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Your Wallet</Label>
              <RadioGroup value={selectedWallet} onValueChange={setSelectedWallet}>
                {wallets.map((wallet) => (
                  <div key={wallet} className="flex items-center space-x-2 rounded-lg border border-border p-3">
                    <RadioGroupItem value={wallet} id={wallet} />
                    <Label htmlFor={wallet} className="flex-1 cursor-pointer">
                      {wallet}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        {/* Amount and Pay Button */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">₹{amount.toLocaleString("en-IN")}</span>
          </div>

          <Button className="w-full h-12 text-base" size="lg" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Pay ₹{amount.toLocaleString("en-IN")}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
