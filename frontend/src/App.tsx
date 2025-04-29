import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import ShoppingCartPage from "./pages/shop/ShoppingCartPage";
import AdminSignupPage from "./pages/admin/AdminSignupPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import PurchaseHistory from "./pages/user/PurchaseHistory";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-stone-50 flex flex-col">
          <NavBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ShoppingCartPage />} />
              <Route path="/products" element={<ShoppingCartPage />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/admin/signup" element={<AdminSignupPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
