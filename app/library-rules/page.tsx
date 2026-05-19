import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Shield, Clock, BookOpen, AlertTriangle, CheckCircle, XCircle, Users, Wifi } from "lucide-react";

export const metadata = {
  title: "Library Rules | BookSphere — VVCE",
  description: "Rules and guidelines for using the VVCE Library & Information Center.",
};

export default function LibraryRulesPage() {
  const rules = [
    {
      icon: BookOpen,
      title: "Borrowing Policy",
      color: "bg-primary",
      items: [
        "Students can borrow up to 3 books at a time.",
        "Each book can be borrowed for a maximum of 14 days.",
        "Borrow requests must be submitted through the student portal.",
        "An admin/librarian must approve the request before the book can be collected.",
        "All documents are classified as per AACR II of Dewey Decimal Classification (DDC).",
      ],
    },
    {
      icon: Clock,
      title: "Due Dates & Returns",
      color: "bg-secondary",
      items: [
        "Books must be returned on or before the due date.",
        "Overdue books will result in borrowing privileges being suspended.",
        "To return a book, hand it to the librarian at the circulation desk.",
        "Renewal requests can be submitted before the due date via the portal.",
        "The library follows an Open Access shelving system.",
      ],
    },
    {
      icon: Shield,
      title: "Book Care",
      color: "bg-accent",
      items: [
        "Handle all library materials with care.",
        "Do not write, highlight, or mark inside library books.",
        "Report any existing damage to the book before borrowing.",
        "Lost or severely damaged books must be replaced or paid for at current market price.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Library Conduct",
      color: "bg-wero-purple",
      items: [
        "Maintain silence in the reading areas (210-seat capacity).",
        "Food and beverages are not allowed near the bookshelves.",
        "Keep your college ID ready for verification at the entrance.",
        "Respect other students and library staff at all times.",
        "Personal belongings must be kept at the property counter.",
      ],
    },
    {
      icon: Wifi,
      title: "Digital Services",
      color: "bg-wero-blue",
      items: [
        "Wi-Fi connectivity is available throughout the library.",
        "25 PCs are available in the digital section for research and browsing.",
        "Access to e-Journals, OPAC, and online databases is free for all students.",
        "Printers, scanners, and copiers are available for academic use.",
        "The library is a member of DELNET for inter-library resource sharing.",
      ],
    },
    {
      icon: Users,
      title: "Library Services",
      color: "bg-primary",
      items: [
        "Lending, Reference, and Referral services available.",
        "Reprographic services (photocopying) on request.",
        "Internet services and e-Journal access for all enrolled students.",
        "Online Public Access Catalogue (OPAC) for searching the collection.",
        "Periodic book exhibitions and new arrivals display.",
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-background">
        {/* Hero */}
        <section className="bg-black text-white border-b-8 border-secondary py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-accent text-black border-4 border-white px-4 py-1 mb-4 transform -rotate-1">
              <span className="font-heading uppercase text-sm font-black flex items-center gap-2">
                <Shield size={18} /> VVCE Library Guidelines
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
              Library <span className="text-secondary">Rules</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              Department of Library & Information Center — Vidyavardhaka College of Engineering, Mysuru
            </p>
          </div>
        </section>

        {/* Rules */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {rules.map((rule) => (
              <div
                key={rule.title}
                className="bg-white border-4 border-black brutal-shadow flex flex-col"
              >
                <div className={`p-5 border-b-4 border-black ${rule.color} flex items-center gap-3`}>
                  <rule.icon size={28} className="text-black" />
                  <h2 className="font-heading text-2xl font-black uppercase tracking-tighter">
                    {rule.title}
                  </h2>
                </div>
                <ul className="p-6 space-y-4 flex-grow">
                  {rule.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Penalty Notice */}
          <div className="max-w-5xl mx-auto mt-12">
            <div className="bg-destructive/10 border-4 border-destructive p-8 brutal-shadow-sm">
              <div className="flex items-start gap-4">
                <XCircle size={32} className="text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-2xl font-black uppercase mb-3 text-destructive">
                    Penalty Notice
                  </h3>
                  <p className="text-lg font-medium leading-relaxed">
                    Violation of library rules may result in suspension of borrowing privileges, 
                    fines, or disciplinary action as per VVCE college policy. Lost books must be 
                    replaced at current market price. Repeated offenders will be reported to the 
                    Head of Department and Dean of Student Affairs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Library Info */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-black text-white border-4 border-primary p-8 brutal-shadow-sm">
              <h3 className="font-heading text-2xl font-black uppercase mb-4">Library at a Glance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Books", value: "39,690+" },
                  { label: "Titles", value: "8,082" },
                  { label: "Journals", value: "81+" },
                  { label: "Seating", value: "210" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-heading text-3xl font-black text-primary">{stat.value}</p>
                    <p className="font-heading uppercase text-xs text-gray-400 font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
