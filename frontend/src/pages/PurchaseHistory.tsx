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

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<
    "all" | "processing" | "shipped" | "delivered"
  >("all");
  const [showCancelled, setShowCancelled] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // 배송 상태를 시간 기준으로 계산하는 함수
  const calculateDeliveryStatus = (order: Order): Order["status"] => {
    if (order.is_deleted) return "processing";

    const now = new Date();
    const orderDate = new Date(order.ordered_at);

    // 오늘 오후 2시 기준
    const todayDeliveryDeadline = new Date();
    todayDeliveryDeadline.setHours(14, 0, 0, 0);

    // 어제 오후 2시 기준
    const yesterdayDeliveryDeadline = new Date();
    yesterdayDeliveryDeadline.setDate(yesterdayDeliveryDeadline.getDate() - 1);
    yesterdayDeliveryDeadline.setHours(14, 0, 0, 0);

    // 어제 오후 2시 이후 ~ 오늘 오후 2시 이전에 주문했다면 배송완료
    if (
      orderDate >= yesterdayDeliveryDeadline &&
      orderDate < todayDeliveryDeadline &&
      now > todayDeliveryDeadline
    ) {
      return "delivered";
    }

    // 그 외의 경우 처리중 상태
    return "processing";
  };

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
      // API 응답을 Order 형식으로 변환
      let ordersWithStatus: Order[] = [];

      if (Array.isArray(response)) {
        ordersWithStatus = response.map((order) => ({
          ...order,
          status: calculateDeliveryStatus(order),
          is_deleted: false,
        }));
      } else if (response && typeof response === "object") {
        ordersWithStatus = [
          {
            ...(response as Order),
            status: calculateDeliveryStatus(response as Order),
            is_deleted: false,
          },
        ];
      }

      setOrders(ordersWithStatus);
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
      // 주문 취소 후 목록 업데이트
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
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by date
    if (date) {
      const orderDate = new Date(order.ordered_at);
      if (orderDate.toDateString() !== date.toDateString()) {
        return false;
      }
    }

    // Filter by status
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Always exclude cancelled orders from main list
    return !order.is_deleted;
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
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">구매 내역</h1>
          <Button variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
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
