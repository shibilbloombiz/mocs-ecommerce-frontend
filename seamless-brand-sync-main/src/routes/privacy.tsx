import { createFileRoute } from "@tanstack/react-router";
import { 
  PolicyLayout, 
  TocItem 
} from "@/components/legal/PolicyLayout";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  CreditCard, 
  Cookie, 
  Truck, 
  UserCheck, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MOCS Footwear" },
      {
        name: "description",
        content:
          "Read the official MOCS Privacy Policy. Learn how we collect, use, protect, and handle your personal data across our online store in compliance with DPDP regulations.",
      },
      { property: "og:title", content: "Privacy Policy — MOCS Footwear" },
      {
        property: "og:description",
        content:
          "Transparent data protection, secure transactions, and customer privacy guarantees by MOCS Foot Care.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

const toc: TocItem[] = [
  { id: "overview", title: "1. Overview & Commitment" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use-data", title: "3. How We Use Information" },
  { id: "payment-security", title: "4. Payment Security & Encryption" },
  { id: "cookies-tracking", title: "5. Cookies & Tracking" },
  { id: "sharing-logistics", title: "6. Data Sharing & Logistics" },
  { id: "customer-rights", title: "7. Your Rights & Choices" },
  { id: "data-retention", title: "8. Data Retention & Storage" },
  { id: "children-privacy", title: "9. Children's Privacy" },
  { id: "grievance-contact", title: "10. Grievance Officer & Contact" },
];

const highlights = [
  {
    title: "100% Encrypted",
    desc: "All transactions and communications use military-grade 256-bit SSL encryption.",
    icon: Lock,
  },
  {
    title: "Zero Data Reselling",
    desc: "We never sell, rent, or trade your personal data to unauthorized third-party advertisers.",
    icon: Eye,
  },
  {
    title: "PCI-DSS Compliant",
    desc: "Card data is processed exclusively through RBI-authorized payment gateways.",
    icon: CreditCard,
  },
  {
    title: "User Data Control",
    desc: "You retain full rights to review, rectify, or request complete erasure of your account.",
    icon: UserCheck,
  },
];

function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="privacy"
      title="Privacy Policy"
      subtitle="At MOCS Footwear, we are dedicated to safeguarding your personal data, ensuring complete transparency, and providing an authentic, secure shopping experience."
      badgeText="DPDP & IT Act Compliant"
      lastUpdated="August 17, 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Overview & Commitment */}
      <section id="overview" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            01
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Overview & Commitment
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            This Privacy Policy sets out how <strong className="text-white">MOCS Foot Care</strong> ("MOCS", "we", "us", or "our") collects, utilizes, retains, and protects any personal information you provide while browsing our storefront (<span className="text-primary font-medium">mocs.in</span>) or purchasing our footwear products.
          </p>
          <p>
            MOCS is committed to ensuring that your privacy is protected under the <em>Information Technology Act, 2000</em>, the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>, and the <em>Digital Personal Data Protection (DPDP) Act, 2023</em>.
          </p>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-zinc-300 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>
              By accessing our website, creating a customer profile, or completing an order, you acknowledge and agree to the practices outlined in this policy.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-we-collect" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            02
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Information We Collect
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            We collect information that is strictly essential for order processing, logistics delivery, customer care, and platform optimization:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> Personal Identifiers
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-300">
                <li>Full name, salutation, and account login credentials.</li>
                <li>Email address and verified mobile phone number.</li>
                <li>Billing address and shipping destination (with postal PIN code).</li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Transactional & Order Data
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-300">
                <li>Product selection, shoe sizes, colors, and order quantity.</li>
                <li>Payment transaction identifiers, date, time, and invoice totals.</li>
                <li>Returns, exchange requests, and warranty support tickets.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" /> Technical & Device Information
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-300">
                <li>IP address, browser type, operating system, and screen resolution.</li>
                <li>Device model, preferred language, and regional location markers.</li>
                <li>Access timestamps and referral web pages.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                <Cookie className="h-4 w-4" /> Interaction & Preference Data
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-300">
                <li>Wishlist items, recently viewed footwear, and shopping cart states.</li>
                <li>Customer feedback, reviews, ratings, and customer service inquiries.</li>
                <li>Marketing preferences and newsletter subscriptions.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How We Use Information */}
      <section id="how-we-use-data" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            03
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            How We Use Your Information
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>We process your data for explicit, lawful, and transparent purposes:</p>
          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong className="text-white">Order Fulfillment & Logistics:</strong> To process payments, generate tax invoices, dispatch footwear from our factory warehouse, and coordinate delivery via verified couriers.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong className="text-white">Real-Time Transactional Notifications:</strong> To send order confirmations, dispatch tracking updates, OTP authentication codes, and delivery status alerts via SMS, Email, and WhatsApp.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong className="text-white">Customer Support & Returns Management:</strong> To assist you with size recommendations, product queries, replacement shoes, refunds, and warranty investigations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong className="text-white">Security & Fraud Detection:</strong> To prevent unauthorized logins, identify card fraudulent behavior, prevent fake orders, and maintain server integrity.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span><strong className="text-white">Continuous Store Improvement:</strong> To analyze user experience, optimize site speed, and curate better footwear collections based on demand.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Payment Security & Encryption */}
      <section id="payment-security" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            04
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Payment Security & Encryption
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            Your financial security is our highest priority. All online transactions on MOCS are processed through Reserve Bank of India (RBI) authorized and <strong className="text-white">PCI-DSS Level 1 Compliant</strong> payment gateways.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Zero Card Storage</h4>
              <p className="text-xs text-zinc-400">
                MOCS does not store or process your complete credit card numbers, debit card PINs, CVV, or net banking passwords on our servers.
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">256-Bit SSL Encryption</h4>
              <p className="text-xs text-zinc-400">
                All data transmission between your device and our checkout system is encrypted end-to-end using TLS 1.3 cryptographic protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cookies & Tracking */}
      <section id="cookies-tracking" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            05
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Cookies & Tracking Technologies
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            We use essential cookies and web storage tokens to provide core eCommerce features:
          </p>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li><strong className="text-white">Essential Cookies:</strong> Required to maintain your logged-in session, remember items in your cart, and secure checkout.</li>
            <li><strong className="text-white">Performance & Analytics:</strong> Help us measure site traffic, popular shoe styles, and navigation friction to enhance performance.</li>
            <li><strong className="text-white">Preference Cookies:</strong> Store your shoe sizing choices and display settings.</li>
          </ul>
          <p className="text-xs text-zinc-400 pt-2">
            You can disable non-essential cookies via your browser settings at any time; however, some shopping features (like persistent cart) may be impaired.
          </p>
        </div>
      </section>

      {/* 6. Data Sharing & Logistics */}
      <section id="sharing-logistics" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            06
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Data Sharing & Third-Party Logistics
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            We strictly do <strong className="text-white">NOT</strong> sell, rent, or trade your personal information. We only share customer data with vetted third-party service providers bound by strict confidentiality agreements:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5 text-xs">
              <span className="font-bold text-primary block mb-1">Logistics & Couriers</span>
              <span className="text-zinc-400">Delhivery, BlueDart, DTDC, Xpressbees for delivery address verification and package dispatch.</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5 text-xs">
              <span className="font-bold text-primary block mb-1">Payment Gateways</span>
              <span className="text-zinc-400">Razorpay, Cashfree, and banking partners to authenticate transactions.</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5 text-xs">
              <span className="font-bold text-primary block mb-1">Cloud & Infrastructure</span>
              <span className="text-zinc-400">Secure cloud database and CDN hosting providers ensuring 99.9% uptime.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Rights & Choices */}
      <section id="customer-rights" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            07
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Your Rights & Choices
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>Under applicable Indian data privacy regulations, you have the following rights:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
              <strong className="text-white block mb-1">Right to Access & Rectify</strong>
              Review your personal profile details in your Account Profile or request corrections for inaccurate information.
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
              <strong className="text-white block mb-1">Right to Erasure (Forget Me)</strong>
              Request full deletion of your registered account and profile data (except records required by tax/statutory laws).
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
              <strong className="text-white block mb-1">Marketing Opt-Out</strong>
              Unsubscribe from promotional emails or SMS campaigns with a single click at any time.
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
              <strong className="text-white block mb-1">Grievance Redressal</strong>
              Lodge inquiries or complaints with our designated Grievance Officer.
            </div>
          </div>
        </div>
      </section>

      {/* 8. Data Retention & Storage */}
      <section id="data-retention" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            08
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Data Retention & Storage
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            We retain personal information only for as long as necessary to fulfill the purposes for which it was gathered, including satisfying legal, accounting, tax, or reporting requirements.
          </p>
          <p className="text-xs text-zinc-400">
            Order invoices and tax documentation are stored securely for a statutory period of 7 years in compliance with the Goods and Services Tax (GST) and Indian corporate statutes.
          </p>
        </div>
      </section>

      {/* 9. Children's Privacy */}
      <section id="children-privacy" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            09
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Children's Privacy
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            Our store is not targeted towards individuals under the age of 18 without parental supervision. While we manufacture kids' footwear collections, purchases must be made by parents or legal guardians. We do not knowingly collect personal information directly from children.
          </p>
        </div>
      </section>

      {/* 10. Grievance Officer & Contact */}
      <section id="grievance-contact" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            10
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Grievance Officer & Legal Contact
          </h2>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-zinc-900/60 to-zinc-950 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            In accordance with the <em>Information Technology Act 2000</em> and the <em>Consumer Protection (E-Commerce) Rules, 2020</em>, the contact details of the Grievance Officer are provided below:
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-2 text-xs">
            <p><strong className="text-white">Grievance Officer:</strong> MOCS Customer Data & Grievance Desk</p>
            <p><strong className="text-white">Organization:</strong> MOCS Foot Care</p>
            <p><strong className="text-white">Corporate Address:</strong> 7QJ8+42H, West Hill, Kozhikode, Kerala 673005, India</p>
            <p><strong className="text-white">Email:</strong> <a href="mailto:support@mocs.in" className="text-primary hover:underline font-bold">support@mocs.in</a></p>
            <p><strong className="text-white">Helpline:</strong> <a href="tel:+917994550834" className="text-primary hover:underline font-bold">+91 7994550834</a> (Mon-Sat, 9:30 AM – 6:30 PM IST)</p>
          </div>
          <p className="text-xs text-zinc-400">
            We endeavor to acknowledge any privacy concern or grievance within 48 hours and resolve it within 30 days of receipt.
          </p>
        </div>
      </section>
    </PolicyLayout>
  );
}
