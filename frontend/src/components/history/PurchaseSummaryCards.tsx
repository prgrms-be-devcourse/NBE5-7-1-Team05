import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/interface/Order";

interface PurchaseSummaryCardsProps {
  orders: Order[];
  filteredOrders: Order[];
  isLoading: boolean;
  hasDateFilter: boolean;
  formatDate: (date: string) => string;
}

export function PurchaseSummaryCards({
  orders,
  filteredOrders,
  isLoading,
  hasDateFilter,
  formatDate,
}: PurchaseSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  const totalAmount = filteredOrders.reduce(
    (total, order) => total + order.total_price,
    0
  );

  const mostRecentOrder = (
    hasDateFilter ? filteredOrders : orders.filter((order) => !order.is_deleted)
  ).sort(
    (a, b) =>
      new Date(b.ordered_at).getTime() - new Date(a.ordered_at).getTime()
  )[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {hasDateFilter ? "선택된 날짜 구매 건수" : "총 구매 건수"}
              </p>
              <p className="text-xl font-semibold">{filteredOrders.length}건</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {hasDateFilter ? "선택된 날짜 구매 금액" : "총 구매 금액"}
              </p>
              <p className="text-xl font-semibold">
                {totalAmount.toLocaleString()}원
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">최근 주문일</p>
              <p className="text-xl font-semibold">
                {mostRecentOrder ? formatDate(mostRecentOrder.ordered_at) : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[60px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
