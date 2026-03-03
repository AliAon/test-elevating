import { Input } from "@/components/ui/input";
import React from "react";
import TableHeader from "./table-header";
import TableRow from "./table-row";

const list = [
  {
    id: 1,
    contract: {
      label: "KONE Contract #1",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 1",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 2,
    contract: {
      label: "KONE Contract #2",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 3,
    contract: {
      label: "KONE Contract #3",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 4,
    contract: {
      label: "KONE Contract #4",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 1",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 5,
    contract: {
      label: "KONE Contract #5",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 6,
    contract: {
      label: "KONE Contract #6",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 3",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
];

export default function EsLinkedContract() {
  return (
    <div>
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Linked ES Pulse Contracts
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
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>
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
    </div>
  );
}
