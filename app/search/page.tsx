import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BookCard } from "@/components/shared/BookCard";
import { createClient } from "@/lib/supabase/server";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();
  
  let query = supabase.from("books").select("*").order("created_at", { ascending: false });

  if (category && typeof category === "string") {
    query = query.ilike("genre", `%${category}%`);
  }
  
  if (q && typeof q === "string") {
    query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%`);
  }

  const { data: booksData, error } = await query;

  const books = booksData?.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    coverUrl: book.cover_url || "",
    isAvailable: book.available_count > 0,
    rackNumber: book.rack_number || "Unassigned",
  })) || [];

  const pageTitle = category
    ? `${category} Books`
    : q
    ? `Search: ${q}`
    : "Library Catalog";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-heading text-5xl font-black uppercase tracking-tighter mb-4">
              {pageTitle}
            </h1>
            <div className="h-2 w-24 bg-primary border-2 border-black brutal-shadow-sm"></div>
          </div>
          
          {error && (
            <div className="p-4 bg-destructive text-white font-bold border-4 border-black brutal-shadow mb-8">
              Error loading catalog: {error.message}
            </div>
          )}

          {books.length === 0 && !error ? (
            <div className="p-12 bg-white border-4 border-black brutal-shadow text-center">
              <h2 className="font-heading text-3xl font-black uppercase mb-4">No books found</h2>
              <p className="text-muted-foreground font-medium text-lg">
                We couldn&apos;t find any books matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
