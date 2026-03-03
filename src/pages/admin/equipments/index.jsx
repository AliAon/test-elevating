import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllEquipmentsQuery,
  useGetGroupByIdQuery,
} from "@/redux/services/groups";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useUpdateGroupMutation } from "@/redux/services/groups";
import { useGetAllBrandQuery } from "@/redux/services/brand-api";
import Loader from "@/components/common/loader";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  ChevronRight,
  ChevronsUpDown,
  CirclePlus,
  SlidersHorizontal,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import AdminGroupFilterPopup from "./admin-group-filter-popup";
import AdminEquipeentFilterPopup from "./admin-equipment-filter-popup";

export default function AdminEquipments() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const group_id = searchParams.get("group_id");
  const clientId = searchParams.get("clientId");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState({
    equipmentType: "",
    buildingId: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const { data: groupData, isLoading: isGroupLoading } = useGetGroupByIdQuery(
    group_id,
    {
      skip: !group_id,
    },
  );

  const { data, isLoading, isFetching } = useGetAllEquipmentsQuery(
    {
      group_id: group_id,
      client_id: clientId,
      search: debouncedSearch,
      limit: 100,
      buildingId: filters.buildingId,
      equipmentType: filters.equipmentType,
    },
    // {
    //   skip: !group_id,
    // }
  );

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
  const equipmentlist = [
    {
      item: "Group List",
      link: "/admin/groups",
    },
    {
      item: `Group Detail`,
      link: `/admin/equipments?group_id=${group_id}`,
    },
  ];

  return (
    <div>
      <Breadcrumbs list={equipmentlist} />

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
        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {groupDetails?.groupname}
                </h1>
              </div>

              {groupDetails?.description &&
                groupDetails?.description !== "No description" && (
                  <p className="text-sm text-gray-600 mb-4">
                    {groupDetails?.description}
                  </p>
                )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Building
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {groupDetails?.building_name || "N/A"}
                  </p>
                  {fullAddress && (
                    <p className="text-xs text-gray-600 mt-1">{fullAddress}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Subscription
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {groupDetails?.es_subscription_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Service Contract
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {groupDetails?.service_contract_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Brand
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {groupDetails?.brand_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Total Equipments
                  </p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {groupDetails?.equipment_ids?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <Button
                type="button"
                className="h-9 rounded-full bg-bg_primary text-text_secondary text-sm font-semibold px-4"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <EditGroupModal open={editOpen} setOpen={setEditOpen} group={groupDetails} />

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
              <AdminEquipeentFilterPopup
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            {!clientId && (
              <Button
                onClick={() => navigate(`/add-equipment?group_id=${group_id}`)}
                className="w-[163px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
              >
                <CirclePlus size={18} />
                Add Equipment
              </Button>
            )}
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
              <p className="text-center mt-10 font-semibold text-lg">
                No Equipments Found
              </p>
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
      to={`/admin/equipment-details/${equipment_id}`}
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group cursor-pointer"
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
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Installation Column */}
      <div className="w-[250px] p-4 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-3/4" />
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

function EditGroupModal({ open, setOpen, group }) {
  const { groupname, id } = group || {};
  const [name, setName] = useState("");
  const [brandId, setBrandId] = useState("");
  const [updateGroup, { isLoading }] = useUpdateGroupMutation();
  const { data: brands } = useGetAllBrandQuery({});

  const brandOptions = brands?.data?.brands?.map((brand) => ({
    label: brand.brand_name,
    value: brand.id,
  }));

  useEffect(() => {
    if (group) {
      setName(groupname || "");
      setBrandId(group?.brand_id || "");
    }
  }, [group, groupname]);

  const handleUpdate = () => {
    if (!id) return;

    const payload = {
      group_id: id,
      groupname: name,
      ...(brandId && { brand_id: brandId }),
    };

    updateGroup(payload)
      .unwrap()
      .then((res) => {
        toast.success(res?.message || "Group updated successfully");
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong");
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <InputField
            className={{
              Wrapper: "!bg-bg_primary border border-[#EAECEF]",
            }}
            label="Group Name"
            placeholder="Enter group name"
            name="groupname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <SelectorWithObjects
            label="Brand"
            placeholder="Select Brand"
            options={brandOptions}
            value={brandId}
            onChange={setBrandId}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-[100px] h-10 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            className="w-[100px] h-10 rounded-full font-semibold disabled:opacity-50"
          >
            {isLoading ? <Loader /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
