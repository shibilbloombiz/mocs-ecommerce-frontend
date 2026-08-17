import { ReactNode, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { 
  ShieldCheck, 
  FileText, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  Share2, 
  Check,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";

export interface TocItem {
  id: string;
  title: string;
  badge?: string;
}

interface PolicyLayoutProps {
  currentPolicy: "privacy" | "terms" | "shipping";
  title: string;
  subtitle: string;
  badgeText: string;
  lastUpdated: string;
  highlights?: { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[];
  toc: TocItem[];
  children: ReactNode;
}

export function PolicyLayout({
  currentPolicy,
  title,
  subtitle,
  badgeText,
  lastUpdated,
  highlights,
  toc,
  children,
}: PolicyLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(toc[0]?.id || "");
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const policyTabs = [
    {
      id: "privacy",
      label: "Privacy Policy",
      to: "/privacy" as const,
      icon: ShieldCheck,
      desc: "Data protection & privacy rights",
    },
    {
      id: "terms",
      label: "Terms of Service",
      to: "/terms" as const,
      icon: FileText,
      desc: "User agreement & purchase terms",
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      to: "/shipping" as const,
      icon: Truck,
      desc: "Delivery timelines & 7-day exchange",
    },
  ];

  // Scroll spy effect to highlight active section in TOC
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = toc.length - 1; i >= 0; i--) {
        const el = document.getElementById(toc[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(toc[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Policy URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredToc = filterQuery.trim()
    ? toc.filter((item) =>
        item.title.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : toc;

  return (
    <div className="min-h-screen bg-[#070709] text-[#ececee] font-sans selection:bg-primary selection:text-white">
      {/* Top Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-orange-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Switcher Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-500">Legal & Policies</span>
            <span>/</span>
            <span className="text-primary font-bold">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs font-bold text-zinc-300 backdrop-blur-md transition hover:border-primary/50 hover:bg-zinc-800 hover:text-white cursor-pointer"
              title="Share Policy"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Share</span>
                </>
              )}
            </button>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 px-3 py-1 text-[11px] font-medium text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <Reveal className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-900/40 to-black/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {badgeText}
              </div>
              <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl font-normal">
                {subtitle}
              </p>
            </div>

            {/* Policy Tabs Pill Switcher */}
            <div className="mt-8 pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {policyTabs.map((tab) => {
                const isActive = tab.id === currentPolicy;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.to}
                    className={`group relative flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-300 border ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-lg shadow-orange-500/20"
                        : "bg-zinc-950/40 text-zinc-300 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-zinc-800/60 text-primary group-hover:bg-primary/20 group-hover:text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <span>{tab.label}</span>
                        {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isActive ? "text-white/80 font-medium" : "text-zinc-400 font-normal"
                        }`}
                      >
                        {tab.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Policy Highlights Cards (If available) */}
        {highlights && highlights.length > 0 && (
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 backdrop-blur-md hover:border-primary/40 transition-colors"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{h.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">{h.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content Layout: Sticky Sidebar TOC + Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          
          {/* Sticky Table of Contents on Desktop */}
          <aside className="hidden lg:block sticky top-24 space-y-4">
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Contents ({toc.length})
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Quick Jump
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-primary"
                />
              </div>

              {/* TOC Links */}
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
                {filteredToc.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          const yOffset = -90;
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });
                          setActiveSection(item.id);
                        }
                      }}
                      className={`group flex items-start gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-primary/15 text-primary border-l-2 border-primary"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-[11px] font-mono text-zinc-500 mt-0.5">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="leading-snug flex-1">{item.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Need Direct Assistance Card */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-5 backdrop-blur-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Need Clarification?</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-normal">
                Our customer care & legal compliance team is available 6 days a week.
              </p>
              <div className="mt-3 space-y-2 text-xs">
                <a
                  href="tel:+917994550834"
                  className="flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors font-medium"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  +91 7994550834
                </a>
                <a
                  href="mailto:support@mocs.in"
                  className="flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors font-medium"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  support@mocs.in
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Document Clauses Content */}
          <main className="min-w-0 space-y-12 pb-16">
            {children}

            {/* Bottom Official Guarantee & Sign-off Box */}
            <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    MOCS Footwear Legal & Customer Support
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 font-normal">
                    Corporate Office: MOCS Foot Care, 7QJ8+42H, West Hill, Kozhikode, Kerala 673005, India
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary-glow cursor-pointer shrink-0 shadow-md shadow-orange-500/20"
                >
                  <span>Contact Helpdesk</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>100% Genuine MOCS Footwear</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>RBI & PCI-DSS Secure Payments</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>7-Day Hassle-Free Exchange</span>
                </div>
              </div>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
