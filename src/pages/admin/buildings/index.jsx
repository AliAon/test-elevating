import Paginate from "@/components/common/paginate";
import BuildingSkeleton from "@/components/skeleton/buildings-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetLvl3ListQuery } from "@/redux/services/subscription";
import { ChevronRight, ChevronsUpDown, CirclePlus, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminBuildingFilterPopup from "./admin-building-filter-popup";

const Buildings = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") ?? page;
  const debounce = useDebounce(search, 300);

  const [filters, setFilters] = useState({
    es_subscription_id: "",
    clientId: "",
  });
  const {
    data: level3List,
    isLoading,
    isFetching,
  } = useGetLvl3ListQuery({
    limit: 20,
    page: currentPage,
    search: debounce,
    clientId: filters?.clientId,
    es_subscription_id: filters?.es_subscription_id,
  });
  const navigate = useNavigate();

  const buildings = level3List?.data || [];

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">Buildings</p>
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
              placeholder="Search here"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <AdminBuildingFilterPopup
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <Button
            onClick={() => navigate("/admin/add-buildings")}
            className="w-[160px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
          >
            <CirclePlus size={18} />
            Add Buildings
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader />
        <div className="mt-2 min-w-[700px] space-y-2">
          {isLoading || isFetching
            ? [...Array(5)].map((_, index) => <BuildingSkeleton key={index} />)
            : buildings?.map((building, index) => (
                <TableRow key={index} building={building} />
              ))}
        </div>
      </div>

      <Paginate
        totalPages={level3List?.pagination?.pages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Buildings;

function TableHeader() {
  return (
    <div className="min-w-[700px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Name
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Building Owner
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Address
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Contact Person
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Floors
        <ChevronsUpDown size={14} className="text-gray-400" />
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
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">{building?.name}</p>
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
        <p className="text-sm text-gray-600 font-medium line-clamp-2">
          {fullAddress || "Address not available"}
        </p>
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
        <Link to={`/admin/add-buildings?uuid=${building?.id}`}>
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}
