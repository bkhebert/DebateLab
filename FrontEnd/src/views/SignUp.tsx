import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Label } from '@radix-ui/react-label';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import useAuth from '../contexts/useAuth';
import DisclaimerCard from '../components/Disclaimer';

const SignUp = () => {
  const navigate = useNavigate();
    const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const[username, setUsername] = useState('');
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !username) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const success = await signup(email, password, username);
      if (success) {
        
        navigate('/onboarding');
      } else {
        setError("Failed to create account. Email may already exist.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError("Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (   <div className="max-w-sm mx-auto mb-10 md:mt-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 dark:bg-cstmdarkaccent dark:text-white">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">Create Your Account</h2>
                    <p className="text-slate-600 dark:text-white">The best way to use this app is to be honest about who you are and what you believe in. </p>
                    
                  </div>

                  <div className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm dark:text-cstmred">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-900 font-medium dark:text-white">Email Address</Label>
                      <Input  
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12  dark:text-white border-slate-300 dark:bg-primary focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
   <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-900 font-medium dark:text-white">Username</Label>
                      <Input  
                        type="username"
                        id="username"
                        placeholder="bigbrainmansplain"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full h-12 border-slate-300 focus:border-blue-500 dark:bg-primary focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2 dark:text-white">
                      <Label htmlFor="password" className="text-slate-900 font-medium dark:text-white">Password</Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 border-slate-300 dark:bg-primary focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-900 font-medium dark:text-white">Confirm Password</Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 border-slate-300 dark:bg-primary focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                        onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
                      />
                    </div>

                    <div className="space-y-4 pt-2 dark:text-white">
                      <Button 
                        className="w-full bg-covenantLight hover:bg-primary dark:bg-neonBlue text-white font-semibold py-3 h-12 rounded-xl"
                        onClick={handleSignUp}
                        disabled={isSubmitting}
                      >
                        <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                        {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-300"></div>
                        </div>

                      </div>
                      
                      {/* <Button
                        variant="outline"
                        className="w-full h-12 border-slate-300 hover:bg-slate-50 rounded-xl"
                        onClick={() => window.location.href = `${baseURL}/auth/google`}
                      >
                        <FcGoogle className="text-xl mr-2" />
                        Sign up with Google
                      </Button> */}
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 text-center space-y-4">
                
                  <div className="flex justify-center items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      <span className="text-xs">Bank-level security</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs">GDPR compliant</span>
                    </div>
                  </div>
                </div>
              </div>);
}

export default SignUp