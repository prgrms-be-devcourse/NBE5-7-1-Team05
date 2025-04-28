import api from "./axiosConfig";
import { OrderResponse, OrderCancelRequest } from "@/interface/Order";

export const orderService = {
  getOrdersByEmail: async (email: string): Promise<OrderResponse[]> => {
    const response = await api.get(
      `/orders?email=${encodeURIComponent(email)}`
    );
    return response.data;
  },

  cancelOrder: async (orderRequest: OrderCancelRequest): Promise<void> => {
    console.log(orderRequest);
    await api.delete(`/orders/${orderRequest.order_id}`);
  },
};
