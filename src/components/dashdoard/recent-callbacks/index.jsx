import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecentHeader from "./table-header";
import RecentRow from "./table-row";
import dayjs from "dayjs";
import { useGetCallbacksAllHistoryQuery } from "@/redux/services/call-backs-api";
import { useSelector } from "react-redux";
import { SkeletonRows } from "@/components/callbacks/callbacks-history";
import Paginate from "@/components/common/paginate";

export default function RecentCallbacks({ level3 }) {
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  useEffect(() => {
    // Reset to first page when building, subscription, or page size changes
    setPage(1);
  }, [level3, subscription_id, rowsPerPage]);

  const {
    data: summary,
    isLoading,
    isFetching,
  } = useGetCallbacksAllHistoryQuery(
    {
      es_subscription_id: subscription_id,
      buildingId: level3,
      date_to: dayjs().format("YYYY-MM-DD"),
      page,
      limit: rowsPerPage,
    },
    { skip: !subscription_id || !level3 },
  );

  const results = summary?.data?.results;
  const pagination = summary?.data?.pagination;
  return (
    <div className="bg-[#F6F6F8] rounded-xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Recent Activity</p>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(val) => setRowsPerPage(Number(val))}
        >
          <SelectTrigger className="w-auto min-h-11 bg-white rounded-2xl text-sm text-[#5B617F] font-semibold">
            <SelectValue placeholder="Select Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 Rows</SelectItem>
            <SelectItem value="20">20 Rows</SelectItem>
            <SelectItem value="30">30 Rows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        <RecentHeader onSetSortkey={setSortkey} onSetSortOrder={setSortOrder} />

        {isLoading || isFetching ? (
          <SkeletonRows />
        ) : (
          <div className="space-y-1.5 mt-2">
            {[...(results || [])]
              ?.sort((a, b) => {
                const valA = a[sortkey];
                const valB = b[sortkey];
                //if date
                if (!isNaN(Date.parse(valA)) && !isNaN(Date.parse(valB))) {
                  return sortOrder === "asc"
                    ? new Date(valA) - new Date(valB)
                    : new Date(valB) - new Date(valA);
                }
                //if number
                if (typeof valA === "number" && typeof valB === "number") {
                  return sortOrder === "asc" ? valA - valB : valB - valA;
                }

                //if String
                return sortOrder === "asc"
                  ? valA?.toString()?.localeCompare(valB?.toString())
                  : valB?.toString()?.localeCompare(valA?.toString());
              })
              ?.map((item, index) => (
                <RecentRow key={index} item={item} />
              ))}
          </div>
        )}
      </div>
      <div>
        <Paginate
          totalPages={pagination?.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
