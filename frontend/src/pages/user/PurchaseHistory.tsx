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

  // 한국 시간으로 날짜 변환하는 함수
  const toKSTDate = (dateString: string): Date => {
    const date = new Date(dateString);

    // 이미 KST 시간(+09:00)이 포함된 경우는 그대로 반환
    if (dateString.includes("Z") || dateString.includes("+")) {
      return date;
    }

    date.setHours(date.getHours() + 8);
    return date;
  };

  const calculateDeliveryStatus = (order: Order): Order["status"] => {
    if (order.is_deleted) return "processing";

    // 현재 시간 (한국 시간)
    const now = new Date();

    // 주문 시간 (한국 시간으로 변환)
    const orderDate = toKSTDate(order.ordered_at);

    console.log("주문 날짜/시간 (KST):", orderDate.toLocaleString("ko-KR"));
    console.log("현재 날짜/시간 (KST):", now.toLocaleString("ko-KR"));

    // 오늘 오후 2시 기준
    const todayDeliveryDeadline = new Date();
    todayDeliveryDeadline.setHours(14, 0, 0, 0);

    // 어제 오후 2시 기준
    const yesterdayDeliveryDeadline = new Date();
    yesterdayDeliveryDeadline.setDate(yesterdayDeliveryDeadline.getDate() - 1);
    yesterdayDeliveryDeadline.setHours(14, 0, 0, 0);

    console.log(
      "오늘 오후 2시 기준:",
      todayDeliveryDeadline.toLocaleString("ko-KR")
    );
    console.log(
      "어제 오후 2시 기준:",
      yesterdayDeliveryDeadline.toLocaleString("ko-KR")
    );

    // 새로운 배송 상태 계산 로직:

    // 1. 오늘 주문된 경우 - 항상 "처리 중(processing)"
    if (
      orderDate.getDate() === now.getDate() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    ) {
      return "processing";
    }

    // . 어제 오후 2시 이전에 주문된 경우 - "배송 완료(delivered)"
    if (orderDate < todayDeliveryDeadline) {
      return "delivered";
    }

    // 기본값으로 "처리 중(processing)" 반환
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
      const data = response.data;

      console.log(data);
      let normalOrders: Order[] = [];
      let cancelledOrders: Order[] = [];

      if (Array.isArray(data)) {
        data.forEach((order) => {
          const isDeleted = order.is_deleted || false;

          const orderWithStatus = {
            ...order,
            is_deleted: isDeleted,
            status: isDeleted ? "processing" : calculateDeliveryStatus(order),
          };

          console.log(orderWithStatus);

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
          status: isDeleted
            ? "processing"
            : calculateDeliveryStatus(data as Order),
        };

        if (isDeleted) {
          cancelledOrders.push(orderWithStatus);
        } else {
          normalOrders.push(orderWithStatus);
        }
      }

      setOrders([...normalOrders, ...cancelledOrders]);
      console.log("Normal orders:", normalOrders);
      console.log("Cancelled orders:", cancelledOrders);
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

  // 한국 시간으로 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const kstDate = toKSTDate(dateString);
    return kstDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 한국 시간으로 날짜 및 시간 포맷팅
  const formatDateTime = (dateString: string) => {
    const kstDate = toKSTDate(dateString);
    return kstDate.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 필터링 시 취소되지 않은 주문만 표시하도록 명확하게 수정
  const filteredOrders = orders.filter((order) => {
    // 취소된 주문은 제외
    if (order.is_deleted) {
      return false;
    }

    // 날짜 필터 적용 (한국 시간 기준)
    if (date) {
      const orderDate = toKSTDate(order.ordered_at);
      const filterDate = new Date(date);
      // 날짜만 비교 (시간 제외)
      if (
        orderDate.getFullYear() !== filterDate.getFullYear() ||
        orderDate.getMonth() !== filterDate.getMonth() ||
        orderDate.getDate() !== filterDate.getDate()
      ) {
        return false;
      }
    }

    // 상태 필터 적용
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // 취소된 주문만 따로 필터링
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
