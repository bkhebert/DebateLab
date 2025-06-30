import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/Input";
import useAuth from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import baseURL from "../constants/constant";
import { Link } from "react-router-dom";
import { 
  Card,   
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from "../components/ui/Card";
import { ArrowRight, Shield } from 'lucide-react';
interface FormState {
  email: string;
  password: string;
}

const SignIn = () => {

    const { user, login } = useAuth();
 // Local state for any error message
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [form, setForm] = useState<FormState>({ email: "", password: "" });
    useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

    const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {

        navigate('/');
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      <Card className="w-full max-w-sm bg-cstmwhite">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
          {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
        </CardDescription>
        <CardAction>
          <Link to="/signUp"><Button className="bg-cstmblack text-cstmwhite"variant="link">Sign Up</Button></Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" 
              value={password}
               onChange={(e) => setPassword(e.target.value)}
               disabled={isSubmitting}
               required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full text-white"
        onClick={handleLogin}
        disabled={isSubmitting}>
          <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
         {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
        </Button>

      </CardFooter>
    </Card>
    </div>
    );
    
}

export default SignIn