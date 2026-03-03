import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  useGetAllEquipmentsQuery,
  useGetGroupByIdQuery,
} from "@/redux/services/groups";
import { useDebounce } from "@/hooks/useDebounce";
import dayjs from "dayjs";
import {
  ChevronRight,
  ChevronsUpDown,
  SlidersHorizontal,
  Building2,
  MapPin,
  FileText,
  Layers,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import EquipmentFilterPopup from "@/components/equipments/callbacks-filter-popup";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState({});

  const { data: groupData, isLoading: isGroupLoading } = useGetGroupByIdQuery(
    groupId,
    {
      skip: !groupId,
    },
  );

  const { data, isLoading, isFetching } = useGetAllEquipmentsQuery({
    group_id: groupId,
    search: debouncedSearch,
    limit: 100,
    equipmentType: filters.equipmentType,
  });

  const list = data?.data || [];
  const groupDetails = groupData?.data || groupData;

  const fullAddress = [
    groupDetails?.building_details?.address,
    groupDetails?.building_details?.city,
    groupDetails?.building_details?.state,
    groupDetails?.building_details?.country,
    groupDetails?.building_details?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");
  const bglist = [
    {
      item: "Buildings",
      link: "/buildings",
    },
    {
      item: "Building Details",
      link: `/buildings/${groupData?.data?.building_id}`,
    },
    {
      item: "Group Details",
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={bglist} />

      {/* Group Details Header */}
      {isGroupLoading ? (
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </div>
        </div>
      ) : groupDetails ? (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-8 mb-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {groupDetails?.groupname}
                </h1>
                {groupDetails?.description &&
                  groupDetails?.description !== "No description" && (
                    <p className="text-sm text-gray-600 mt-2">
                      {groupDetails?.description}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Building
                </p>
              </div>
              <p className="text-sm text-gray-900 font-semibold">
                {groupDetails?.building_name || "N/A"}
              </p>
              {fullAddress && (
                <div className="flex items-start gap-1 mt-1">
                  <MapPin
                    size={12}
                    className="text-gray-400 mt-1 flex-shrink-0"
                  />
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {fullAddress}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Subscription
                </p>
              </div>
              <p className="text-sm text-gray-900 font-semibold">
                {groupDetails?.es_subscription_name || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Service Contract
                </p>
              </div>
              <p className="text-sm text-gray-900 font-semibold">
                {groupDetails?.service_contract_name || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Total Equipments
                </p>
              </div>
              <p className="text-2xl text-gray-900 font-bold">
                {groupDetails?.equipment_ids?.length || 0}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Equipment List */}
      <div className="bg-bg_primary rounded-xl p-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Equipment List
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
                placeholder="Search Equipment by Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>
            <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
              <EquipmentFilterPopup filters={filters} setFilters={setFilters} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-8">
          <TableHeader />
          <div className="mt-2 min-w-[1000px] space-y-2">
            {isLoading || isFetching ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <TableRowSkeleton key={item} />
              ))
            ) : list?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No Equipments Found</p>
              </div>
            ) : (
              list?.map((item) => <TableRow key={item?.id} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="min-w-[1000px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Name
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Design
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Installation
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Modernization
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[50px]"></div>
    </div>
  );
}

function TableRow({ item }) {
  const {
    equipment_id,
    equipment_name,
    equipment_status,
    oem_service_equipment_number,
    equipment_type,
    design_code,
    brand_name,
    model_number,
    year_of_installation,
    equipment_life,
    next_modernization_date,
    last_modernization_parts,
    last_modernization_date,
  } = item || {};

  return (
    <Link
      to={`/equipment-details/${equipment_id}`}
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      {/* Name Column */}
      <div className="w-[250px] p-4 space-y-1">
        <p className="text-xs text-gray-500 font-medium uppercase">
          {equipment_type || "N/A"}
        </p>
        <p
          title={equipment_name}
          className="text-sm text-gray-900 font-semibold line-clamp-1 flex items-center gap-2"
        >
          {equipment_name || "N/A"}{" "}
          <small
            className={
              (equipment_status === "ACTIVE" ? "bg-green-600" : "bg-red-600") +
              " text-white px-2 rounded-full text-[10px]"
            }
          >
            {equipment_status.replaceAll("_", " ")}
          </small>
        </p>
        <p className="text-xs text-gray-600">
          {oem_service_equipment_number || "N/A"}
        </p>
      </div>

      {/* Design Column */}
      <div className="w-[250px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {design_code || "N/A"}
        </p>
        <p className="text-xs text-gray-600">
          {brand_name || "N/A"} • {model_number || "N/A"}
        </p>
      </div>

      {/* Installation Column */}
      <div className="w-[250px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {year_of_installation || "N/A"}
        </p>
        <p className="text-xs text-gray-600">
          LIFE: {equipment_life ? `${equipment_life} years` : "N/A"}{" "}
          {next_modernization_date
            ? " • Up to " + dayjs(next_modernization_date).format("DD-MM-YYYY")
            : ""}
        </p>
      </div>

      {/* Modernization Column */}
      <div className="w-[250px] p-4 space-y-1">
        <p
          className="text-sm text-gray-900 font-semibold line-clamp-1"
          title={last_modernization_parts}
        >
          {last_modernization_parts || "N/A"}
        </p>
        <p className="text-xs text-gray-600">
          {last_modernization_date
            ? dayjs(last_modernization_date).format("DD-MM-YYYY")
            : "N/A"}
        </p>
      </div>

      {/* Action Column */}
      <div className="w-[50px] p-4 flex items-center justify-center">
        <ChevronRight
          size={18}
          className="text-gray-400 group-hover:text-primary transition-colors"
        />
      </div>
    </Link>
  );
}

function TableRowSkeleton() {
  return (
    <div className="w-full flex items-center justify-between border border-gray-200 bg-white rounded-lg">
      {/* Name Column */}
      <div className="w-[250px] p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Design Column */}
      <div className="w-[250px] p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Installation Column */}
      <div className="w-[250px] p-4 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      {/* Modernization Column */}
      <div className="w-[250px] p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Action Column */}
      <div className="w-[50px] p-4 flex items-center justify-center">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
