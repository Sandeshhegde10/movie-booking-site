"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function TestAuthPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const { toast } = useToast()

    const handleRegister = async () => {
        try {
            const { registerUser } = await import("@/app/actions/auth")
            const result = await registerUser(email, password, name)

            if (result.success) {
                toast({
                    title: "✅ Success!",
                    description: `User created! Check MongoDB Atlas to see ${email} in the database.`,
                })
            } else {
                toast({
                    title: "❌ Error",
                    description: result.error,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "❌ Error",
                description: "Failed to register",
                variant: "destructive",
            })
        }
    }

    const handleLogin = async () => {
        try {
            const { loginUser } = await import("@/app/actions/auth")
            const result = await loginUser(email, password)

            if (result.success) {
                toast({
                    title: "✅ Login Success!",
                    description: `Welcome back! User found in database.`,
                })
            } else {
                toast({
                    title: "❌ Login Failed",
                    description: result.error,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "❌ Error",
                description: "Failed to login",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-8 p-8 border rounded-lg bg-card">
                <div>
                    <h1 className="text-3xl font-bold text-center">🧪 Test MongoDB Auth</h1>
                    <p className="text-center text-muted-foreground mt-2">
                        Test user registration and login with MongoDB
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="test@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            placeholder="password123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Button onClick={handleRegister} className="w-full">
                            📝 Register (Create User in MongoDB)
                        </Button>
                        <Button onClick={handleLogin} variant="outline" className="w-full">
                            🔑 Login (Check if User Exists)
                        </Button>
                    </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
                    <p className="font-semibold">✅ After clicking "Register":</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>User will be created in MongoDB</li>
                        <li>Go to MongoDB Atlas</li>
                        <li>Click "Browse Collections"</li>
                        <li>Select "cinema" → "users"</li>
                        <li>You'll see your email there!</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
