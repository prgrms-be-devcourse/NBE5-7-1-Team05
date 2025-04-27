export interface PaymentData {
  email: string;
  address: string;
  postal_code: string;
  total_price: number;
  products: {
    product_id: number;
    quantity: number;
  }[];
}
