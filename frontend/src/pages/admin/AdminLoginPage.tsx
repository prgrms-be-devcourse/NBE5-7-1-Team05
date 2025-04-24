import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginForm from "@/interface/LoginForm";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      // TODO: 승중님 로그인 완료하시면 로컬 스토리지에 저장
      // 토큰 저장
      // localStorage.setItem("adminToken", "dummy_token");
      // login(response.data.token, response.data.user);
      navigate("/admin");
    } catch (error: any) {
      // TODO: 로그인 연동 후 에러 데이터 구조 적용
      if (error.response?.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        // 서버에 요청은 보냈지만 응답을 받지 못한 경우
        setError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full bg-brown-900 hover:bg-brown-800"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/signup")}
            >
              회원가입
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
