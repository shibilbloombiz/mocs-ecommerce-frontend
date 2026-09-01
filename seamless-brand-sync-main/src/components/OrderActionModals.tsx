import { useState, useEffect, useMemo } from "react";
import {
  Star,
  X,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Building2,
  Zap,
  ShieldCheck,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  ChevronRight,
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export interface RefundPayload {
  reason: string;
  items?: string[];
  refundMethod: "bank" | "upi" | "original";
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  upiDetails?: {
    upiId: string;
  };
  saveAccount?: boolean;
}

interface OrderActionModalsProps {
  // Cancel Order Modal State
  cancelModal: boolean;
  setCancelModal: (open: boolean) => void;
  cancelReason: string;
  setCancelReason: (v: string) => void;
  handleCancelOrder: () => void;

  // Return Request Modal State
  returnModal: boolean;
  setReturnModal: (open: boolean) => void;
  selectedOrder: any;
  returnReason: string;
  setReturnReason: (v: string) => void;
  returnItems: string[];
  setReturnItems: (items: string[] | ((prev: string[]) => string[])) => void;
  handleReturnOrder: (payload: RefundPayload) => Promise<void> | void;

  // Review Dialog State
  reviewModal: boolean;
  setReviewModal: (open: boolean) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  handleCreateReview: () => void;
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const COMMON_RETURN_REASONS = [
  "Size is too small",
  "Size is too large",
  "Defective or damaged product",
  "Wrong color / item delivered",
  "Comfort / fit not as expected",
  "Quality not matching expectation",
  "Changed my mind",
];

const POPULAR_UPI_HANDLES = ["@okhdfcbank", "@oksbi", "@paytm", "@ybl", "@okaxis", "@okicici"];

// Authentic Vector for UPI Brand (no emojis)
function UpiBrandLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 shrink-0 select-none", className)}>
      <span className="font-display font-black italic tracking-tighter text-[#18181b] text-sm leading-none">
        UPI
      </span>
      <div className="flex items-center -space-x-1">
        <svg viewBox="0 0 12 16" className="h-3.5 w-2.5 fill-[#16a34a]">
          <path d="M0 0 L12 8 L0 16 Z" />
        </svg>
        <svg viewBox="0 0 12 16" className="h-3.5 w-2.5 fill-[#ea580c]">
          <path d="M0 0 L12 8 L0 16 Z" />
        </svg>
      </div>
    </div>
  );
}

