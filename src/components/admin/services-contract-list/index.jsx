import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import React from "react";
import TableHeader from "./table-header";
import TableRow from "./table-row";
import { servicelist } from "@/helpers/constant";

export default function ServiceContractList() {
  return (
    <div>
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Service Contracts
          </p>
          <div className="flex items-center gap-4">
            <div className="relative w-[260px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
              <img
                src="/assets/svg/search.svg"
                alt=""
                width={24}
                height={24}
                className="absolute top-1/2 -translate-y-1/2 left-5"
              />
              <Input
                placeholder="Search contracts"
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>
            <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
              <SlidersHorizontal size={20} className="text-text_secondary" />
              <p className="text-sm text-text_secondary font-semibold">
                Filter
              </p>
            </div>

            <Button className="w-[207px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary">
              <CirclePlus size={18} />
              Add Service Contract
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-8">
          <TableHeader />
          <div className="mt-2 min-w-[700px] space-y-2">
            {servicelist.map((row) => (
              <TableRow key={row.id} row={row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
