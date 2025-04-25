export default interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  deleted?: boolean;
  deletedAt?: string;
}
