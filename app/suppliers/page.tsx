"use client";

import { useEffect, useState } from "react";
import SupplierForm from "../components/SupplierForm";
import {
  deleteSupplierById,
} from "../lib/actions/supplier.actions";
import { Supplier, getSuppliers } from "../lib/services/supplier.service";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadSuppliers = async () => {
    setLoading(true);
    const data = await getSuppliers();
    setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      const data = await getSuppliers();
      if (!active) return;
      setSuppliers(data);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleSaved = async () => {
    await loadSuppliers();
    setEditing(null);
    setFeedback("Supplier saved.");
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleDelete = async (id: string) => {
    await deleteSupplierById(id);
    await loadSuppliers();
    setFeedback("Supplier deleted.");
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        {feedback && <span className="text-sm text-green-700">{feedback}</span>}
      </div>

      <SupplierForm
        key={editing?.id ?? "new-supplier"}
        initialData={editing}
        onSubmitted={handleSaved}
        onCancel={() => setEditing(null)}
      />

      <div className="overflow-hidden rounded border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-3" colSpan={6}>
                    Loading suppliers...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td className="px-4 py-3" colSpan={6}>
                    No suppliers yet. Add your first one above.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{supplier.name}</td>
                    <td className="px-4 py-3">{supplier.contactName || "-"}</td>
                    <td className="px-4 py-3">{supplier.email || "-"}</td>
                    <td className="px-4 py-3">{supplier.phone || "-"}</td>
                    <td className="px-4 py-3">{supplier.address || "-"}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold"
                        onClick={() => setEditing(supplier)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white"
                        onClick={() => handleDelete(supplier.id)}
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
