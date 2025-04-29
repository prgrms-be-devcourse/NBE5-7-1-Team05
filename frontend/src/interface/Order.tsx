export interface OrderProduct {
  order_product_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  order_id: number;
  email: string;
  address: string;
  postal_code: string;
  ordered_at: string;
  total_price: number;
  order_products: OrderProduct[];
  is_deleted?: boolean;
  status?: "processing" | "shipped" | "delivered";
}

export interface OrderResponse {
  order_id: number;
  email: string;
  address: string;
  postal_code: string;
  ordered_at: string;
  total_price: number;
  is_deleted?: boolean;
  order_products: OrderProduct[];
}

export interface OrderCancelRequest {
  order_id: number;
}

export interface OrderSearchRequest {
  email: string;
}
