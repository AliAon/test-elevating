import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, CirclePlus, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import AdminSubscriptionFilterPopup from "./admin-subscription-filter-popup";

const list = [
  {
    id: 1,
    contract: {
      label: "KONE Contract #1",
      code: "ID. CTR-002",
    },

    contract_type: "Type 1",
    contract_price: "$120,000 / year",
    next_date: "4",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    sub_value: "$120,000",
    status: "+5%",
  },
  {
    id: 2,
    contract: {
      label: "KONE Contract #2",
      code: "ID. CTR-002",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "4",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    sub_value: "$120,000",
    status: "+5%",
  },
  {
    id: 3,
    contract: {
      label: "KONE Contract #3",
      code: "ID. CTR-002",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "4",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    sub_value: "$120,000",
    status: "+5%",
  },
  {
    id: 4,
    contract: {
      label: "KONE Contract #4",
      code: "ID. CTR-002",
    },

    contract_type: "Type 1",
    contract_price: "$120,000 / year",
    next_date: "4",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    sub_value: "$120,000",
    status: "+5%",
  },
  {
    id: 5,
    contract: {
      label: "KONE Contract #5",
      code: "ID. CTR-002",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "4",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    sub_value: "$120,000",
    status: "+5%",
  },
  {
    id: 6,
    contract: {
      label: "KONE Contract #6",
      code: "ID. CTR-002",
    },

    contract_type: "Type 3",
    contract_price: "$120,000 / year",
    next_date: "4",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    sub_value: "$120,000",
    status: "+5%",
  },
];

export default function AdminClientEsSubscription() {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">
          ES Pluse Subscriptions
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
              placeholder="Search for the name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <AdminSubscriptionFilterPopup
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          <Button className="w-[207px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary">
            <CirclePlus size={18} />
            Add ES Pluse Contract
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader />
        <div className="mt-2 min-w-[700px] space-y-2">
          {list.map((row) => (
            <TableRow key={row.id} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

const TableHeader = () => {
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between">
      <div className="w-[300px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Contract
        <ChevronsUpDown size={16} />
      </div>

      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Sub. Value
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Start and End
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        No. of Buildings
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        No of Equipment
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
};

function TableRow({ row }) {
  return (
    <div className="w-full flex items-start justify-between bg-white rounded-2xl">
      <div className="w-[300px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.contract?.label}
        </p>
        <p className="text-xs text-text_secondary font-medium">
          {row?.contract?.code}
        </p>
      </div>
      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.sub_value}
        </p>
      </div>

      <div className="w-[200px] flex items-start gap-2 p-4">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-sm text-text_primary font-semibold">
            {row?.start_end?.start}
          </p>
          <p className="text-xs text-text_secondary font-medium">
            {row?.start_end?.end}
          </p>
          <p className="text-xs text-[#248EA5] font-medium">
            {row?.start_end?.day_left}
          </p>
        </div>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.next_date}
        </p>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">{row?.status}</p>
      </div>
    </div>
  );
}
