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
  PackageCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BadgePercent, 
  Banknote,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns Policy — MOCS Footwear" },
      {
        name: "description",
        content:
          "Read the official MOCS Shipping, Delivery & Returns Policy. Fast Pan-India courier delivery, free shipping over ₹999, live parcel tracking, and 7-day hassle-free shoe exchange.",
      },
      { property: "og:title", content: "Shipping & Returns Policy — MOCS Footwear" },
      {
        property: "og:description",
        content:
          "Fast dispatch, verified logistics, and 7-day doorstep shoe replacement by MOCS Foot Care.",
      },
    ],
  }),
  component: ShippingPolicyPage,
});

const toc: TocItem[] = [
  { id: "coverage-network", title: "1. Pan-India Coverage & Couriers" },
  { id: "dispatch-estimates", title: "2. Dispatch & Delivery Timelines" },
  { id: "shipping-charges", title: "3. Shipping Charges & Free Shipping" },
  { id: "order-tracking", title: "4. Real-Time Tracking & Alerts" },
  { id: "cod-policy", title: "5. Cash on Delivery (COD) Rules" },
  { id: "damaged-packages", title: "6. Damaged or Tampered Parcels" },
  { id: "returns-exchange", title: "7. 7-Day Easy Returns & Size Exchange" },
  { id: "refund-process", title: "8. Refund Processing & Timelines" },
  { id: "undelivered-orders", title: "9. Undelivered Shipments" },
  { id: "logistics-support", title: "10. Logistics & Support Desk" },
];

const highlights = [
  {
    title: "Free Shipping > ₹999",
    desc: "Enjoy zero shipping fees on all orders above ₹999 across India.",
    icon: BadgePercent,
  },
  {
    title: "24-48h Dispatch SLA",
    desc: "Orders are checked, packed, and handed over to couriers within 1-2 business days.",
    icon: Clock,
  },
  {
    title: "19,000+ PIN Codes",
    desc: "Direct delivery across metro, urban, and rural Indian postal codes.",
    icon: MapPin,
  },
  {
    title: "7-Day Easy Exchange",
    desc: "Free size replacement if your pair doesn't fit like a glove.",
    icon: RotateCcw,
  },
];

function ShippingPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="shipping"
      title="Shipping & Returns Policy"
      subtitle="We believe in fast, reliable delivery and a frictionless customer experience. Every pair of MOCS shoes is rigorously inspected, securely packed, and tracked right to your doorstep."
      badgeText="Fast Tracked Dispatch"
      lastUpdated="August 17, 2026"
      highlights={highlights}
      toc={toc}
    >
      {/* 1. Coverage & Network */}
      <section id="coverage-network" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            01
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Pan-India Shipping Coverage & Courier Partners
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            MOCS delivers to more than <strong className="text-white">19,000+ PIN codes</strong> across India. We partner exclusively with tier-1 logistics providers to ensure timely and damage-free transit:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-center">
              <span className="font-bold text-white text-xs block">Delhivery Express</span>
              <span className="text-[10px] text-zinc-400">Surface & Air Express</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-center">
              <span className="font-bold text-white text-xs block">Blue Dart</span>
              <span className="text-[10px] text-zinc-400">Metro Priority Air</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-center">
              <span className="font-bold text-white text-xs block">DTDC Express</span>
              <span className="text-[10px] text-zinc-400">Nationwide Network</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-center">
              <span className="font-bold text-white text-xs block">Xpressbees</span>
              <span className="text-[10px] text-zinc-400">Hyperlocal Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dispatch & Delivery Timelines */}
      <section id="dispatch-estimates" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            02
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Dispatch Times & Estimated Delivery Schedules
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            All confirmed orders are processed and dispatched directly from our Kerala manufacturing and central fulfillment facility within <strong className="text-white">24 to 48 hours</strong> (excluding Sundays and national holidays).
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-800 rounded-xl overflow-hidden">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-3">Destination Region</th>
                  <th className="p-3">Estimated Transit Time</th>
                  <th className="p-3">Primary Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr className="hover:bg-zinc-800/30">
                  <td className="p-3 font-semibold text-white">Kerala & South Indian Metros (Bengaluru, Chennai, Hyderabad)</td>
                  <td className="p-3 text-primary font-bold">2 – 3 Business Days</td>
                  <td className="p-3 text-zinc-400">Express Road / Air</td>
                </tr>
                <tr className="hover:bg-zinc-800/30">
                  <td className="p-3 font-semibold text-white">Major Metros (Mumbai, Delhi-NCR, Kolkata, Pune)</td>
                  <td className="p-3 text-primary font-bold">3 – 5 Business Days</td>
                  <td className="p-3 text-zinc-400">Air Cargo Express</td>
                </tr>
                <tr className="hover:bg-zinc-800/30">
                  <td className="p-3 font-semibold text-white">Tier 2 & Tier 3 Cities / Rest of India</td>
                  <td className="p-3 text-primary font-bold">4 – 6 Business Days</td>
                  <td className="p-3 text-zinc-400">Surface Express</td>
                </tr>
                <tr className="hover:bg-zinc-800/30">
                  <td className="p-3 font-semibold text-white">North-East & Remote Regions (J&K, Ladakh, Islands)</td>
                  <td className="p-3 text-primary font-bold">6 – 9 Business Days</td>
                  <td className="p-3 text-zinc-400">Air Postal Transit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Shipping Charges */}
      <section id="shipping-charges" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            03
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Shipping Charges & Free Shipping Thresholds
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-1">
                <Sparkles className="h-4 w-4" /> Free Standard Shipping
              </div>
              <p className="text-xs text-zinc-300">
                Orders with a subtotal of <strong className="text-white">₹999 or above</strong> qualify for 100% Free Standard Shipping across India.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-1">
                <Truck className="h-4 w-4 text-primary" /> Sub-Threshold Orders
              </div>
              <p className="text-xs text-zinc-400">
                For orders below ₹999, a nominal flat logistics charge of <strong className="text-white">₹49 to ₹79</strong> (based on delivery zone) is calculated automatically at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Order Tracking */}
      <section id="order-tracking" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            04
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Real-Time Tracking & SMS/WhatsApp Alerts
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            Once your footwear is scanned and dispatched by the carrier, you will receive an automatic dispatch notification containing:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-300">
            <li>Dedicated Courier Partner Name and Air Waybill (AWB) Tracking Number.</li>
            <li>One-click live tracking link sent to your registered Email and WhatsApp/SMS.</li>
            <li>Real-time updates directly visible inside your MOCS <strong className="text-white">Orders Page</strong>.</li>
          </ul>
        </div>
      </section>

      {/* 5. COD Policy */}
      <section id="cod-policy" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            05
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Cash on Delivery (COD) Guidelines
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            Cash on Delivery (COD) is available across most serviceable pincodes up to an order value of ₹5,000.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs space-y-2 text-zinc-400">
            <p><strong className="text-white">Verification:</strong> COD orders may require a quick one-time SMS/WhatsApp OTP confirmation before warehouse dispatch to minimize return-to-origin (RTO) delays.</p>
            <p><strong className="text-white">Payment Handover:</strong> Please ensure the exact cash amount is ready at the time of delivery. Delivery agents do not carry card POS machines unless UPI QR is supported by the courier app.</p>
          </div>
        </div>
      </section>

      {/* 6. Damaged / Tampered Packages */}
      <section id="damaged-packages" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            06
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Damaged, Missing, or Tampered Packages
          </h2>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>Immediate 48-Hour Reporting Protocol</span>
          </div>
          <p className="text-xs">
            If your outer parcel box arrives visibly torn, crushed, unsealed, or tampered with, please <strong className="text-white">refuse delivery</strong> or take clear photographs before opening.
          </p>
          <p className="text-xs">
            If you discover any manufacturing defect, missing items, or wrong size upon opening, report it to <a href="mailto:support@mocs.in" className="text-primary underline font-semibold">support@mocs.in</a> within <strong className="text-white">48 hours of delivery</strong> along with unboxing photos/videos. We will arrange an immediate doorstep replacement at zero additional charge.
          </p>
        </div>
      </section>

      {/* 7. 7-Day Easy Returns & Size Exchange */}
      <section id="returns-exchange" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            07
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            7-Day Easy Returns & Size Exchange Policy
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            We want you to love your MOCS shoes. If the size doesn't fit or you need a different style, you can initiate a return or size exchange within <strong className="text-white">7 days</strong> of delivery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="font-bold text-primary block mb-1">1. Unworn Condition</span>
              Shoes must be completely unworn, clean, free of outdoor scuffs, with original sole protectors intact.
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="font-bold text-primary block mb-1">2. Original Packaging</span>
              The footwear must be returned in the original MOCS brand box along with tags, insoles, and packaging inserts.
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="font-bold text-primary block mb-1">3. Doorstep Reverse Pickup</span>
              Our courier executive will collect the return parcel from your address within 24–48 hours of approval.
            </div>
          </div>
        </div>
      </section>

      {/* 8. Refund Timelines */}
      <section id="refund-process" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            08
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Refund Processing & Bank Timelines
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            Once our quality assurance team inspects the returned pair at our warehouse (usually within 24 hours of arrival):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-white block mb-1">Prepaid Orders (UPI / Card / Net Banking)</strong>
              <p className="text-zinc-400">
                100% refund is initiated back to your original payment source. Funds reflect in your account within <strong className="text-primary">3 to 5 business days</strong> depending on your issuing bank.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <strong className="text-white block mb-1">Cash on Delivery (COD) Orders</strong>
              <p className="text-zinc-400">
                Refunds are processed via direct NEFT bank transfer or verified UPI ID provided by the customer during return submission within <strong className="text-primary">24 to 48 hours</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Undelivered Shipments */}
      <section id="undelivered-orders" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            09
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Undelivered Shipments & Address Accuracy
          </h2>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-sm leading-relaxed text-zinc-300 space-y-3">
          <p>
            Our courier partners will attempt delivery up to <strong className="text-white">3 times</strong> before marking an order as Return to Origin (RTO).
          </p>
          <p className="text-xs text-zinc-400">
            Please ensure your delivery address contains landmarks, apartment/house numbers, and an active mobile number to prevent failed attempts. If a shipment is returned due to an invalid address or customer refusal, subsequent re-dispatch may incur standard re-shipping charges.
          </p>
        </div>
      </section>

      {/* 10. Logistics Support Desk */}
      <section id="logistics-support" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
            10
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Logistics & Delivery Support Desk
          </h2>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-zinc-900/60 to-zinc-950 p-6 text-sm leading-relaxed text-zinc-300 space-y-4">
          <p>
            Have a question about an existing shipment or need urgent delivery assistance? Our logistics coordinators are ready to help:
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-2 text-xs">
            <p><strong className="text-white">Logistics Desk:</strong> MOCS Dispatch & Fulfillment Center</p>
            <p><strong className="text-white">Warehouse Location:</strong> MOCS Foot Care, 7QJ8+42H, West Hill, Kozhikode, Kerala 673005</p>
            <p><strong className="text-white">Email Inquiries:</strong> <a href="mailto:support@mocs.in" className="text-primary hover:underline font-bold">support@mocs.in</a> (Subject: Order Tracking #[ID])</p>
            <p><strong className="text-white">Helpline / WhatsApp:</strong> <a href="tel:+917994550834" className="text-primary hover:underline font-bold">+91 7994550834</a></p>
          </div>
        </div>
      </section>
    </PolicyLayout>
  );
}
