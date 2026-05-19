import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BookCard } from "@/components/shared/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Users, Library, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = [
  "Mathematics",
  "Data Structures",
  "Operating Systems",
  "Computer Organization",
  "Algorithms",
  "Software Engineering",
  "Database Management",
  "Biology",
  "Humanities / Ethics",
];

export default async function Home() {
  const supabase = await createClient();

  // Fetch the 4 most recently added books as featured
  const { data: booksData } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  const featuredBooks = booksData?.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    coverUrl: book.cover_url || "",
    isAvailable: book.available_count > 0,
    rackNumber: book.rack_number || "Unassigned",
  })) || [];

  // Get total counts for stats
  const { count: totalBooks } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });

  const { data: availableData } = await supabase
    .from("books")
    .select("available_count");

  const totalAvailable = availableData?.reduce(
    (sum: number, book: any) => sum + (book.available_count || 0),
    0
  ) || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full bg-gradient-wero border-b-8 border-black overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block bg-white border-4 border-black px-6 py-2 brutal-shadow mb-4 rotate-[-2deg]">
                <span className="font-heading uppercase text-xl font-black">University Library 2.0</span>
              </div>
              
              <h1 className="font-heading text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black">
                Find your next <br />
                <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">big idea.</span>
              </h1>
              
              <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto border-2 border-black bg-white/90 p-4 brutal-shadow-sm">
                Access our collection of academic textbooks, reference materials, and journals. Search, borrow, and read.
              </p>
              
              {/* Search Bar in Hero */}
              <form action="/search" method="GET" className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mt-12 bg-white p-4 border-4 border-black brutal-shadow">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                  <Input 
                    name="q"
                    placeholder="Search by title or author..." 
                    className="h-16 pl-14 text-lg font-medium border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>
                <Button type="submit" className="h-16 px-8 font-heading uppercase text-xl border-2 border-black bg-accent text-black hover:bg-accent/90 brutal-shadow-sm brutal-hover rounded-none">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="py-20 bg-muted border-b-8 border-black">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Total Books", value: String(totalBooks || 0), icon: BookOpen, color: "bg-primary" },
                { label: "Genres", value: String(CATEGORIES.length), icon: Users, color: "bg-secondary" },
                { label: "Available Now", value: String(totalAvailable), icon: Library, color: "bg-accent" },
                { label: "Semesters", value: "III & IV", icon: ArrowRight, color: "bg-blue-300" },
              ].map((stat, i) => (
                <div key={i} className={`flex items-center gap-6 p-6 bg-white border-4 border-black brutal-shadow brutal-hover transition-transform`}>
                  <div className={`p-4 border-4 border-black ${stat.color} brutal-shadow-sm`}>
                    <stat.icon size={32} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-heading uppercase text-sm text-muted-foreground">{stat.label}</h4>
                    <p className="font-heading text-4xl font-black uppercase">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED BOOKS */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-heading text-5xl font-black uppercase tracking-tighter mb-4">
                  New Arrivals
                </h2>
                <div className="h-2 w-24 bg-primary border-2 border-black brutal-shadow-sm"></div>
              </div>
              <Link href="/search">
                <Button variant="outline" className="hidden md:flex gap-2 font-heading uppercase border-4 border-black brutal-shadow-sm brutal-hover rounded-none h-12 px-6">
                  View All Catalog <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
            
            {featuredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="p-12 bg-white border-4 border-black brutal-shadow text-center">
                <h3 className="font-heading text-2xl font-black uppercase mb-2">No books yet</h3>
                <p className="text-muted-foreground font-medium">Run the seed script to populate the catalog.</p>
              </div>
            )}
            
            <Link href="/search" className="md:hidden mt-8 block">
              <Button variant="outline" className="w-full gap-2 font-heading uppercase border-4 border-black brutal-shadow-sm brutal-hover rounded-none h-14">
                View All Catalog <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-24 bg-black text-white border-y-8 border-primary">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-5xl font-black uppercase tracking-tighter mb-12 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {CATEGORIES.map((category, i) => (
                <Link key={i} href={`/search?category=${encodeURIComponent(category)}`}>
                  <div className="group border-4 border-white p-6 hover:bg-white hover:text-black transition-colors brutal-shadow-sm cursor-pointer h-32 flex items-center justify-center text-center">
                    <span className="font-heading uppercase text-xl font-bold group-hover:scale-110 transition-transform">
                      {category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 relative overflow-hidden bg-secondary border-b-8 border-black">
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary border-4 border-black rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent border-4 border-black rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 max-w-3xl mx-auto">
              Ready to start reading?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/login">
                <Button className="w-full sm:w-auto h-16 px-10 font-heading uppercase text-xl border-4 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow brutal-hover rounded-none">
                  Student Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 font-heading uppercase text-xl border-4 border-black bg-white text-black hover:bg-gray-100 brutal-shadow brutal-hover rounded-none">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
