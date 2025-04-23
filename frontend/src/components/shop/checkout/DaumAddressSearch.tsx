import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DaumAddressSearchProps {
  onComplete: (data: { address: string; zonecode: string }) => void;
  triggerId?: string;
}

const DaumAddressSearch: React.FC<DaumAddressSearchProps> = ({
  onComplete,
  triggerId,
}) => {
  const [open, setOpen] = useState(false);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onComplete({
      address: fullAddress,
      zonecode: data.zonecode,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          id={triggerId}
          type="button"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          주소 찾기
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[500px]">
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] overflow-hidden">
          <DaumPostcode
            onComplete={handleComplete}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DaumAddressSearch;
