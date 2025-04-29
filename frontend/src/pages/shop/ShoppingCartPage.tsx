import { useState, useEffect } from "react";
import axios from "axios";
import Product from "@/interface/Product";
import CartItem from "@/interface/CartItem";
import ProductList from "../../components/shop/product/ProductList";
import CheckoutForm from "../../components/shop/checkout/CheckoutForm";

const ShoppingCartPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_API_PRODUCTS
          }`
        );
        const activeProducts = response.data.data.filter(
          (product: Product) => !product.deleted
        );
        setProducts(activeProducts);
        setError(null);
      } catch (err) {
        setError("상품을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
        console.error("상품 목록 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 mt-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-4">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-brown-900 text-white rounded hover:bg-brown-800"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-4">
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
