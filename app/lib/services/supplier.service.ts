export type Supplier = {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

let suppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Acme Supplies",
    contactName: "Lara Kim",
    email: "hello@acme.example",
    phone: "555-0100",
    address: "123 Market St, Springfield",
  },
  {
    id: "sup-2",
    name: "Northwind Traders",
    contactName: "Miguel Ortiz",
    email: "orders@northwind.example",
    phone: "555-0200",
    address: "8 Harbor Way, Lakeside",
  },
];

const clone = <T,>(value: T): T => structuredClone(value);

export async function getSuppliers(): Promise<Supplier[]> {
  return clone(suppliers);
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supplier = suppliers.find((item) => item.id === id);
  return supplier ? clone(supplier) : null;
}

export type SupplierInput = Omit<Supplier, "id">;

export async function createSupplier(input: SupplierInput): Promise<Supplier> {
  const supplier: Supplier = {
    ...input,
    id: crypto.randomUUID(),
  };
  suppliers = [...suppliers, supplier];
  return clone(supplier);
}

export async function updateSupplier(
  id: string,
  input: Partial<SupplierInput>,
): Promise<Supplier | null> {
  const index = suppliers.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated = { ...suppliers[index], ...input };
  suppliers[index] = updated;
  return clone(updated);
}

export async function deleteSupplier(id: string): Promise<boolean> {
  const previousLength = suppliers.length;
  suppliers = suppliers.filter((item) => item.id !== id);
  return suppliers.length < previousLength;
}
