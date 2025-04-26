export interface Purchase {
  id: string;
  productName: string;
  price: number;
  purchaseDate: string;
  purchaseTime: string;
  status: "processing" | "shipped" | "delivered";
  quantity: number;
  is_deleted: boolean;
}
