import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/contants/contants.ts";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
          `${BASE_URL}/users/login`,
          { email, password, role: "USER" },
          { withCredentials: true }
      );

      // Assuming response contains { userId, authToken }
      const { userId, authToken } = response.data;

      localStorage.setItem("userId", userId);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userEmail", email);

      console.log("Login successful:", response.data);
      navigate("/dashboard"); // redirect to dashboard after login
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-glow">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-white">Izabi</span>
            </Link>
            <p className="text-white/80 mt-2">Welcome back to your learning journey</p>
          </div>

          {/* Login Form */}
          <Card className="shadow-float border-0 bg-card/95 backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background/50"
                  />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:text-primary-glow font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded bg-gradient-primary"
                aria-label="Izabi Logo"
              >
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="bg-gradient-hero bg-clip-text text-lg font-bold text-transparent">
                Izabi
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Izabi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Login;
