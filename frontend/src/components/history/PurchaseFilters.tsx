import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { KoreanCalendar } from "./KoreanCalender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PurchaseFiltersProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  statusFilter: "all" | "processing" | "shipped" | "delivered";
  setStatusFilter: (
    value: "all" | "processing" | "shipped" | "delivered"
  ) => void;
  onReset: () => void;
}

export function PurchaseFilters({
  date,
  setDate,
  statusFilter,
  setStatusFilter,
  onReset,
}: PurchaseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Label className="sm:hidden">날짜 필터</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString("ko-KR") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <KoreanCalendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                return date > today;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Label className="sm:hidden">상태 필터</Label>
        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="processing">처리중</SelectItem>
            <SelectItem value="shipped">배송중</SelectItem>
            <SelectItem value="delivered">배송완료</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
        <RotateCcw className="mr-2 h-4 w-4" />
        필터 초기화
      </Button>
    </div>
  );
}
