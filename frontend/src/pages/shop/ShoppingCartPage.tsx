import React from "react";
import { useState } from "react";
import Product from "@/interface/Product";
import CartItem from "@/interface/CartItem";
import ProductList from "../../components/shop/product/ProductList";
import CheckoutForm from "../../components/shop/checkout/CheckoutForm";

const ShoppingCartPage = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "콜롬비아 나리뇨",
      price: 5000,
      category: "커피콩",
      imageUrl: "https://i.imgur.com/HKOFQYa.jpeg",
      stock: 100,
    },
    {
      id: 2,
      name: "게이샤",
      price: 5000,
      category: "커피콩",
      imageUrl: "https://i.imgur.com/HKOFQYa.jpeg",
      stock: 100,
    },
    {
      id: 3,
      name: "과테말라",
      price: 5000,
      category: "커피콩",
      imageUrl: "https://i.imgur.com/HKOFQYa.jpeg",
      stock: 100,
    },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existingItem = cart.find((item) => item.product.id === productId);

    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.product.id !== productId));
    }
  };

  const handleCheckout = () => {
    if (!email || !address || !zipCode) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

    alert("결제가 완료되었습니다!");
    console.log("주문 정보:", { cart, email, address, zipCode });

    setCart([]);
    setEmail("");
    setAddress("");
    setZipCode("");
  };

  return (
    <div className="container mx-auto p-4 mt-4">
      <h1 className="text-2xl font-semibold mb-6">상품 대시보드</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductList
            products={products}
            cart={cart}
            onAddToCart={addToCart}
            onRemovefromCart={removeFromCart}
          />
        </div>
        <div>
          <CheckoutForm
            cart={cart}
            email={email}
            address={address}
            zipCode={zipCode}
            onEmailChange={setEmail}
            onAddressChange={setAddress}
            onZipCodeChange={setZipCode}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
