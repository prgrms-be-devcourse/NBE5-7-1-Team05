import Product from "@/interface/Product";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateProduct = (
  product: Omit<Product, "id">
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!product.name.trim()) {
    errors.push({ field: "name", message: "상품명을 입력해주세요." });
  } else if (product.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "상품명은 2자 이상이어야 합니다.",
    });
  }

  if (!product.category.trim()) {
    errors.push({
      field: "category",
      message: "카테고리를 입력해주세요.",
    });
  }

  // 가격 검증
  if (product.price <= 0) {
    errors.push({ field: "price", message: "가격은 0보다 커야 합니다." });
  } else if (product.price > 1000000) {
    errors.push({
      field: "price",
      message: "가격은 1,000,000원 이하여야 합니다.",
    });
  }

  // 이미지 URL 검증
  if (!product.image_url.trim()) {
    errors.push({
      field: "imageUrl",
      message: "이미지 URL을 입력해주세요.",
    });
  } else if (!isValidUrl(product.image_url)) {
    errors.push({
      field: "imageUrl",
      message: "유효한 URL 형식이 아닙니다.",
    });
  }

  // 재고 검증
  if (product.stock <= 0) {
    errors.push({
      field: "stock",
      message: "재고는 1 이상이어야 합니다.",
    });
  } else if (product.stock > 10000) {
    errors.push({
      field: "stock",
      message: "재고는 10,000개 이하여야 합니다.",
    });
  }

  return errors;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
