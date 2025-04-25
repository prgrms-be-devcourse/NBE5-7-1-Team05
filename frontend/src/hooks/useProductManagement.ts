import { useState } from "react";
import axios from "axios";
import Product from "@/interface/Product";
import {
  ValidationError,
  validateProduct,
} from "@/utils/validation/ProductValidation";

interface UseProductManagementProps {
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateProduct: (productId: number, addedStock: number) => void;
  onRefreshProducts: () => void;
}

export const useProductManagement = ({
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onRefreshProducts,
}: UseProductManagementProps) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    price: 0,
    imageUrl: "",
    stock: 0,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addStock, setAddStock] = useState<number>(0);

  const addProduct = async () => {
    const validationErrors = validateProduct(newProduct);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/products",
        newProduct
      );

      if (response.status === 200 || response.status === 201) {
        const createdProduct = response.data;
        onAddProduct(createdProduct);

        setNewProduct({
          name: "",
          category: "",
          price: 0,
          imageUrl: "",
          stock: 0,
        });
        setErrors([]);
        alert("상품이 성공적으로 추가되었습니다.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrors([
            { field: "name", message: "이미 존재하는 상품명입니다." },
          ]);
        } else if (error.response?.data?.message) {
          alert(`오류: ${error.response.data.message}`);
        } else {
          alert("상품 추가 중 오류가 발생했습니다.");
        }
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
      console.error("상품 추가 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/admin/products/${productId}`);
      onDeleteProduct(productId);
      onRefreshProducts();
      alert("상품이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleAddStock = (product: Product) => {
    setEditingProduct(product);
    setAddStock(0);
    setEditDialogOpen(true);
  };

  const handleStockSubmit = async () => {
    if (!editingProduct) return;

    if (addStock <= 0) {
      alert("추가할 재고는 1개 이상이어야 합니다.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/admin/products/${editingProduct.id}`,
        {
          stock: addStock,
        }
      );
      onUpdateProduct(editingProduct.id, addStock);
      setEditDialogOpen(false);
      setEditingProduct(null);
      setAddStock(0);
      alert(`${addStock}개의 재고가 추가되었습니다.`);
    } catch (error) {
      console.error("재고 추가 실패:", error);
      alert("재고 추가 중 오류가 발생했습니다.");
    }
  };

  return {
    newProduct,
    setNewProduct,
    errors,
    isLoading,
    editDialogOpen,
    setEditDialogOpen,
    editingProduct,
    addStock,
    setAddStock,
    addProduct,
    handleDelete,
    handleAddStock,
    handleStockSubmit,
  };
};
