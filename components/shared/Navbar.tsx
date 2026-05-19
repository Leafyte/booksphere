"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, login, logout } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    
    // Check active session
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser && !isAuthenticated) {
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
          });
      } else if (!authUser && isAuthenticated) {
        logout();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthenticated, login, logout]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/search" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-white brutal-shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 brutal-hover">
          <div className="bg-primary p-2 border-2 border-black rounded-sm brutal-shadow-sm">
            <Library size={24} className="text-black" />
          </div>
          <span className="font-heading text-2xl font-black uppercase tracking-tighter hidden sm:block">
            Book<span className="text-primary">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-heading uppercase text-sm tracking-wide px-3 py-1 border-2 transition-all ${
                  pathname === link.href
                    ? "border-black bg-secondary brutal-shadow-sm"
                    : "border-transparent hover:border-black hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="border-2 border-black brutal-shadow-sm brutal-hover rounded-none">
              <Search size={18} />
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href={user?.role === "admin" ? "/admin" : "/student"}>
                  <Button className="font-heading uppercase border-2 border-black bg-accent text-black hover:bg-accent/90 brutal-shadow-sm brutal-hover rounded-none">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    logout();
                  }} 
                  variant="outline" 
                  className="font-heading uppercase border-2 border-black brutal-shadow-sm brutal-hover rounded-none"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="outline" className="font-heading uppercase border-2 border-black brutal-shadow-sm brutal-hover rounded-none">
                    Student Login
                  </Button>
                </Link>
                <Link href="/admin-login">
                  <Button className="font-heading uppercase border-2 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-hover rounded-none">
                    Admin Access
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden border-2 border-black brutal-shadow-sm rounded-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-4 border-black bg-white overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-heading uppercase text-lg p-3 border-2 ${
                    pathname === link.href
                      ? "border-black bg-secondary brutal-shadow-sm"
                      : "border-transparent hover:border-black"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-1 bg-black w-full my-2"></div>
              {isAuthenticated ? (
                <>
                  <Link href={user?.role === "admin" ? "/admin" : "/student"} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full font-heading uppercase border-2 border-black bg-accent text-black brutal-shadow-sm rounded-none py-6 text-lg">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={async () => { 
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      logout(); 
                      setIsMobileMenuOpen(false); 
                    }} 
                    variant="outline" 
                    className="w-full font-heading uppercase border-2 border-black brutal-shadow-sm rounded-none py-6 text-lg"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-heading uppercase border-2 border-black brutal-shadow-sm rounded-none py-6 text-lg">
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/admin-login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full font-heading uppercase border-2 border-black bg-primary text-black brutal-shadow-sm rounded-none py-6 text-lg">
                      Admin Access
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
