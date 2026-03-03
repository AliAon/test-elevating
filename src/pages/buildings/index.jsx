import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetLvl3BySubscriptionIdQuery } from "@/redux/services/subscription";
import {
  ChevronRight,
  ChevronsUpDown,
  Phone,
  SlidersHorizontal,
  Building2,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Buildings = () => {
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const {
    data: buildingsData,
    isLoading,
    isFetching,
  } = useGetLvl3BySubscriptionIdQuery(
    {
      subscriptionId: es_subscription_id,
      search: debounce,
    },
    {
      skip: !es_subscription_id,
    },
  );

  const buildings = buildingsData?.data || [];

  // Filter buildings by search
  const filteredBuildings = buildings.filter((building) =>
    building?.name?.toLowerCase().includes(debounce.toLowerCase()),
  );

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-primary" />
          <p className="text-2xl text-text_primary font-semibold">Buildings</p>
        </div>
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
              placeholder="Search buildings"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <SlidersHorizontal size={20} className="text-text_secondary" />
            <p className="text-sm text-text_secondary font-semibold">Filter</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader onSetSortkey={setSortkey} onSetSortOrder={setSortOrder} />
        <div className="mt-2 min-w-[700px] space-y-2">
          {isLoading || isFetching ? (
            [...Array(5)].map((_, index) => <BuildingSkeleton key={index} />)
          ) : filteredBuildings?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No buildings found</p>
            </div>
          ) : (
            [...(filteredBuildings || [])]
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
              .map((building, index) => (
                <TableRow key={index} building={building} />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Buildings;

function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[700px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Name
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Building Owner
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Address
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Contact Person
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Floors
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-12"></div>
    </div>
  );
}

function TableRow({ building }) {
  const fullAddress = [
    building?.address,
    building?.city,
    building?.state,
    building?.country,
    building?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link to={`/buildings/${building?.id}`}>
      <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 group cursor-pointer">
        <div className="w-[200px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold">
            {building?.name}
          </p>
        </div>

        <div className="w-[180px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold truncate">
            {building?.building_owner?.name || "N/A"}
          </p>
          {building?.building_owner?.phone_number && (
            <p className="text-xs text-gray-600 truncate">
              {building?.building_owner?.phone_number}
            </p>
          )}
        </div>

        <div className="w-[250px] p-4 space-y-1">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 font-medium line-clamp-2">
              {fullAddress || "Address not available"}
            </p>
          </div>
        </div>

        <div className="w-[220px] p-4 space-y-1">
          <div className="space-y-1.5">
            <p className="text-sm text-gray-900 font-semibold">
              {building?.contact_person_name || "N/A"}
            </p>
            {building?.phone_number && (
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Phone size={12} className="text-gray-500" />
                {building?.phone_number}
              </p>
            )}
            {building?.email && (
              <p className="text-xs text-gray-600 flex items-center gap-1.5 truncate">
                <img
                  src="/assets/svg/gmail.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="opacity-60"
                />
                {building?.email}
              </p>
            )}
          </div>
        </div>

        <div className="w-[120px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold">
            {building?.total_floors || "0"}
          </p>
        </div>

        <div className="w-12 flex items-center justify-center p-4">
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors"
          />
        </div>
      </div>
    </Link>
  );
}

function BuildingSkeleton() {
  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
      <div className="w-[200px] space-y-2">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="w-[180px] space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="w-[250px] space-y-2">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="w-[220px] space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="w-[120px] space-y-2">
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="w-12">
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}
