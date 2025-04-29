import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderDetailModal from "./OrderDetailModal";
import OrderFilter from "./OrderFilter";
import { Order } from "@/interface/Order";
import { formatDateTime, isDateInRange } from "../../../utils/date/dateUtils";

interface Props {
  orders: Order[];
}

const AdminOrderManagement: React.FC<Props> = ({ orders }) => {
  const [dateFilter, setDateFilter] = useState("today");
  const [emailFilter, setEmailFilter] = useState("");

  const getDateFilteredOrders = () => {
    return orders.filter((order) => {
      // 분리한 유틸리티 함수 사용
      return isDateInRange(
        order.ordered_at,
        dateFilter === "today" ? "today" : "all"
      );
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
    <Card>
      <CardHeader>
        <CardTitle>주문 내역</CardTitle>
        <CardDescription>
          전체 주문 목록을 확인하고 관리할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderFilter
          dateFilter={dateFilter}
          emailFilter={emailFilter}
          onDateFilterChange={setDateFilter}
          onEmailFilterChange={setEmailFilter}
        />

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
              <TableRow key={order.order_id}>
                <TableCell className="font-medium">{order.order_id}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>
                  {/* 분리한 유틸리티 함수 사용 */}
                  {formatDateTime(order.ordered_at)}
                </TableCell>
                <TableCell>
                  {order.order_products.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                  개
                </TableCell>
                <TableCell className="text-right">
                  {order.total_price.toLocaleString()}원
                </TableCell>
                <TableCell className="text-center">
                  <OrderDetailModal order={order} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminOrderManagement;
