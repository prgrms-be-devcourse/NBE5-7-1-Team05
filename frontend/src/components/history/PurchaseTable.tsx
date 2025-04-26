import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { Purchase } from "@/interface/Purchase";

interface PurchaseTableProps {
  purchases: Purchase[];
  isLoading: boolean;
  getStatusColor: (status: Purchase["status"]) => string;
  formatDateTime: (date: string, time: string) => string;
  hasFilterApplied: boolean;
}

export function PurchaseTable({
  purchases,
  isLoading,
  getStatusColor,
  formatDateTime,
  hasFilterApplied,
}: PurchaseTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (purchases.length === 0) {
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
            <TableHead className="min-w-[80px]">수량</TableHead>
            <TableHead className="min-w-[100px]">금액</TableHead>
            <TableHead className="min-w-[180px]">구매일시</TableHead>
            <TableHead className="min-w-[100px]">상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">{purchase.id}</TableCell>
              <TableCell>{purchase.productName}</TableCell>
              <TableCell>{purchase.quantity}</TableCell>
              <TableCell>{purchase.price.toLocaleString()}원</TableCell>
              <TableCell>
                {formatDateTime(purchase.purchaseDate, purchase.purchaseTime)}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    purchase.status
                  )}`}
                >
                  {purchase.status === "processing"
                    ? "처리중"
                    : purchase.status === "shipped"
                    ? "배송중"
                    : "배송완료"}
                </span>
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
