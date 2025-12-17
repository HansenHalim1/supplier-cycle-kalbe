export type Product = {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
  description?: string;
};

let products: Product[] = [
  {
    id: "prod-1",
    name: "Vitamin C 500mg",
    sku: "VC-500",
    price: 12.5,
    stock: 120,
    description: "Immune support supplement",
  },
  {
    id: "prod-2",
    name: "Herbal Tea Pack",
    sku: "HT-10",
    price: 8.75,
    stock: 60,
    description: "Assorted herbal tea box",
  },
];

const clone = <T,>(value: T): T => structuredClone(value);

export async function getProducts(): Promise<Product[]> {
  return clone(products);
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = products.find((item) => item.id === id);
  return product ? clone(product) : null;
}

export type ProductInput = Omit<Product, "id">;

export async function createProduct(input: ProductInput): Promise<Product> {
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
  };
  products = [...products, product];
  return clone(product);
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<Product | null> {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated = { ...products[index], ...input };
  products[index] = updated;
  return clone(updated);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const previousLength = products.length;
  products = products.filter((item) => item.id !== id);
  return products.length < previousLength;
}
