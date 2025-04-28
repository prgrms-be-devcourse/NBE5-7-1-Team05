import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Product from "@/interface/Product";
import AdminOrderManagement from "@/components/admin/order/AdminOrderManagement";
import AdminProductManagement from "@/components/admin/product/AdminProductManagement";
import { Order } from "@/interface/Order";
import api from "@/utils/api/axiosConfig";

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders] = useState<Order[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(import.meta.env.VITE_API_PRODUCTS);

      console.log("response:", response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setProducts(response.data.data);
      } else if (
        response.data &&
        response.data.products &&
        Array.isArray(response.data.products)
      ) {
        setProducts(response.data.products);
      } else {
        console.error("Unexpected API response format:", response.data);
        setProducts([]);
      }

      setError(null);
    } catch (error) {
      console.error("상품 조회 실패:", error);
      setError("상품 목록을 불러오는데 실패했습니다.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (_productId: number) => {
    fetchProducts();
  };

  const handleUpdateProduct = (productId: number, addedStock: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, stock: product.stock + addedStock }
          : product
      )
    );
  };

  const handleRefreshProducts = () => {
    fetchProducts();
  };

  return (
    <div className="container mx-auto mt-4 p-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">주문 내역</TabsTrigger>
          <TabsTrigger value="products">상품 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <AdminOrderManagement orders={orders} />
        </TabsContent>

        <TabsContent value="products">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <AdminProductManagement
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProduct={handleUpdateProduct}
              onRefreshProducts={handleRefreshProducts}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
