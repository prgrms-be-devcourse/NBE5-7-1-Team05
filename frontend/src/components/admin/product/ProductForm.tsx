import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Product from "@/interface/Product";

interface ValidationError {
  field: string;
  message: string;
}

interface Props {
  product: Omit<Product, "id">;
  onProductChange: (product: Omit<Product, "id">) => void;
  onSubmit: () => void;
  errors?: ValidationError[];
  isLoading?: boolean;
}

const ProductForm: React.FC<Props> = ({
  product,
  onProductChange,
  onSubmit,
  errors = [],
  isLoading = false,
}) => {
  const getFieldError = (field: string): string | undefined => {
    const error = errors.find((err) => err.field === field);
    return error?.message;
  };

  return (
    <div className="mb-8 border p-4 rounded-md">
      <div className="flex justify-between">
        <h3 className="font-extrabold mb-4">새 상품 추가</h3>
        <Button
          className="bg-brown-900 hover:bg-brown-800"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "추가 중..." : "상품 추가하기"}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block">상품명</label>
          <Input
            type="text"
            placeholder="상품명 입력"
            value={product.name}
            onChange={(e) =>
              onProductChange({ ...product, name: e.target.value })
            }
            className={getFieldError("name") ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {getFieldError("name") && (
            <p className="text-red-500 text-sm mt-1">{getFieldError("name")}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">카테고리</label>
          <Input
            type="text"
            placeholder="카테고리 입력"
            value={product.category}
            onChange={(e) =>
              onProductChange({ ...product, category: e.target.value })
            }
            className={getFieldError("category") ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {getFieldError("category") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("category")}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">가격</label>
          <Input
            type="number"
            placeholder="가격 입력"
            value={product.price || ""}
            onChange={(e) =>
              onProductChange({ ...product, price: Number(e.target.value) })
            }
            className={getFieldError("price") ? "border-red-500" : ""}
            min="0"
            disabled={isLoading}
          />
          {getFieldError("price") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("price")}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">이미지 URL</label>
          <Input
            type="text"
            placeholder="이미지 URL 입력"
            value={product.image_url}
            onChange={(e) =>
              onProductChange({ ...product, image_url: e.target.value })
            }
            className={getFieldError("imageUrl") ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {getFieldError("imageUrl") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("imageUrl")}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">재고</label>
          <Input
            type="number"
            placeholder="재고 입력"
            value={product.stock || ""}
            onChange={(e) =>
              onProductChange({ ...product, stock: Number(e.target.value) })
            }
            className={getFieldError("stock") ? "border-red-500" : ""}
            min="0"
            disabled={isLoading}
          />
          {getFieldError("stock") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("stock")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
