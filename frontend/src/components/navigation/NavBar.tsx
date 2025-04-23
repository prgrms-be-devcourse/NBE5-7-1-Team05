import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur flex justify-center">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold">Coffee Shop</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/products">상품 목록</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin">관리자 로그인</Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/signup">관리자 회원가입</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
