import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Edit3,
  X,
  Truck,
  Check,
  CornerUpLeft,
  Clock,
  RotateCcw,
  ChevronDown,
  Building2,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Send,
  Lock,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { cn, getImageUrl, formatDateTime } from "@/lib/utils";
import { AdminDropdown } from "@/components/admin/AdminShell";


const isItemRefundedOrReturned = (item: any, order: any) => {
  if (!order) return false;
  const hasReturnStatus = 
    order.orderStatus === "Returned" || 
    order.status === "returned" || 
    order.orderStatus === "Return Requested" || 
    order.status === "return_requested" || 
    order.orderStatus === "Return Accepted" || 
    order.status === "return_accepted" || 
    order.orderStatus === "Item Picked Up" || 
    order.orderStatus === "Refund Initiated" || 
    order.orderStatus === "Refunded" || 
    order.paymentStatus === "Refunded" || 
    order.paymentStatus === "refunded";
  if (!hasReturnStatus && !order.returnReason) return false;
  if (order.items?.length === 1) return true;
  const reason = (order.returnReason || "").toLowerCase();
  return reason.includes(item.name.toLowerCase());
};

const getOrderStatusStyle = (status: string) => {
  const s = status || "Placed";
  switch (s) {
    case "Placed":
    case "placed":
      return "bg-zinc-100 text-zinc-700 border border-zinc-300/60";
    case "Confirmed":
    case "confirmed":
      return "bg-blue-100 text-blue-800 border border-blue-300/60";
    case "Processing":
    case "processing":
      return "bg-amber-100 text-amber-800 border border-amber-300/60";
    case "Shipped":
    case "shipped":
      return "bg-indigo-100 text-indigo-800 border border-indigo-300/60";
    case "Out for Delivery":
    case "out_for_delivery":
      return "bg-purple-100 text-purple-800 border border-purple-300/60";
    case "Delivered":
    case "delivered":
      return "bg-emerald-100 text-emerald-800 border border-emerald-300/60";
    case "Cancelled":
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-300/60";
    case "Return Requested":
    case "return_requested":
      return "bg-purple-100 text-purple-800 border border-purple-300/60";
    case "Return Accepted":
    case "return_accepted":
      return "bg-sky-100 text-sky-800 border border-sky-300/60";
    case "Out for Pickup":
      return "bg-amber-100 text-amber-800 border border-amber-300/60";
    case "Item Picked Up":
      return "bg-indigo-100 text-indigo-800 border border-indigo-300/60";
    case "Returned":
    case "returned":
      return "bg-teal-100 text-teal-800 border border-teal-300/60";
    case "Refund Initiated":
      return "bg-cyan-100 text-cyan-800 border border-cyan-300/60";
    case "Refunded":
    case "refunded":
      return "bg-emerald-100 text-emerald-800 border border-emerald-300/60";
    default:
      return "bg-stone-100 text-stone-700 border border-stone-300/60";
  }
};


