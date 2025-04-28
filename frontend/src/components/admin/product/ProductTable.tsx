import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import Product from "@/interface/Product";
import logo from "../../../assets/grid_and_circle_logo.png";

interface ProductTableProps {
  products: Product[];
  isDeleted?: boolean;
  onAddStock?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isDeleted = false,
  onAddStock,
  onDelete,
}) => {
  return (
    <Table>
      <TableCaption>
        {isDeleted
          ? `삭제된 상품 ${products.length}개`
          : `현재 상품 ${products.length}개`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>이미지</TableHead>
          <TableHead>상품명</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>재고</TableHead>
          <TableHead className="text-right">가격</TableHead>
          {isDeleted ? (
            <TableHead className="text-right">삭제일시</TableHead>
          ) : (
            <TableHead className="text-right">관리</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.id}</TableCell>
            <TableCell>
              <div className="w-12 h-12 rounded overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = logo;
                  }}
                />
              </div>
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell className="text-right">{product.price}원</TableCell>
            {isDeleted ? (
              <TableCell className="text-right">
                {product.deleted_at
                  ? new Date(product.deleted_at).toLocaleString()
                  : "-"}
              </TableCell>
            ) : (
              <TableCell className="text-right">
                {!isDeleted && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onAddStock?.(product)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hover:bg-red-600 hover:text-white"
                      size="icon"
                      onClick={() => onDelete?.(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
