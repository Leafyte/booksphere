"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  isAvailable: boolean;
  rackNumber: string;
}

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
}

export function BookCard({ book, onBorrow }: BookCardProps) {
  return (
    <div className="group relative flex flex-col bg-white border-4 border-black brutal-shadow brutal-transition brutal-hover rounded-lg overflow-hidden h-full">
      {/* Cover Image Area */}
      <div className="relative aspect-[2/3] w-full border-b-4 border-black bg-muted overflow-hidden">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-secondary">
            <BookOpen size={48} className="text-black/20" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <Badge 
            className={`font-heading uppercase text-xs border-2 border-black rounded-none px-3 py-1 brutal-shadow-sm ${
              book.isAvailable 
                ? "bg-accent text-black hover:bg-accent" 
                : "bg-destructive text-white hover:bg-destructive"
            }`}
          >
            {book.isAvailable ? "Available" : "Borrowed"}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="font-heading uppercase text-[10px] border-2 border-black rounded-none">
            {book.genre}
          </Badge>
          <span className="font-heading uppercase text-xs text-muted-foreground font-black">
            Rack: {book.rackNumber}
          </span>
        </div>
        
        <h3 className="font-heading text-xl font-black uppercase leading-tight mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-muted-foreground font-medium mb-6">
          {book.author}
        </p>

        <div className="mt-auto">
          <Button 
            className="w-full font-heading uppercase tracking-wider border-2 border-black bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-active rounded-none transition-all"
            disabled={!book.isAvailable}
            onClick={() => onBorrow?.(book.id)}
          >
            {book.isAvailable ? "Borrow Book" : "Notify When Available"}
          </Button>
        </div>
      </div>
    </div>
  );
}
