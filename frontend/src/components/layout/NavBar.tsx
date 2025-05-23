import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "../../assets/grid_and_circle_logo.png";
import { useAuth } from "@/contexts/AuthContext";
import EmailDialog from "../history/EmailDialog";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleEmailSubmit = (email: string) => {
    localStorage.setItem("purchaseEmail", email);
    setIsDialogOpen(false);
    navigate("/purchase-history");
  };

  const handlePurchaseHistoryClick = () => {
    const savedEmail = localStorage.getItem("purchaseEmail");
    if (savedEmail) {
      navigate("/purchase-history");
    } else {
      setIsDialogOpen(true);
    }
    closeMenu();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur flex justify-center">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img src={logo} alt="Grid & Circle" className="w-12" />
              <span
                className="text-xl md:text-2xl font-bold font-outfit"
                style={{
                  fontFamily: "DM Sans",
                  fontWeight: 500,
                  fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                  color: "#43301d",
                }}
              >
                Grid & Circle
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              className="bg-transparent hover:bg-stone-50 text-black shadow-none"
              asChild
            >
              <Link to="/products">상품 목록</Link>
            </Button>
            <Button
              className="bg-transparent hover:bg-stone-50 text-black shadow-none"
              onClick={handlePurchaseHistoryClick}
            >
              구매 조회
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="outline" className="text-black" asChild>
                  <Link to="/admin">관리자 대시보드</Link>
                </Button>
                <Button
                  className="bg-brown-900 hover:bg-brown-800"
                  onClick={handleLogout}
                  asChild
                >
                  <Link to="/">로그아웃</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="text-black" asChild>
                  <Link to="/admin/login">관리자 로그인</Link>
                </Button>
                <Button className="bg-brown-900 hover:bg-brown-800" asChild>
                  <Link to="/admin/signup">관리자 회원가입</Link>
                </Button>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-black" />
            ) : (
              <Menu className="h-6 w-6 text-black" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <Link
                to="/products"
                className="text-black hover:bg-stone-50 px-4 py-2 rounded-md"
                onClick={closeMenu}
              >
                상품 목록
              </Link>
              <button
                className="text-black hover:bg-stone-50 px-4 py-2 rounded-md text-left"
                onClick={handlePurchaseHistoryClick}
              >
                구매 조회
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="text-black hover:bg-stone-50 px-4 py-2 rounded-md border border-gray-200"
                    onClick={closeMenu}
                  >
                    관리자 대시보드
                  </Link>
                  <button
                    className="text-white bg-brown-900 hover:bg-brown-800 px-4 py-2 rounded-md text-left"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/admin/login"
                    className="text-black hover:bg-stone-50 px-4 py-2 rounded-md border border-gray-200"
                    onClick={closeMenu}
                  >
                    관리자 로그인
                  </Link>
                  <Link
                    to="/admin/signup"
                    className="text-white bg-brown-900 hover:bg-brown-800 px-4 py-2 rounded-md"
                    onClick={closeMenu}
                  >
                    관리자 회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <EmailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleEmailSubmit}
      />
    </>
  );
};

export default NavBar;
