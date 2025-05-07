import React, { useState } from 'react';
import { cn } from "@/lib/utils"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import config from '@/config/config';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleSuccess, handleGoogleError } from "@/utils/googleAuthUtils";

export function LoginForm({
  className,
  ...props

}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.backendUrl}/login`, { email, password });

      if (response.data.data) {
        localStorage.setItem('token', response.data.data);
        setMessage(response.data.message || 'Login successful!');
        setIsError(false);
        const role = jwtDecode<{ role: string }>(response.data.data);
        if (role.role == 'admin') {
          navigate('/admin-dashboard'); // Redirect to admin dashboard
        } else {
          navigate('/dashboard');
        }
      } else {
        setMessage(response.data.message || 'Login failed. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      // console.error('Error logging in:', error);
      setIsError(true);
      setMessage('Invalid Credatials.');
    }
  };
  const handelSignUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/signup')
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                // required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse, setMessage, setIsError, navigate)}
                  onError={() => handleGoogleError(setMessage, setIsError)}
                  useOneTap
                  theme="filled_black"
                  text="continue_with"
                  shape="pill"
                />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" onClick={handelSignUp} className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
          {message && (
            <div className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}