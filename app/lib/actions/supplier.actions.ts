import {
  Supplier,
  SupplierInput,
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "../services/supplier.service";

export async function addSupplier(
  input: SupplierInput,
): Promise<Supplier> {
  return createSupplier(input);
}

export async function updateSupplierById(
  id: string,
  input: Partial<SupplierInput>,
): Promise<Supplier | null> {
  return updateSupplier(id, input);
}

export async function deleteSupplierById(id: string): Promise<boolean> {
  return deleteSupplier(id);
}
