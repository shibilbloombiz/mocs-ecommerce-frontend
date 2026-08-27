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
      id: "shipping",
      label: "Shipping & Returns",
      to: "/shipping" as const,
      icon: Truck,
      desc: "Delivery timelines & 7-day exchange",
    },
    {
      id: "terms",
      label: "Terms of Service",
      to: "/terms" as const,
      icon: FileText,
      desc: "Store agreement & purchase terms",
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
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Policy link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredToc = filterQuery.trim()
    ? toc.filter((item) =>
        item.title.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : toc;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Meta Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Policies</span>
            <span>/</span>
            <span className="text-foreground font-semibold">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary cursor-pointer shadow-sm"
              title="Share Link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Share</span>
                </>
              )}
            </button>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Minimal Hero Header */}
        <Reveal className="mb-8">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {badgeText}
              </div>
              <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                {subtitle}
              </p>
            </div>

            {/* Quick Switcher Policy Tabs */}
            <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
              {policyTabs.map((tab) => {
                const isActive = tab.id === currentPolicy;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    to={tab.to}
                    className={`flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-200 border ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-accent"
                    }`}
                  >
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-primary"
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
                        className={`text-xs truncate mt-0.5 ${
                          isActive ? "text-white/80 font-medium" : "text-muted-foreground font-normal"
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

        {/* Highlights Row */}
        {highlights && highlights.length > 0 && (
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm hover:border-primary/40 transition-colors space-y-2"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{h.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-normal">{h.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content Layout: Sticky Sidebar TOC + Policy Clauses */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
          
          {/* Sticky Minimal Table of Contents on Desktop */}
          <aside className="hidden lg:block sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Sections ({toc.length})
                </span>
              </div>

              {/* Quick Filter */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-1.5 pl-8 pr-2.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary transition"
                />
              </div>

              {/* TOC Navigation */}
              <nav className="space-y-1 max-h-[55vh] overflow-y-auto pr-1">
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
                      className={`flex items-start gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="text-[11px] font-mono opacity-70 mt-0.5">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="leading-snug flex-1">{item.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact Box */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 text-xs shadow-sm">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Need Help?</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Contact our customer support team directly:
              </p>
              <div className="space-y-1.5 pt-1">
                <a
                  href="tel:+917994550834"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>+91 7994550834</span>
                </a>
                <a
                  href="mailto:support@mocs.in"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>support@mocs.in</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Clauses Content */}
          <main className="min-w-0 space-y-8 pb-16">
            {children}

            {/* Bottom Support & Guarantee Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    MOCS Footwear Customer Care
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground font-normal">
                    MOCS Foot Care, Kozhikode, Kerala, India • Open Mon–Sat 9:00 AM – 6:00 PM IST
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary-glow cursor-pointer shrink-0 shadow-sm"
                >
                  <span>Contact Us</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>100% Genuine MOCS Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Secure Encrypted Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>7-Day Easy Size Exchange</span>
                </div>
              </div>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
