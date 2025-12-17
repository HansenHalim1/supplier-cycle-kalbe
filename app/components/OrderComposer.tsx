"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { addOrder } from "../lib/actions/order.actions";
import { getProducts, type Product } from "../lib/services/product.service";
import { getSuppliers, type Supplier } from "../lib/services/supplier.service";

type OrderItemDraft = {
  productId: string;
  quantity: number;
};

type Props = {
  onSubmitted?: () => void;
};

export default function OrderComposer({ onSubmitted }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<OrderItemDraft[]>([{ productId: "", quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [supplierList, productList] = await Promise.all([
        getSuppliers(),
        getProducts(),
      ]);
      if (!active) return;
      setSuppliers(supplierList);
      setProducts(productList);
      setSupplierId((prev) => prev || supplierList[0]?.id || "");
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleItemChange = (
    index: number,
    field: keyof OrderItemDraft,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: field === "quantity" ? Number(value) || 0 : value,
            }
          : item,
      ),
    );
  };

  const addRow = () => {
    setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  };

  const removeRow = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleanedItems = items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

    if (!supplierId) {
      setError("Supplier is required.");
      setSubmitting(false);
      return;
    }

    if (cleanedItems.length === 0) {
      setError("Add at least one product with quantity.");
      setSubmitting(false);
      return;
    }

    try {
      await addOrder({
        supplierId,
        items: cleanedItems,
      });
      onSubmitted?.();
      setItems([{ productId: "", quantity: 1 }]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create order";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const productLookup = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return map;
  }, [products]);

  const estimatedTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = productLookup.get(item.productId);
      if (!product || typeof product.price !== "number") return total;
      return total + product.price * (item.quantity || 0);
    }, 0);
  }, [items, productLookup]);

  if (loading) {
    return (
      <div className="rounded border bg-white p-4 shadow-sm">
        <p className="text-sm">Loading suppliers and products...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Create Purchase Order</h2>
        <div className="text-sm text-gray-700">
          Estimated total:{" "}
          <span className="font-semibold text-slate-900">
            ${estimatedTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Supplier</span>
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          required
        >
          <option value="">Select supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Items</span>
          <button
            type="button"
            className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold"
            onClick={addRow}
          >
            + Add item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr,1fr,auto]"
            >
              <select
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-60"
                  onClick={() => removeRow(index)}
                  disabled={items.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Order"}
      </button>
    </form>
  );
}
