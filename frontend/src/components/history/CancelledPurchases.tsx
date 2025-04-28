import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Order } from "@/interface/Order";

interface CancelledPurchasesProps {
  orders: Order[];
  showCancelled: boolean;
  setShowCancelled: (value: boolean) => void;
  formatDateTime: (date: string) => string;
}

export function CancelledPurchases({
  orders,
  showCancelled,
  setShowCancelled,
  formatDateTime,
}: CancelledPurchasesProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-red-600">주문 취소된 상품</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-cancelled"
              checked={showCancelled}
              onCheckedChange={setShowCancelled}
            />
            <Label htmlFor="show-cancelled">취소된 주문 보기</Label>
          </div>
        </div>
      </CardHeader>
      {showCancelled && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">주문번호</TableHead>
                  <TableHead className="min-w-[150px]">상품명</TableHead>
                  <TableHead className="min-w-[80px]">수량</TableHead>
                  <TableHead className="min-w-[100px]">금액</TableHead>
                  <TableHead className="min-w-[180px]">주문일시</TableHead>
                  <TableHead className="min-w-[100px]">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.order_id} className="bg-red-50">
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
                    <TableCell>
                      {order.order_products.reduce(
                        (sum, product) => sum + product.quantity,
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      {order.total_price.toLocaleString()}원
                    </TableCell>
                    <TableCell>{formatDateTime(order.ordered_at)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        주문취소
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
