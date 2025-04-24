import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../../assets/grid_and_circle_logo.png";
import { useAuth } from "@/contexts/AuthContext";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur flex justify-center">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} className="w-12" />
            <span
              className="text-2xl font-bold font-outfit"
              style={{
                fontFamily: "DM Sans",
                fontWeight: 500,
                fontSize: "1.7rem",
                color: "#43301d",
              }}
            >
              Grid & Circle
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            className="bg-transparent hover:bg-stone-50 text-black shadow-none"
            asChild
          >
            <Link to="/products">상품 목록</Link>
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
      </div>
    </header>
  );
};

export default NavBar;
