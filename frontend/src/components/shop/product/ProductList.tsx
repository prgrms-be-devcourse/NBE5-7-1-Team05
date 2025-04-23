import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProductCard from "./ProductCard";
import Product from "@/interface/Product";
import CartItem from "@/interface/CartItem";

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemovefromCart: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  cart,
  onAddToCart,
  onRemovefromCart,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">상품 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={
                cart.find((item) => item.product.id === product.id)?.quantity ||
                0
              }
              onAdd={onAddToCart}
              onRemove={onRemovefromCart}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
