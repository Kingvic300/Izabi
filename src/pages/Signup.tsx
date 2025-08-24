import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // ✅ Redirect to OTP page with user data; OTP will be sent there
    navigate("/otp", {
      state: {
        email: formData.email,
        password: formData.password,
        mode: "verification", // for OTP page to know this is for signup
      },
    });
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
            <p className="text-white/80 mt-2">Start your AI-powered learning journey</p>
          </div>

          {/* Signup Form */}
          <Card className="shadow-float border-0 bg-card/95 backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Join thousands of students already using Izabi</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                  />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    variant="hero"
                    disabled={!formData.email || !formData.password || !formData.confirmPassword}
                >
                  Request OTP
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:text-primary-glow font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Signup;
