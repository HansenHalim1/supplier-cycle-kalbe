"use client";

import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import { deleteProductById } from "../lib/actions/product.actions";
import { Product, getProducts } from "../lib/services/product.service";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const data = await getProducts();
      if (!active) return;
      setProducts(data);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSaved = async () => {
    await loadProducts();
    setEditing(null);
    setFeedback("Product saved.");
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleDelete = async (id: string) => {
    await deleteProductById(id);
    await loadProducts();
    setFeedback("Product deleted.");
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Catalog</p>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        </div>
        {feedback && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
            {feedback}
          </span>
        )}
      </div>

      <ProductForm
        key={editing?.id ?? "new-product"}
        initialData={editing}
        onSubmitted={handleSaved}
        onCancel={() => setEditing(null)}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    <span className="text-gray-600">Loading products...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    <span className="text-gray-600">No products yet. Add your first one above.</span>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t odd:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                    <td className="px-4 py-3">{product.sku || "-"}</td>
                    <td className="px-4 py-3">
                      {product.price != null ? `$${product.price.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-4 py-3">{product.stock ?? "-"}</td>
                    <td className="px-4 py-3">{product.description || "-"}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 transition hover:bg-slate-300"
                        onClick={() => setEditing(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
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
