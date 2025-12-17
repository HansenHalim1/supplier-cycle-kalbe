import { getProductById, type Product } from "./product.service";
import { getSupplierById, type Supplier } from "./supplier.service";

export type OrderStatus = "Pending" | "Processing" | "Received" | "Cancelled";

export type OrderItem = {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
};

export type Order = {
  id: string;
  supplierId: string;
  supplierName?: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
};

let orders: Order[] = [];

const clone = <T,>(value: T): T => structuredClone(value);

const resolveProductSnapshot = (product: Product) => ({
  productName: product.name,
  unitPrice: product.price,
});

const resolveSupplierSnapshot = (supplier: Supplier) => supplier.name;

export type OrderInput = {
  supplierId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export async function getOrders(): Promise<Order[]> {
  if (orders.length === 0) {
    await seedOrders();
  }
  return clone(orders);
}

export async function createOrder(input: OrderInput): Promise<Order> {
  if (input.items.length === 0) {
    throw new Error("Order requires at least one item");
  }

  const supplier = await getSupplierById(input.supplierId);
  if (!supplier) throw new Error("Supplier not found");

  const resolvedItems: OrderItem[] = [];
  for (const item of input.items) {
    const product = await getProductById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    resolvedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      ...resolveProductSnapshot(product),
    });
  }

  const order: Order = {
    id: crypto.randomUUID(),
    supplierId: input.supplierId,
    supplierName: resolveSupplierSnapshot(supplier),
    status: "Pending",
    createdAt: new Date().toISOString(),
    items: resolvedItems,
  };
  orders = [...orders, order];
  return clone(order);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  const index = orders.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...orders[index], status };
  orders[index] = updated;
  return clone(updated);
}

async function seedOrders() {
  const sample: OrderInput[] = [
    {
      supplierId: "sup-1",
      items: [
        { productId: "prod-1", quantity: 20 },
        { productId: "prod-2", quantity: 10 },
      ],
    },
  ];

  const seeded: Order[] = [];
  for (const input of sample) {
    const order = await createOrder(input);
    seeded.push(order);
  }

  // Replace seed without duplicating if createOrder pushed it.
  orders = seeded;
}
