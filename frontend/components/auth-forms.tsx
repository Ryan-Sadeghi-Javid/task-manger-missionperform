// frontend/components/auth-forms.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState("login")
  const { login, register, error } = useAuth()

  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Handles login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    try {
      setLoading(true)
      await login(loginData.username, loginData.password)
    } finally {
      setLoading(false)
    }
  }

  // Handles register form submission
    const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (registerData.password !== registerData.confirmPassword) {
        setFormError("Passwords do not match")
        return
    }

    if (registerData.username.trim().length < 3) {
        setFormError("Username must be at least 3 characters")
        return
    }

    if (registerData.password.length < 6) {
    setFormError("Password must be at least 6 characters long")
    return
    }

    try {
        setLoading(true)
        await register(registerData.username, registerData.password)

        // If register succeeds, optionally clear fields
        setRegisterData({ username: "", password: "", confirmPassword: "" })
    } catch (err: unknown) {
      setActiveTab("register")

      let errorMessage = "Registration failed. Please try again."

      if (err instanceof Error) {
        errorMessage = err.message
      }

      setFormError(errorMessage)
    } finally {
      setLoading(false)
    }
    }


  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
          <CardDescription>
            Power your productivity with MissionPerform’s task management solution.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Display error messages */}
            {(error || formError) && (
            <Alert
                variant="destructive"
                className="mt-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
            >
                <AlertDescription>{formError || error}</AlertDescription>
            </Alert>
            )}
            {/* Login form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Register form */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose a unique username"
                    required
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Username must be unique and at least 3 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Switch login/register tab */}
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}