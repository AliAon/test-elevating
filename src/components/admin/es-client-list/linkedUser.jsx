import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableHeader from "./table-header";
import TableRow from "./table-row";
import { useGetUsersQuery } from "@/redux/services/auth-api";
import { ContactListSkeleton } from "@/components/skeleton/contact-row-skeleton";
import { useDebounce } from "@/hooks/useDebounce";

export default function ESClient() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const debounceQuery = useDebounce(search, 300);

  const { data, isFetching } = useGetUsersQuery({
    user_type_id:
      "21661987-bbca-48bb-aa4b-1e6faa4895c8|7c0be78a-8d89-43bd-a014-4d31e6d7f85a",
    search: debounceQuery,
    limit: 100,
  });

  const users = data?.data || [];
  return (
    <div>
      <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">ES Clients</p>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
              <SlidersHorizontal size={20} className="text-text_secondary" />
              <p className="text-sm text-text_secondary font-semibold">
                Filter
              </p>
            </div>

            <Button
              onClick={() => navigate("/create-users?type=es-client")}
              className="w-[150px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
            >
              <CirclePlus size={18} />
              Add User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-8">
          <TableHeader
            onSetSortkey={setSortkey}
            onSetSortOrder={setSortOrder}
          />
          {isFetching ? (
            <ContactListSkeleton count={5} />
          ) : (
            <div className="mt-2 min-w-[700px] space-y-2">
              {[...(users || [])]
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

                ?.map((row) => (
                  <TableRow key={row?.user_id} row={row} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
