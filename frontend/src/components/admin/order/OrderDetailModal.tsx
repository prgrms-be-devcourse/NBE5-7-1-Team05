import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/interface/Order";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, MailIcon, PackageIcon } from "lucide-react";

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  order: Order;
}

const OrderDetailModal: React.FC<Props> = ({ order }) => {
  // 주문 상태에 따른 배지 색상 결정
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            처리중
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            배송중
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            배송완료
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            처리중
          </Badge>
        );
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("ko-KR", options);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="transition hover:bg-gray-100"
        >
          상세보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-w-3xl md:max-w-4xl mt04">
        <DialogHeader className="border-b pb-4 mt-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <DialogTitle className="text-xl">
              주문 #{order.order_id} {getStatusBadge(order.status)}
            </DialogTitle>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <CalendarIcon size={14} /> {formatDate(order.ordered_at)}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* 주문자 정보 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <MailIcon size={18} className="mr-2 text-gray-500" />
              주문자 정보
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">이메일</span>
                  <span className="font-medium">{order.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 배송 정보 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <MapPinIcon size={18} className="mr-2 text-gray-500" />
              배송 정보
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-gray-600">주소</span>
                  <span className="font-medium">{order.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">우편번호</span>
                  <span className="font-medium">{order.postal_code}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 주문 상품 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <PackageIcon size={18} className="mr-2 text-gray-500" />
              주문 상품
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="divide-y">
                {order.order_products.map((item, index) => (
                  <li key={index} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString()}원 x {item.quantity}개
                        </p>
                      </div>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>총 결제금액</span>
                  <span className="text-blue-700">
                    {order.total_price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline">닫기</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
