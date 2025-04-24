import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import Product from "@/interface/Product";

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  stock: number;
  onStockChange: (stock: number) => void;
  onSubmit: () => void;
}

const StockDialog: React.FC<StockDialogProps> = ({
  open,
  onOpenChange,
  product,
  stock,
  onStockChange,
  onSubmit,
}) => {
  const handleIncrement = () => {
    onStockChange(stock + 1);
  };

  const handleDecrement = () => {
    if (stock > 1) {
      onStockChange(stock - 1);
    }
  };

  const totalStock = (product?.stock || 0) + stock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            재고 추가
          </DialogTitle>
          <DialogDescription>
            {product?.name}의 재고를 추가합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-md">
            <div>
              <p className="text-sm text-gray-500">현재 재고</p>
              <p className="text-2xl text-gray-700 font-bold">
                {product?.stock}개
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-black">추가 후 재고</p>
              <p className="text-2xl font-bold text-black">{totalStock}개</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={stock <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    onStockChange(value);
                  }
                }}
                min="1"
                className="text-center text-lg font-semibold h-10"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              최소 1개 이상의 재고를 추가해야 합니다.
            </p>
          </div>

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-1/2"
            >
              취소
            </Button>
            <Button
              onClick={onSubmit}
              className="w-1/2 bg-brown-900 hover:bg-brown-800 text-white"
            >
              추가
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockDialog;
