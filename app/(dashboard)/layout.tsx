"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, login } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!authUser) {
        // Not authenticated at all — redirect to login
        if (pathname.startsWith("/admin")) {
          router.push("/admin-login");
        } else {
          router.push("/login");
        }
        return;
      }

      // User is authenticated in Supabase but Zustand store may be empty
      if (!isAuthenticated) {
        supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single()
          .then(({ data: userData }) => {
            if (userData) {
              login({
                id: userData.student_id,
                name: `${userData.first_name} ${userData.last_name}`,
                email: authUser.email || "",
                role: userData.role,
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });
  }, [isAuthenticated, login, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="animate-spin mx-auto text-primary" />
          <p className="font-heading uppercase text-lg font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Navbar />
      <div className="flex flex-grow max-w-[1600px] mx-auto w-full">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
