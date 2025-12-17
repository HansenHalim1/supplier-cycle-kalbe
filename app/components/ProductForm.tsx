"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { addProduct, updateProductById } from "../lib/actions/product.actions";
import { Product, ProductInput } from "../lib/services/product.service";

type Props = {
  initialData?: Product | null;
  onSubmitted?: () => void;
  onCancel?: () => void;
};

const emptyForm: ProductInput = {
  name: "",
  sku: "",
  price: undefined,
  stock: undefined,
  description: "",
};

export default function ProductForm({
  initialData,
  onSubmitted,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      void id;
      setForm({ ...emptyForm, ...rest });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      const numeric = value === "" ? undefined : Number(value);
      setForm((prev) => ({ ...prev, [name]: numeric }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (initialData?.id) {
        const updated = await updateProductById(initialData.id, form);
        if (!updated) throw new Error("Product not found");
      } else {
        await addProduct(form);
      }
      onSubmitted?.();
      if (!initialData) {
        setForm(emptyForm);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save product";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = Boolean(initialData?.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>
        {isEditMode && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Name</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Product name"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">SKU</span>
          <input
            name="sku"
            value={form.sku || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="SKU code"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Price</span>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price ?? ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="0.00"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Stock</span>
          <input
            type="number"
            name="stock"
            value={form.stock ?? ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="0"
          />
        </label>
      </div>

      <label className="space-y-1 text-sm block">
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          placeholder="Details about the product"
          rows={3}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
