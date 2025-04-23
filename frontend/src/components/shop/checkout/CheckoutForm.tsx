import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CartItem from "@/interface/CartItem";
import DaumAddressSearch from "./DaumAddressSearch";
import {
  validateEmail,
  validateAddress,
  validateZipCode,
} from "@/utils/validation/CheckoutValidation";
import { Search } from "lucide-react";

interface CheckoutFormProps {
  cart: CartItem[];
  email: string;
  address: string;
  zipCode: string;
  onEmailChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onCheckout: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart,
  email,
  address,
  zipCode,
  onEmailChange,
  onAddressChange,
  onZipCodeChange,
  onCheckout,
}) => {
  const [errors, setErrors] = useState<{
    email?: string;
    address?: string;
    zipCode?: string;
  }>({});

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleAddressComplete = (data: {
    address: string;
    zonecode: string;
  }) => {
    onAddressChange(data.address);
    onZipCodeChange(data.zonecode);

    setErrors({
      ...errors,
      address: undefined,
      zipCode: undefined,
    });
  };

  const handleEmailChange = (value: string) => {
    onEmailChange(value);

    const validation = validateEmail(value);
    if (!validation.isValid) {
      setErrors({ ...errors, email: validation.message });
    } else {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handleCheckoutClick = () => {
    const emailValidation = validateEmail(email);
    const addressValidation = validateAddress(address);
    const zipCodeValidation = validateZipCode(zipCode);

    const newErrors = {
      email: !emailValidation.isValid ? emailValidation.message : undefined,
      address: !addressValidation.isValid
        ? addressValidation.message
        : undefined,
      zipCode: !zipCodeValidation.isValid
        ? zipCodeValidation.message
        : undefined,
    };

    setErrors(newErrors);

    if (
      emailValidation.isValid &&
      addressValidation.isValid &&
      zipCodeValidation.isValid
    ) {
      onCheckout();
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">주문 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-muted-foreground mb-2">
            선택한 상품 ({totalItems}개)
          </p>

          {cart.length > 0 ? (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    {(item.product.price * item.quantity).toLocaleString()}원
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">장바구니가 비어있습니다.</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">배송 정보</h3>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-base">
              구매자 정보
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="address-search" className="text-base">
                주소
              </Label>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("address-search-trigger")?.click()
                  }
                >
                  <Search className="h-4 w-4 mr-1" />
                  주소 찾기
                </Button>
              </div>
            </div>

            <div className="hidden">
              <DaumAddressSearch
                onComplete={handleAddressComplete}
                triggerId="address-search-trigger"
              />
            </div>

            <Input
              id="address"
              type="text"
              placeholder="주소"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              readOnly
              className={`${errors.address ? "border-red-500" : ""} bg-gray-50`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              id="zipcode"
              type="text"
              placeholder="우편번호"
              value={zipCode}
              onChange={(e) => onZipCodeChange(e.target.value)}
              readOnly
              className={`${errors.zipCode ? "border-red-500" : ""} bg-gray-50`}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              id="detail-address"
              type="text"
              placeholder="상세 주소 입력 (선택사항)"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <div className="flex justify-between w-full font-bold">
          <span>총 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <Button
          className="w-full bg-brown-900 hover:bg-brown-800 "
          size="lg"
          onClick={handleCheckoutClick}
          disabled={cart.length === 0}
        >
          결제하기
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CheckoutForm;
