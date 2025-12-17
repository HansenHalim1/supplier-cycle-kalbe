"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  addSupplier,
  updateSupplierById,
} from "../lib/actions/supplier.actions";
import { Supplier, SupplierInput } from "../lib/services/supplier.service";

type Props = {
  initialData?: Supplier | null;
  onSubmitted?: () => void;
  onCancel?: () => void;
};

const emptyForm: SupplierInput = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
};

export default function SupplierForm({
  initialData,
  onSubmitted,
  onCancel,
}: Props) {
  const [form, setForm] = useState<SupplierInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      void id; // Preserve parity with Supplier while omitting id from the form state.
      setForm({ ...emptyForm, ...rest });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (initialData?.id) {
        const updated = await updateSupplierById(initialData.id, form);
        if (!updated) throw new Error("Supplier not found");
      } else {
        await addSupplier(form);
      }
      onSubmitted?.();
      if (!initialData) {
        setForm(emptyForm);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save supplier";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = Boolean(initialData?.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {isEditMode ? "Edit Supplier" : "Add Supplier"}
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
            placeholder="Supplier name"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Contact</span>
          <input
            name="contactName"
            value={form.contactName || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Contact person"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="contact@email.com"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Phone</span>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="555-1234"
          />
        </label>
      </div>

      <label className="space-y-1 text-sm block">
        <span className="font-medium">Address</span>
        <textarea
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          placeholder="Street, City"
          rows={3}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEditMode ? "Update Supplier" : "Add Supplier"}
      </button>
    </form>
  );
}
