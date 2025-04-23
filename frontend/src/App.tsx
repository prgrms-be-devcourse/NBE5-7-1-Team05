import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navigation/NavBar";
import ShoppingCartPage from "./pages/shop/ShoppingCartPage";
import AdminSignupPage from "./pages/admin/AdminSignupPage";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ShoppingCartPage />} />
            <Route path="/products" element={<ShoppingCartPage />} />
            <Route path="/signup" element={<AdminSignupPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
