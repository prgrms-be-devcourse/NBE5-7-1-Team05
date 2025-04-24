export interface Order {
  id: string;
  email: string;
  address: string;
  zipCode: string;
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  date: string;
}