export function OrderActionModals({
  cancelModal,
  setCancelModal,
  cancelReason,
  setCancelReason,
  handleCancelOrder,
  returnModal,
  setReturnModal,
  selectedOrder,
  returnReason,
  setReturnReason,
  returnItems,
  setReturnItems,
  handleReturnOrder,
  reviewModal,
  setReviewModal,
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  handleCreateReview,
}: OrderActionModalsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Return Flow Multi-Step State
  const [returnStep, setReturnStep] = useState<1 | 2>(1);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Refund Destination State
  const [refundMethod, setRefundMethod] = useState<"bank" | "upi">("upi");
  const [useSavedAccount, setUseSavedAccount] = useState<boolean>(true);
  const [saveForFuture, setSaveForFuture] = useState<boolean>(true);

  // Bank Form State
  const [holderName, setHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // UPI Form State
  const [upiId, setUpiId] = useState("");

  // Saved Account State from User Profile
  const [savedAccount, setSavedAccount] = useState<any>(null);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Detect whether order was paid online vs COD
  const isOnlinePayment = useMemo(() => {
    const method = (selectedOrder?.paymentMethod || "").toLowerCase();
    return (
      method.includes("online") ||
      method.includes("upi") ||
      method.includes("card") ||
      method.includes("prepaid") ||
      method.includes("razorpay") ||
      method.includes("netbanking")
    );
  }, [selectedOrder]);

  const refundTimeline = isOnlinePayment ? "1–2 days" : "2–3 days";
  const refundTimelineSubtitle = isOnlinePayment
    ? "credited in 1–2 days after product collection"
    : "credited in 2–3 days after product collection";

  // Load saved refund method when return modal opens
  useEffect(() => {
    if (returnModal) {
      setReturnStep(1);
      setLoadingSaved(true);
      setShowSecurityInfo(false);
      apiClient.users
        .getRefundAccount()
        .then((res: any) => {
          if (res && res.type && res.type !== "none") {
            setSavedAccount(res);
            setUseSavedAccount(true);
            setRefundMethod(res.type === "upi" ? "upi" : "bank");
            if (res.type === "bank") {
              setHolderName(res.accountHolderName || "");
              setBankName(res.bankName || "");
              setIfscCode(res.ifscCode || "");
            } else if (res.type === "upi") {
              setUpiId(res.upiId || "");
            }
          } else {
            setSavedAccount(null);
            setUseSavedAccount(false);
            setRefundMethod("upi");
          }
        })
        .catch(() => {
          setSavedAccount(null);
          setUseSavedAccount(false);
          setRefundMethod("upi");
        })
        .finally(() => setLoadingSaved(false));
    }
  }, [returnModal]);

  const activeRating = hoverRating || reviewRating;

  // Calculate dynamic refund amount
  const refundAmount = useMemo(() => {
    if (!selectedOrder) return 0;
    if (selectedOrder.items?.length > 1 && returnItems.length > 0) {
      return selectedOrder.items
        .filter((item: any) => {
          const key = `${item.product?.id || item.product}_${item.size}_${item.color}`;
          return returnItems.includes(key);
        })
        .reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
    }
    return selectedOrder.total || selectedOrder.totalAmount || 499;
  }, [selectedOrder, returnItems]);

  // Validate step 1 to proceed to step 2
  const handleProceedToRefund = () => {
    if (selectedOrder && selectedOrder.items?.length > 1 && returnItems.length === 0) {
      toast.error("Please select at least one item you wish to return.");
      return;
    }
    if (!returnReason.trim()) {
      toast.error("Please select or describe the reason for your return.");
      return;
    }
    setReturnStep(2);
  };

  // Final submission of return request
  const handleSubmitReturn = async () => {
    if (refundMethod === "bank") {
      if (useSavedAccount && savedAccount?.type === "bank") {
        const payload: RefundPayload = {
          reason: returnReason.trim(),
          items: returnItems,
          refundMethod: "bank",
          bankDetails: {
            accountHolderName: savedAccount.accountHolderName,
            accountNumber: savedAccount.maskedAccountNumber || "",
            ifscCode: savedAccount.ifscCode,
            bankName: savedAccount.bankName,
          },
          saveAccount: false,
        };
        setSubmittingReturn(true);
        try {
          await handleReturnOrder(payload);
        } finally {
          setSubmittingReturn(false);
        }
        return;
      }

      // Validate new bank details
      const cleanAcc = accountNumber.replace(/[^0-9]/g, "");
      const cleanConfirm = confirmAccount.replace(/[^0-9]/g, "");
      const cleanIfsc = ifscCode.trim().toUpperCase();

      if (!holderName.trim()) {
        toast.error("Please enter the account holder name.");
        return;
      }
      if (cleanAcc.length < 8 || cleanAcc.length > 20) {
        toast.error("Please enter a valid bank account number (8 to 20 digits).");
        return;
      }
      if (cleanAcc !== cleanConfirm) {
        toast.error("Account numbers do not match. Please re-check.");
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
        toast.error("Please enter a valid 11-character IFSC code (e.g., HDFC0001234, SBIN0000456).");
        return;
      }

      const payload: RefundPayload = {
        reason: returnReason.trim(),
        items: returnItems,
        refundMethod: "bank",
        bankDetails: {
          accountHolderName: holderName.trim(),
          accountNumber: cleanAcc,
          ifscCode: cleanIfsc,
          bankName: bankName.trim() || "Bank Transfer",
        },
        saveAccount: saveForFuture,
      };

      setSubmittingReturn(true);
      try {
        await handleReturnOrder(payload);
      } finally {
        setSubmittingReturn(false);
      }
    } else if (refundMethod === "upi") {
      if (useSavedAccount && savedAccount?.type === "upi") {
        const payload: RefundPayload = {
          reason: returnReason.trim(),
          items: returnItems,
          refundMethod: "upi",
          upiDetails: {
            upiId: savedAccount.upiId || savedAccount.maskedUpiId,
          },
          saveAccount: false,
        };
        setSubmittingReturn(true);
        try {
          await handleReturnOrder(payload);
        } finally {
          setSubmittingReturn(false);
        }
        return;
      }

      const cleanUpi = upiId.trim().toLowerCase();
      if (!/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/.test(cleanUpi)) {
        toast.error("Please enter a valid UPI ID (e.g., username@okhdfcbank, mobile@paytm).");
        return;
      }

      const payload: RefundPayload = {
        reason: returnReason.trim(),
        items: returnItems,
        refundMethod: "upi",
        upiDetails: {
          upiId: cleanUpi,
        },
        saveAccount: saveForFuture,
      };

      setSubmittingReturn(true);
      try {
        await handleReturnOrder(payload);
      } finally {
        setSubmittingReturn(false);
      }
    }
  };

  return (
    <>
      {/* ── Cancel Order Modal ── */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-2xl text-stone-900 text-left animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setCancelModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
                <AlertCircle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Cancel Order</h3>
                <p className="text-xs text-stone-500">Let us know why you'd like to cancel.</p>
              </div>
            </div>

            {/* Prepaid Online Refund Notice - Admin Approval Model */}
            {selectedOrder && (selectedOrder.paymentStatus === "Paid" || selectedOrder.paidAt || isOnlinePayment) && (
              <div className="mt-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-700 stroke-[2.2] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5 text-left">
                  <p className="font-bold text-amber-900">
                    Prepaid Refund (Admin Verification & Approval)
                  </p>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Since this order was paid online (<strong className="font-bold font-mono">₹{selectedOrder.total}</strong>), your refund request will be submitted to the store admin for verification. Upon admin approval, funds are transferred back to your original payment account within <strong>1–2 business days</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Cancellation Reason
              </label>
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-red-500 focus:bg-white focus:outline-none transition-all resize-none no-scrollbar"
                placeholder="e.g., Ordered by mistake, found better price elsewhere, change of delivery address..."
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="rounded-full px-5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="rounded-full bg-red-600 px-6 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-red-700 hover:shadow-md transition cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Exact Reference Model Return & Refund Modal (Compact, Responsive & Dynamic 1-2 Days for Online) ── */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-[600px] max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[32px] border border-zinc-200/90 bg-white shadow-2xl text-zinc-900 text-left animate-in zoom-in-95 duration-200 my-auto overflow-hidden no-scrollbar">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setReturnModal(false)}
              className="absolute right-4 sm:right-6 top-4 sm:top-6 z-10 grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition cursor-pointer"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>

            {/* Scrollable Container (no scrollbar visible) */}
            <div className="overflow-y-auto p-5 sm:p-7 space-y-4 no-scrollbar">
              
              {/* ── Top Header matching MOCS Theme ── */}
              <div className="flex items-center gap-3.5 pr-8">
                {/* Circular Return Icon with delicate outer ring */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full border border-orange-200/70 scale-120 pointer-events-none" />
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-orange-50 text-[#F46A1E] border border-orange-200 shadow-xs">
                    <RotateCcw className="h-5 w-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* Title, Badge & Subtitle with Dynamic 1-2 Days for Online Orders */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-stone-900 leading-tight">
                      {returnStep === 1 ? "Select Item to Return" : "Select Refund Method"}
                    </h3>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-orange-700 border border-orange-200">
                      Step {returnStep} of 2
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5 leading-snug">
                    {returnStep === 1
                      ? "Select the item(s) and reason for requesting a return"
                      : `Choose where you want your refund credited (${refundTimelineSubtitle})`}
                  </p>
                </div>
              </div>

              {/* ── STEP 1: ITEM SELECTION & RETURN REASON (MOCS THEME) ── */}
              {returnStep === 1 && (
                <div className="space-y-4 pt-1">
                  {/* Multiple Items Picker */}
                  {selectedOrder && selectedOrder.items?.length > 1 && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                        Select Item(s) to Return
                      </label>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                        {selectedOrder.items.map((item: any, idx: number) => {
                          const key = `${item.product?.id || item.product}_${item.size}_${item.color}`;
                          const isChecked = returnItems.includes(key);
                          return (
                            <label
                              key={idx}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl border p-2 transition cursor-pointer text-xs font-semibold select-none",
                                isChecked
                                  ? "border-orange-400 bg-orange-50/60 text-stone-900 shadow-xs ring-1 ring-orange-400/20"
                                  : "border-stone-200/80 bg-stone-50/40 text-stone-700 hover:bg-stone-100/60"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setReturnItems((prev) =>
                                    isChecked ? prev.filter((k) => k !== key) : [...prev, key]
                                  );
                                }}
                                className="rounded border-stone-300 text-[#F46A1E] focus:ring-orange-500 h-4 w-4 cursor-pointer"
                              />
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="h-9 w-9 rounded-lg object-cover bg-white border border-stone-200/60 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=120";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="truncate font-bold text-stone-900 text-xs">{item.name}</p>
                                <p className="text-[10px] text-stone-500 font-medium">
                                  Size {item.size} · Color: {item.color} · Qty {item.qty} · ₹{item.price * item.qty}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Reason Chips */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                      Choose Return Reason
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_RETURN_REASONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReturnReason(r)}
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold transition border cursor-pointer",
                            returnReason === r
                              ? "bg-[#F46A1E] border-[#F46A1E] text-white shadow-xs shadow-orange-500/20"
                              : "bg-stone-50 border-stone-200/80 text-stone-700 hover:bg-orange-50/60 hover:border-orange-200 hover:text-orange-900"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Feedback Textarea */}
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#F46A1E] focus:bg-white focus:outline-none transition-all resize-none"
                      placeholder="Provide any additional details to speed up your return approval..."
                      rows={2}
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-150">
                    <button
                      type="button"
                      onClick={() => setReturnModal(false)}
                      className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToRefund}
                      className="flex items-center gap-1.5 rounded-xl bg-[#F46A1E] hover:bg-[#ea580c] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer shadow-md shadow-orange-500/15"
                    >
                      Next: Refund Method
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: REFUND METHOD DESIGN (MOCS THEME) ── */}
              {returnStep === 2 && (
                <div className="space-y-3.5 pt-1">
                  {/* Dynamic Refund Amount Subheader */}
                  <div>
                    <p className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-stone-600">
                      HOW WOULD YOU LIKE TO RECEIVE YOUR REFUND OF ₹{refundAmount}?
                    </p>
                  </div>

                  {/* ── 2 Method Cards: Bank Transfer & Instant UPI (Side-by-Side Responsive Grid) ── */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                    {/* Bank Transfer Card */}
                    <div
                      onClick={() => {
                        setRefundMethod("bank");
                        if (savedAccount?.type === "bank") {
                          setUseSavedAccount(true);
                        }
                      }}
                      className={cn(
                        "relative rounded-2xl border-2 p-3 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none",
                        refundMethod === "bank"
                          ? "border-[#F46A1E] bg-[#fffaf5] shadow-xs ring-1 ring-[#F46A1E]/20"
                          : "border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-xs"
                      )}
                    >
                      <div>
                        {/* Top Row */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            {/* Round orange-tinted icon */}
                            <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-orange-50 text-orange-600 shrink-0 border border-orange-200/80">
                              <Building2 className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                                  Bank Transfer
                                </span>
                                <span className="rounded-full bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 border border-emerald-200 leading-none">
                                  Recommended
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Radio Check Circle */}
                          <div
                            className={cn(
                              "grid h-4.5 w-4.5 sm:h-5 sm:w-5 place-items-center rounded-full transition-all shrink-0 mt-0.5",
                              refundMethod === "bank"
                                ? "bg-[#F46A1E] text-white shadow-xs"
                                : "border-2 border-stone-300 bg-white"
                            )}
                          >
                            {refundMethod === "bank" && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Subtitles with Dynamic 1-2 Days for Online Orders */}
                        <div className="mt-2 space-y-0.5">
                          <p className="text-[11px] sm:text-xs font-semibold text-stone-700 leading-tight">
                            IMPS / NEFT (Direct Credit)
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-stone-500 leading-tight">
                            Refund directly to your bank account ({refundTimeline} after pickup)
                          </p>
                        </div>
                      </div>

                      {/* Bottom Feature Tag */}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium text-orange-600 mt-2.5 pt-2 border-t border-orange-100/60">
                        <ShieldCheck className="h-3.5 w-3.5 stroke-[2] shrink-0" />
                        <span className="truncate">Secure • Fast • Direct Credit</span>
                      </div>
                    </div>

                    {/* Instant UPI Card */}
                    <div
                      onClick={() => {
                        setRefundMethod("upi");
                        if (savedAccount?.type === "upi") {
                          setUseSavedAccount(true);
                        }
                      }}
                      className={cn(
                        "relative rounded-2xl border-2 p-3 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none",
                        refundMethod === "upi"
                          ? "border-[#F46A1E] bg-[#fffaf5] shadow-xs ring-1 ring-[#F46A1E]/20"
                          : "border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-xs"
                      )}
                    >
                      <div>
                        {/* Top Row */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            {/* Round orange-tinted icon */}
                            <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-orange-50 text-[#F46A1E] shrink-0 border border-orange-200/80">
                              <Zap className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                                  Instant UPI
                                </span>
                                <span className="rounded-full bg-orange-100 text-orange-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 border border-orange-200 leading-none">
                                  Fastest
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Radio Check Circle */}
                          <div
                            className={cn(
                              "grid h-4.5 w-4.5 sm:h-5 sm:w-5 place-items-center rounded-full transition-all shrink-0 mt-0.5",
                              refundMethod === "upi"
                                ? "bg-[#F46A1E] text-white shadow-xs"
                                : "border-2 border-stone-300 bg-white"
                            )}
                          >
                            {refundMethod === "upi" && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Subtitles with Dynamic 1-2 Days for Online Orders */}
                        <div className="mt-2 space-y-0.5">
                          <p className="text-[11px] sm:text-xs font-semibold text-stone-700 leading-tight">
                            GPay, PhonePe, Paytm, BHIM
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-stone-500 leading-tight">
                            Instant refund to your UPI ID ({refundTimeline} after pickup)
                          </p>
                        </div>
                      </div>

                      {/* Bottom Feature Tag */}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium text-orange-600 mt-2.5 pt-2 border-t border-orange-100/60">
                        <ShieldCheck className="h-3.5 w-3.5 stroke-[2] shrink-0" />
                        <span className="truncate">Instant • 24x7 • Direct Payout</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Saved Payout Account Detected Box ── */}
                  {savedAccount && savedAccount.type === refundMethod && useSavedAccount ? (
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-3 sm:p-3.5 transition-all duration-200 animate-in fade-in">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 stroke-[2.2]" />
                          Saved Payout Account Detected
                        </span>
                        <button
                          type="button"
                          onClick={() => setUseSavedAccount(false)}
                          className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer transition"
                        >
                          Use different account
                          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Inner Details Card matching model */}
                      <div className="bg-white rounded-xl border border-stone-200/80 p-2.5 sm:p-3 mt-2 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          {/* Authentic Brand Logo / Icon */}
                          {refundMethod === "upi" ? (
                            <div className="grid h-9 w-12 place-items-center rounded-lg bg-stone-50 border border-stone-200/70 shrink-0 px-1">
                              <UpiBrandLogo />
                            </div>
                          ) : (
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-600 border border-orange-200 shrink-0">
                              <Building2 className="h-4.5 w-4.5 stroke-[2]" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider leading-none">
                              {refundMethod === "upi" ? "UPI ID" : savedAccount.bankName || "Bank Account"}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="font-bold text-xs sm:text-sm text-stone-900 font-mono truncate">
                                {refundMethod === "upi"
                                  ? savedAccount.maskedUpiId || savedAccount.upiId || "use***@okhdfcbank"
                                  : `${savedAccount.accountHolderName} · ${savedAccount.maskedAccountNumber}`}
                              </span>
                              <span className="rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 border border-emerald-200 inline-flex items-center gap-0.5 leading-none">
                                <Check className="h-2 w-2 stroke-[3]" />
                                Verified
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5 leading-none">
                              <Check className="h-2.5 w-2.5 stroke-[2.5] text-emerald-600" />
                              Pre-verified for faster refunds
                            </p>
                          </div>
                        </div>

                        {/* Right Verification Shield */}
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 shrink-0 ml-1.5">
                          <ShieldCheck className="h-4 w-4 stroke-[2]" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── Form View for Entering / Changing Details ── */
                    <div className="space-y-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 p-3 sm:p-3.5 transition-all duration-200">
                      <div className="flex items-center justify-between pb-1 border-b border-stone-200/60">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                          {refundMethod === "upi" ? "Enter UPI ID" : "Enter Bank Account Details"}
                        </span>
                        {savedAccount && savedAccount.type === refundMethod && (
                          <button
                            type="button"
                            onClick={() => setUseSavedAccount(true)}
                            className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                          >
                            ← Use saved account ({savedAccount.maskedUpiId || savedAccount.maskedAccountNumber})
                          </button>
                        )}
                      </div>

                      {/* UPI Form */}
                      {refundMethod === "upi" && (
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10.5px] font-bold text-stone-600 block mb-1">
                              UPI ID (VPA) *
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="e.g., username@okhdfcbank or 9876543210@paytm"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:border-[#F46A1E] focus:ring-1 focus:ring-[#F46A1E] focus:outline-none font-mono"
                              />
                              {/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/.test(upiId.trim()) && (
                                <div className="absolute right-2.5 top-2 text-emerald-600 flex items-center gap-1 text-[10.5px] font-bold">
                                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.2]" />
                                  Valid Format
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Handle Suggestions */}
                          <div className="flex items-center gap-1 flex-wrap pt-0.5">
                            <span className="text-[9.5px] text-stone-500 font-semibold">Quick handles:</span>
                            {POPULAR_UPI_HANDLES.map((handle) => (
                              <button
                                key={handle}
                                type="button"
                                onClick={() => {
                                  const prefix = upiId.includes("@") ? upiId.split("@")[0] : upiId;
                                  setUpiId(`${prefix || "user"}${handle}`);
                                }}
                                className="rounded-md bg-white border border-stone-200 px-1.5 py-0.5 text-[9.5px] font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition cursor-pointer"
                              >
                                {handle}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer Form */}
                      {refundMethod === "bank" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                                Account Holder Name *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Rajesh Kumar"
                                value={holderName}
                                onChange={(e) => setHolderName(e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:border-[#F46A1E] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                                Bank Name (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., HDFC Bank"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:border-[#F46A1E] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                                Account Number *
                              </label>
                              <input
                                type="password"
                                placeholder="Enter account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:border-[#F46A1E] focus:outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                                Confirm Account Number *
                              </label>
                              <input
                                type="text"
                                placeholder="Re-enter account"
                                value={confirmAccount}
                                onChange={(e) => setConfirmAccount(e.target.value)}
                                className={cn(
                                  "w-full rounded-lg border bg-white px-2.5 py-1.5 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none font-mono",
                                  confirmAccount && accountNumber !== confirmAccount
                                    ? "border-red-400 focus:border-red-500"
                                    : confirmAccount && accountNumber === confirmAccount
                                    ? "border-emerald-500 focus:border-emerald-600"
                                    : "border-stone-300 focus:border-[#F46A1E]"
                                )}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                              IFSC Code * (11 characters)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., HDFC0001234"
                              maxLength={11}
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                              className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:border-[#F46A1E] focus:outline-none uppercase font-mono tracking-wider"
                            />
                          </div>
                        </div>
                      )}

                      {/* Save Account Checkbox */}
                      <label className="flex items-center gap-1.5 pt-0.5 text-[11px] font-semibold text-stone-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={saveForFuture}
                          onChange={(e) => setSaveForFuture(e.target.checked)}
                          className="rounded border-stone-300 text-[#F46A1E] focus:ring-orange-500 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span>Save this payout account securely for 1-click future refunds</span>
                      </label>
                    </div>
                  )}

                  {/* ── 256-Bit Encrypted & 100% Privacy Protected Security Card (MOCS Orange Theme) ── */}
                  <div className="rounded-2xl border border-orange-200/80 bg-[#fffaf5] p-3 sm:p-3.5 flex items-start gap-3">
                    <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-orange-100 text-orange-700 shrink-0 border border-orange-200">
                      <Shield className="h-4.5 w-4.5 stroke-[2]" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-orange-950 text-xs sm:text-[13px]">
                        256-Bit Encrypted & 100% Privacy Protected
                      </p>
                      <p className="text-stone-500 leading-snug text-[10.5px] sm:text-[11px]">
                        Your payout details are encrypted and accessed strictly for refund processing. Money is transferred automatically to your account within <strong className="text-stone-700 font-semibold">{isOnlinePayment ? "1–2 business days" : "2–3 business days"}</strong> after product collection & inspection.
                      </p>
                    </div>
                  </div>

                  {/* ── Footer Actions (MOCS Orange Theme) ── */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-150 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setReturnStep(1)}
                      className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-50 hover:text-stone-950 transition shadow-xs cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 stroke-[2.2]" />
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={submittingReturn}
                      onClick={handleSubmitReturn}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F46A1E] to-[#d95b13] hover:from-[#ea580c] hover:to-[#c2410c] px-5 sm:px-7 py-2.5 text-white shadow-md shadow-orange-500/25 transition duration-200 cursor-pointer disabled:opacity-50"
                    >
                      <div className="grid h-4.5 w-4.5 place-items-center rounded-md bg-white/15 border border-white/25 shrink-0">
                        <Lock className="h-2.5 w-2.5 text-white stroke-[2.5]" />
                      </div>
                      <div className="text-left">
                        <span className="font-extrabold text-xs sm:text-[13px] uppercase tracking-wider block text-white leading-none">
                          {submittingReturn ? "SUBMITTING..." : "CONFIRM & SUBMIT RETURN"}
                        </span>
                        <span className="text-[9.5px] text-orange-100 font-medium normal-case block leading-tight mt-0.5">
                          Secure • Fast • Hassle-free
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* ── Bottom Trust Indicator ── */}
                  <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 font-medium pt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 stroke-[2]" />
                    <span>Your data is safe with us.</span>
                    <button
                      type="button"
                      onClick={() => setShowSecurityInfo(true)}
                      className="text-[#6d28d9] font-bold hover:underline cursor-pointer ml-0.5"
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Trust & Security "Learn More" Dialog (Explaining Online vs COD Timelines) ── */}
      {showSecurityInfo && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl text-left text-zinc-900 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowSecurityInfo(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-50 text-[#7c3aed] border border-purple-100">
                <ShieldCheck className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold">100% Safe Payouts</h4>
                <p className="text-xs text-zinc-500">How your refund data and timeline work.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs text-zinc-600 leading-relaxed">
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <p className="font-bold text-[#5b21b6] mb-0.5">Online Payments Refund Speed</p>
                <p className="text-zinc-600">For orders paid online (UPI / Card / NetBanking), funds are transferred directly within <strong>1–2 business days</strong> after the product is collected from your doorstep and verified.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <p className="font-bold text-emerald-800 mb-0.5">Cash on Delivery (COD) Payouts</p>
                <p className="text-zinc-600">For COD orders, refunds are directly transferred via Instant UPI or NEFT/IMPS to your bank account within <strong>2–3 business days</strong> after return collection.</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <p className="font-bold text-zinc-800 mb-0.5">End-to-End Encryption</p>
                <p className="text-zinc-500">All account details and UPI VPAs are tokenized and stored in 256-bit encrypted vaults in compliance with RBI payout guidelines.</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSecurityInfo(false)}
                className="rounded-xl bg-[#6d28d9] px-5 py-2 text-xs font-bold text-white hover:bg-[#5b21b6] transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Dialog ── */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-2xl text-stone-900 text-left animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setReviewModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100">
                <Sparkles className="h-5 w-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Write a Review</h3>
                <p className="text-xs text-stone-500">Rate and share your authentic experience.</p>
              </div>
            </div>

            {/* Interactive Rating Picker */}
            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/40 p-3.5 text-center">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setReviewRating(s)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors duration-150",
                        s <= activeRating
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-stone-300 hover:text-amber-200"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                {ratingLabels[activeRating] || "Select Rating"}
              </p>
            </div>

            {/* Review Comment */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Your Review
                </label>
                <span className="text-[10px] text-stone-400 font-medium">
                  {reviewText.length}/500
                </span>
              </div>
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="How did it fit? How is the comfort, material, and sole grip?..."
                rows={3}
                maxLength={500}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-full px-5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateReview}
                className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-glow hover:shadow-md transition cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
