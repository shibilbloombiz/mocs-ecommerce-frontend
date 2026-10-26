import { createFileRoute } from "@tanstack/react-router";
import { 
  PolicyLayout, 
  TocItem 
} from "@/components/legal/PolicyLayout";
import { 
  Award, 
  ShoppingBag, 
  Copyright, 
  Scale, 
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MOCS Footwear" },
      {
        name: "description",
        content:
          "Read the official Terms of Service for MOCS Footwear. Understand customer ordering, product guarantees, pricing, cancellation rules, and legal agreements.",
      },
      { property: "og:title", content: "Terms of Service — MOCS Footwear" },
      {
        property: "og:description",
        content: "Official store terms of use and customer purchase agreement by MOCS Footwear.",
      },
    ],
  }),
  component: TermsPage,
});

const toc: TocItem[] = [
  { id: "acceptance", title: "1. Agreement & Acceptance" },
  { id: "account-eligibility", title: "2. Account & Eligibility" },
  { id: "products-pricing", title: "3. Products, Sizing & Pricing" },
  { id: "orders-payment", title: "4. Orders & Payment Methods" },
  { id: "cancellations", title: "5. Order Cancellation Policy" },
  { id: "intellectual-property", title: "6. Intellectual Property & Brand" },
  { id: "warranty-liability", title: "7. Warranty & Limitation of Liability" },
  { id: "governing-law", title: "8. Governing Law & Jurisdiction" },
  { id: "contact-legal", title: "9. Contact & Inquiries" },
];

const highlights = [
  {
    title: "Official Brand Store",
    desc: "Binding terms governing direct purchases from MOCS Foot Care.",
    icon: Award,
  },
  {
    title: "Transparent Sizing",
    desc: "Standard Indian & UK shoe size charts to ensure a perfect fit.",
    icon: ShoppingBag,
  },
  {
    title: "IP Protected",
    desc: "All footwear designs, sole molds, logos, and photos are proprietary.",
    icon: Copyright,
  },
  {
    title: "Fair Customer Terms",
    desc: "Customer-first policies compliant with Indian Consumer Protection guidelines.",
    icon: Scale,
  },
];

function TermsPage() {
  return (
    <PolicyLayout
      currentPolicy="terms"
      title="Terms of Service"
      subtitle="Please review these standard terms of service governing your purchases and use of the MOCS footwear online store."
      badgeText="Official Store Terms"
      lastUpdated="August 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Agreement & Acceptance */}
      <section id="acceptance" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Agreement & Acceptance of Terms
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Welcome to <strong className="text-foreground">MOCS Footwear</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you and <strong className="text-foreground">MOCS Foot Care</strong> ("MOCS", "we", "us", or "our"), governing your access to and purchases from <span className="text-primary font-medium">mocs.in</span>.
          </p>
          <p>
            By browsing our website, creating an account, or purchasing our products, you agree to these Terms, our <a href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</a>, and our <a href="/shipping" className="text-primary font-medium hover:underline">Shipping & Returns Policy</a>.
          </p>
        </div>
      </section>

      {/* 2. Account & Eligibility */}
      <section id="account-eligibility" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Account & Eligibility
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>You must be at least 18 years of age or accessing under the supervision of a parent/guardian to make purchases.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>You are responsible for maintaining the confidentiality of your account credentials and providing accurate shipping information.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Products, Sizing & Pricing */}
      <section id="products-pricing" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Products, Sizing & Pricing
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <ul className="space-y-2.5 pl-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Product Specifications:</strong> All shoes and sandals are manufactured using premium Polyurethane (PU) and quality materials. We make every effort to display product colors and textures accurately; minor color variations may occur depending on screen displays.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Pricing & Taxes:</strong> All prices are listed in Indian Rupees (INR) and are inclusive of all applicable Goods and Services Tax (GST).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Sizing:</strong> Products follow standard Indian / UK shoe sizing. Please refer to our size guide on each product page.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Orders & Payment Methods */}
      <section id="orders-payment" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Orders & Payment Methods
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            When you place an order, you will receive an order confirmation receipt via Email and SMS. We accept payments via:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="font-semibold text-xs text-foreground">UPI</p>
              <p className="text-[11px] text-muted-foreground">GPay, PhonePe, Paytm</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="font-semibold text-xs text-foreground">Cards</p>
              <p className="text-[11px] text-muted-foreground">Visa, Master, RuPay</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="font-semibold text-xs text-foreground">Net Banking</p>
              <p className="text-[11px] text-muted-foreground">All Major Banks</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="font-semibold text-xs text-foreground">Cash on Delivery</p>
              <p className="text-[11px] text-muted-foreground">Pay on arrival</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Order Cancellation Policy */}
      <section id="cancellations" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Order Cancellation Policy
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            You can cancel an order <strong className="text-foreground">anytime before it is dispatched</strong> directly from your <strong className="text-foreground">Orders page</strong> or by contacting our support team with your Order ID.
          </p>
          <p>
            For cancelled prepaid orders, 100% of the amount is automatically refunded to your original payment method within 5–7 working days. If an order has already been handed over to the courier, you can simply request a return or refuse delivery upon arrival.
          </p>
        </div>
      </section>

      {/* 6. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Intellectual Property & Brand
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            All content on this website, including but not limited to the MOCS logo, trademarks, shoe designs, product photographs, text copy, and graphics, are the intellectual property of <strong className="text-foreground">MOCS Foot Care</strong>. Unauthorized reproduction or commercial redistribution without prior written consent is strictly prohibited.
          </p>
        </div>
      </section>

      {/* 7. Warranty & Limitation of Liability */}
      <section id="warranty-liability" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Warranty & Limitation of Liability
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            MOCS footwear is manufactured to high durability and comfort standards. We warrant against manufacturing defects present at the time of delivery. Normal wear and tear, accidental damage, or improper footwear maintenance are not covered under warranty.
          </p>
          <p>
            Our total liability for any claim arising out of your purchase will not exceed the purchase price paid for the specific product.
          </p>
        </div>
      </section>

      {/* 8. Governing Law & Jurisdiction */}
      <section id="governing-law" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Governing Law & Jurisdiction
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong className="text-foreground">Kozhikode, Kerala, India</strong>.
          </p>
        </div>
      </section>

      {/* 9. Contact & Inquiries */}
      <section id="contact-legal" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Contact & Legal Inquiries
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            For any legal inquiries, commercial clarifications, or customer support regarding these Terms, please contact:
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
                <p className="font-semibold text-foreground text-xs">Email Legal Desk</p>
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
                <p className="font-semibold text-foreground text-xs">Customer Support</p>
                <p className="text-xs text-muted-foreground">+91 7994550834</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </PolicyLayout>
  );
}
