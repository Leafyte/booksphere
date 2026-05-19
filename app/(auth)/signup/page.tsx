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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const studentId = formData.get("studentId") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const supabase = createClient();
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          student_id: studentId,
          role: "student",
        },
      },
    });

    if (authError || !authData.user) {
      alert(authError?.message || "Signup failed");
      setIsLoading(false);
      return;
    }

    login({
      id: studentId,
      name: `${firstName} ${lastName}`,
      email: email,
      role: "student",
    });
    
    setIsLoading(false);
    router.push("/student");
  };

  return (
    <div className="bg-white border-4 border-black brutal-shadow p-8 w-full">
      <div className="mb-8 border-b-4 border-black pb-6">
        <div className="inline-block bg-secondary border-2 border-black px-3 py-1 mb-4 transform rotate-2">
          <span className="font-heading uppercase text-xs font-black">New Registration</span>
        </div>
        <h1 className="font-heading text-4xl font-black uppercase tracking-tighter">Join the Library</h1>
        <p className="text-muted-foreground mt-2 font-medium">Create your student account to borrow books.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-heading uppercase text-sm font-bold">First Name</Label>
            <Input 
              id="firstName" 
              name="firstName"
              placeholder="Alex" 
              required 
              className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-heading uppercase text-sm font-bold">Last Name</Label>
            <Input 
              id="lastName" 
              name="lastName"
              placeholder="Smith" 
              required 
              className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentId" className="font-heading uppercase text-sm font-bold">Student ID</Label>
          <Input 
            id="studentId" 
            name="studentId"
            placeholder="STU12345" 
            required 
            className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-heading uppercase text-sm font-bold">College Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email"
            placeholder="alex@college.edu" 
            required 
            className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-heading uppercase text-sm font-bold">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              required 
              className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary pr-12"
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
          className="w-full h-14 font-heading uppercase text-lg border-2 border-black bg-accent text-black hover:bg-accent/90 brutal-shadow-sm brutal-active rounded-none transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
        </Button>
      </form>

      <div className="mt-8 text-center border-t-2 border-black pt-6">
        <p className="font-medium text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-heading uppercase font-bold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
