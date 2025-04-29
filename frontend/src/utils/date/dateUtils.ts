import { Order } from "@/interface/Order";

/**
 * 날짜 문자열을 한국 시간(KST)으로 변환
 */
export const toKSTDate = (dateString: string): Date => {
  const date = new Date(dateString);

  // 이미 KST 시간(+09:00)이 포함된 경우는 그대로 반환
  if (dateString.includes("Z") || dateString.includes("+")) {
    return date;
  }

  // KST는 UTC+9이지만, 코드에서는 +8로 설정되어 있었습니다.
  // 실제 요구사항에 맞게 조정하세요.
  date.setHours(date.getHours() + 8);
  return date;
};

/**
 * 주문의 배송 상태 계산
 */
export const calculateDeliveryStatus = (order: Order): Order["status"] => {
  if (order.is_deleted) return "processing";

  // 현재 시간 (한국 시간)
  const now = new Date();

  // 주문 시간 (한국 시간으로 변환)
  const orderDate = toKSTDate(order.ordered_at);

  // 오늘 오후 2시 기준
  const todayDeliveryDeadline = new Date();
  todayDeliveryDeadline.setHours(14, 0, 0, 0);

  // 어제 오후 2시 기준
  const yesterdayDeliveryDeadline = new Date();
  yesterdayDeliveryDeadline.setDate(yesterdayDeliveryDeadline.getDate() - 1);
  yesterdayDeliveryDeadline.setHours(14, 0, 0, 0);

  // 1. 오늘 주문된 경우 - 항상 "처리 중(processing)"
  if (
    orderDate.getDate() === now.getDate() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getFullYear() === now.getFullYear()
  ) {
    return "processing";
  }

  // 2. 어제 오후 2시 이전에 주문된 경우만 "배송 완료(delivered)"
  if (orderDate < yesterdayDeliveryDeadline) {
    return "delivered";
  }

  // 3. 어제 오후 2시 이후에 주문된 경우 - "처리 중(processing)"
  // (즉, 어제 오후 2시 ~ 오늘 자정 사이 주문)

  // 기본값으로 "처리 중(processing)" 반환
  return "processing";
};

/**
 * 한국 시간으로 날짜만 포맷팅
 */
export const formatDate = (dateString: string) => {
  const kstDate = toKSTDate(dateString);
  return kstDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 한국 시간으로 날짜 및 시간 포맷팅
 */
export const formatDateTime = (dateString: string) => {
  const kstDate = toKSTDate(dateString);
  return kstDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * 특정 날짜 범위에 포함되는지 확인 (관리자 페이지용)
 */
export const isDateInRange = (dateString: string, range: "today" | "all") => {
  if (range === "all") return true;

  const orderDate = toKSTDate(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 오늘 오후 2시
  const todayDeadline = new Date(today);
  todayDeadline.setHours(14, 0, 0, 0);

  // 어제 오후 2시
  const yesterdayDeadline = new Date(yesterday);
  yesterdayDeadline.setHours(14, 0, 0, 0);

  return orderDate >= yesterdayDeadline && orderDate <= todayDeadline;
};
