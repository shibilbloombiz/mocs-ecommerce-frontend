import { useState } from "react";
import { Star, X, AlertCircle, Sparkles, CornerDownLeft, RotateCcw } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

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
  handleReturnOrder: () => void;

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

  const activeRating = hoverRating || reviewRating;

  return (
    <>
      {/* Cancel Order Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xl text-stone-900 text-left animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setCancelModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Cancel Order</h3>
                <p className="text-xs text-stone-500">Let us know why you'd like to cancel.</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Cancellation Reason
              </label>
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-red-500 focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="e.g., Ordered by mistake, found better price elsewhere..."
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-red-700 hover:shadow-md transition cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xl text-stone-900 text-left animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setReturnModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Request Return</h3>
                <p className="text-xs text-stone-500">Select items and state the reason for return.</p>
              </div>
            </div>

            {selectedOrder && selectedOrder.items?.length > 1 && (
              <div className="mt-5 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  Select Item(s) to Return
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item: any, idx: number) => {
                    const key = `${item.product?.id || item.product}_${item.size}_${item.color}`;
                    const isChecked = returnItems.includes(key);
                    return (
                      <label
                        key={idx}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-2.5 transition cursor-pointer text-xs font-semibold",
                          isChecked
                            ? "border-purple-300 bg-purple-50/40 text-purple-950 shadow-xs"
                            : "border-stone-200/70 bg-stone-50/40 text-stone-700 hover:bg-stone-100/50"
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
                          className="rounded border-stone-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover bg-white border border-stone-200/60 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=120";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-bold text-stone-900">{item.name}</p>
                          <p className="text-[10px] text-stone-500">
                            Size {item.size} · {item.color} · Qty {item.qty}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Reason for Return
              </label>
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-purple-500 focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="e.g., Size is too small, defective sole, wrong color received..."
                rows={3}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setReturnModal(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleReturnOrder}
                className="rounded-full bg-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary transition cursor-pointer shadow-md"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xl text-stone-900 text-left animate-in zoom-in-95 duration-200">
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
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-center">
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
                        "h-8 w-8 transition-colors duration-150",
                        s <= activeRating
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-stone-300 hover:text-amber-200"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                {ratingLabels[activeRating] || "Select Rating"}
              </p>
            </div>

            {/* Review Comment */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Your Review
                </label>
                <span className="text-[10px] text-stone-400 font-medium">
                  {reviewText.length}/500
                </span>
              </div>
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="How did it fit? How is the comfort, material, and sole grip?..."
                rows={4}
                maxLength={500}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateReview}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-glow hover:shadow-md transition cursor-pointer"
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
