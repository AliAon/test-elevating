import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export const Header = ({ title, onAdd, onBoarding }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-2xl text-black font-semibold">{title}</p>
      {title !== "Link Building" && (
        <Button
          onClick={onAdd}
          className="w-[140px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
        >
          <CirclePlus size={18} />
          Add Another
        </Button>
      )}
    </div>
  );
};
