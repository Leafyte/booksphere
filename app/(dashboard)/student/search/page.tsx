"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/shared/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

const GENRES = ["All", "Mathematics", "Data Structures", "Operating Systems", "Computer Organization", "Algorithms", "Software Engineering", "Database Management", "Biology", "Humanities / Ethics"];

export default function SearchBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("title", { ascending: true });

    if (data) {
      setBooks(data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        coverUrl: book.cover_url || "",
        isAvailable: book.available_count > 0,
        rackNumber: book.rack_number || "Unassigned",
      })));
    }
    setIsLoading(false);
  };

  const handleBorrow = async (bookId: string) => {
    setBorrowingId(bookId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to borrow books.");
      setBorrowingId(null);
      return;
    }

    const { error } = await supabase
      .from("borrow_requests")
      .insert({
        book_id: bookId,
        user_id: user.id,
        status: "pending",
      });

    if (error) {
      alert("Failed to submit borrow request: " + error.message);
    } else {
      alert("Borrow request submitted! An admin will approve it shortly.");
    }
    setBorrowingId(null);
  };

  // Filtering logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchesAvailability = showOnlyAvailable ? book.isAvailable : true;
    
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-5xl font-black uppercase tracking-tighter">Library Catalog</h1>
          <p className="text-muted-foreground font-medium mt-2">Search and filter through our collection of resources.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Bar & Mobile Filter Toggle */}
        <div className="flex-grow flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author..." 
              className="h-14 pl-14 text-lg font-medium border-4 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary brutal-shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            className="h-14 px-6 border-4 border-black brutal-shadow-sm rounded-none lg:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal size={24} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 flex-shrink-0 space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border-4 border-black p-6 brutal-shadow-sm">
            <h3 className="font-heading uppercase text-lg font-black border-b-4 border-black pb-4 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={20} /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-heading uppercase text-sm font-bold mb-3">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 border-2 border-black flex items-center justify-center brutal-shadow-sm transition-colors ${showOnlyAvailable ? 'bg-accent' : 'bg-white group-hover:bg-gray-100'}`}>
                    {showOnlyAvailable && <div className="w-3 h-3 bg-black"></div>}
                  </div>
                  <span className="font-medium">Show Only Available</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={showOnlyAvailable}
                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  />
                </label>
              </div>

              <div>
                <h4 className="font-heading uppercase text-sm font-bold mb-3">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => (
                    <Badge 
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`cursor-pointer font-heading uppercase border-2 border-black rounded-none px-3 py-1.5 transition-all ${
                        selectedGenre === genre 
                          ? 'bg-primary text-black brutal-shadow-sm' 
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-8 font-heading uppercase border-2 border-black rounded-none text-muted-foreground hover:text-black"
              onClick={() => {
                setSearchTerm("");
                setSelectedGenre("All");
                setShowOnlyAvailable(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-grow">
          <div className="mb-6 flex justify-between items-center">
            <p className="font-medium text-muted-foreground">
              Showing <span className="font-bold text-black">{filteredBooks.length}</span> results
            </p>
          </div>
          
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBorrow={handleBorrow}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-12 text-center brutal-shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-muted border-4 border-black flex items-center justify-center mb-6 transform rotate-12">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="font-heading text-2xl font-black uppercase mb-2">No Books Found</h3>
              <p className="text-muted-foreground font-medium max-w-md">
                We couldn&apos;t find any books matching your current search criteria. Try adjusting your filters.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("All");
                  setShowOnlyAvailable(false);
                }}
                className="mt-8 font-heading uppercase border-2 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow-sm rounded-none"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
