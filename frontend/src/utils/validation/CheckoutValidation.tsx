export const validateEmail = (
  email: string
): { isValid: boolean; message: string } => {
  if (!email.trim()) {
    return { isValid: false, message: "이메일을 입력해주세요." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "유효한 이메일 형식을 입력해주세요." };
  }
  return { isValid: true, message: "" };
};

export const validateAddress = (
  address: string
): { isValid: boolean; message: string } => {
  if (!address.trim()) {
    return { isValid: false, message: "주소를 입력해주세요." };
  }

  if (address.trim().length < 5) {
    return { isValid: false, message: "주소는 최소 5자 이상이어야 합니다." };
  }

  return { isValid: true, message: "" };
};

export const validateZipCode = (
  zipCode: string
): { isValid: boolean; message: string } => {
  if (!zipCode.trim()) {
    return { isValid: false, message: "우편번호를 입력해주세요." };
  }

  const zipCodeRegex = /^\d{5}$/;
  if (!zipCodeRegex.test(zipCode)) {
    return { isValid: false, message: "우편번호는 5자리 숫자여야 합니다." };
  }

  return { isValid: true, message: "" };
};

export const validateCheckoutForm = (
  email: string,
  address: string,
  zipCode: string
): {
  isValid: boolean;
  errors: { email?: string; address?: string; zipCode?: string };
} => {
  const emailValidation = validateEmail(email);
  const addressValidation = validateAddress(address);
  const zipCodeValidation = validateZipCode(zipCode);

  const isValid =
    emailValidation.isValid &&
    addressValidation.isValid &&
    zipCodeValidation.isValid;

  const errors: { email?: string; address?: string; zipCode?: string } = {};

  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  if (!addressValidation.isValid) {
    errors.address = addressValidation.message;
  }

  if (!zipCodeValidation.isValid) {
    errors.zipCode = zipCodeValidation.message;
  }
  return { isValid, errors };
};
