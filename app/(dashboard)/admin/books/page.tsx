"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Library, Plus, Search, X, Trash2, Edit, Loader2, BookOpen } from "lucide-react";

const GENRE_OPTIONS = [
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

export default function ManageBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "Mathematics",
    rack_number: "",
    inventory_count: 1,
    cover_url: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBooks(data);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      genre: "Mathematics",
      rack_number: "",
      inventory_count: 1,
      cover_url: "",
    });
    setEditingBook(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const supabase = createClient();

    if (editingBook) {
      // Update existing book
      const { error } = await supabase
        .from("books")
        .update({
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          rack_number: formData.rack_number || null,
          inventory_count: formData.inventory_count,
          available_count: formData.inventory_count,
          cover_url: formData.cover_url || null,
        })
        .eq("id", editingBook.id);

      if (error) {
        alert("Failed to update book: " + error.message);
      } else {
        resetForm();
        await fetchBooks();
      }
    } else {
      // Add new book
      const { error } = await supabase.from("books").insert({
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        rack_number: formData.rack_number || null,
        inventory_count: formData.inventory_count,
        available_count: formData.inventory_count,
        cover_url: formData.cover_url || null,
      });

      if (error) {
        alert("Failed to add book: " + error.message);
      } else {
        resetForm();
        await fetchBooks();
      }
    }
    setIsSubmitting(false);
  };

  const handleEdit = (book: any) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      rack_number: book.rack_number || "",
      inventory_count: book.inventory_count,
      cover_url: book.cover_url || "",
    });
    setEditingBook(book);
    setShowAddForm(true);
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    setDeletingId(bookId);
    const supabase = createClient();
    const { error } = await supabase.from("books").delete().eq("id", bookId);
    if (error) {
      alert("Failed to delete book: " + error.message);
    } else {
      await fetchBooks();
    }
    setDeletingId(null);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black text-white border-4 border-primary p-6 brutal-shadow-sm">
        <div>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tighter">
            Manage Books
          </h1>
          <p className="text-gray-400 font-medium mt-1">
            {books.length} books in the library inventory
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="font-heading uppercase border-2 border-white bg-primary text-black hover:bg-primary/90 brutal-shadow-sm rounded-none gap-2"
        >
          <Plus size={20} /> Add New Book
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border-4 border-black brutal-shadow p-6">
          <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
            <h2 className="font-heading text-2xl font-black uppercase tracking-tighter">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-muted border-2 border-black rounded-none">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-heading uppercase text-sm font-bold">Book Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Introduction to Algorithms"
                  className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-heading uppercase text-sm font-bold">Author *</Label>
                <Input
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Thomas H. Cormen"
                  className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="font-heading uppercase text-sm font-bold">Genre *</Label>
                <select
                  required
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full h-12 border-2 border-black rounded-none px-3 font-medium bg-white focus:outline-none focus:border-primary"
                >
                  {GENRE_OPTIONS.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-heading uppercase text-sm font-bold">Rack Number</Label>
                <Input
                  value={formData.rack_number}
                  onChange={(e) => setFormData({ ...formData, rack_number: e.target.value })}
                  placeholder="e.g. CS-101"
                  className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-heading uppercase text-sm font-bold">Number of Copies *</Label>
                <Input
                  required
                  type="number"
                  min={1}
                  value={formData.inventory_count}
                  onChange={(e) => setFormData({ ...formData, inventory_count: parseInt(e.target.value) || 1 })}
                  className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-heading uppercase text-sm font-bold">Cover Image URL (optional)</Label>
              <Input
                value={formData.cover_url}
                onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                placeholder="https://example.com/cover.jpg"
                className="h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-heading uppercase border-2 border-black bg-accent text-black hover:bg-accent/80 brutal-shadow-sm rounded-none px-8 h-12"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : editingBook ? (
                  "Update Book"
                ) : (
                  "Add Book"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="font-heading uppercase border-2 border-black rounded-none px-8 h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search books by title, author, or genre..."
          className="h-14 pl-14 text-lg font-medium border-4 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary brutal-shadow-sm"
        />
      </div>

      {/* Books Table */}
      <div className="bg-white border-4 border-black brutal-shadow overflow-hidden">
        <div className="p-4 border-b-4 border-black bg-secondary flex justify-between items-center">
          <h2 className="font-heading text-xl font-black uppercase tracking-tighter">
            All Books ({filteredBooks.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-4 border-black bg-muted">
                <th className="text-left p-4 font-heading uppercase text-xs font-bold">Title</th>
                <th className="text-left p-4 font-heading uppercase text-xs font-bold">Author</th>
                <th className="text-left p-4 font-heading uppercase text-xs font-bold">Genre</th>
                <th className="text-center p-4 font-heading uppercase text-xs font-bold">Stock</th>
                <th className="text-center p-4 font-heading uppercase text-xs font-bold">Available</th>
                <th className="text-center p-4 font-heading uppercase text-xs font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-b-2 border-black/20 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm leading-tight">{book.title}</p>
                    {book.rack_number && (
                      <span className="text-xs text-muted-foreground font-medium">Rack: {book.rack_number}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium">{book.author}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="rounded-none border-2 border-black font-heading uppercase text-[10px]">
                      {book.genre}
                    </Badge>
                  </td>
                  <td className="p-4 text-center font-heading font-black text-lg">{book.inventory_count}</td>
                  <td className="p-4 text-center">
                    <Badge
                      className={`rounded-none border-2 border-black font-heading uppercase text-xs ${
                        book.available_count > 0
                          ? "bg-accent text-black hover:bg-accent"
                          : "bg-destructive text-white hover:bg-destructive"
                      }`}
                    >
                      {book.available_count}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 border-2 border-black bg-secondary hover:bg-secondary/80 brutal-shadow-sm rounded-none transition-all"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={deletingId === book.id}
                        className="p-2 border-2 border-black bg-destructive text-white hover:bg-destructive/80 brutal-shadow-sm rounded-none transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === book.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-heading uppercase text-lg font-bold text-muted-foreground">No books found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
