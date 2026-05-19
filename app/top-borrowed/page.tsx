import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpen, Trophy } from "lucide-react";

export const metadata = {
  title: "Top Borrowed | BookSphere",
  description: "See which books are the most popular among students at BookSphere.",
};

export default async function TopBorrowedPage() {
  const supabase = await createClient();

  // Get books with borrow counts
  const { data: borrowCounts } = await supabase
    .from("borrow_requests")
    .select("book_id, books(id, title, author, genre, rack_number, cover_url, available_count, inventory_count)")
    .in("status", ["approved", "returned"]);

  // Aggregate borrow counts per book
  const bookMap = new Map<string, { book: any; count: number }>();
  borrowCounts?.forEach((req: any) => {
    if (req.books) {
      const existing = bookMap.get(req.book_id);
      if (existing) {
        existing.count++;
      } else {
        bookMap.set(req.book_id, { book: req.books, count: 1 });
      }
    }
  });

  const topBooks = Array.from(bookMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-background">
        {/* Hero */}
        <section className="bg-black text-white border-b-8 border-accent py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-primary text-black border-4 border-white px-4 py-1 mb-4 transform rotate-1">
              <span className="font-heading uppercase text-sm font-black flex items-center gap-2">
                <TrendingUp size={18} /> Most Popular
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
              Top <span className="text-accent">Borrowed</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              The most requested books in our library. See what everyone is reading!
            </p>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="container mx-auto px-4 py-16">
          {topBooks.length > 0 ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {topBooks.map((item, index) => (
                <div
                  key={item.book.id}
                  className={`flex items-center gap-6 p-6 border-4 border-black bg-white brutal-shadow-sm hover:brutal-shadow transition-all ${
                    index === 0 ? "border-accent bg-accent/10" : ""
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-14 h-14 flex-shrink-0 flex items-center justify-center border-4 border-black font-heading text-2xl font-black ${
                      index === 0
                        ? "bg-accent text-black"
                        : index === 1
                        ? "bg-secondary text-black"
                        : index === 2
                        ? "bg-primary text-black"
                        : "bg-muted text-black"
                    }`}
                  >
                    {index === 0 ? <Trophy size={28} /> : `#${index + 1}`}
                  </div>

                  {/* Book Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-heading text-xl font-black uppercase leading-tight truncate">
                      {item.book.title}
                    </h3>
                    <p className="text-muted-foreground font-medium">{item.book.author}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="rounded-none border-2 border-black font-heading uppercase text-[10px]">
                        {item.book.genre}
                      </Badge>
                      {item.book.rack_number && (
                        <span className="text-xs text-muted-foreground font-bold">Rack: {item.book.rack_number}</span>
                      )}
                    </div>
                  </div>

                  {/* Borrow Count */}
                  <div className="flex-shrink-0 text-center">
                    <p className="font-heading text-3xl font-black text-primary">{item.count}</p>
                    <p className="font-heading uppercase text-[10px] text-muted-foreground font-bold">Borrows</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-4 border-black brutal-shadow max-w-2xl mx-auto">
              <BookOpen size={64} className="mx-auto text-gray-300 mb-6" />
              <h3 className="font-heading text-2xl uppercase mb-2">No Data Yet</h3>
              <p className="text-muted-foreground font-medium text-lg">
                Once students start borrowing books, the leaderboard will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
