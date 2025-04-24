import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Product from "@/interface/Product";
import AdminOrderManagement from "@/components/admin/order/AdminOrderManagement";
import AdminProductManagement from "@/components/admin/product/AdminProductManagement";
import axios from "axios";
import { Order } from "@/interface/Order";

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      email: "customer1@example.com",
      address: "서울시 강남구",
      zipCode: "12345",
      items: [
        { productId: 1, name: "콜롬비아 나리뇨", quantity: 2, price: 5000 },
        { productId: 2, name: "게이샤", quantity: 1, price: 5000 },
      ],
      totalAmount: 15000,
      date: "2025-04-21T10:30:00",
    },
    {
      id: "ORD-002",
      email: "customer2@example.com",
      address: "서울시 서초구",
      zipCode: "54321",
      items: [{ productId: 3, name: "과테말라", quantity: 3, price: 5000 }],
      totalAmount: 15000,
      date: "2025-04-22T09:15:00",
    },
    {
      id: "ORD-003",
      email: "customer1@example.com",
      address: "서울시 강남구",
      zipCode: "12345",
      items: [{ productId: 2, name: "게이샤", quantity: 4, price: 5000 }],
      totalAmount: 20000,
      date: "2025-04-22T14:45:00",
    },
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/products");

      // API 응답 로깅
      console.log("API Response:", response.data);

      // 응답이 배열인지 확인
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // 응답이 { data: [...] } 형태인 경우
        setProducts(response.data.data);
      } else if (
        response.data &&
        response.data.products &&
        Array.isArray(response.data.products)
      ) {
        // 응답이 { products: [...] } 형태인 경우
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

  const handleDeleteProduct = (productId: number) => {
    // 삭제 후 즉시 상품 목록 새로고침
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>

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
