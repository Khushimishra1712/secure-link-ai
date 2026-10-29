"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginUser(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] opacity-70" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] opacity-70" />
      
      <Card className="w-full max-w-[420px] z-10 bg-card/40 backdrop-blur-2xl border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl p-2">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2 mt-4">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-primary drop-shadow-md" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Log in to your SecureLink AI account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5 px-2">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@securelink.ai"
                required
                className="h-12 px-4 rounded-xl bg-background/50 border-white/10 focus-visible:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-muted-foreground">Password</Label>
                <Link href="#" className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 px-4 rounded-xl bg-background/50 border-white/10 focus-visible:ring-primary/50 transition-all"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-md font-semibold mt-2 group" disabled={isPending}>
              {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Sign In"}
              {!isPending && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">
                <span className="bg-card/40 px-3 text-muted-foreground backdrop-blur-md rounded-full border border-white/5 py-1">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full h-12 rounded-xl bg-background/40 border-white/10 hover:bg-background/80 font-semibold" disabled>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
