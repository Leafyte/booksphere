"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookmarkCheck, Search, Loader2, CheckCircle, XCircle, RotateCcw } from "lucide-react";

export default function BorrowRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "returned">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("borrow_requests")
      .select("*, books(title, author, genre), users(first_name, last_name, student_id)")
      .order("created_at", { ascending: false });

    if (data) setRequests(data);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (requestId: string, newStatus: "approved" | "rejected" | "returned") => {
    setProcessingId(requestId);
    const supabase = createClient();

    const { error } = await supabase
      .from("borrow_requests")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (error) {
      alert("Failed to update request: " + error.message);
    } else {
      await fetchRequests();
    }
    setProcessingId(null);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-400 text-black hover:bg-yellow-400",
      approved: "bg-accent text-black hover:bg-accent",
      rejected: "bg-destructive text-white hover:bg-destructive",
      returned: "bg-secondary text-black hover:bg-secondary",
    };
    return (
      <Badge className={`rounded-none border-2 border-black font-heading uppercase text-[10px] ${styles[status] || ""}`}>
        {status}
      </Badge>
    );
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      req.books?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.users?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.users?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.users?.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    returned: requests.filter((r) => r.status === "returned").length,
  };

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
            Borrow Requests
          </h1>
          <p className="text-gray-400 font-medium mt-1">
            {counts.pending} pending · {counts.approved} approved · {counts.returned} returned
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {(["all", "pending", "approved", "rejected", "returned"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-3 border-4 font-heading uppercase text-sm font-bold transition-all ${
              filter === tab
                ? "border-black bg-primary text-black brutal-shadow-sm"
                : "border-black bg-white text-black hover:bg-muted"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by book title, student name, or ID..."
          className="h-14 pl-14 text-lg font-medium border-4 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary brutal-shadow-sm"
        />
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white border-4 border-black p-12 text-center brutal-shadow">
            <BookmarkCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-heading text-xl font-black uppercase mb-2">No Requests Found</h3>
            <p className="text-muted-foreground font-medium">
              {filter === "all" ? "No borrow requests have been made yet." : `No ${filter} requests found.`}
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border-4 border-black brutal-shadow-sm hover:brutal-shadow transition-all p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Book & Student Info */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {getStatusBadge(req.status)}
                    <span className="text-xs text-muted-foreground font-bold">
                      {new Date(req.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-black uppercase leading-tight">
                    {req.books?.title || "Unknown Book"}
                  </h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium">
                    <p className="text-muted-foreground">
                      Author: <span className="text-black">{req.books?.author || "—"}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Requested by:{" "}
                      <span className="text-black">
                        {req.users?.first_name} {req.users?.last_name}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Student ID: <span className="text-black">{req.users?.student_id || "—"}</span>
                    </p>
                  </div>

                  {req.status === "approved" && req.due_date && (
                    <p className="text-sm font-bold text-primary">
                      Due: {new Date(req.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex gap-3 flex-shrink-0">
                  {req.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={processingId === req.id}
                        onClick={() => handleStatusUpdate(req.id, "approved")}
                        className="font-heading uppercase bg-accent text-black hover:bg-accent/80 border-2 border-black rounded-none brutal-shadow-sm gap-2 px-4"
                      >
                        {processingId === req.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={processingId === req.id}
                        onClick={() => handleStatusUpdate(req.id, "rejected")}
                        className="font-heading uppercase border-2 border-black rounded-none brutal-shadow-sm text-destructive hover:bg-destructive/10 gap-2 px-4"
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <Button
                      size="sm"
                      disabled={processingId === req.id}
                      onClick={() => handleStatusUpdate(req.id, "returned")}
                      className="font-heading uppercase bg-secondary text-black hover:bg-secondary/80 border-2 border-black rounded-none brutal-shadow-sm gap-2 px-4"
                    >
                      {processingId === req.id ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                      Mark Returned
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
