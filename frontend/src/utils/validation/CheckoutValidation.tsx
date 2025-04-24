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

export const validateName = (
  name: string
): { isValid: boolean; message: string } => {
  if (!name.trim()) {
    return { isValid: false, message: "이름을 입력해주세요." };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: "이름은 2자 이상이어야 합니다." };
  }

  return { isValid: true, message: "" };
};

export const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: "비밀번호를 입력해주세요." };
  }

  if (password.length < 8) {
    return { isValid: false, message: "비밀번호는 8자 이상이어야 합니다." };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "비밀번호는 특수문자를 포함해야 합니다.",
    };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "비밀번호는 숫자를 포함해야 합니다." };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "비밀번호는 대문자를 포함해야 합니다." };
  }

  return { isValid: true, message: "" };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): { isValid: boolean; message: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: "비밀번호 확인을 입력해주세요." };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
  }

  return { isValid: true, message: "" };
};

export const validateAdminCode = (
  adminCode: string
): { isValid: boolean; message: string } => {
  if (!adminCode.trim()) {
    return { isValid: false, message: "관리자 코드를 입력해주세요." };
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

export const validateSignupForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  adminCode: string
): {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    adminCode?: string;
  };
} => {
  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const confirmPasswordValidation = validateConfirmPassword(
    password,
    confirmPassword
  );
  const adminCodeValidation = validateAdminCode(adminCode);

  const isValid =
    nameValidation.isValid &&
    emailValidation.isValid &&
    passwordValidation.isValid &&
    confirmPasswordValidation.isValid &&
    adminCodeValidation.isValid;

  const errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    adminCode?: string;
  } = {};

  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }

  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message;
  }

  if (!adminCodeValidation.isValid) {
    errors.adminCode = adminCodeValidation.message;
  }

  return { isValid, errors };
};
