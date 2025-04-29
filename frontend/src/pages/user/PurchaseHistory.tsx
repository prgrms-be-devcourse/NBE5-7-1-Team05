import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailDialog from "@/components/history/EmailDialog";
import { PurchaseTable } from "@/components/history/PurchaseTable";
import { PurchaseFilters } from "@/components/history/PurchaseFilters";
import { PurchaseSummaryCards } from "@/components/history/PurchaseSummaryCards";
import { CancelledPurchases } from "@/components/history/CancelledPurchases";
import { CancelOrderDialog } from "@/components/history/CancelOrderDialog";
import { Order } from "@/interface/Order";
import { orderService } from "@/utils/api/orderService";
import { Mail } from "lucide-react";

import {
  toKSTDate,
  calculateDeliveryStatus,
  formatDate,
  formatDateTime,
} from "@/utils/date/dateUtils";

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<
    "all" | "processing" | "delivered"
  >("all");
  const [showCancelled, setShowCancelled] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const loadOrders = async () => {
    const savedEmail = localStorage.getItem("purchaseEmail");
    if (!savedEmail) {
      navigate("/");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await orderService.getOrdersByEmail(savedEmail);
      const data = response.data;

      let normalOrders: Order[] = [];
      let cancelledOrders: Order[] = [];

      if (Array.isArray(data)) {
        data.forEach((order) => {
          const isDeleted = order.is_deleted || false;

          const orderWithStatus = {
            ...order,
            is_deleted: isDeleted,
            status: calculateDeliveryStatus(order),
          };

          if (isDeleted) {
            cancelledOrders.push(orderWithStatus);
          } else {
            normalOrders.push(orderWithStatus);
          }
        });
      } else if (response && typeof response === "object") {
        const isDeleted = (data as Order).is_deleted || false;

        const orderWithStatus = {
          ...(data as Order),
          is_deleted: isDeleted,
          status: calculateDeliveryStatus(data as Order),
        };

        if (isDeleted) {
          cancelledOrders.push(orderWithStatus);
        } else {
          normalOrders.push(orderWithStatus);
        }
      }

      setOrders([...normalOrders, ...cancelledOrders]);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(
        "주문 내역을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      await orderService.cancelOrder({ order_id: selectedOrderId });
      setOrders(
        orders.map((order) =>
          order.order_id === selectedOrderId
            ? { ...order, is_deleted: true, status: "processing" }
            : order
        )
      );
      setIsCancelDialogOpen(false);
      setSelectedOrderId(null);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("주문 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsCancelDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (order.is_deleted) {
      return false;
    }

    if (date) {
      const orderDate = toKSTDate(order.ordered_at);
      const filterDate = new Date(date);
      if (
        orderDate.getFullYear() !== filterDate.getFullYear() ||
        orderDate.getMonth() !== filterDate.getMonth() ||
        orderDate.getDate() !== filterDate.getDate()
      ) {
        return false;
      }
    }

    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const cancelledOrders = orders.filter((order) => order.is_deleted);

  const handleEmailChange = (email: string) => {
    localStorage.setItem("purchaseEmail", email);
    setIsEmailDialogOpen(false);
    loadOrders();
  };

  const handleFilterReset = () => {
    setDate(undefined);
    setStatusFilter("all");
  };

  return (
    <div className="container mx-auto p-4 md:p-4">
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">현재 이메일:</span>
              <span className="ml-2 text-sm">
                {localStorage.getItem("purchaseEmail")}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEmailDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            이메일 변경
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl">
                구매하신 상품 목록
              </CardTitle>
              <PurchaseFilters
                date={date}
                setDate={setDate}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onReset={handleFilterReset}
              />
            </div>
          </CardHeader>
          <CardContent>
            <PurchaseTable
              orders={filteredOrders}
              isLoading={isLoading}
              getStatusColor={getStatusColor}
              formatDateTime={formatDateTime}
              hasFilterApplied={!!date || statusFilter !== "all"}
              onCancelOrder={handleCancelOrder}
            />
          </CardContent>
        </Card>

        <CancelledPurchases
          orders={cancelledOrders}
          showCancelled={showCancelled}
          setShowCancelled={setShowCancelled}
          formatDateTime={formatDateTime}
        />

        <PurchaseSummaryCards
          orders={orders}
          filteredOrders={filteredOrders}
          isLoading={isLoading}
          hasDateFilter={!!date}
          formatDate={formatDate}
        />
      </div>

      <EmailDialog
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        onSubmit={handleEmailChange}
      />

      <CancelOrderDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancelOrder}
        orderId={selectedOrderId ? `ORD-${selectedOrderId}` : ""}
      />
    </div>
  );
}
