import React from "react";
import { Input } from "@/components/ui/input";

interface Props {
  dateFilter: string;
  emailFilter: string;
  onDateFilterChange: (value: string) => void;
  onEmailFilterChange: (value: string) => void;
}

const OrderFilter: React.FC<Props> = ({
  dateFilter,
  emailFilter,
  onDateFilterChange,
  onEmailFilterChange,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <label className="text-sm font-medium mb-1 block">날짜 필터</label>
        <select
          className="w-full border rounded-md p-2"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
        >
          <option value="today">어제 14:00 ~ 오늘 14:00</option>
          <option value="all">전체 기간</option>
        </select>
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium mb-1 block">이메일 검색</label>
        <Input
          type="text"
          placeholder="이메일 검색"
          value={emailFilter}
          onChange={(e) => onEmailFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrderFilter;
