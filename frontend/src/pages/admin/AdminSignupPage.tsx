import React, { useState, useEffect } from "react";
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
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateAdminCode,
  validateSignupForm,
} from "../../utils/validation/CheckoutValidation";
import SignupForm from "@/interface/SignupForm";
import { FormErrors } from "@/interface/FormErrors";
import { authService } from "@/utils/api/authService";

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const checkFormValidity = () => {
    const { isValid } = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.adminCode
    );
    setIsFormValid(isValid);
  };

  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: value,
    }));

    let validation;
    switch (id) {
      case "name":
        validation = validateName(value);
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "password":
        validation = validatePassword(value);
        if (formData.confirmPassword) {
          const confirmValidation = validateConfirmPassword(
            value,
            formData.confirmPassword
          );
          setErrors((prev: any) => ({
            ...prev,
            confirmPassword: confirmValidation.isValid
              ? undefined
              : confirmValidation.message,
          }));
        }
        break;
      case "confirmPassword":
        validation = validateConfirmPassword(formData.password, value);
        break;
      case "adminCode":
        validation = validateAdminCode(value);
        break;
      default:
        return;
    }

    setErrors((prev: any) => ({
      ...prev,
      [id]: validation.isValid ? undefined : validation.message,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const { isValid, errors: formErrors } = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.adminCode
    );

    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode,
      });

      console.log(response);

      navigate("/admin/login");
    } catch (error: any) {
      if (error.response?.status === 400) {
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data?.message) {
          setApiError(error.response.data.message);
        } else {
          setApiError("입력한 정보를 확인해주세요.");
        }
      } else if (error.response?.status === 409) {
        setErrors((prev: any) => ({
          ...prev,
          email: "이미 사용 중인 이메일입니다.",
        }));
      } else if (error.response?.status === 403) {
        setErrors((prev: any) => ({
          ...prev,
          adminCode: "유효하지 않은 관리자 코드입니다.",
        }));
      } else if (error.request) {
        setApiError("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setApiError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 회원가입</CardTitle>
          <CardDescription>관리자 계정을 생성하세요</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
                placeholder="대소문자, 숫자, 특수문자 포함 8자 이상"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminCode">관리자 코드</Label>
              <Input
                id="adminCode"
                type="text"
                placeholder="관리자 코드를 입력하세요"
                value={formData.adminCode}
                onChange={handleInputChange}
                className={errors.adminCode ? "border-red-500" : ""}
              />
              {errors.adminCode && (
                <p className="text-sm text-red-500">{errors.adminCode}</p>
              )}
            </div>
            {apiError && <div className="text-sm text-red-500">{apiError}</div>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full bg-brown-900 hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/login")}
            >
              로그인으로 돌아가기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
