"use client";

import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { BookCard } from "@/components/shared/BookCard";
import { BookOpen, CalendarClock, History, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [stats, setStats] = useState({ borrowed: 0, pending: 0, dueSoon: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Fetch borrow requests for this user
      const { data: requests } = await supabase
        .from("borrow_requests")
        .select("*, books(*)")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (requests) {
        const approved = requests.filter(r => r.status === "approved");
        const pending = requests.filter(r => r.status === "pending");

        const borrowedMapped = approved.map(r => ({
          id: r.books?.id || r.id,
          title: r.books?.title || "Unknown",
          author: r.books?.author || "Unknown",
          genre: r.books?.genre || "N/A",
          coverUrl: r.books?.cover_url || "",
          isAvailable: false,
          rackNumber: r.books?.rack_number || "Unassigned",
        }));

        setBorrowedBooks(borrowedMapped);
        setStats({
          borrowed: approved.length,
          pending: pending.length,
          dueSoon: approved.filter(r => {
            if (!r.due_date) return false;
            const due = new Date(r.due_date);
            const now = new Date();
            const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return diff <= 3 && diff >= 0;
          }).length,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-4 border-black p-6 brutal-shadow-sm">
        <div>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tighter">
            Welcome, {user?.name?.split(' ')[0] || "Student"}!
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Here&apos;s what&apos;s happening with your library account.</p>
        </div>
        <Link href="/student/search">
          <Button className="font-heading uppercase border-2 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-hover rounded-none">
            Explore Catalog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Currently Borrowed", value: String(stats.borrowed), icon: BookOpen, color: "bg-accent" },
          { label: "Pending Requests", value: String(stats.pending), icon: History, color: "bg-secondary" },
          { label: "Due Soon", value: String(stats.dueSoon), icon: CalendarClock, color: "bg-primary" },
          { label: "Unread Notifications", value: "0", icon: Bell, color: "bg-blue-300" },
        ].map((stat, i) => (
          <div key={i} className={`flex items-center gap-4 p-5 bg-white border-4 border-black brutal-shadow-sm brutal-hover transition-transform`}>
            <div className={`p-3 border-4 border-black ${stat.color} rounded-sm`}>
              <stat.icon size={24} className="text-black" />
            </div>
            <div>
              <p className="font-heading text-3xl font-black uppercase">{stat.value}</p>
              <h4 className="font-heading uppercase text-xs text-muted-foreground font-bold">{stat.label}</h4>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-heading text-2xl font-black uppercase tracking-tighter mb-6">
          Currently Reading
        </h2>
        
        {borrowedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-black p-12 text-center brutal-shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-heading text-xl font-black uppercase mb-2">No Books Borrowed</h3>
            <p className="text-muted-foreground font-medium mb-6">Browse the catalog to find your next read!</p>
            <Link href="/student/search">
              <Button className="font-heading uppercase border-2 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow-sm rounded-none">
                Browse Catalog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
