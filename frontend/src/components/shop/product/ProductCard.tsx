import Product from "@/interface/Product";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "../../../assets/grid_and_circle_logo.png";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAdd,
  onRemove,
}) => {
  return (
    <Card key={product.id} className="overflow-hidden !p-0">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform"
          onError={(e) => {
            (e.target as HTMLImageElement).src = logo;
          }}
        />
      </div>
      <CardContent>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <p className="font-bold mt-2 text-lg">
          {product.price.toLocaleString()}원
        </p>
      </CardContent>
      <CardFooter className="bg-stone-50 p-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(product.id)}
          disabled={quantity === 0}
        >
          -
        </Button>
        <span>{quantity}</span>
        <Button
          className="bg-brown-900 hover:bg-brown-800"
          size="sm"
          onClick={() => onAdd(product)}
        >
          +
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
