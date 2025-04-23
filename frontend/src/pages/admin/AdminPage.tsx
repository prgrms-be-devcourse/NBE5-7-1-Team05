import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Product from "@/interface/Product";

interface Order {
  id: string;
  email: string;
  address: string;
  zipCode: string;
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  date: string;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "콜롬비아 나리뇨",
      price: 5000,
      category: "커피콩",
      imageUrl: "https://i.imgur.com/HKOFQYa.jpeg",
    },
    {
      id: 2,
      name: "게이샤",
      price: 5000,
      category: "커피콩",
      imageUrl: "https://i.imgur.com/HKOFQYa.jpeg",
    },
    {
      id: 3,
      name: "과테말라",
      price: 5000,
      category: "커피콩",
      imageUrl: "https://i.imgur.com/HKOFQYa.jpeg",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
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

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    price: 0,
    imageUrl: "",
  });

  const addProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.category ||
      newProduct.price <= 0 ||
      !newProduct.imageUrl
    ) {
      alert("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    setProducts([...products, { id: newId, ...newProduct }]);

    setNewProduct({
      name: "",
      category: "",
      price: 0,
      imageUrl: "",
    });
  };

  const [dateFilter, setDateFilter] = useState("today");
  const [emailFilter, setEmailFilter] = useState("");

  const getDateFilteredOrders = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    today.setHours(14, 0, 0, 0);
    yesterday.setHours(14, 0, 0, 0);

    return orders.filter((order) => {
      const orderDate = new Date(order.date);

      if (dateFilter === "today") {
        return orderDate >= yesterday && orderDate <= today;
      }
      return true;
    });
  };

  const getFilteredOrders = () => {
    const dateFiltered = getDateFilteredOrders();

    if (emailFilter) {
      return dateFiltered.filter((order) =>
        order.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }
    return dateFiltered;
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">주문 내역</TabsTrigger>
          <TabsTrigger value="products">상품 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>주문 내역</CardTitle>
              <CardDescription>
                전체 주문 목록을 확인하고 관리할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    날짜 필터
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="today">어제 14:00 ~ 오늘 14:00</option>
                    <option value="all">전체 기간</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    이메일 검색
                  </label>
                  <Input
                    type="text"
                    placeholder="이메일 검색"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableCaption>
                  전체 {filteredOrders.length}건의 주문 내역
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문 번호</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>주문 날짜</TableHead>
                    <TableHead>상품 수</TableHead>
                    <TableHead className="text-right">총 금액</TableHead>
                    <TableHead className="text-center">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                        개
                      </TableCell>
                      <TableCell className="text-right">
                        {order.totalAmount.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              상세보기
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                주문 상세 정보 ({order.id})
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div>
                                <h3 className="font-medium mb-2">주문 정보</h3>
                                <p>
                                  <span className="text-gray-500">이메일:</span>{" "}
                                  {order.email}
                                </p>
                                <p>
                                  <span className="text-gray-500">주소:</span>{" "}
                                  {order.address}
                                </p>
                                <p>
                                  <span className="text-gray-500">
                                    우편번호:
                                  </span>{" "}
                                  {order.zipCode}
                                </p>
                                <p>
                                  <span className="text-gray-500">
                                    주문일시:
                                  </span>{" "}
                                  {new Date(order.date).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <h3 className="font-medium mb-2">주문 상품</h3>
                                <ul className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <li
                                      key={index}
                                      className="flex justify-between"
                                    >
                                      <span>
                                        {item.name} x {item.quantity}
                                      </span>
                                      <span>
                                        {(
                                          item.price * item.quantity
                                        ).toLocaleString()}
                                        원
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                                  <span>총 금액</span>
                                  <span>
                                    {order.totalAmount.toLocaleString()}원
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>상품 관리</CardTitle>
              <CardDescription>
                상품을 추가하고 관리할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8 border p-4 rounded-md">
                <h3 className="font-medium mb-4">새 상품 추가</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      상품명
                    </label>
                    <Input
                      type="text"
                      placeholder="상품명 입력"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      카테고리
                    </label>
                    <Input
                      type="text"
                      placeholder="카테고리 입력"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      가격
                    </label>
                    <Input
                      type="number"
                      placeholder="가격 입력"
                      value={newProduct.price || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      이미지 URL
                    </label>
                    <Input
                      type="text"
                      placeholder="이미지 URL 입력"
                      value={newProduct.imageUrl}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={addProduct}>상품 추가하기</Button>
              </div>

              <h3 className="font-medium mb-4">상품 목록</h3>
              <Table>
                <TableCaption>전체 {products.length}개 상품</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">가격</TableHead>
                    <TableHead>이미지</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.id}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        {product.price.toLocaleString()}원
                      </TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
