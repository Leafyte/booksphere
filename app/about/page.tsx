import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Library, BookOpen, Users, Clock, Wifi, Monitor, Globe, Newspaper } from "lucide-react";

export const metadata = {
  title: "About | BookSphere — VVCE Library",
  description: "About the Department of Library & Information Center at Vidyavardhaka College of Engineering, Mysuru.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full bg-accent border-b-8 border-black overflow-hidden py-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block bg-white border-4 border-black px-6 py-2 brutal-shadow mb-4 rotate-[2deg]">
                <span className="font-heading uppercase text-xl font-black">About Us</span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-black">
                VVCE Library &<br />
                <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">Information Center</span>
              </h1>
              
              <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto border-2 border-black bg-white/90 p-4 brutal-shadow-sm">
                Established in 1997 — the heart of academic excellence at Vidyavardhaka College of Engineering, Mysuru.
              </p>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-4xl font-black uppercase mb-6">Our Library</h2>
                <div className="h-2 w-24 bg-primary border-2 border-black brutal-shadow-sm mb-6"></div>
                <p className="text-lg text-muted-foreground font-medium mb-6">
                  The Library at Vidyavardhaka College of Engineering was established in 1997. Being 
                  the heart of the institution, it is the centre of all academic activities on campus. 
                  Situated on the Ground Floor, it covers an area of <strong>1,023 sq. meters</strong> with 
                  both lending facilities and a reference section.
                </p>
                <p className="text-lg text-muted-foreground font-medium">
                  The library is developed and enriched with great care. It has a collection of 
                  <strong> 39,690+ books</strong> with <strong>8,082 titles</strong>. The library subscribes to 
                  around <strong>81 printed journals</strong>. All documents are classified as per AACR II 
                  of Dewey Decimal Classification (DDC) and systematically shelved on Open Access.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Library, label: "39,690+", desc: "Physical Books", color: "bg-primary" },
                  { icon: Users, label: "210 Seats", desc: "Reading Capacity", color: "bg-secondary" },
                  { icon: BookOpen, label: "8,082", desc: "Unique Titles", color: "bg-accent" },
                  { icon: Newspaper, label: "81+", desc: "Printed Journals", color: "bg-wero-blue" },
                ].map((feature, i) => (
                  <div key={i} className={`p-6 border-4 border-black ${feature.color} brutal-shadow brutal-hover flex flex-col items-center text-center gap-4`}>
                    <div className="p-3 bg-white border-2 border-black rounded-full">
                      <feature.icon size={32} className="text-black" />
                    </div>
                    <div>
                      <h4 className="font-heading uppercase font-black text-lg leading-tight">{feature.label}</h4>
                      <p className="font-medium text-sm mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INFRASTRUCTURE */}
        <section className="py-24 bg-muted border-y-8 border-black">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-black uppercase mb-4">Infrastructure</h2>
              <div className="h-2 w-24 bg-accent border-2 border-black brutal-shadow-sm mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Monitor, title: "Digital Lab", desc: "25 PCs with server, 3 printers, a scanner, and a copier for student use." },
                { icon: Wifi, title: "Wi-Fi Enabled", desc: "Full Wi-Fi connectivity across the library for seamless digital access." },
                { icon: Globe, title: "DELNET Member", desc: "Member of DELNET — Developing Library Network for inter-library loans and resource sharing." },
              ].map((item, i) => (
                <div key={i} className="bg-white border-4 border-black p-8 brutal-shadow brutal-hover text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary border-4 border-black flex items-center justify-center">
                    <item.icon size={32} className="text-black" />
                  </div>
                  <h3 className="font-heading text-xl font-black uppercase mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIBRARY SERVICES */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-black uppercase mb-4">Library Services</h2>
              <div className="h-2 w-24 bg-primary border-2 border-black brutal-shadow-sm mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Lending",
                "Reference",
                "Referral",
                "Reprographic",
                "Internet Services",
                "Access to e-Journals",
                "Access to Journals",
                "OPAC",
              ].map((service) => (
                <div key={service} className="border-4 border-black bg-secondary p-5 brutal-shadow-sm brutal-hover text-center">
                  <span className="font-heading uppercase text-sm font-black">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPEN ACCESS RESOURCES */}
        <section className="py-24 bg-black text-white border-y-8 border-primary">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-black uppercase mb-4">Open Access Resources</h2>
              <div className="h-2 w-24 bg-primary border-2 border-white brutal-shadow-sm mx-auto"></div>
              <p className="text-gray-400 font-medium mt-4 text-lg">Free academic resources available to all students</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "NPTEL", url: "http://www.nptel.ac.in/" },
                { name: "National Digital Library", url: "https://ndl.iitkgp.ac.in/" },
                { name: "DOAJ", url: "http://www.doaj.org/" },
                { name: "Project Gutenberg", url: "https://www.gutenberg.org/" },
                { name: "InTechOpen", url: "http://www.benthamscience.com/" },
                { name: "OCLC", url: "http://www.oclc.org/" },
                { name: "World Scientific", url: "http://www.worldscientific.com/" },
                { name: "KopyKitab VTU", url: "http://vtulibrary.kopykitab.com/" },
              ].map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-4 border-white bg-white/10 p-5 hover:bg-primary hover:text-black transition-all text-center brutal-shadow-sm"
                >
                  <span className="font-heading uppercase text-sm font-black">{resource.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
