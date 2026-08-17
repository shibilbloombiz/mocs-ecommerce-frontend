import { createFileRoute } from "@tanstack/react-router";
import { 
  PolicyLayout, 
  TocItem 
} from "@/components/legal/PolicyLayout";
import { 
  FileText, 
  Scale, 
  ShieldAlert, 
  Award, 
  ShoppingBag, 
  Copyright, 
  HelpCircle,
  Ban,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MOCS Footwear" },
      {
        name: "description",
        content:
          "Read the official Terms of Service and Conditions of Sale for MOCS Footwear. Learn about ordering, product guarantees, intellectual property, and user agreements.",
      },
      { property: "og:title", content: "Terms of Service — MOCS Footwear" },
      {
        property: "og:description",
        content:
          "Official terms of use, purchasing rules, and legal agreements for MOCS Foot Care.",
      },
    ],
  }),
  component: TermsPage,
});

const toc: TocItem[] = [
  { id: "acceptance", title: "1. Agreement & Acceptance" },
  { id: "account-eligibility", title: "2. Eligibility & Account Security" },
  { id: "product-descriptions", title: "3. Products & Sizing Accuracy" },
  { id: "pricing-billing", title: "4. Pricing, Taxes & Billing" },
  { id: "orders-cancellations", title: "5. Orders & Cancellations" },
  { id: "intellectual-property", title: "6. Intellectual Property & Brand" },
  { id: "prohibited-activities", title: "7. Prohibited Uses" },
  { id: "warranty-disclaimer", title: "8. Warranty & Liability Limits" },
  { id: "governing-law", title: "9. Governing Law & Jurisdiction" },
  { id: "contact-terms", title: "10. Contact & Clarifications" },
];

const highlights = [
  {
    title: "Official Brand Terms",
    desc: "Binding terms governing direct purchases from MOCS Foot Care manufacturing.",
    icon: Award,
  },
  {
    title: "Transparent Sizing",
    desc: "Detailed shoe charts and PU sole specifications to ensure the perfect fit.",
    icon: ShoppingBag,
  },
  {
    title: "IP Protected",
    desc: "All footwear designs, logos, and PU injection moulds are legally protected.",
    icon: Copyright,
  },
  {
    title: "Fair Dispute Resolution",
    desc: "Governed under Indian law with dedicated customer arbitration support.",
    icon: Scale,
  },
];

