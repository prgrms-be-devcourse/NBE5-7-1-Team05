import axios from "./axiosConfig";
import { OrderResponse, OrderCancelRequest } from "@/interface/Order";

export const orderService = {
  getOrdersByEmail: async (email: string): Promise<OrderResponse[]> => {
    const response = await axios.get(
      `/orders?email=${encodeURIComponent(email)}`
    );
    return response.data;
  },

  cancelOrder: async (orderRequest: OrderCancelRequest): Promise<void> => {
    await axios.put(`/orders/${orderRequest.order_id}`, orderRequest);
  },
};
