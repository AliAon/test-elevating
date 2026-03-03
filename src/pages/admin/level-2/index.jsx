import Paginate from "@/components/common/paginate";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetClientByIdQuery } from "@/redux/services/admin-client";
import { useGetLvl2BySubscriptionIdQuery } from "@/redux/services/subscription";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Level2() {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const [page, setPage] = useState(1);
  const currentPage = params.get("page") ?? page;
  const [search] = useState("");
  const { data: client } = useGetClientByIdQuery(clientId, {
    skip: !clientId,
  });

  const debounce = useDebounce(search, 300);

  const { data, isLoading, isFetching } = useGetLvl2BySubscriptionIdQuery({
    search: debounce,
    page: currentPage,
    limit: 30,
    client_id: clientId,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[86px] h-[66px] flex items-center justify-center rounded-2xl border border-[#EAECEF]">
            <img src={client?.data?.logo_url} alt="" width={58} height={48} />
          </div>
          <div>
            <p className="text-3xl text-text_primary font-semibold">
              {client?.data?.client_name}
            </p>
            <div className="mt-1">
              <p className="text-sm text-text_secondary font-medium">
                {client?.data?.HQ_address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-sm text-text_primary font-semibold">
              ES Pulse - Sydney Corporate Towers
            </p>
          </div>
          <div className="w-[1px] h-12 bg-[#EAECEF]" />
        </div>
      </div>

      <div className="bg-bg_primary rounded-3xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Level 2 List
          </p>
        </div>

        <div className="overflow-x-auto w-full mt-8">
          <TableHeader />
          <div className="mt-2 min-w-[1100px] space-y-2">
            {isLoading || isFetching
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <TableRowSkeleton key={item} />
                ))
              : data?.data?.map((item) => (
                  <TableRow key={item._id} item={item} />
                ))}
          </div>
        </div>

        <div>
          <Paginate
            totalPages={data?.pagination?.pages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="min-w-[1100px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Name
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Contact person
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Phone number
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Email
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Status
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      {/* <div className="w-12"></div> */}
    </div>
  );
}

function TableRow({ item }) {
  const { id, name, email, is_active, contact_person_name, phone_number } =
    item || {};

  const fullAddress = [item?.address, item?.city, item?.state, item?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
      <div className="w-[220px] p-4 space-y-1">
        <div className="flex items-center gap-2">
          <p
            title={name}
            className="text-sm text-gray-900 font-semibold line-clamp-1 flex-1"
          >
            {name}
          </p>
        </div>
      </div>

      <div className="w-[280px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {contact_person_name || "N/A"}
        </p>
        {fullAddress && (
          <p className="text-xs text-gray-500 font-medium line-clamp-1">
            {fullAddress}
          </p>
        )}
      </div>

      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {phone_number || "N/A"}
        </p>
      </div>

      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {email || "N/A"}
        </p>
      </div>

      <div className="w-[120px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {is_active ? "Active" : "Inactive"}
        </p>
      </div>

      {/* <div className="w-12 flex items-center justify-center p-4">
        <Link to={`/admin/equipments?group_id=${id}`}>
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors cursor-pointer"
          />
        </Link>
      </div> */}
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="w-full flex items-center justify-between border border-gray-200 bg-white rounded-lg">
      <div className="w-[220px] p-4 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      <div className="w-[280px] p-4 space-y-1">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      <div className="w-[200px] p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="w-[200px] p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="w-[120px] p-4">
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="w-12 flex items-center justify-center p-4">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
