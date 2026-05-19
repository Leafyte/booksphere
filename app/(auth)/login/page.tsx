"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const studentId = formData.get("studentId") as string;
    const password = formData.get("password") as string;
    
    const supabase = createClient();
    
    const email = studentId.includes("@") ? studentId : `${studentId}@college.edu`;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      alert(authError?.message || "Login failed");
      setIsLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError || !userData) {
      alert("Failed to fetch user profile");
      setIsLoading(false);
      return;
    }

    login({
      id: userData.student_id,
      name: `${userData.first_name} ${userData.last_name}`,
      email: email,
      role: userData.role,
    });
    
    setIsLoading(false);
    
    if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/student");
    }
  };

  return (
    <div className="bg-white border-4 border-black brutal-shadow p-8 w-full">
      <div className="mb-8 border-b-4 border-black pb-6">
        <div className="inline-block bg-accent border-2 border-black px-3 py-1 mb-4 transform -rotate-2">
          <span className="font-heading uppercase text-xs font-black">Student Access</span>
        </div>
        <h1 className="font-heading text-4xl font-black uppercase tracking-tighter">Welcome Back</h1>
        <p className="text-muted-foreground mt-2 font-medium">Enter your credentials to access the library catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="studentId" className="font-heading uppercase text-sm font-bold">Student ID</Label>
          <Input 
            id="studentId" 
            name="studentId"
            placeholder="e.g. STU12345" 
            required 
            className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-heading uppercase text-sm font-bold">Password</Label>
            <Link href="#" className="text-xs font-bold text-primary hover:underline uppercase">Forgot?</Link>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              required 
              className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent rounded-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 font-heading uppercase text-lg border-2 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-active rounded-none transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center border-t-2 border-black pt-6">
        <p className="font-medium text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="font-heading uppercase font-bold text-primary hover:underline">
            Create One
          </Link>
        </p>
        <div className="mt-4">
          <Link href="/admin-login" className="text-xs font-bold text-muted-foreground hover:text-black uppercase underline decoration-2 underline-offset-4">
            Are you an administrator?
          </Link>
        </div>
      </div>
    </div>
  );
}
