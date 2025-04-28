import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Product from "@/interface/Product";
import AdminOrderManagement from "@/components/admin/order/AdminOrderManagement";
import AdminProductManagement from "@/components/admin/product/AdminProductManagement";
import { Order } from "@/interface/Order";
import api from "@/utils/api/axiosConfig";

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(import.meta.env.VITE_API_PRODUCTS);

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
        console.error(
          "Unexpected Products API response format:",
          response.data
        );
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

  const fetchOrders = async () => {
    try {
      // adminToken 가져오기 (로컬 스토리지나 상태 관리에서 가져오는 방식으로 수정 필요)
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        setError("관리자 인증이 필요합니다.");
        return;
      }

      // Authorization 헤더 추가
      const response = await api.get("/admin/orders", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      // 응답 구조 확인을 위해 전체 응답 로깅
      console.log("전체 주문 응답:", response);

      // 응답 데이터 구조에 따라 적절하게 처리
      if (Array.isArray(response.data)) {
        console.log("response.data는 배열입니다:", response.data);
        setOrders(response.data);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        console.log("response.data.data는 배열입니다:", response.data.data);
        setOrders(response.data.data);
      } else if (
        response.data &&
        response.data.orders &&
        Array.isArray(response.data.orders)
      ) {
        console.log("response.data.orders는 배열입니다:", response.data.orders);
        setOrders(response.data.orders);
      } else {
        console.error("예상치 못한 주문 API 응답 형식:", response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error("주문 조회 실패:", error);
      setError("주문 목록을 불러오는데 실패했습니다.");
      setOrders([]);
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
      <Tabs defaultValue="orders" className="w-full mt-4">
        <TabsList className="mb-2">
          <TabsTrigger value="orders">주문 내역</TabsTrigger>
          <TabsTrigger value="products">상품 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
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