function TermsPage() {
  return (
    <PolicyLayout
      currentPolicy="terms"
      title="Terms of Service"
      subtitle="Please review these Terms of Service carefully before browsing our store or purchasing MOCS footwear products. They govern your legal relationship with MOCS Foot Care."
      badgeText="Official Commercial Terms"
      lastUpdated="August 17, 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Agreement & Acceptance */}
      <section id="acceptance" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            01
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Agreement & Acceptance of Terms
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            Welcome to <strong className="text-white">MOCS Footwear</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Customer", or "you") and <strong className="text-white">MOCS Foot Care</strong> ("MOCS", "we", "us", or "our"), governing your access to and use of our website (<span className="text-primary font-medium">mocs.in</span>) and all associated online retail services.
          </p>
          <p>
            By browsing our website, creating an account, or placing an order, you signify your full agreement to these Terms, our <a href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</a>, and our <a href="/shipping" className="text-primary hover:underline font-semibold">Shipping & Returns Policy</a>. If you do not agree to any part of these Terms, you must discontinue using our services immediately.
          </p>
        </div>
      </section>

      {/* 2. Eligibility & Account Security */}
      <section id="account-eligibility" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            02
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Eligibility & Account Security
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            To use our services or place orders, you represent and warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-300">
            <li>You are at least 18 years of age or possess legal parental/guardian consent to enter into binding purchase contracts.</li>
            <li>All information you provide during account registration or checkout is truthful, accurate, and up to date.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials, login passwords, and OTPs.</li>
            <li>You agree to notify MOCS immediately at <span className="text-primary font-semibold">support@mocs.in</span> of any unauthorized use of your account.</li>
          </ul>
        </div>
      </section>

      {/* 3. Products & Sizing Accuracy */}
      <section id="product-descriptions" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            03
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Products, PU Sole Technology & Sizing Accuracy
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            MOCS footwear is manufactured utilizing direct polyurethane (PU) injection technology engineered for lightweight durability, anatomical arch support, and impact absorption.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-primary uppercase tracking-wider block mb-1">Color Representation</strong>
              We make every effort to display the colors and textures of our footwear as accurately as possible. However, actual colors may slightly vary depending on your display screen calibration and lighting.
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-primary uppercase tracking-wider block mb-1">Size Selection</strong>
              Please consult our official UK/India shoe sizing charts before ordering. In the event of a sizing discrepancy, we offer a standard 7-day size exchange under our Shipping & Returns Policy.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing, Taxes & Billing */}
      <section id="pricing-billing" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            04
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Pricing, Taxes & Billing
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            All prices listed on MOCS are quoted in <strong className="text-white">Indian Rupees (INR ₹)</strong> and are inclusive of all applicable Goods and Services Tax (GST) unless explicitly noted otherwise.
          </p>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>We reserve the right to modify prices and promotional discounts at any time without prior notice.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>In the rare event of a typographical pricing error or inventory glitch, MOCS reserves the right to cancel the order and provide a 100% full refund to the original payment source.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Payment can be made via UPI, Credit/Debit Cards, Net Banking, EMI, or verified Cash on Delivery (COD).</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Orders & Cancellations */}
      <section id="orders-cancellations" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            05
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Order Confirmation, Dispatch & Cancellations
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            Your receipt of an order confirmation does not constitute our final acceptance of your order. MOCS reserves the right to accept or decline your order for legitimate operational reasons (e.g., product out of stock, failure of payment authentication, or suspicion of fraudulent activity).
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 space-y-2 text-xs">
            <strong className="text-white block">Customer Cancellation Window:</strong>
            <p className="text-zinc-400">
              You may cancel an order directly from your <span className="text-primary font-medium">Orders Dashboard</span> before the order status transitions to <em>Dispatched</em>. Once the shipment is handed over to our courier partner, the order cannot be cancelled in transit, but can be exchanged or returned upon delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            06
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Intellectual Property Rights & Trademarks
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            The MOCS brand name, logos, product designs, sole moulds, graphics, user interface designs, product photographs, videos, and copywriting are the exclusive intellectual property of <strong className="text-white">MOCS Foot Care</strong> and are protected under Indian and international copyright and trademark laws.
          </p>
          <p className="text-xs text-zinc-400">
            You may not reproduce, duplicate, copy, sell, resell, scrape, or exploit any portion of the MOCS brand or products without express written permission from our executive leadership.
          </p>
        </div>
      </section>

      {/* 7. Prohibited Uses */}
      <section id="prohibited-activities" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            07
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Prohibited Uses & User Conduct
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>You agree not to use our website or services for any of the following:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2.5">
              <Ban className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>Engaging in fraudulent transactions or chargeback abuse.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2.5">
              <Ban className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>Transmitting viruses, malware, or attempting unauthorized database access.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2.5">
              <Ban className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>Automated scraping, crawling, or indexing of product catalogues without authorization.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start gap-2.5">
              <Ban className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>Submitting false, abusive, defamatory, or misleading product reviews.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Warranty & Liability Limits */}
      <section id="warranty-disclaimer" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            08
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Manufacturing Warranty & Limitation of Liability
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            MOCS footwear is backed by our standard <strong>30-day manufacturing warranty</strong> covering sole detachment or structural bonding defects under standard usage conditions.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-xs text-zinc-400 space-y-2">
            <strong className="text-white block">Warranty Exclusions:</strong>
            <p>
              The warranty does not cover normal wear and tear, cuts, burns, damage caused by rough misuse, chemical exposure, or modifications made by third-party cobblers.
            </p>
          </div>
          <p className="text-xs text-zinc-400">
            To the maximum extent permitted by applicable Indian law, MOCS shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use our products or website. Our total aggregate liability shall not exceed the actual purchase price paid for the specific product in question.
          </p>
        </div>
      </section>

      {/* 9. Governing Law & Jurisdiction */}
      <section id="governing-law" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            09
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Governing Law & Legal Jurisdiction
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            These Terms, and all claims or causes of action arising out of or relating to your use of MOCS services, shall be governed by and construed in accordance with the laws of the Republic of India, without giving effect to any principles of conflicts of law.
          </p>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-zinc-300 flex items-start gap-3">
            <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>
              You irrevocably agree that the courts situated in <strong className="text-white">Kozhikode, Kerala, India</strong> shall have exclusive jurisdiction to settle any dispute, claim, or controversy arising out of or in connection with these Terms or transactions on MOCS.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Contact & Clarifications */}
      <section id="contact-terms" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            10
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Contact & Legal Clarifications
          </h2>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-zinc-900/60 to-zinc-950 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            For questions, legal notices, or clarification regarding these Terms of Service, please contact our legal and customer operations desk:
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-2 text-xs">
            <p><strong className="text-white">Entity:</strong> MOCS Foot Care</p>
            <p><strong className="text-white">Corporate Office:</strong> 7QJ8+42H, West Hill, Kozhikode, Kerala 673005, India</p>
            <p><strong className="text-white">Customer Support:</strong> <a href="mailto:support@mocs.in" className="text-primary hover:underline font-bold">support@mocs.in</a></p>
            <p><strong className="text-white">Helpline:</strong> <a href="tel:+917994550834" className="text-primary hover:underline font-bold">+91 7994550834</a></p>
          </div>
        </div>
      </section>
    </PolicyLayout>
  );
}
