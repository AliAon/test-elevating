import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGroupsByBuildingIdQuery } from "@/redux/services/groups";
import { useGetLevel3Query } from "@/redux/services/subscription";
import {
  ChevronRight,
  ChevronsUpDown,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Layers,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function BuildingDetails() {
  const { buildingId } = useParams();

  const { data: buildingData, isLoading: isBuildingLoading } =
    useGetLevel3Query(buildingId, {
      skip: !buildingId,
    });

  const { data: groupsData, isLoading: isGroupsLoading } =
    useGetGroupsByBuildingIdQuery(
      {
        building_id: buildingId,
      },
      {
        skip: !buildingId,
      },
    );

  const building = buildingData?.data;
  const groups = groupsData?.data?.groups || [];

  const fullAddress = [
    building?.address,
    building?.city,
    building?.state,
    building?.country,
    building?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  const list = [
    {
      item: "Buildings",
      link: "/buildings",
    },
    {
      item: "Building Details",
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={list} />

      {/* Building Details Header */}
      {isBuildingLoading ? (
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          </div>
        </div>
      ) : building ? (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-8 mb-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {building?.name}
                </h1>
                {fullAddress && (
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin size={16} className="text-gray-400 mt-1" />
                    <p className="text-sm text-gray-600">{fullAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Building Owner */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Building Owner
                </p>
              </div>
              <p className="text-sm text-gray-900 font-semibold">
                {building?.building_owner?.name || "N/A"}
              </p>
              {building?.building_owner?.phone_number && (
                <p className="text-xs text-gray-600 mt-1">
                  {building?.building_owner?.phone_number}
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Contact Person
                </p>
              </div>
              <p className="text-sm text-gray-900 font-semibold">
                {building?.contact_person_name || "N/A"}
              </p>
              {building?.phone_number && (
                <div className="flex items-center gap-1 mt-1">
                  <Phone size={12} className="text-gray-500" />
                  <p className="text-xs text-gray-600">
                    {building?.phone_number}
                  </p>
                </div>
              )}
              {building?.email && (
                <div className="flex items-center gap-1 mt-1">
                  <Mail size={12} className="text-gray-500" />
                  <p className="text-xs text-gray-600 truncate">
                    {building?.email}
                  </p>
                </div>
              )}
            </div>

            {/* Floors */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Layers size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Total Floors
                </p>
              </div>
              <p className="text-2xl text-gray-900 font-bold">
                {building?.total_floors || "0"}
              </p>
            </div>

            {/* Groups Count */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Layers size={16} className="text-gray-400" />
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Equipment Groups
                </p>
              </div>
              <p className="text-2xl text-gray-900 font-bold">
                {groups?.length || "0"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Groups List */}
      <div className="bg-bg_primary rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-2xl text-text_primary font-semibold">
            Equipment Groups
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <TableHeader />
          <div className="mt-2 min-w-[1100px] space-y-2">
            {isGroupsLoading ? (
              [1, 2, 3, 4, 5]?.map((item) => <TableRowSkeleton key={item} />)
            ) : groups?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  No equipment groups found
                </p>
              </div>
            ) : (
              groups?.map((item) => <TableRow key={item.id} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="min-w-[1100px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Group Name
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Building
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Subscription
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Service Contract
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Equipments
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-12"></div>
    </div>
  );
}

function TableRow({ item }) {
  const {
    id,
    groupname,
    description,
    equipment_ids,
    building_name,
    building_details,
    es_subscription_name,
    service_contract_name,
  } = item || {};

  const fullAddress = [
    building_details?.address,
    building_details?.city,
    building_details?.state,
    building_details?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link to={`/groups/${id}`}>
      <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 group cursor-pointer">
        <div className="w-[220px] p-4 space-y-1">
          <p
            title={groupname}
            className="text-sm text-gray-900 font-semibold line-clamp-1"
          >
            {groupname}
          </p>
          {description && description !== "No description" && (
            <p className="text-xs text-gray-500 font-medium line-clamp-1">
              {description}
            </p>
          )}
        </div>

        <div className="w-[280px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold line-clamp-1">
            {building_name || "N/A"}
          </p>
          {fullAddress && (
            <p className="text-xs text-gray-500 font-medium line-clamp-1">
              {fullAddress}
            </p>
          )}
        </div>

        <div className="w-[200px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold line-clamp-1">
            {es_subscription_name || "N/A"}
          </p>
        </div>

        <div className="w-[200px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold line-clamp-1">
            {service_contract_name || "N/A"}
          </p>
        </div>

        <div className="w-[120px] p-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold">
            {equipment_ids?.length || 0}
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

function TableRowSkeleton() {
  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
      <div className="w-[220px] space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="w-[280px] space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="w-[200px]">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="w-[200px]">
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="w-[120px]">
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="w-12">
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}
