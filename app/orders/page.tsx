"use client";

import { useEffect, useState } from "react";
import OrderComposer from "../components/OrderComposer";
import { updateOrderStatusById } from "../lib/actions/order.actions";
import { getOrders, type Order } from "../lib/services/order.service";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await getOrders();
      if (!active) return;
      setOrders(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleSubmitted = async () => {
    await loadOrders();
    setFeedback("Order created.");
    setTimeout(() => setFeedback(null), 2500);
  };

  const markReceived = async (id: string) => {
    await updateOrderStatusById(id, "Received");
    await loadOrders();
    setFeedback("Order updated.");
    setTimeout(() => setFeedback(null), 2500);
  };

  const statusStyles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Processing: "bg-blue-100 text-blue-800",
    Received: "bg-green-100 text-green-800",
    Cancelled: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Operations</p>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
        </div>
        {feedback && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
            {feedback}
          </span>
        )}
      </div>

      <OrderComposer onSubmitted={handleSubmitted} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Supplier</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    <span className="text-gray-600">Loading orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    <span className="text-gray-600">No orders yet. Create one above.</span>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t align-top odd:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {order.supplierName || "-"}
                      </div>
                      <div className="text-xs text-gray-600">{order.supplierId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          statusStyles[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <ul className="space-y-1 text-xs">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-900">
                              {item.productName || item.productId}
                            </span>
                            <span className="text-gray-700">
                              x{item.quantity}{" "}
                              {typeof item.unitPrice === "number"
                                ? `@$${item.unitPrice.toFixed(2)}`
                                : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {order.status !== "Received" && (
                        <button
                          className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700"
                          onClick={() => markReceived(order.id)}
                        >
                          Mark Received
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
