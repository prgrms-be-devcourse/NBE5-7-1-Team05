import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailDialog from "@/components/history/EmailDialog";
import { PurchaseTable } from "@/components/history/PurchaseTable";
import { PurchaseFilters } from "@/components/history/PurchaseFilters";
import { PurchaseSummaryCards } from "@/components/history/PurchaseSummaryCards";
import { CancelledPurchases } from "@/components/history/CancelledPurchases";
import { Purchase } from "@/interface/Purchase";

const mockPurchases: Purchase[] = [
  {
    id: "ORD-001",
    productName: "Wireless Headphones",
    price: 129990,
    purchaseDate: "2025-04-26",
    purchaseTime: "13:30:00",
    status: "processing",
    quantity: 1,
    is_deleted: false,
  },
  {
    id: "ORD-002",
    productName: "Smart Watch",
    price: 199990,
    purchaseDate: "2025-04-26",
    purchaseTime: "10:15:00",
    status: "processing",
    quantity: 1,
    is_deleted: false,
  },
  {
    id: "ORD-003",
    productName: "Laptop Stand",
    price: 39990,
    purchaseDate: "2025-04-25",
    purchaseTime: "15:45:00",
    status: "delivered",
    quantity: 2,
    is_deleted: false,
  },
  {
    id: "ORD-004",
    productName: "Bluetooth Speaker",
    price: 79990,
    purchaseDate: "2025-04-24",
    purchaseTime: "11:00:00",
    status: "delivered",
    quantity: 1,
    is_deleted: true,
  },
  {
    id: "ORD-005",
    productName: "USB-C Hub",
    price: 49990,
    purchaseDate: "2025-04-26",
    purchaseTime: "13:30:00",
    status: "processing",
    quantity: 1,
    is_deleted: true,
  },
  {
    id: "ORD-006",
    productName: "Mechanical Keyboard",
    price: 149990,
    purchaseDate: "2025-04-24",
    purchaseTime: "09:20:00",
    status: "delivered",
    quantity: 1,
    is_deleted: false,
  },
  {
    id: "ORD-007",
    productName: "Gaming Mouse",
    price: 89990,
    purchaseDate: "2025-04-23",
    purchaseTime: "16:40:00",
    status: "delivered",
    quantity: 1,
    is_deleted: false,
  },
];

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<
    "all" | "processing" | "shipped" | "delivered"
  >("all");
  const [showCancelled, setShowCancelled] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  // 배송 상태를 시간 기준으로 계산하는 함수
  const calculateDeliveryStatus = (purchase: Purchase): Purchase["status"] => {
    if (purchase.is_deleted) return purchase.status;

    const now = new Date();
    const purchaseDateTime = new Date(
      `${purchase.purchaseDate}T${purchase.purchaseTime}`
    );

    // 오늘 오후 2시 기준
    const todayDeliveryDeadline = new Date();
    todayDeliveryDeadline.setHours(14, 0, 0, 0);

    // 어제 오후 2시 기준
    const yesterdayDeliveryDeadline = new Date();
    yesterdayDeliveryDeadline.setDate(yesterdayDeliveryDeadline.getDate() - 1);
    yesterdayDeliveryDeadline.setHours(14, 0, 0, 0);

    // 어제 오후 2시 이후 ~ 오늘 오후 2시 이전에 주문했다면 배송완료
    if (
      purchaseDateTime >= yesterdayDeliveryDeadline &&
      purchaseDateTime < todayDeliveryDeadline &&
      now > todayDeliveryDeadline
    ) {
      return "delivered";
    }

    // 그 외의 경우 원래 상태 유지
    return purchase.status;
  };

  const loadPurchases = async () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      const updatedPurchases = mockPurchases.map((purchase) => ({
        ...purchase,
        status: calculateDeliveryStatus(purchase),
      }));
      setPurchases(updatedPurchases);
      setIsLoading(false);
    }, 1500); // Simulate loading delay
  };

  useEffect(() => {
    // Check if user is already authenticated
    const savedEmail = localStorage.getItem("purchaseEmail");
    if (!savedEmail) {
      navigate("/");
    } else {
      loadPurchases();
    }
  }, [navigate]);

  const getStatusColor = (status: Purchase["status"]) => {
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

  const formatDateTime = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredPurchases = purchases.filter((purchase) => {
    // Filter by date
    if (date) {
      const purchaseDate = new Date(purchase.purchaseDate);
      if (purchaseDate.toDateString() !== date.toDateString()) {
        return false;
      }
    }

    // Filter by status
    if (statusFilter !== "all" && purchase.status !== statusFilter) {
      return false;
    }

    // Always exclude cancelled orders from main list
    return !purchase.is_deleted;
  });

  const cancelledPurchases = purchases.filter(
    (purchase) => purchase.is_deleted
  );

  const handleEmailChange = (email: string) => {
    localStorage.setItem("purchaseEmail", email);
    setIsEmailDialogOpen(false);
    loadPurchases();
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
              purchases={filteredPurchases}
              isLoading={isLoading}
              getStatusColor={getStatusColor}
              formatDateTime={formatDateTime}
              hasFilterApplied={!!date || statusFilter !== "all"}
            />
          </CardContent>
        </Card>

        <CancelledPurchases
          purchases={cancelledPurchases}
          showCancelled={showCancelled}
          setShowCancelled={setShowCancelled}
          formatDateTime={formatDateTime}
        />

        <PurchaseSummaryCards
          purchases={purchases}
          filteredPurchases={filteredPurchases}
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
    </div>
  );
}
