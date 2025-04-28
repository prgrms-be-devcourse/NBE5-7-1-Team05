import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Order } from "@/interface/Order";

interface PurchaseTableProps {
  orders: Order[];
  isLoading: boolean;
  getStatusColor: (status: Order["status"]) => string;
  formatDateTime: (date: string) => string;
  hasFilterApplied: boolean;
  onCancelOrder: (orderId: number) => void;
}

export function PurchaseTable({
  orders,
  isLoading,
  getStatusColor,
  formatDateTime,
  hasFilterApplied,
  onCancelOrder,
}: PurchaseTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {hasFilterApplied
            ? "필터 조건에 맞는 구매 내역이 없습니다"
            : "구매 내역이 없습니다"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasFilterApplied
            ? "다른 필터 조건을 선택해보세요"
            : "아직 구매하신 상품이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">주문번호</TableHead>
            <TableHead className="min-w-[150px]">상품명</TableHead>
            <TableHead className="min-w-[80px] text-right">수량</TableHead>
            <TableHead className="min-w-[100px] text-right">금액</TableHead>
            <TableHead className="min-w-[180px] text-right">주문일시</TableHead>
            <TableHead className="min-w-[100px] text-right">상태</TableHead>
            <TableHead className="min-w-[100px] text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell className="font-medium">
                ORD-{order.order_id}
              </TableCell>
              <TableCell>
                {order.order_products.map((product, index) => (
                  <div key={product.order_product_id}>
                    {product.product_name}
                    {index < order.order_products.length - 1 && ", "}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                {order.order_products.reduce(
                  (sum, product) => sum + product.quantity,
                  0
                )}
              </TableCell>
              <TableCell className="text-right">
                {order.total_price.toLocaleString()}원
              </TableCell>
              <TableCell className="text-right">
                {formatDateTime(order.ordered_at)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.status || "processing"
                  )}`}
                >
                  {order.status === "delivered"
                    ? "배송완료"
                    : order.status === "shipped"
                    ? "배송중"
                    : "처리중"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {order.status !== "delivered" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancelOrder(order.order_id)}
                  >
                    주문취소
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
