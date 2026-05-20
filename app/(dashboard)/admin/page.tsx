"use client";

import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Users, Library, BookmarkCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalBooks: 0, totalStudents: 0, pendingRequests: 0, overdueBooks: 0 });
  const [requests, setRequests] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();

    // Get book count
    const { count: bookCount } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true });

    // Get student count
    const { count: studentCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    // Get pending requests with book and user info
    const { data: requestData } = await supabase
      .from("borrow_requests")
      .select("*, books(title), users(first_name, last_name)")
      .order("created_at", { ascending: false })
      .limit(10);

    const pendingCount = requestData?.filter(r => r.status === "pending").length || 0;

    setStats({
      totalBooks: bookCount || 0,
      totalStudents: studentCount || 0,
      pendingRequests: pendingCount,
      overdueBooks: 0,
    });

    setRequests(requestData || []);
  };

  const handleRequest = async (requestId: string, action: "approved" | "rejected") => {
    setIsProcessing(requestId);
    const supabase = createClient();

    const { error } = await supabase
      .from("borrow_requests")
      .update({ status: action })
      .eq("id", requestId);

    if (error) {
      alert("Failed to update request: " + error.message);
    } else {
      // Refresh data
      await fetchData();
    }
    setIsProcessing(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400 text-black hover:bg-yellow-400 rounded-none font-heading uppercase text-[10px] border-2 border-black">Pending</Badge>;
      case "approved":
        return <Badge className="bg-accent text-black hover:bg-accent rounded-none font-heading uppercase text-[10px] border-2 border-black">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-white hover:bg-destructive rounded-none font-heading uppercase text-[10px] border-2 border-black">Rejected</Badge>;
      case "returned":
        return <Badge className="bg-secondary text-black hover:bg-secondary rounded-none font-heading uppercase text-[10px] border-2 border-black">Returned</Badge>;
      default:
        return <Badge variant="outline" className="rounded-none font-heading uppercase text-[10px] border-2 border-black">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black text-white border-4 border-primary p-6 brutal-shadow-sm">
        <div>
          <div className="inline-block bg-primary text-black border-2 border-white px-2 py-0.5 mb-2 transform -rotate-1">
            <span className="font-heading uppercase text-[10px] font-black">System Status: Online</span>
          </div>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tighter">
            Admin Overview
          </h1>
          <p className="text-gray-400 font-medium mt-1">Manage library inventory, requests, and students.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/books">
            <Button className="font-heading uppercase border-2 border-white bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-hover rounded-none">
              Manage Books
            </Button>
          </Link>
          <Link href="/admin/requests">
            <Button className="font-heading uppercase border-2 border-white bg-accent text-black hover:bg-accent/90 brutal-shadow-sm brutal-hover rounded-none">
              Borrow Requests
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Inventory", value: String(stats.totalBooks), icon: Library, color: "bg-white border-black text-black", iconBg: "bg-accent" },
          { label: "Active Students", value: String(stats.totalStudents), icon: Users, color: "bg-white border-black text-black", iconBg: "bg-primary" },
          { label: "Pending Requests", value: String(stats.pendingRequests), icon: BookmarkCheck, color: "bg-secondary border-black text-black", iconBg: "bg-white" },
          { label: "Overdue Books", value: String(stats.overdueBooks), icon: AlertTriangle, color: "bg-destructive border-black text-white", iconBg: "bg-black text-white" },
        ].map((stat, i) => (
          <div key={i} className={`flex items-center gap-4 p-5 border-4 brutal-shadow-sm brutal-hover transition-transform ${stat.color}`}>
            <div className={`p-3 border-4 border-current ${stat.iconBg} rounded-sm`}>
              <stat.icon size={24} className={stat.iconBg.includes('text-white') ? 'text-white' : 'text-black'} />
            </div>
            <div>
              <p className="font-heading text-4xl font-black uppercase">{stat.value}</p>
              <h4 className="font-heading uppercase text-xs font-bold opacity-80">{stat.label}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Borrow Requests */}
      <div className="bg-white border-4 border-black brutal-shadow flex flex-col">
        <div className="p-4 border-b-4 border-black bg-secondary flex justify-between items-center">
          <h2 className="font-heading text-2xl font-black uppercase tracking-tighter">
            Borrow Requests
          </h2>
          <Badge className="bg-black text-white hover:bg-black font-heading rounded-none">{stats.pendingRequests} Pending</Badge>
        </div>
        <div className="p-0 flex-grow">
          {requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground font-medium">No borrow requests yet.</p>
            </div>
          ) : (
            <div className="divide-y-4 divide-black">
              {requests.map((req) => (
                <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(req.status)}
                      <span className="text-xs text-muted-foreground font-bold">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-bold text-lg leading-tight">{req.books?.title || "Unknown Book"}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      Requested by: <span className="text-black">{req.users?.first_name} {req.users?.last_name}</span>
                    </p>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        disabled={isProcessing === req.id}
                        onClick={() => handleRequest(req.id, "approved")}
                        className="font-heading uppercase bg-accent text-black hover:bg-accent/80 border-2 border-black rounded-none brutal-shadow-sm"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={isProcessing === req.id}
                        onClick={() => handleRequest(req.id, "rejected")}
                        className="font-heading uppercase border-2 border-black rounded-none brutal-shadow-sm text-destructive hover:bg-destructive/10"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
