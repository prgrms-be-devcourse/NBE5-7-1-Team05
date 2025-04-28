export default interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  stock: number;
  deleted?: boolean;
  deleted_at?: string;
}
