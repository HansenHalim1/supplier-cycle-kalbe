import {
  type Order,
  type OrderInput,
  type OrderStatus,
  createOrder,
  updateOrderStatus,
} from "../services/order.service";

export async function addOrder(input: OrderInput): Promise<Order> {
  return createOrder(input);
}

export async function updateOrderStatusById(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  return updateOrderStatus(id, status);
}
