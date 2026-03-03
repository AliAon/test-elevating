import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronsUpDown, CirclePlus } from "lucide-react";
import React, { useState } from "react";

export default function Buildings({handleBack}) {
  return (
    <div>
      <div className="bg-bg_primary rounded-xl p-7">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-black font-semibold">Buildings</p>
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
                placeholder="Search for the name"
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>

            <Button className="w-[140px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary">
              <CirclePlus size={18} />
              Add Another
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-8">
          <TableHeader />
          <div className="mt-2 min-w-[700px] space-y-2">
            <TableRow />
            <TableRow />
            <TableRow />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={handleBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

const TableHeader = () => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between">
      <div className="w-[350px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        <div className="flex items-center gap-5">
          <Checkbox
            className="bg-white rounded-none"
            checked={checked}
            onCheckedChange={setChecked}
          />
          Property
        </div>
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[230px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        No of Equipments
        <ChevronsUpDown size={16} />
      </div>
      <div className="flex-1 flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Address
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
};

const TableRow = () => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="w-full flex items-start justify-between bg-white rounded-2xl">
      <div className="w-[350px] flex items-center gap-5 p-4 space-y-1">
        <Checkbox
          className="bg-white rounded-none mt-1.5"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p className="text-sm text-text_primary font-semibold truncate">
          Water Mark Ltd.
        </p>
      </div>

      <div className="w-[230px] flex items-start gap-2 p-4">
        <p className="text-sm text-text_secondary font-semibold truncate">
          258
        </p>
      </div>

      <div className="flex-1 p-4 space-y-1 flex items-center justify-between">
        <p className="text-sm text-text_secondary font-semibold truncate">
          Clarence Street, Sydney NSW 2000, Australia
        </p>
        <ChevronRight size={20} color="#898EA6" className="cursor-pointer" />
      </div>
    </div>
  );
};
