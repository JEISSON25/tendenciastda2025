"use client"

import Swal from 'sweetalert2'
import { useState } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Calendar, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("CLIENTE")

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setRole("");
  };

  const handleLogin = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${apiUrl}/usuario/login/`, {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Verifica tu usuario y contraseña.',
      });
      return;
    }

    if (!response.ok) {
      console.error("Error en login:", response.status);
      return;
    }

    const data = await response.json();

    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      showConfirmButton: false,
      timer: 2000,
    });

    setTimeout(() => {
      router.push('/clients');
    }, 2000);
  };

  const handleRegisterUser = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const userData = {
      username,
      password,
      email,
      role,
    };

    try {
      const response = await fetch(`${apiUrl}/usuario/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          typeof errorData === "string"
            ? errorData
            : Object.values(errorData).flat().join("\n");

        await Swal.fire({
          title: "Error al registrar usuario",
          text: errorMessage,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }

      await Swal.fire({
        title: "Usuario registrado",
        text: "El usuario se ha registrado correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      resetForm();

    } catch (error) {
      console.error("Error de red:", error);
      await Swal.fire({
        title: "Error de red",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ReserveFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl">Authentication</CardTitle>
            <CardDescription className="text-center">Choose your preferred method to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    placeholder="Enter your username"
                    className="h-11"
                    onChange={(e) => (setUsername(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 pr-10"
                      onChange={(e) => (setPassword(e.target.value))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-gray-300" />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm">
                    Forgot password?
                  </Button>
                </div>
                <Button className="w-full h-11" onClick={(e) => { handleLogin(e) }}>Sign In</Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input id="registerEmail" type="email" placeholder="john@example.com" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Username">Username</Label>
                  <Input id="Username" type="email" placeholder="jhon.doe" className="h-11" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="h-11 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="rounded border-gray-300" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Button variant="link" className="px-0 text-sm h-auto">
                      Terms of Service
                    </Button>
                  </Label>
                </div>
                <Button className="w-full h-11" onClick={() => handleRegisterUser()}>Create Account</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
