import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BookCard } from "@/components/shared/BookCard";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "New Arrivals | BookSphere",
  description: "Check out the latest books added to the BookSphere library catalog.",
};

export default async function NewArrivalsPage() {
  const supabase = await createClient();
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-background">
        {/* Hero */}
        <section className="bg-black text-white border-b-8 border-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-secondary text-black border-4 border-white px-4 py-1 mb-4 transform -rotate-1">
              <span className="font-heading uppercase text-sm font-black flex items-center gap-2">
                <Sparkles size={18} /> Fresh Off the Shelves
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
              New <span className="text-primary">Arrivals</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              The latest additions to our library collection. Be the first to borrow them!
            </p>
          </div>
        </section>

        {/* Books Grid */}
        <section className="container mx-auto px-4 py-16">
          {books && books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    coverUrl: book.cover_url || "",
                    isAvailable: book.available_count > 0,
                    rackNumber: book.rack_number || "—",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-heading text-2xl uppercase text-muted-foreground">No books yet</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
