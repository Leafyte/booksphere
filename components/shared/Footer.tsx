import Link from "next/link";
import { Library, Mail, Globe, Book } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-auto border-t-8 border-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 inline-block group">
              <div className="bg-primary p-2 border-2 border-black rounded-sm group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[4px_4px_0px_0px_white] transition-all">
                <Library size={32} className="text-black" />
              </div>
              <span className="font-heading text-4xl font-black uppercase tracking-tighter">
                Book<span className="text-primary">Sphere</span>
              </span>
            </Link>
            <p className="text-lg max-w-sm text-gray-300 font-medium">
              A modern, neo-brutalist approach to college library management. Find, borrow, and manage physical books with style.
            </p>
            <div className="flex gap-4 pt-4">
              {[Mail, Globe, Book].map((Icon, i) => (
                <Link key={i} href="#" className="bg-white text-black p-3 border-2 border-transparent hover:border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#FF8A7A] transition-all rounded-sm">
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-heading text-2xl uppercase tracking-wide text-secondary">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Catalog Search", href: "/search" },
                { name: "New Arrivals", href: "/new-arrivals" },
                { name: "Top Borrowed", href: "/top-borrowed" },
                { name: "Library Rules", href: "/library-rules" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-primary hover:underline underline-offset-4 decoration-2 font-medium text-lg transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-heading text-2xl uppercase tracking-wide text-accent">Contact Us</h3>
            <ul className="space-y-4 text-gray-300 font-medium text-lg">
              <li className="font-bold text-white">Vidyavardhaka College of Engineering</li>
              <li>P.B. No.206, Gokulam III Stage Mysuru - 570 002, Karnataka, India</li>
              <li>+91 821 4276201</li>
              <li>
                <a href="mailto:principal@vvce.ac.in" className="hover:text-primary transition-colors">
                  principal@vvce.ac.in
                </a>
              </li>
              <li>
                <a href="https://vvce.ac.in/departments/department-of-library-information-center/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-base">
                  Library Website ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t-4 border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading uppercase tracking-widest text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BookSphere. All rights reserved.
          </p>
          <div className="flex gap-6 font-heading uppercase tracking-widest text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
