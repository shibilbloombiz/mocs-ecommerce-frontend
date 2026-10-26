import { createFileRoute } from "@tanstack/react-router";
import { 
  PolicyLayout, 
  TocItem 
} from "@/components/legal/PolicyLayout";
import { 
  Lock, 
  Eye, 
  CreditCard, 
  UserCheck, 
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MOCS Footwear" },
      {
        name: "description",
        content:
          "Read the official MOCS Privacy Policy. Learn how we collect, protect, and handle your data across our online store with 100% secure encrypted transactions.",
      },
      { property: "og:title", content: "Privacy Policy — MOCS Footwear" },
      {
        property: "og:description",
        content: "Transparent data protection and customer privacy guarantees by MOCS Footwear.",
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
  { id: "data-sharing", title: "5. Data Sharing & Logistics" },
  { id: "cookies-tracking", title: "6. Cookies & Preferences" },
  { id: "customer-rights", title: "7. Your Rights & Data Control" },
  { id: "contact-support", title: "8. Grievance & Support Contact" },
];

const highlights = [
  {
    title: "100% Encrypted",
    desc: "All transactions and customer sessions use secure 256-bit SSL encryption.",
    icon: Lock,
  },
  {
    title: "Zero Data Selling",
    desc: "We never sell, rent, or trade your personal information to third parties.",
    icon: Eye,
  },
  {
    title: "Secure Gateways",
    desc: "Payment processing is handled via RBI-approved, PCI-DSS compliant gateways.",
    icon: CreditCard,
  },
  {
    title: "Full Data Control",
    desc: "You have complete rights to view, update, or request deletion of your account data.",
    icon: UserCheck,
  },
];

function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="privacy"
      title="Privacy Policy"
      subtitle="We are committed to protecting your privacy and ensuring your personal information is handled safely, responsibly, and transparently."
      badgeText="Customer Data Protection"
      lastUpdated="August 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Overview & Commitment */}
      <section id="overview" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Overview & Commitment
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            This Privacy Policy explains how <strong className="text-foreground">MOCS Foot Care</strong> ("MOCS", "we", "us", or "our") collects, uses, and protects your information when you visit our website (<span className="text-primary font-medium">mocs.in</span>) or place an order for footwear products.
          </p>
          <p>
            By using our website, you agree to the collection and use of information in accordance with this policy. We ensure that your information is used solely for order processing, logistics delivery, and providing you with a seamless customer experience.
          </p>
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-we-collect" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Information We Collect
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-4">
          <p>We only collect the essential information required to fulfill your orders and enhance your shopping experience:</p>
          <ul className="space-y-2.5 pl-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Contact & Identity:</strong> Full Name, Email Address, and Mobile Phone Number.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Shipping Details:</strong> Complete Delivery Address, Landmark, City, State, and Postal PIN Code.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Order & Purchase History:</strong> Products purchased, sizing selections, transaction IDs, and invoice records.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Technical Data:</strong> IP address, device type, browser information, and cookie data to preserve your shopping cart.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. How We Use Information */}
      <section id="how-we-use-data" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            How We Use Your Information
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>We use your information strictly for the following purposes:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Order Fulfillment</p>
              <p className="text-xs text-muted-foreground">Processing payments, packing orders, generating invoices, and arranging courier deliveries.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Shipment Alerts</p>
              <p className="text-xs text-muted-foreground">Sending live order confirmation, tracking links, and delivery updates via SMS/Email/WhatsApp.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Customer Support</p>
              <p className="text-xs text-muted-foreground">Assisting with size exchanges, return requests, refunds, or general footwear inquiries.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Security & Fraud Prevention</p>
              <p className="text-xs text-muted-foreground">Detecting unauthorized transactions and maintaining store security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Payment Security */}
      <section id="payment-security" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Payment Security & Encryption
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Your online payments are processed through certified, PCI-DSS Level 1 compliant payment gateways (such as Razorpay, UPI, Net Banking, and major cards).
          </p>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-xs space-y-2 text-foreground">
            <p className="font-semibold flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Zero Storage of Sensitive Card Credentials
            </p>
            <p className="text-muted-foreground">
              MOCS never collects, sees, or stores your Credit/Debit Card CVV numbers, PINs, or banking passwords. All card information is encrypted and transmitted directly through RBI-authorized banking networks.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Data Sharing */}
      <section id="data-sharing" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Data Sharing & Logistics
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            We do <strong className="text-foreground">not</strong> sell, rent, or trade your personal data. We only share essential delivery information with verified partners strictly necessary to complete your order:
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-foreground">Courier & Logistics Partners:</strong> Handing over recipient name, address, and phone number to courier services (e.g., Bluedart, Delhivery) for doorstep delivery.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-foreground">Payment Processors:</strong> Encrypted transaction verification to prevent unauthorized billing.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 6. Cookies & Tracking */}
      <section id="cookies-tracking" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Cookies & Preferences
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            We use cookies to maintain your shopping cart items, remember your browsing session, and analyze general site traffic to improve page speed. You can easily modify your browser settings to decline cookies at any time, though some shopping cart features may require cookies to function properly.
          </p>
        </div>
      </section>

      {/* 7. Customer Rights */}
      <section id="customer-rights" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Your Rights & Data Control
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>As a valued MOCS customer, you have full control over your personal data:</p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Access & Edit:</strong> You can view and update your profile, shipping addresses, and contact info anytime.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Opt-Out:</strong> Unsubscribe from marketing promotions or promotional newsletters with a single click.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Data Deletion:</strong> Request complete removal of your account and saved information by emailing our support desk.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 8. Contact & Grievance */}
      <section id="contact-support" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Grievance & Support Contact
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or how your information is handled, please reach out to us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href="mailto:support@mocs.in"
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 hover:border-primary transition"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-xs">Email Support</p>
                <p className="text-xs text-muted-foreground">support@mocs.in</p>
              </div>
            </a>
            <a
              href="tel:+917994550834"
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 hover:border-primary transition"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-xs">Customer Helpline</p>
                <p className="text-xs text-muted-foreground">+91 7994550834</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </PolicyLayout>
  );
}