const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Manage Orders — MOCS Admin" },
    ],
  }),
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [showDeleted, setShowDeleted] = useState("false");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Detailed modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Refund processing state
  const [refundUtr, setRefundUtr] = useState("");
  const [refundNotes, setRefundNotes] = useState("");
  const [manualRefundMethod, setManualRefundMethod] = useState("original");
  const [manualRefundAmount, setManualRefundAmount] = useState("");
  const [processingRefund, setProcessingRefund] = useState(false);
  const [showRefundConfirmModal, setShowRefundConfirmModal] = useState(false);


  const [viewedOrderIds, setViewedOrderIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("mocs_viewed_orders");
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
    return new Set<string>();
  });

  const markAsViewed = (orderId: string) => {
    setViewedOrderIds((prev) => {
      const updated = new Set(prev);
      updated.add(orderId);
      try {
        localStorage.setItem("mocs_viewed_orders", JSON.stringify(Array.from(updated)));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  useEffect(() => {
    setPage(1);
  }, [statusFilter, payFilter, methodFilter, showDeleted, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.orders.listAll(`showDeleted=${showDeleted}`);
      
      let filtered = [...res];

      // If viewing active orders without specific failed/pending filters, filter out cancelled/unpaid online payment attempts
      if (showDeleted === "false" && !payFilter && !statusFilter) {
        filtered = filtered.filter((o) => {
          const isOnline = (o.paymentMethod || "").toLowerCase() === "online";
          const isUnpaid = ["pending", "failed", "cancelled"].includes((o.paymentStatus || "").toLowerCase());
          if (isOnline && isUnpaid && !o.paidAt) return false;
          return true;
        });
      }

      if (statusFilter) {
        filtered = filtered.filter(o => (o.orderStatus || o.status || "").toLowerCase() === statusFilter.toLowerCase());
      }


      if (payFilter) {
        filtered = filtered.filter(o => (o.paymentStatus || "").toLowerCase() === payFilter.toLowerCase());
      }

      if (methodFilter) {
        filtered = filtered.filter(o => (o.paymentMethod || "").toLowerCase() === methodFilter.toLowerCase());
      }

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(o => 
          (o.razorpayOrderId && o.razorpayOrderId.toLowerCase().includes(query)) ||
          o._id.toLowerCase().includes(query) ||
          (o.user && o.user.name.toLowerCase().includes(query)) ||
          (o.user && o.user.email.toLowerCase().includes(query)) ||
          (o.shippingAddress && o.shippingAddress.name && o.shippingAddress.name.toLowerCase().includes(query))
        );
      }

      setOrders(filtered);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load orders", { id: "load-orders-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, payFilter, methodFilter, showDeleted]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openOrderId = params.get("openOrderId");
    if (openOrderId && orders.length > 0) {
      const orderToOpen = orders.find((o) => o._id === openOrderId);
      if (orderToOpen) {
        openDetailModal(orderToOpen);
        // Clear query param so it doesn't reopen on page refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [orders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openDetailModal = (order: any) => {
    setSelectedOrder(order);
    setRefundUtr(order?.refundDetails?.refundTransactionId || `UTR-${Date.now().toString().slice(-8)}`);
    setRefundNotes(order?.refundDetails?.adminNotes || "");
    setManualRefundMethod(order?.refundDetails?.refundMethod || (order?.paymentMethod === "online" ? "original" : "bank"));
    setManualRefundAmount(String(order?.refundDetails?.refundAmount || order?.total || ""));
    setDetailModalOpen(true);
    markAsViewed(order._id);
  };

  const initiateRefundConfirmation = () => {
    if (!refundUtr.trim()) {
      toast.error("Please enter a valid UTR / Transaction Reference ID before confirming.");
      return;
    }
    setShowRefundConfirmModal(true);
  };

  const handleProcessRefund = async (orderId: string) => {
    setProcessingRefund(true);
    try {
      const updated = await apiClient.orders.processRefund(orderId, {
        utr: refundUtr.trim() || undefined,
        adminNotes: refundNotes.trim() || undefined,
        refundAmount: Number(manualRefundAmount) || selectedOrder?.refundDetails?.refundAmount || selectedOrder?.total,
        refundMethod: manualRefundMethod,
      });
      toast.success(`Manual refund of ₹${updated.refundDetails?.refundAmount || updated.total} recorded and marked completed!`);
      setSelectedOrder(updated);
      setShowRefundConfirmModal(false);
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.message || "Failed to process refund payout");
    } finally {
      setProcessingRefund(false);
    }
  };


  const handleUpdateStatus = async (orderId: string, newStatus: string, note?: string) => {
    setUpdatingStatus(true);
    try {
      const updated = await apiClient.orders.updateStatus(orderId, newStatus, note);
      toast.success(`Order status updated to: ${newStatus}`);
      setSelectedOrder(updated);
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPayStatus: string) => {
    setUpdatingStatus(true);
    try {
      const updated = await apiClient.orders.updatePaymentStatus(orderId, newPayStatus);
      toast.success(`Payment status updated to: ${newPayStatus}`);
      setSelectedOrder(updated);
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update payment status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSoftDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to archive/soft-delete this order?")) return;
    try {
      await apiClient.orders.delete(orderId);
      toast.success("Order archived successfully");
      setDetailModalOpen(false);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const handleRestore = async (orderId: string) => {
    try {
      await apiClient.orders.restore(orderId);
      toast.success("Order restored successfully");
      setDetailModalOpen(false);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to restore order");
    }
  };

  // Pagination index slices
  const totalPages = Math.ceil(orders.length / limit);
  const paginatedOrders = orders.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-foreground flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" /> Manage Orders
        </h1>
        <p className="text-muted-foreground text-sm">Fulfill orders, track payments, and review deliveries.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-glow">
            Search
          </button>

          <div className="flex flex-wrap gap-2 items-center">
            <AdminDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "", label: "Fulfillment Status" },
                { value: "Placed", label: "Placed" },
                { value: "Confirmed", label: "Confirmed" },
                { value: "Processing", label: "Processing" },
                { value: "Shipped", label: "Shipped" },
                { value: "Out for Delivery", label: "Out for Delivery" },
                { value: "Delivered", label: "Delivered" },
                { value: "Cancelled", label: "Cancelled" },
                { value: "Return Requested", label: "Return Requested" },
                { value: "Return Accepted", label: "Return Accepted" },
                { value: "Returned", label: "Returned" },
              ]}
            />

            <AdminDropdown
              value={payFilter}
              onChange={setPayFilter}
              options={[
                { value: "", label: "Payment Status" },
                { value: "Pending", label: "Pending" },
                { value: "Paid", label: "Paid" },
                { value: "Failed", label: "Failed" },
                { value: "Refunded", label: "Refunded" },
              ]}
            />

            <AdminDropdown
              value={methodFilter}
              onChange={setMethodFilter}
              options={[
                { value: "", label: "Payment Method" },
                { value: "COD", label: "COD" },
                { value: "Online", label: "Online" },
              ]}
            />

            <AdminDropdown
              value={showDeleted}
              onChange={setShowDeleted}
              options={[
                { value: "false", label: "Active Orders" },
                { value: "true", label: "Archived Orders" },
                { value: "all", label: "All Orders" },
              ]}
            />
          </div>
        </form>
      </div>

      {/* Orders List Table */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex py-20 justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No customer orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground text-xs font-bold uppercase border-b border-border">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Fulfillment</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Total</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedOrders.map((o) => (
                  <tr key={o._id} className={o.isDeleted ? "opacity-60 bg-muted/10" : "hover:bg-muted/10 transition"}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {o.razorpayOrderId ? o.razorpayOrderId.slice(-8).toUpperCase() : o._id.slice(-8).toUpperCase()}
                        </p>
                        {(o.orderStatus === "Placed" || o.status === "placed") && (
                          <span className="inline-flex items-center rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{formatDate(o.createdAt)}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{o.shippingAddress?.name || o.user?.name || "Guest User"}</p>
                      <p className="text-xs text-muted-foreground">{o.shippingAddress?.phone || "—"}</p>
                    </td>
                     <td className="p-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        getOrderStatusStyle(o.orderStatus || o.status)
                      }`}>
                        {o.orderStatus || o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        {(() => {
                          const payStat = o.paymentStatus || "";
                          const isPendingApproval = payStat.toLowerCase().includes("pending approval") || o.refundDetails?.refundStatus === "Pending Approval";
                          const isRefunded = payStat.toLowerCase() === "refunded" || o.refundDetails?.refundStatus === "Refunded";
                          const isPaid = payStat.toLowerCase() === "paid";
                          const isFailed = ["failed", "cancelled"].includes(payStat.toLowerCase()) && !isPendingApproval && !isRefunded;
                          
                          let badgeClass = "bg-amber-500/10 text-amber-600 border border-amber-500/20";
                          let displayLabel = o.paymentStatus;

                          if (isPendingApproval) {
                            badgeClass = "bg-amber-500/15 text-amber-700 border border-amber-500/30 font-black animate-pulse";
                            displayLabel = "Refund Approval Required";
                          } else if (isPaid) {
                            badgeClass = "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
                          } else if (isFailed) {
                            badgeClass = "bg-destructive/10 text-destructive border border-destructive/20";
                          } else if (isRefunded) {
                            badgeClass = "bg-purple-500/10 text-purple-600 border border-purple-500/20";
                          }

                          return (
                            <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                              {displayLabel}
                            </span>
                          );
                        })()}
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{o.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-4 font-display text-sm font-bold text-foreground">
                      ₹{o.totalAmount || o.total}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDetailModal(o)}
                        className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-primary hover:text-primary flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border p-4 bg-muted/5">
            <span className="text-xs text-muted-foreground font-semibold">
              Showing page {page} of {totalPages} ({orders.length} orders total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold transition hover:bg-accent disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold transition hover:bg-accent disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal Overlay */}
      <AnimatePresence>
        {detailModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 p-4 backdrop-blur-md overflow-y-auto select-none">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl rounded-[28px] border border-stone-200/60 bg-white p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] my-4 font-sans"
            >
              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />

              {/* Header */}
              <div className="mb-6 flex items-start justify-between border-b border-stone-100 pb-4 pt-2">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Order Management
                  </span>
                  <h3 className="font-display text-2xl font-black text-stone-900 mt-1">
                    Order Details: <span className="font-mono text-lg font-bold text-stone-600">
                      {selectedOrder.razorpayOrderId ? selectedOrder.razorpayOrderId.slice(-8).toUpperCase() : selectedOrder._id.slice(-8).toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">Placed on {formatDateTime(selectedOrder.createdAt)}</p>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="rounded-full p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-300 focus:outline-none cursor-pointer"
                >
                  <X className="h-5.5 w-5.5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="grid gap-6 md:grid-cols-2 text-left overflow-y-auto pr-1 flex-1 no-scrollbar pb-2">
                
                {/* Left Column: Purchased Items, Prices & Customer Shipping Details */}
                <div className="space-y-5">
                  <div>
                    <h4 className="font-display text-xs font-black uppercase tracking-widest text-primary border-l-2 border-primary pl-2 mb-3">Purchased Items</h4>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1.5 no-scrollbar">
                      {selectedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 p-3 hover:bg-stone-50 transition-all duration-200">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="h-14 w-14 rounded-xl object-cover bg-stone-100 border border-stone-200/50 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=120";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-extrabold text-stone-900">{item.name}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-semibold text-stone-500">
                                Size {item.size} · Color: <span className="font-bold text-stone-600">{item.color}</span> · Qty <span className="font-bold text-stone-600">{item.qty}</span>
                              </span>
                              {isItemRefundedOrReturned(item, selectedOrder) && (
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 shrink-0">
                                  {selectedOrder.orderStatus === "Return Requested" || selectedOrder.status === "return_requested" ? "Return Requested" : "Refunded / Returned"}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-sm text-stone-900 bg-white border border-stone-150 px-2 py-1 rounded-lg shadow-2xs">
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-stone-50/30 p-4 text-sm space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Subtotal</span>
                      <span className="font-bold text-stone-800">₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Shipping Charge</span>
                      <span className="font-bold text-stone-800">{selectedOrder.shipping === 0 ? "Free" : `₹${selectedOrder.shipping}`}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-100 pt-3 font-display text-lg font-black">
                      <span className="text-stone-900">Total Amount</span>
                      <span className="text-primary text-xl">₹{selectedOrder.totalAmount || selectedOrder.total}</span>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div>
                    <h4 className="font-display text-xs font-black uppercase tracking-widest text-primary border-l-2 border-primary pl-2 mb-3">Customer Shipping Details</h4>
                    <div className="rounded-2xl border border-stone-150 bg-stone-50/20 p-4 text-xs space-y-2.5 leading-relaxed text-stone-700">
                      <p className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-400 font-medium uppercase tracking-wider text-[9px]">Name</span>
                        <span className="font-bold text-stone-900">{selectedOrder.shippingAddress?.name || selectedOrder.user?.name || "Guest"}</span>
                      </p>
                      <p className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-400 font-medium uppercase tracking-wider text-[9px]">Phone</span>
                        <span className="font-bold text-stone-900">{selectedOrder.shippingAddress?.phone || "—"}</span>
                      </p>
                      <p className="flex justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-stone-400 font-medium uppercase tracking-wider text-[9px]">Email</span>
                        <span className="font-bold text-stone-900">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email || "—"}</span>
                      </p>
                      <div className="pt-1.5">
                        <span className="text-stone-400 font-medium uppercase tracking-wider text-[9px] block mb-1">Shipping Address</span>
                        <p className="font-semibold text-stone-800 leading-normal">
                          {selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress?.line1}<br />
                          {selectedOrder.shippingAddress?.city}
                          {selectedOrder.shippingAddress?.state ? `, ${selectedOrder.shippingAddress?.state}` : ""}
                          {selectedOrder.shippingAddress?.pincode ? ` - ${selectedOrder.shippingAddress?.pincode}` : selectedOrder.shippingAddress?.postalCode ? ` - ${selectedOrder.shippingAddress?.postalCode}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Status Info & Actions */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display text-xs font-black uppercase tracking-widest text-primary border-l-2 border-primary pl-2 mb-3">Order Status Details</h4>
                    <div className="rounded-2xl border border-stone-150 bg-stone-50/20 p-4 text-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500 font-medium">Fulfillment Status:</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          getOrderStatusStyle(selectedOrder.orderStatus || selectedOrder.status)
                        }`}>
                          {selectedOrder.orderStatus || selectedOrder.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-t border-stone-100 pt-2.5">
                        <span className="text-stone-500 font-medium">Payment Status:</span>
                        {(() => {
                          const payStat = selectedOrder.paymentStatus?.toLowerCase() || "";
                          const method = selectedOrder.paymentMethod?.toLowerCase() || "";
                          const displayStatus = (method === "online" && payStat === "pending") || payStat === "cancelled" ? "Failed" : selectedOrder.paymentStatus;
                          const isPaid = displayStatus === "Paid" || displayStatus === "paid";
                          const isFailed = displayStatus === "Failed" || displayStatus === "failed" || displayStatus === "Cancelled" || displayStatus === "cancelled";
                          const isRefunded = displayStatus === "Refunded" || displayStatus === "refunded";
                          
                          let badgeClass = "bg-amber-500/10 text-amber-600 border border-amber-500/20";
                          if (isPaid) badgeClass = "bg-emerald-500/10 text-emerald-650 border border-emerald-500/20";
                          if (isFailed) badgeClass = "bg-red-500/10 text-red-650 border border-red-500/20";
                          if (isRefunded) badgeClass = "bg-purple-500/10 text-purple-650 border border-purple-500/20";

                          return (
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${badgeClass}`}>
                              {displayStatus}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="flex justify-between items-center border-t border-stone-100 pt-2.5">
                        <span className="text-stone-500 font-medium">Payment Method:</span>
                        <span className="font-bold text-stone-850 uppercase text-[10px]">{selectedOrder.paymentMethod || "COD"}</span>
                      </div>

                      {selectedOrder.transactionId && (
                        <div className="border-t border-stone-100 pt-2.5 font-mono text-[9px] text-stone-500 flex justify-between gap-2 overflow-hidden">
                          <span>TXN ID:</span>
                          <span className="font-bold text-stone-800 truncate max-w-[190px]">{selectedOrder.transactionId}</span>
                        </div>
                      )}

                      {selectedOrder.cancelReason && (
                        <div className="border-t border-stone-100 pt-2.5 text-xs text-red-600 font-bold">
                          <strong>Reason:</strong> {selectedOrder.cancelReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operations & Timeline */}
                  <div>
                    <h4 className="font-display text-xs font-black uppercase tracking-widest text-primary border-l-2 border-primary pl-2 mb-3">
                      {selectedOrder.isDeleted ? "Management Operations" : "Fulfillment & Status Actions"}
                    </h4>
                    {selectedOrder.isDeleted ? (
                      <button
                        onClick={() => handleRestore(selectedOrder._id)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-emerald-600 cursor-pointer shadow-md shadow-emerald-500/10"
                      >
                        <RotateCcw className="h-4.5 w-4.5" /> Restore Archived Order
                      </button>
                    ) : (
                      <div className="space-y-4">
                        {/* ── Amazon & Flipkart-Style Return & Refund Operations Hub (Handles Returns + Cancelled Prepaid Orders) ── */}
                        {(["Return Requested", "Return Accepted", "Out for Pickup", "Item Picked Up", "Returned", "Refund Initiated", "Refunded"].includes(selectedOrder.orderStatus) || (selectedOrder.orderStatus === "Cancelled" && selectedOrder.refundDetails)) ? (
                          <div className="rounded-2xl border border-purple-200/80 bg-purple-50/40 p-4 space-y-3.5 text-left">
                            <div className="flex items-center justify-between border-b border-purple-150 pb-2.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-purple-600" />
                                {selectedOrder.orderStatus === "Cancelled" ? "Prepaid Cancellation Refund Approval" : "Return & Refund Operations"}
                              </span>
                              <span className={cn(
                                "rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border",
                                selectedOrder.orderStatus === "Refunded" || selectedOrder.paymentStatus?.toLowerCase() === "refunded" || selectedOrder.refundDetails?.refundStatus === "Refunded"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                              )}>
                                {selectedOrder.orderStatus === "Cancelled" ? (selectedOrder.paymentStatus === "Refunded" ? "Refund Completed" : "Refund Pending Approval") : selectedOrder.orderStatus}
                              </span>
                            </div>

                            {/* Customer Payout Destination Preview */}
                            <div className="bg-white rounded-xl p-3 border border-purple-150 text-xs space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-stone-500 text-[10px] font-bold uppercase">Customer Refund Destination</span>
                                <span className="font-extrabold text-[10px] uppercase text-purple-700">
                                  {selectedOrder.refundDetails?.refundMethod === "bank" ? "Bank Account" : selectedOrder.refundDetails?.refundMethod === "upi" ? "UPI ID" : "Original Payment Source"}
                                </span>
                              </div>

                              {selectedOrder.refundDetails?.refundMethod === "bank" && selectedOrder.refundDetails?.bankDetails && (
                                <div className="space-y-1 text-[11px] font-medium text-stone-700">
                                  <p><strong>A/C Holder:</strong> {selectedOrder.refundDetails.bankDetails.accountHolderName}</p>
                                  <p><strong>Bank:</strong> {selectedOrder.refundDetails.bankDetails.bankName || "Bank Transfer"}</p>
                                  <div className="flex items-center justify-between font-mono bg-stone-50 p-1.5 rounded border border-stone-200">
                                    <span><strong>A/C:</strong> {selectedOrder.refundDetails.bankDetails.accountNumber || selectedOrder.refundDetails.bankDetails.maskedAccountNumber}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrder.refundDetails.bankDetails.accountNumber);
                                        toast.success("Account number copied!");
                                      }}
                                      className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer"
                                    >
                                      Copy A/C
                                    </button>
                                  </div>
                                  <div className="flex items-center justify-between font-mono bg-stone-50 p-1.5 rounded border border-stone-200">
                                    <span><strong>IFSC:</strong> {selectedOrder.refundDetails.bankDetails.ifscCode}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrder.refundDetails.bankDetails.ifscCode);
                                        toast.success("IFSC Code copied!");
                                      }}
                                      className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer"
                                    >
                                      Copy IFSC
                                    </button>
                                  </div>
                                </div>
                              )}

                              {selectedOrder.refundDetails?.refundMethod === "upi" && (
                                <div className="space-y-1 text-[11px] text-stone-700 font-medium">
                                  <div className="flex items-center justify-between bg-stone-50 p-1.5 rounded border border-stone-200">
                                    <p><strong>UPI ID:</strong> <span className="font-mono text-purple-700 font-bold">{selectedOrder.refundDetails.upiDetails?.upiId || selectedOrder.refundDetails.upiDetails?.maskedUpiId}</span></p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrder.refundDetails.upiDetails?.upiId || selectedOrder.refundDetails.upiDetails?.maskedUpiId);
                                        toast.success("UPI ID copied!");
                                      }}
                                      className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer ml-2"
                                    >
                                      Copy UPI
                                    </button>
                                  </div>
                                </div>
                              )}

                              {selectedOrder.refundDetails?.refundMethod === "original" && (
                                <div className="space-y-0.5 text-[11px] font-medium text-stone-700">
                                  <p><strong>Payment Mode:</strong> {selectedOrder.paymentMethod || "Online / Razorpay"}</p>
                                  {selectedOrder.razorpayPaymentId && (
                                    <p className="font-mono text-[10px]"><strong>Payment Ref:</strong> {selectedOrder.razorpayPaymentId}</p>
                                  )}
                                  <p className="text-[10px] text-emerald-700 font-bold">Reverse routing to customer's checkout bank / UPI card</p>
                                </div>
                              )}

                              <div className="flex justify-between items-center pt-1.5 border-t border-stone-100">
                                <span className="text-stone-500 text-[11px] font-bold">Refund Amount:</span>
                                <span className="font-display font-black text-sm text-stone-900">
                                  ₹{selectedOrder.refundDetails?.refundAmount || selectedOrder.total}
                                </span>
                              </div>

                              {(selectedOrder.returnReason || selectedOrder.cancelReason) && (
                                <p className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                                  <strong>Reason:</strong> {selectedOrder.returnReason || selectedOrder.cancelReason}
                                </p>
                              )}
                            </div>

                            {/* Return & Refund Workflow Action Controls */}
                            {selectedOrder.orderStatus === "Return Requested" && (
                              <button
                                onClick={() => handleUpdateStatus(selectedOrder._id, "Return Accepted", "Return request approved. Pickup scheduled within 7 business days.")}
                                disabled={updatingStatus}
                                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer shadow-md shadow-purple-500/10"
                              >
                                Approve Return (Schedule Pickup)
                              </button>
                            )}

                            {selectedOrder.orderStatus === "Return Accepted" && (
                              <button
                                onClick={() => handleUpdateStatus(selectedOrder._id, "Returned", "Item received and verified at fulfillment center.")}
                                disabled={updatingStatus}
                                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 py-3 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer shadow-md shadow-sky-500/10"
                              >
                                Mark Item Picked Up / Received
                              </button>
                            )}

                            {/* Manual Refund Processing Station for Online Payments & Returns */}
                            {(["Returned", "Item Picked Up", "Return Accepted"].includes(selectedOrder.orderStatus) || selectedOrder.orderStatus === "Cancelled") && selectedOrder.paymentStatus !== "Refunded" && (
                              <div className="space-y-3 pt-3 border-t border-purple-150 bg-white/70 rounded-xl p-3 border">
                                <div className="flex items-center justify-between pb-1 border-b border-stone-150">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                                    <Send className="h-3.5 w-3.5 text-purple-600" />
                                    Manual Refund Execution
                                  </span>
                                  <span className="text-[10px] font-semibold text-stone-500">
                                    Direct Payout / Reverse Routing
                                  </span>
                                </div>

                                {/* Quick Copy Tools for Admin (Phone / Razorpay Payment ID / UPI) */}
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {selectedOrder.shippingAddress?.phone && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrder.shippingAddress.phone);
                                        toast.success("Customer phone copied to clipboard!");
                                      }}
                                      className="inline-flex items-center gap-1 rounded-md bg-stone-100 hover:bg-purple-100 px-2 py-1 text-[10px] font-bold text-stone-700 hover:text-purple-900 border border-stone-200 transition cursor-pointer"
                                    >
                                      <Smartphone className="h-3 w-3 text-stone-500" />
                                      <span>Copy Phone: {selectedOrder.shippingAddress.phone}</span>
                                      <Copy className="h-2.5 w-2.5 ml-0.5 opacity-60" />
                                    </button>
                                  )}

                                  {selectedOrder.razorpayPaymentId && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrder.razorpayPaymentId);
                                        toast.success("Razorpay Payment ID copied to clipboard!");
                                      }}
                                      className="inline-flex items-center gap-1 rounded-md bg-stone-100 hover:bg-purple-100 px-2 py-1 text-[10px] font-bold text-stone-700 hover:text-purple-900 border border-stone-200 transition cursor-pointer"
                                    >
                                      <CreditCard className="h-3 w-3 text-stone-500" />
                                      <span className="font-mono">Copy Rzp ID: {selectedOrder.razorpayPaymentId}</span>
                                      <Copy className="h-2.5 w-2.5 ml-0.5 opacity-60" />
                                    </button>
                                  )}
                                </div>

                                {/* Manual Refund Method Selector */}
                                <div>
                                  <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                                    Select Refund Channel Used
                                  </label>
                                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                    <button
                                      type="button"
                                      onClick={() => setManualRefundMethod("original")}
                                      className={cn(
                                        "p-2 rounded-lg border text-left font-bold transition cursor-pointer leading-tight",
                                        manualRefundMethod === "original"
                                          ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500/20"
                                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                                      )}
                                    >
                                      <div className="flex items-center gap-1">
                                        <CreditCard className="h-3 w-3 text-purple-600" />
                                        <span>Gateway / Razorpay</span>
                                      </div>
                                      <span className="text-[9px] font-normal text-stone-500 block mt-0.5">Reverse via Dashboard</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setManualRefundMethod("manual_online")}
                                      className={cn(
                                        "p-2 rounded-lg border text-left font-bold transition cursor-pointer leading-tight",
                                        manualRefundMethod === "manual_online"
                                          ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500/20"
                                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                                      )}
                                    >
                                      <div className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3 text-purple-600" />
                                        <span>Direct Bank IMPS</span>
                                      </div>
                                      <span className="text-[9px] font-normal text-stone-500 block mt-0.5">NetBanking Payout</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setManualRefundMethod("upi")}
                                      className={cn(
                                        "p-2 rounded-lg border text-left font-bold transition cursor-pointer leading-tight",
                                        manualRefundMethod === "upi"
                                          ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500/20"
                                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                                      )}
                                    >
                                      <div className="flex items-center gap-1">
                                        <Smartphone className="h-3 w-3 text-purple-600" />
                                        <span>UPI App Payout</span>
                                      </div>
                                      <span className="text-[9px] font-normal text-stone-500 block mt-0.5">GPay, PhonePe, Paytm</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setManualRefundMethod("bank")}
                                      className={cn(
                                        "p-2 rounded-lg border text-left font-bold transition cursor-pointer leading-tight",
                                        manualRefundMethod === "bank"
                                          ? "border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500/20"
                                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                                      )}
                                    >
                                      <div className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3 text-purple-600" />
                                        <span>Customer Bank A/C</span>
                                      </div>
                                      <span className="text-[9px] font-normal text-stone-500 block mt-0.5">Saved Beneficiary</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Amount & UTR Inputs in 2 columns */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-600 block mb-0.5">
                                      Refund Amount (₹)
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="Amount"
                                      value={manualRefundAmount}
                                      onChange={(e) => setManualRefundAmount(e.target.value)}
                                      className="w-full rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-900 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-600 block mb-0.5">
                                      UTR / Payout Ref ID *
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g., UTR4123456789 or rfnd_..."
                                      value={refundUtr}
                                      onChange={(e) => setRefundUtr(e.target.value)}
                                      className="w-full rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-stone-900 placeholder:text-stone-400 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[9.5px] font-bold uppercase tracking-wider text-stone-600 block mb-0.5">
                                    Admin Audit Note (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., Manual refund transferred via HDFC Bank IMPS / GPay"
                                    value={refundNotes}
                                    onChange={(e) => setRefundNotes(e.target.value)}
                                    className="w-full rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:border-purple-500 focus:outline-none"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={initiateRefundConfirmation}
                                  disabled={processingRefund || !refundUtr.trim()}
                                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer shadow-md shadow-emerald-600/15 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingRefund ? "Approving & Processing Refund..." : "Approve & Complete Refund Payout"}
                                </button>
                              </div>
                            )}

                            {(selectedOrder.orderStatus === "Refunded" || selectedOrder.paymentStatus === "Refunded") && (
                              <div className="rounded-xl bg-emerald-100/70 border border-emerald-300 p-3 text-xs text-emerald-900 space-y-1">
                                <p className="font-bold flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  Refund Completed Successfully
                                </p>
                                {selectedOrder.refundDetails?.refundTransactionId && (
                                  <p className="font-mono text-[11px]">
                                    UTR / Ref: <strong>{selectedOrder.refundDetails.refundTransactionId}</strong>
                                  </p>
                                )}
                                {selectedOrder.refundDetails?.refundCompletedAt && (
                                  <p className="text-[10px] text-emerald-750">
                                    Processed on {formatDateTime(selectedOrder.refundDetails.refundCompletedAt)}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="grid gap-3 grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest block mb-1">Fulfillment</label>
                              {(selectedOrder.paymentStatus?.toLowerCase() === "failed" || selectedOrder.paymentStatus?.toLowerCase() === "cancelled") ? (
                                <div className="font-semibold text-stone-500 bg-stone-100/80 border border-stone-200/50 rounded-xl px-3 py-2 text-center text-xs">
                                  {selectedOrder.orderStatus || selectedOrder.status}
                                </div>
                              ) : (
                                <AdminDropdown
                                   value={selectedOrder.orderStatus || selectedOrder.status}
                                   onChange={(val) => handleUpdateStatus(selectedOrder._id, val)}
                                   disabled={updatingStatus}
                                   className="w-full text-stone-700 font-bold"
                                   options={(() => {
                                     const baseOpts = ["Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
                                     if (["Return Requested", "Return Accepted", "Returned", "Refunded"].includes(selectedOrder.orderStatus)) {
                                       baseOpts.push(selectedOrder.orderStatus);
                                     }
                                     return baseOpts.map((s) => ({
                                       value: s,
                                       label: s,
                                       className: getOrderStatusStyle(s)
                                     }));
                                   })()}
                                 />
                              )}
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest block mb-1">Payment</label>
                              {(() => {
                                const isCod = selectedOrder.paymentMethod === "COD";
                                const isReturned = selectedOrder.orderStatus === "Returned" || selectedOrder.orderStatus === "Refunded";
                                const showDropdown = isCod || isReturned;

                                if (!showDropdown) {
                                  return (
                                    <div className="font-semibold text-stone-500 bg-stone-100/80 border border-stone-200/50 rounded-xl px-3.5 py-2.5 text-center text-xs">
                                      {selectedOrder.paymentStatus}
                                    </div>
                                  );
                                }

                                if (selectedOrder.paymentStatus?.toLowerCase() === "failed" || selectedOrder.paymentStatus?.toLowerCase() === "cancelled") {
                                  return (
                                    <div className="font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2 text-center text-xs uppercase">
                                      Failed
                                    </div>
                                  );
                                }

                                return (
                                  <AdminDropdown
                                    value={selectedOrder.paymentStatus}
                                    onChange={(val) => handleUpdatePaymentStatus(selectedOrder._id, val)}
                                    disabled={updatingStatus}
                                    className="w-full text-stone-700 font-bold"
                                    options={(() => {
                                      const opts = ["Pending", "Paid", "Failed"];
                                      if (["Returned", "Refunded"].includes(selectedOrder.orderStatus)) {
                                        opts.push("Refunded");
                                      }
                                      return opts.map((s) => {
                                        let badgeClass = "bg-stone-50 text-stone-600 border border-stone-200/50";
                                        if (s === "Paid") badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200/50";
                                        if (s === "Failed") badgeClass = "bg-rose-50 text-rose-700 border border-rose-200/50";
                                        if (s === "Refunded") badgeClass = "bg-purple-50 text-purple-750 border border-purple-200/50";
                                        return { value: s, label: s, className: badgeClass };
                                      });
                                    })()}
                                  />
                                );
                              })()}
                            </div>
                          </div>
                        )}
                        {/* Status History Timeline */}
                        {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                          <div className="border-t border-stone-100 pt-4">
                            <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">Order Status History</h4>
                            <div className="relative border-l border-stone-200 pl-3 space-y-3.5 text-left">
                              {selectedOrder.statusHistory.map((history: any, index: number) => (
                                <div key={index} className="relative">
                                  <span className="absolute -left-[16.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-white" />
                                  <p className="text-[11px] font-bold text-stone-850">{history.status}</p>
                                  {history.note && <p className="text-[10px] text-stone-500 mt-0.5">{history.note}</p>}
                                  <p className="text-[9px] text-stone-400 mt-0.5">
                                    {formatDateTime(history.updatedAt)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleSoftDelete(selectedOrder._id)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/40 py-2.5 text-xs font-bold uppercase tracking-wider text-red-650 transition hover:bg-red-50 cursor-pointer"
                        >
                          Archive / Soft Delete Order
                        </button>
                      </div>
                    )}
                  </div>

                </div>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Admin Online & Manual Refund Confirmation Dialog ── */}
      {showRefundConfirmModal && selectedOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl text-left text-stone-900 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowRefundConfirmModal(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-stone-900">
                  Confirm Refund Payout
                </h3>
                <p className="text-xs text-stone-500">
                  Please verify payout details before confirming.
                </p>
              </div>
            </div>

            {/* Payout Summary Box */}
            <div className="mt-4 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
                <span className="text-stone-500 text-[10.5px] font-bold uppercase">Customer</span>
                <span className="font-bold text-stone-850 truncate max-w-[200px]">
                  {selectedOrder.user?.name || selectedOrder.shippingAddress?.name || "Customer"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
                <span className="text-stone-500 text-[10.5px] font-bold uppercase">Refund Channel</span>
                <span className="font-bold text-purple-700">
                  {manualRefundMethod === "original"
                    ? "Razorpay Dashboard / Online Reverse"
                    : manualRefundMethod === "manual_online"
                    ? "Direct Bank IMPS / NetBanking"
                    : manualRefundMethod === "upi"
                    ? "Manual UPI (GPay/PhonePe)"
                    : "Customer Bank Account"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
                <span className="text-stone-500 text-[10.5px] font-bold uppercase">UTR / Payout Ref #</span>
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {refundUtr}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-600 font-bold uppercase text-[11px]">Total Refund Amount</span>
                <span className="font-display font-black text-base text-emerald-600">
                  ₹{manualRefundAmount || selectedOrder.refundDetails?.refundAmount || selectedOrder.total}
                </span>
              </div>
            </div>

            {/* Warning Note */}
            <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">
              ⚠️ This will mark the order as <strong className="text-stone-800">Refunded</strong> and send the UTR reference to the customer's order tracking page.
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-stone-150">
              <button
                type="button"
                disabled={processingRefund}
                onClick={() => setShowRefundConfirmModal(false)}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingRefund}
                onClick={() => handleProcessRefund(selectedOrder._id)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {processingRefund ? "Processing..." : "Yes, Confirm & Issue Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
