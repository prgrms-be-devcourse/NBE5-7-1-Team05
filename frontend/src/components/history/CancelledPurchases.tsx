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
import { Purchase } from "@/interface/Purchase";

interface CancelledPurchasesProps {
  purchases: Purchase[];
  showCancelled: boolean;
  setShowCancelled: (value: boolean) => void;
  formatDateTime: (date: string, time: string) => string;
}

export function CancelledPurchases({
  purchases,
  showCancelled,
  setShowCancelled,
  formatDateTime,
}: CancelledPurchasesProps) {
  if (purchases.length === 0) {
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
                  <TableHead className="min-w-[180px]">구매일시</TableHead>
                  <TableHead className="min-w-[100px]">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id} className="bg-red-50">
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{purchase.productName}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{purchase.price.toLocaleString()}원</TableCell>
                    <TableCell>
                      {formatDateTime(
                        purchase.purchaseDate,
                        purchase.purchaseTime
                      )}
                    </TableCell>
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
