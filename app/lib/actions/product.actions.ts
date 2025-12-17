import {
  Product,
  ProductInput,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/product.service";

export async function addProduct(input: ProductInput): Promise<Product> {
  return createProduct(input);
}

export async function updateProductById(
  id: string,
  input: Partial<ProductInput>,
): Promise<Product | null> {
  return updateProduct(id, input);
}

export async function deleteProductById(id: string): Promise<boolean> {
  return deleteProduct(id);
}
