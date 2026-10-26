import { Fragment } from "react";
import { X, Calendar, MapPin, CreditCard, Check } from "lucide-react";
import { cn, getImageUrl, formatDate, formatDateTime } from "@/lib/utils";


interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: any;
  statusStyles: Record<string, string>;
  isItemRefundedOrReturned: (item: any, order: any) => boolean;
  onCancel: (orderId: string) => void;
  onReturn: (orderId: string) => void;
  onReview: (productId: string, orderId: string, color: string, size: number | null) => void;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  selectedOrder,
  statusStyles,
  isItemRefundedOrReturned,
  onCancel,
  onReturn,
  onReview,
}: OrderDetailsModalProps) {
  if (!isOpen || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start lg:items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8 text-stone-900">
        <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="text-left">
            <h3 className="font-display text-xl font-bold text-stone-900">Order Details</h3>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Placed on {formatDateTime(selectedOrder.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-stone-100 text-stone-400 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 text-left">
          {/* Product list */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-black uppercase tracking-wider text-primary">Purchased Items</h4>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {selectedOrder.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-stone-150 bg-stone-50/50 p-3">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="h-11 w-11 rounded-xl object-cover bg-white border border-stone-150 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=120";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-stone-900">{item.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-stone-500 font-medium">Size {item.size} · Color: {item.color} · Qty {item.qty}</span>
                      {isItemRefundedOrReturned(item, selectedOrder) && (
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 shrink-0">
                          {selectedOrder.orderStatus === "Return Requested" || selectedOrder.status === "return_requested" 
                            ? "Return Requested" 
                            : selectedOrder.orderStatus === "Return Accepted" || selectedOrder.status === "return_accepted"
                              ? "Return Accepted"
                              : selectedOrder.paymentStatus === "Refunded" || selectedOrder.paymentStatus === "refunded"
                                ? "Refunded"
                                : "Returned"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm text-stone-900">₹{item.price * item.qty}</span>
                    {["Delivered", "delivered"].includes(selectedOrder.orderStatus || selectedOrder.status) && (
                      <button
                        onClick={() => {
                          const prodId = typeof item.product === "object" ? (item.product?._id || item.product?.id) : item.product;
                          onReview(String(prodId || ""), selectedOrder._id, item.color || "Default", item.size || null);
                        }}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition cursor-pointer"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Meta details grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-150 bg-stone-50/50 p-4 space-y-2">
              <h4 className="font-display text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Shipping Address
              </h4>
              <p className="text-xs font-bold text-stone-850 leading-relaxed text-left">
                {selectedOrder.shippingAddress?.name || selectedOrder.shippingAddress?.fullName}<br />
                {selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress?.line1}<br />
                {selectedOrder.shippingAddress?.city}
                {selectedOrder.shippingAddress?.state ? `, ${selectedOrder.shippingAddress?.state}` : ""}
                {selectedOrder.shippingAddress?.pincode ? ` - ${selectedOrder.shippingAddress?.pincode}` : selectedOrder.shippingAddress?.postalCode ? ` - ${selectedOrder.shippingAddress?.postalCode}` : ""}
                {selectedOrder.shippingAddress?.phone && <><br />Phone: {selectedOrder.shippingAddress.phone}</>}
                {selectedOrder.shippingAddress?.email && <><br />Email: {selectedOrder.shippingAddress.email}</>}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-150 bg-stone-50/50 p-4 space-y-2">
              <h4 className="font-display text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Payment Summary
              </h4>
              <div className="text-xs space-y-1">
                <p className="flex justify-between items-center font-medium text-stone-550 py-0.5">
                  Method: 
                  <span className="font-extrabold text-[10px] uppercase tracking-wider bg-stone-100 text-stone-850 px-2.5 py-0.5 rounded-full border border-stone-200">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>
                <p className="flex justify-between items-center font-medium text-stone-550 py-0.5">
                  Payment Status: 
                  <span className={cn(
                    "font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
                    (() => {
                      const payStat = selectedOrder.paymentStatus?.toLowerCase() || "";
                      const method = selectedOrder.paymentMethod?.toLowerCase() || "";
                      const displayStatus = (method === "online" && payStat === "pending") || payStat === "cancelled" ? "failed" : payStat;
                      
                      if (displayStatus === "paid") {
                        return "bg-emerald-50 text-emerald-600 border-emerald-200";
                      }
                      if (displayStatus === "refunded") {
                        return "bg-purple-50 text-purple-600 border-purple-200";
                      }
                      if (displayStatus === "failed") {
                        return "bg-red-50 text-red-600 border-red-200";
                      }
                      return "bg-amber-550/10 text-amber-600 border-amber-500/20";
                    })()
                  )}>
                    {(() => {
                      const payStat = selectedOrder.paymentStatus?.toLowerCase() || "";
                      const method = selectedOrder.paymentMethod?.toLowerCase() || "";
                      return (method === "online" && payStat === "pending") || payStat === "cancelled" ? "FAILED" : selectedOrder.paymentStatus?.toUpperCase();
                    })()}
                  </span>
                </p>
                <p className="flex justify-between items-center font-medium text-stone-550 py-0.5">
                  Order Status: 
                  <span className={cn(
                    "font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full",
                    statusStyles[selectedOrder.orderStatus || selectedOrder.status] || "bg-stone-100 text-stone-650 border border-stone-200"
                  )}>
                    {selectedOrder.orderStatus || selectedOrder.status}
                  </span>
                </p>
                {selectedOrder.transactionId && (
                  <p className="flex justify-between font-medium text-stone-500 truncate max-w-full">Txn ID: <span className="font-semibold text-stone-800 text-[10px]">{selectedOrder.transactionId}</span></p>
                )}
                <p className="flex justify-between font-medium text-stone-500 border-t border-stone-200/80 pt-1 mt-1 font-display text-sm font-extrabold text-stone-900">Total: <span>₹{selectedOrder.total}</span></p>
              </div>
            </div>
          </div>

          {/* Status History & Return/Refund Lifecycle Tracker */}
          {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
            <div className="space-y-4 border-t border-stone-100 pt-6">
              <h4 className="font-display text-xs font-black uppercase tracking-widest text-primary text-left">
                {["Return Requested", "Return Accepted", "Out for Pickup", "Item Picked Up", "Returned", "Refund Initiated", "Refunded"].includes(selectedOrder.orderStatus)
                  ? "Return & Refund Tracking"
                  : "Order Status Tracker"}
              </h4>
              
              {selectedOrder.orderStatus === "Cancelled" ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border p-4 text-xs font-bold text-center bg-red-50 border-red-200 text-red-600">
                    This order was cancelled: {selectedOrder.cancelReason || "No reason provided"}
                  </div>

                  {/* Amazon/Flipkart Style Refund Payout Card for Prepaid Cancelled Orders */}
                  {selectedOrder.refundDetails && (
                    <div className="rounded-2xl border border-orange-200/80 bg-[#fffaf5] p-4 space-y-3 text-left">
                      <div className="flex items-center justify-between border-b border-orange-150 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 text-[#F46A1E]" />
                          Prepaid Cancellation Refund
                        </span>
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border",
                          selectedOrder.refundDetails?.refundStatus === "Refunded" || selectedOrder.paymentStatus?.toLowerCase() === "refunded"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : selectedOrder.refundDetails?.refundStatus === "Pending Approval" || selectedOrder.paymentStatus === "Refund Pending Approval"
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-orange-100 text-orange-800 border-orange-300"
                        )}>
                          {selectedOrder.refundDetails?.refundStatus === "Refunded" || selectedOrder.paymentStatus?.toLowerCase() === "refunded" 
                            ? "Refund Credited" 
                            : selectedOrder.refundDetails?.refundStatus === "Pending Approval" || selectedOrder.paymentStatus === "Refund Pending Approval"
                            ? "Pending Admin Approval"
                            : "Refund Initiated"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Refund Destination</span>
                          <p className="font-bold text-stone-850 mt-0.5">
                            Original Payment Source ({selectedOrder.paymentMethod || "Online / Razorpay"})
                          </p>
                          {selectedOrder.razorpayPaymentId && (
                            <p className="text-[10px] text-stone-500 font-mono truncate">Payment Ref: {selectedOrder.razorpayPaymentId}</p>
                          )}
                        </div>

                        <div>
                          <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Refund Amount</span>
                          <p className="font-display font-extrabold text-stone-900 text-sm mt-0.5">
                            ₹{selectedOrder.refundDetails?.refundAmount || selectedOrder.total}
                          </p>
                          {selectedOrder.refundDetails?.refundTransactionId ? (
                            <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                              UTR / Ref: {selectedOrder.refundDetails.refundTransactionId}
                            </p>
                          ) : (
                            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                              {selectedOrder.refundDetails?.refundStatus === "Pending Approval" || selectedOrder.paymentStatus === "Refund Pending Approval"
                                ? "Awaiting admin verification & approval"
                                : "Est. Credit: 1–2 business days"}
                            </p>
                          )}
                        </div>
                      </div>

                      {(selectedOrder.refundDetails?.refundStatus === "Pending Approval" || selectedOrder.paymentStatus === "Refund Pending Approval") && (
                        <p className="text-[10.5px] text-stone-500 pt-2 border-t border-orange-100/70 leading-relaxed">
                          ℹ️ Your cancellation & refund request is under review by our admin team. Once approved, the funds will be transferred directly to your payment source.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : ["Return Requested", "Return Accepted", "Out for Pickup", "Item Picked Up", "Returned", "Refund Initiated", "Refunded"].includes(selectedOrder.orderStatus) ? (
                <div className="space-y-4">
                  {/* Return & Refund Stepper Tracker */}
                  <div className="w-full pt-3 pb-2 select-none">
                    {(() => {
                      const returnSteps = ["Return Requested", "Return Accepted", "Item Picked Up", "Refund Initiated", "Refunded"];
                      const currentStatus = selectedOrder.orderStatus === "Returned" ? "Item Picked Up" : selectedOrder.orderStatus;
                      const currentStepIndex = returnSteps.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());
                      const clampedStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
                      
                      const getReturnStatusDate = (statusName: string) => {
                        const match = selectedOrder.statusHistory?.find((h: any) => h.status.toLowerCase() === statusName.toLowerCase() || (statusName === "Item Picked Up" && h.status.toLowerCase() === "returned"));
                        return match ? formatDate(match.updatedAt) : null;
                      };

                      return (
                        <div className="flex items-center justify-between w-full">
                          {returnSteps.map((step, idx) => {
                            const isCompleted = idx < clampedStepIndex;
                            const isActive = idx === clampedStepIndex;
                            const stepDate = getReturnStatusDate(step);

                            return (
                              <Fragment key={step}>
                                {/* Node */}
                                <div className="flex flex-col items-center relative shrink-0">
                                  <div
                                    className={cn(
                                      "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs select-none",
                                      isCompleted
                                        ? "bg-[#F46A1E] text-white border-2 border-[#F46A1E]"
                                        : isActive
                                        ? "bg-white text-[#F46A1E] border-2 border-[#F46A1E] ring-4 ring-orange-100 shadow-md scale-105"
                                        : "bg-stone-50 text-stone-300 border-2 border-stone-200"
                                    )}
                                  >
                                    {isCompleted ? (
                                      <Check className="h-4 w-4 stroke-[3]" />
                                    ) : (
                                      <span className="text-xs font-extrabold font-mono">{idx + 1}</span>
                                    )}
                                  </div>

                                  {/* Label & Date */}
                                  <div className="absolute top-10 sm:top-11 flex flex-col items-center w-20 sm:w-24 text-center pointer-events-none">
                                    <span
                                      className={cn(
                                        "text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-tight leading-tight",
                                        isActive
                                          ? "text-orange-700 font-black"
                                          : isCompleted
                                          ? "text-stone-850"
                                          : "text-stone-400"
                                      )}
                                    >
                                      {step === "Return Accepted" ? "Approved" : step === "Item Picked Up" ? "Picked Up" : step}
                                    </span>
                                    {stepDate && (
                                      <span className="text-[7.5px] sm:text-[8px] font-bold text-stone-400 mt-0.5 whitespace-nowrap">
                                        {stepDate}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Connecting Segment */}
                                {idx < returnSteps.length - 1 && (
                                  <div className="flex-1 h-[2.5px] mx-1 sm:mx-1.5 rounded-full overflow-hidden bg-stone-200/80">
                                    <div
                                      className={cn(
                                        "h-full transition-all duration-500",
                                        idx < clampedStepIndex ? "bg-[#F46A1E] w-full" : "w-0"
                                      )}
                                    />
                                  </div>
                                )}
                              </Fragment>
                            );
                          })}
                        </div>
                      );
                    })()}
                    <div className="h-10 sm:h-11" />
                  </div>

                  {/* Amazon/Flipkart-Style Refund Payout Destination Card */}
                  <div className="rounded-2xl border border-orange-200/80 bg-[#fffaf5] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-orange-150 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-[#F46A1E]" />
                        Refund Payout Details
                      </span>
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border",
                        selectedOrder.orderStatus === "Refunded" || selectedOrder.paymentStatus?.toLowerCase() === "refunded"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-orange-100 text-orange-800 border-orange-300"
                      )}>
                        {selectedOrder.orderStatus === "Refunded" || selectedOrder.paymentStatus?.toLowerCase() === "refunded" ? "Refund Credited" : "Refund in Progress"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Refund Destination</span>
                        {selectedOrder.refundDetails?.refundMethod === "bank" ? (
                          <p className="font-bold text-stone-850 mt-0.5">
                            {selectedOrder.refundDetails?.bankDetails?.bankName || "Bank Transfer"} (A/C: {selectedOrder.refundDetails?.bankDetails?.maskedAccountNumber || "••••"})
                          </p>
                        ) : selectedOrder.refundDetails?.refundMethod === "upi" ? (
                          <p className="font-bold text-stone-850 mt-0.5">
                            UPI ID: <span className="font-mono text-orange-700 font-bold">{selectedOrder.refundDetails?.upiDetails?.maskedUpiId || selectedOrder.refundDetails?.upiDetails?.upiId}</span>
                          </p>
                        ) : (
                          <p className="font-bold text-stone-850 mt-0.5">Original Payment Source ({selectedOrder.paymentMethod})</p>
                        )}
                        {selectedOrder.refundDetails?.bankDetails?.accountHolderName && (
                          <p className="text-[11px] text-stone-500">Beneficiary: {selectedOrder.refundDetails?.bankDetails?.accountHolderName}</p>
                        )}
                      </div>

                      <div>
                        <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider block">Refund Amount</span>
                        <p className="font-display font-extrabold text-stone-900 text-sm mt-0.5">
                          ₹{selectedOrder.refundDetails?.refundAmount || selectedOrder.total}
                        </p>
                        {selectedOrder.refundDetails?.refundTransactionId ? (
                          <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                            UTR / Ref: {selectedOrder.refundDetails.refundTransactionId}
                          </p>
                        ) : (
                          <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                            Est. Credit: {["online", "upi", "card", "prepaid", "razorpay"].includes((selectedOrder.paymentMethod || "").toLowerCase()) ? "1–2 business days after product collection" : "2–3 business days after pickup"}
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedOrder.returnReason && (
                      <div className="pt-2 border-t border-orange-100 text-[11px] text-stone-600">
                        <span className="font-bold text-stone-700">Return Reason: </span>
                        {selectedOrder.returnReason}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Standard Forward Delivery Stepper */
                <div className="w-full pt-3 pb-2 select-none">
                  {(() => {
                    const steps = ["Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
                    const currentStatus = selectedOrder.orderStatus || selectedOrder.status || "Placed";
                    const currentStepIndex = steps.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());
                    const clampedStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
                    
                    const getStatusDate = (statusName: string) => {
                      const match = selectedOrder.statusHistory?.find((h: any) => h.status.toLowerCase() === statusName.toLowerCase());
                      return match ? formatDate(match.updatedAt) : null;
                    };

                    return (
                      <div className="flex items-center justify-between w-full">
                        {steps.map((step, idx) => {
                          const isCompleted = idx < clampedStepIndex;
                          const isActive = idx === clampedStepIndex;
                          const stepDate = getStatusDate(step);

                          return (
                            <Fragment key={step}>
                              {/* Node */}
                              <div className="flex flex-col items-center relative shrink-0">
                                <div
                                  className={cn(
                                    "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs select-none",
                                    isCompleted
                                      ? "bg-emerald-500 text-white border-2 border-emerald-500"
                                      : isActive
                                      ? "bg-white text-emerald-600 border-2 border-emerald-500 ring-4 ring-emerald-100 shadow-md scale-105"
                                      : "bg-stone-50 text-stone-300 border-2 border-stone-200"
                                  )}
                                >
                                  {isCompleted ? (
                                    <Check className="h-4 w-4 stroke-[3]" />
                                  ) : (
                                    <span className="text-xs font-extrabold font-mono">{idx + 1}</span>
                                  )}
                                </div>

                                {/* Label & Date */}
                                <div className="absolute top-10 sm:top-11 flex flex-col items-center w-20 sm:w-24 text-center pointer-events-none">
                                  <span
                                    className={cn(
                                      "text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-tight leading-tight",
                                      isActive
                                        ? "text-emerald-600 font-black"
                                        : isCompleted
                                        ? "text-stone-850"
                                        : "text-stone-400"
                                    )}
                                  >
                                    {step}
                                  </span>
                                  {stepDate && (
                                    <span className="text-[7.5px] sm:text-[8px] font-bold text-stone-400 mt-0.5 whitespace-nowrap">
                                      {stepDate}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Connecting Segment */}
                              {idx < steps.length - 1 && (
                                <div className="flex-1 h-[2.5px] mx-1 sm:mx-1.5 rounded-full overflow-hidden bg-stone-200/80">
                                  <div
                                    className={cn(
                                      "h-full transition-all duration-500",
                                      idx < clampedStepIndex ? "bg-emerald-500 w-full" : "w-0"
                                    )}
                                  />
                                </div>
                              )}
                            </Fragment>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <div className="h-10 sm:h-11" />
                </div>
              )}

            </div>
          )}
        </div>


        <div className="mt-8 flex justify-end gap-3 border-t border-stone-100 pt-4">
          {["Placed", "Confirmed", "Processing", "pending", "paid"].includes(selectedOrder.orderStatus || selectedOrder.status) && (
            <button
              onClick={() => onCancel(selectedOrder._id)}
              className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
            >
              Cancel Order
            </button>
          )}
          {(() => {
            const isDelivered = ["Delivered", "delivered"].includes(selectedOrder.orderStatus || selectedOrder.status);
            if (!isDelivered) return null;

            const deliveryDate = selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt) : new Date(selectedOrder.createdAt);
            const now = new Date();
            const diffDays = Math.abs(now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);

            let maxDaysAllowed = 3;
            if (selectedOrder.items && selectedOrder.items.length > 0) {
              for (const item of selectedOrder.items) {
                const product = item.product;
                if (product && typeof product === "object") {
                  const promo = product.promo2 || "3-day returns";
                  const match = promo.match(/(\d+)-day/i);
                  if (match) {
                    const days = parseInt(match[1], 10);
                    if (days > maxDaysAllowed) {
                      maxDaysAllowed = days;
                    }
                  }
                }
              }
            }

            if (diffDays > maxDaysAllowed) return null;

            return (
              <button
                onClick={() => onReturn(selectedOrder._id)}
                className="rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100 transition cursor-pointer"
              >
                Request Return
              </button>
            );
          })()}
          <button
            onClick={onClose}
            className="rounded-full bg-stone-900 px-5 py-2 text-xs font-bold text-white hover:bg-stone-850 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
