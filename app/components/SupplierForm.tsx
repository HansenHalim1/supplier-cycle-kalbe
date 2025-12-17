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
  const buttonClass =
    "inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60";
  const secondaryButtonClass =
    "text-sm text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEditMode ? "Edit Supplier" : "Add Supplier"}
        </h2>
        {isEditMode && (
          <button
            type="button"
            onClick={onCancel}
            className={secondaryButtonClass}
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Supplier name"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Contact</span>
          <input
            name="contactName"
            value={form.contactName || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="contact@email.com"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Phone</span>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="555-1234"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Address</span>
        <textarea
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Street, City"
          rows={3}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className={buttonClass}>
        {submitting ? "Saving..." : isEditMode ? "Update Supplier" : "Add Supplier"}
      </button>
    </form>
  );
}
