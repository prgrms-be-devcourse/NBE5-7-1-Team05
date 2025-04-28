import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => void;
}

export default function EmailDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: EmailDialogProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      onSubmit(email);
      setEmail(""); // Reset email after submission
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>구매 조회</DialogTitle>
          <DialogDescription>
            구매 내역을 확인하기 위해 이메일을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between space-x-2">
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-brown-900 hover:bg-brown-800">
              조회하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
