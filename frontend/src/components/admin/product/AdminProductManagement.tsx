import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Product from "@/interface/Product";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import StockDialog from "./StockDialog";
import { useProductManagement } from "@/hooks/useProductManagement";

interface Props {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateProduct: (productId: number, addedStock: number) => void;
  onRefreshProducts: () => void;
}

const AdminProductManagement: React.FC<Props> = ({
  products = [],
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onRefreshProducts,
}) => {
  const {
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
  } = useProductManagement({
    onAddProduct,
    onDeleteProduct,
    onUpdateProduct,
    onRefreshProducts,
  });

  const activeProducts = products.filter((product) => !product.deleted);
  const deletedProducts = products.filter((product) => product.deleted);

  return (
    <Card>
      <CardContent>
        <ProductForm
          product={newProduct}
          onProductChange={setNewProduct}
          onSubmit={addProduct}
          errors={errors}
          isLoading={isLoading}
        />

        <h3 className="font-medium mb-4">상품 관리</h3>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">현재 상품</TabsTrigger>
            <TabsTrigger value="deleted">삭제된 상품</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <ProductTable
              products={activeProducts}
              onAddStock={handleAddStock}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="deleted">
            <ProductTable products={deletedProducts} isDeleted={true} />
          </TabsContent>
        </Tabs>

        <StockDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          product={editingProduct}
          stock={addStock}
          onStockChange={setAddStock}
          onSubmit={handleStockSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default AdminProductManagement;
