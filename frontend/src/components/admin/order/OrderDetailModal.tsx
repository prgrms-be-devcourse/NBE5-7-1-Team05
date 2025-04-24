import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  email: string;
  address: string;
  zipCode: string;
  items: OrderItem[];
  totalAmount: number;
  date: string;
}

interface Props {
  order: Order;
}

const OrderDetailModal: React.FC<Props> = ({ order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          상세보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>주문 상세 정보 ({order.id})</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-medium mb-2">주문 정보</h3>
            <p>
              <span className="text-gray-500">이메일:</span> {order.email}
            </p>
            <p>
              <span className="text-gray-500">주소:</span> {order.address}
            </p>
            <p>
              <span className="text-gray-500">우편번호:</span> {order.zipCode}
            </p>
            <p>
              <span className="text-gray-500">주문일시:</span>{" "}
              {new Date(order.date).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">주문 상품</h3>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>총 금액</span>
              <span>{order.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
