"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const adminId = formData.get("adminId") as string;
    const password = formData.get("password") as string;
    
    const supabase = createClient();
    const email = adminId.includes("@") ? adminId : `${adminId}@college.edu`;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      alert(authError?.message || "Invalid credentials");
      setIsLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      alert("Access denied. You do not have admin privileges.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    login({
      id: userData.student_id,
      name: `${userData.first_name} ${userData.last_name}`,
      email: email,
      role: "admin",
    });
    
    setIsLoading(false);
    router.push("/admin");
  };

  return (
    <div className="bg-black text-white border-4 border-primary brutal-shadow p-8 w-full">
      <div className="mb-8 border-b-4 border-primary pb-6 relative">
        <div className="absolute top-0 right-0 p-3 bg-primary border-2 border-white rounded-full">
          <ShieldCheck size={32} className="text-black" />
        </div>
        <div className="inline-block bg-primary text-black border-2 border-white px-3 py-1 mb-4 transform rotate-2">
          <span className="font-heading uppercase text-xs font-black">Staff Only</span>
        </div>
        <h1 className="font-heading text-4xl font-black uppercase tracking-tighter text-white">System Admin</h1>
        <p className="text-gray-400 mt-2 font-medium">Restricted access to management portal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="adminId" className="font-heading uppercase text-sm font-bold text-gray-300">Staff ID</Label>
          <Input 
            id="adminId" 
            name="adminId"
            placeholder="e.g. ADM001" 
            required 
            className="h-12 bg-gray-900 border-2 border-white text-white rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg placeholder:text-gray-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-heading uppercase text-sm font-bold text-gray-300">Master Password</Label>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              required 
              className="h-12 bg-gray-900 border-2 border-white text-white rounded-none focus-visible:ring-0 focus-visible:border-primary text-lg pr-12 placeholder:text-gray-600"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white hover:bg-transparent rounded-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 font-heading uppercase text-lg border-2 border-white bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-active rounded-none transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Authenticate"}
        </Button>
      </form>

      <div className="mt-8 text-center border-t-2 border-gray-800 pt-6">
        <div className="mt-4">
          <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-white uppercase underline decoration-2 underline-offset-4 transition-colors">
            Return to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
