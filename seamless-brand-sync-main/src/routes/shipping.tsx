import { createFileRoute } from "@tanstack/react-router";
import { 
  PolicyLayout, 
  TocItem 
} from "@/components/legal/PolicyLayout";
import { 
  Truck, 
  Clock, 
  RotateCcw, 
  MapPin, 
  CheckCircle2, 
  BadgePercent, 
  Banknote,
  Mail,
  Phone,
  ShieldCheck
} from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns Policy — MOCS Footwear" },
      {
        name: "description",
        content:
          "Read the official MOCS Shipping & Returns Policy. Fast Pan-India delivery, free shipping over ₹999, live courier tracking, and 7-day hassle-free shoe exchange.",
      },
      { property: "og:title", content: "Shipping & Returns Policy — MOCS Footwear" },
      {
        property: "og:description",
        content: "Fast dispatch, verified logistics, and 7-day easy exchange by MOCS Footwear.",
      },
    ],
  }),
  component: ShippingPolicyPage,
});

const toc: TocItem[] = [
  { id: "shipping-coverage", title: "1. Pan-India Delivery & Timelines" },
  { id: "shipping-charges", title: "2. Shipping Charges & Free Shipping" },
  { id: "live-tracking", title: "3. Live Order Tracking" },
  { id: "cod-policy", title: "4. Cash on Delivery (COD)" },
  { id: "returns-exchange", title: "5. 7-Day Easy Size Exchange & Returns" },
  { id: "return-pickup", title: "6. Doorstep Pickup & Return Process" },
  { id: "refund-timeline", title: "7. Refund Process & Timelines" },
  { id: "damaged-items", title: "8. Damaged or Defective Items" },
  { id: "shipping-support", title: "9. Logistics & Support Helpdesk" },
];

const highlights = [
  {
    title: "Free Shipping > ₹999",
    desc: "Free standard delivery across India on all orders above ₹999.",
    icon: BadgePercent,
  },
  {
    title: "24-48h Dispatch",
    desc: "Orders are inspected, packed, and handed over to couriers in 1-2 business days.",
    icon: Clock,
  },
  {
    title: "Pan-India Reach",
    desc: "Direct doorstep delivery across 19,000+ PIN codes in India.",
    icon: MapPin,
  },
  {
    title: "7-Day Size Exchange",
    desc: "Hassle-free size replacement if your pair doesn't fit comfortably.",
    icon: RotateCcw,
  },
];

function ShippingPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="shipping"
      title="Shipping & Returns Policy"
      subtitle="We ensure fast, reliable delivery and an effortless return & size exchange experience for every pair of MOCS footwear."
      badgeText="Fast Tracked Dispatch"
      lastUpdated="August 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Pan-India Delivery & Timelines */}
      <section id="shipping-coverage" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Pan-India Delivery & Timelines
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            We deliver to over <strong className="text-foreground">19,000+ PIN codes</strong> across India via leading courier partners (including Bluedart, Delhivery, ExpressBees, and DTDC).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Order Processing</p>
              <p className="text-xs text-muted-foreground">Orders are quality-checked, boxed, and dispatched within <strong>24 to 48 business hours</strong>.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Estimated Delivery Time</p>
              <p className="text-xs text-muted-foreground">Metro Cities: <strong>2 – 4 business days</strong><br />Rest of India: <strong>4 – 7 business days</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shipping Charges */}
      <section id="shipping-charges" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Shipping Charges & Free Shipping
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <ul className="space-y-2.5 pl-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Orders Above ₹999:</strong> Free Standard Shipping across India.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Orders Below ₹999:</strong> A flat nominal delivery fee of ₹60 is applied at checkout.</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground pt-1">
            All prices displayed on MOCS are inclusive of GST. There are no hidden fees at checkout.
          </p>
        </div>
      </section>

      {/* 3. Live Tracking */}
      <section id="live-tracking" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Live Order Tracking
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Once your package is handed over to our courier partner, you will receive a tracking link via SMS, WhatsApp, and Email.
          </p>
          <p>
            You can also track your shipment anytime from your <strong className="text-foreground">Account &gt; Orders</strong> page by clicking on your active order.
          </p>
        </div>
      </section>

      {/* 4. Cash on Delivery (COD) */}
      <section id="cod-policy" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Cash on Delivery (COD)
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Cash on Delivery is available for most serviceable PIN codes across India.
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>Please keep the exact cash amount ready at the time of delivery, or pay digitally to the delivery agent via UPI QR code if supported by the courier.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>We may verify high-value COD orders via phone/OTP confirmation prior to dispatch to prevent delivery failure.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. 7-Day Easy Returns & Size Exchange */}
      <section id="returns-exchange" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            7-Day Easy Size Exchange & Returns
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            We want you to love your MOCS footwear! If the size doesn't fit or you need a replacement, you can request a <strong className="text-foreground">free size exchange or return within 7 days</strong> of delivery.
          </p>
          <div className="rounded-xl bg-background border border-border p-4 space-y-2 text-xs">
            <p className="font-semibold text-foreground">Conditions for Returns & Exchange:</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• The shoes must be <strong>unworn, clean, and in original condition</strong> with no outdoor scuffs.</li>
              <li>• The original shoe box, tags, and packaging materials must be intact.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Return Pickup & Process */}
      <section id="return-pickup" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Doorstep Pickup & Return Process
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>How to request an exchange or return:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary">Step 1</span>
              <p className="font-semibold text-foreground text-xs">Submit Request</p>
              <p className="text-xs text-muted-foreground">Go to your Orders page or email support@mocs.in with your Order ID and size requirement.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary">Step 2</span>
              <p className="font-semibold text-foreground text-xs">Doorstep Pickup</p>
              <p className="text-xs text-muted-foreground">Our courier partner will pick up the boxed pair from your delivery address within 24–48 hours.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary">Step 3</span>
              <p className="font-semibold text-foreground text-xs">Exchange / Refund</p>
              <p className="text-xs text-muted-foreground">Once received and inspected, the new size is dispatched or your refund is initiated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Refund Timelines */}
      <section id="refund-timeline" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Refund Process & Timelines
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Upon return arrival at our warehouse and passing quality inspection, refunds are processed promptly:
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Prepaid Orders (UPI / Card / NetBanking):</strong> Refund is credited back to the original payment source within <strong>5 to 7 business days</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Cash on Delivery (COD) Orders:</strong> Refund is transferred directly to your bank account via UPI or NEFT upon sharing your account/UPI details.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 8. Damaged / Defective Items */}
      <section id="damaged-items" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Damaged or Defective Items
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            In the rare event that your footwear arrives damaged or defective, please notify us within <strong className="text-foreground">48 hours of delivery</strong> with a photo of the product. We will arrange an immediate free replacement at zero extra cost.
          </p>
        </div>
      </section>

      {/* 9. Support Desk */}
      <section id="shipping-support" className="scroll-mt-24 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            09
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Logistics & Support Helpdesk
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Need help tracking a shipment or initiating a size replacement? Our team is happy to help:
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
                <p className="font-semibold text-foreground text-xs">Email Logistics Team</p>
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
