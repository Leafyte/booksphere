"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { 
  BookOpen, 
  LayoutDashboard, 
  LogOut,
  Library,
  BookmarkCheck
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isStudent = user?.role === "student";

  const studentLinks = [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "Search Books", href: "/student/search", icon: BookOpen },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Books", href: "/admin/books", icon: Library },
    { name: "Borrow Requests", href: "/admin/requests", icon: BookmarkCheck },
  ];

  const links = isStudent ? studentLinks : adminLinks;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r-4 border-black flex flex-col h-[calc(100vh-5rem)] sticky top-20">
      <div className="p-6 border-b-4 border-black">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-none border-2 border-black brutal-shadow-sm flex items-center justify-center font-heading text-xl font-black uppercase ${isStudent ? 'bg-primary' : 'bg-secondary'}`}>
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-heading font-black uppercase truncate">{user?.name || "User"}</p>
            <p className="text-xs font-medium text-muted-foreground uppercase truncate">
              {isStudent ? "Student Portal" : "Admin Portal"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all group ${
                isActive
                  ? `border-black ${isStudent ? 'bg-accent' : 'bg-primary'} brutal-shadow-sm`
                  : "border-transparent hover:border-black hover:bg-muted"
              }`}
            >
              <link.icon 
                size={20} 
                className={isActive ? "text-black" : "text-gray-500 group-hover:text-black"} 
              />
              <span className={`font-heading uppercase text-sm font-bold tracking-wide ${
                isActive ? "text-black" : "text-gray-600 group-hover:text-black"
              }`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-4 border-black space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 border-2 border-transparent hover:border-black hover:bg-destructive/10 transition-all group text-left"
        >
          <LogOut size={20} className="text-destructive group-hover:text-destructive" />
          <span className="font-heading uppercase text-sm font-bold tracking-wide text-destructive group-hover:text-destructive">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
