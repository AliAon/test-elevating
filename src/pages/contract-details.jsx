import TableHeader from "@/components/service-contracts/contarct-details/table-header";
import TableRow from "@/components/service-contracts/contarct-details/table-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Download, SlidersHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetContractByIdQuery } from "@/redux/services/contract";
import { formatDate } from "@/helpers/helper";
import ContractDetailsSkeleton from "@/components/skeleton/contract-details-skeleton";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { useGetAllEquipmentsQuery } from "@/redux/services/groups";
import { useUser } from "@/hooks/useUserType";
import { useGetLvl3BySubscriptionIdQuery } from "@/redux/services/subscription";
import BuildingTableHeader from "@/components/service-contracts/contarct-details/building-table-header";
import { useDebounce } from "@/hooks/useDebounce";
import AdminEquipeentFilterPopup from "./admin/equipments/admin-equipment-filter-popup";
const tabs = [
  {
    key: "equipment",
    title: "Equipments",
  },
  {
    key: "building",
    title: "List of “Buildings",
  },
];
export default function ContractDetails() {
  const [open, setOpen] = useState(false);
  const [kpiTab, setKpiTab] = useState("overall");
  const { id } = useParams();
  const userData = useUser();
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);
  const [filters, setFilters] = useState({
    equipmentType: "",
    buildingId: "",
  });
  const { data: equipments } = useGetAllEquipmentsQuery({
    client_id: userData?.es_subscriptions?.[0]?.client_id,
    search: debounce,
    equipmentType: filters.equipmentType,
    buildingId: filters.buildingId,
  });
  const [active, setActive] = useState(tabs[0].key);
  const { data: buildingsList } = useGetLvl3BySubscriptionIdQuery({
    subscriptionId: userData?.es_subscriptions?.[0]?.subscription_id,
    search: debounce,
  });
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const buildingsListData = buildingsList?.data;
  const equipmentsList = equipments?.data;
  const { data, isLoading } = useGetContractByIdQuery(id, { skip: !id });
  const contract = data?.data;
  const pdfUrl = data?.data?.contract_terms_file_key;
  const downloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (isLoading) return <ContractDetailsSkeleton />;
  if (!contract) return <p>No contract found.</p>;

  const kpiTabs = [
    { key: "overall", title: "Overall" },
    { key: "business", title: "Business Hours" },
    { key: "after", title: "After Hours" },
  ];

  function getOverallKpis() {
    return [
      {
        bgColor: "#248EA526",
        icon: "/assets/svg/service-kpi-1.svg",
        title: "Maintenance Visit + Target",
        value:
          contract?.contract_kpis?.maintenance_visit_per_equipment ?? "N/A",
        extra_label: "Per equipment per month",
      },
      {
        bgColor: "#B468B926",
        icon: "/assets/svg/service-kpi-2.svg",
        title: "Breakdown Rate",
        value:
          contract?.contract_kpis?.rate_of_breakdown != null
            ? `${contract?.contract_kpis.rate_of_breakdown}%`
            : "N/A",
      },
      {
        bgColor: "#1F98B226",
        icon: "/assets/svg/service-kpi-3.svg",
        title: "Annual Safety Test Report",
        value: contract?.contract_kpis?.annual_safety_test_report ?? "N/A",
        extra_label: "Per equipment per month",
      },
      {
        bgColor: "#C2285A26",
        icon: "/assets/svg/service-kpi-4.svg",
        title: "Annual Comfort Report",
        value: "25 Hours",
        extra_label: "Per equipment per month",
      },
      {
        bgColor: "#C2285A26",
        icon: "/assets/svg/service-kpi-4.svg",
        title: "Minor Response Time",
        value:
          contract?.contract_kpis?.minor_response_time != null
            ? `${contract?.contract_kpis?.minor_response_time} Hours`
            : "N/A",
      },
      {
        bgColor: "#1F98B226",
        icon: "/assets/svg/service-kpi-7.svg",
        title: "Annual Man Trapped Event",
        value: contract?.equipment_kpis?.annual_man_trapped_event ?? "N/A",
      },
      {
        bgColor: "#C2285A26",
        icon: "/assets/svg/service-kpi-9.svg",
        title: "Equipment Availability",
        value:
          contract?.equipment_kpis?.equipment_availability_target != null
            ? `${contract?.equipment_kpis?.equipment_availability_target}%`
            : "N/A",
      },
    ];
  }

  function getBusinessKpis() {
    // Support both camelCase and snake_case keys for compatibility
    const data =
      contract?.business_hours_response_time ||
      contract?.businessHoursResponseTime;
    if (!data) return [];
    return [
      {
        bgColor: "#248EA526",
        icon: "/assets/svg/service-kpi-2.svg",
        title: "Critical Equipment Stopped",
        value: (
          data?.criticalEquipmentStopped || data?.critical_equipment_stopped
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.criticalEquipmentStopped ||
                data?.critical_equipment_stopped
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#F06B3C26",
        icon: "/assets/svg/service-kpi-5.svg",
        title: "Non-Operational/Aesthetic Faults",
        value: (
          data?.nonOperationalOrAestheticFaults ||
          data?.non_operational_or_aesthetic_faults
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.nonOperationalOrAestheticFaults ||
                data?.non_operational_or_aesthetic_faults
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#B468B926",
        icon: "/assets/svg/service-kpi-4.svg",
        title: "Operational/Intermittent Faults",
        value: (
          data?.operationalIntermittentFaults ||
          data?.operational_intermittent_faults
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.operationalIntermittentFaults ||
                data?.operational_intermittent_faults
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#C2285A26",
        icon: "/assets/svg/service-kpi-3.svg",
        title: "Non-Critical Equipment Stopped",
        value: (
          data?.nonCriticalEquipmentStopped ||
          data?.non_critical_equipment_stopped
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.nonCriticalEquipmentStopped ||
                data?.non_critical_equipment_stopped
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#1F98B226",
        icon: "/assets/svg/service-kpi-1.svg",
        title: "Entrapment",
        value: data?.entrapment?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${data?.entrapment?.hours} Hour(s)`,
      },
    ];
  }

  function getAfterKpis() {
    // Support both camelCase and snake_case keys for compatibility
    const data =
      contract?.after_hours_response_time || contract?.afterHoursResponseTime;
    if (!data) return [];
    return [
      {
        bgColor: "#248EA526",
        icon: "/assets/svg/service-kpi-2.svg",
        title: "Critical Equipment Stopped",
        value: (
          data?.criticalEquipmentStopped || data?.critical_equipment_stopped
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.criticalEquipmentStopped ||
                data?.critical_equipment_stopped
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#F06B3C26",
        icon: "/assets/svg/service-kpi-5.svg",
        title: "Non-Operational/Aesthetic Faults",
        value: (
          data?.nonOperationalOrAestheticFaults ||
          data?.non_operational_or_aesthetic_faults
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.nonOperationalOrAestheticFaults ||
                data?.non_operational_or_aesthetic_faults
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#B468B926",
        icon: "/assets/svg/service-kpi-4.svg",
        title: "Operational/Intermittent Faults",
        value: (
          data?.operationalIntermittentFaults ||
          data?.operational_intermittent_faults
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.operationalIntermittentFaults ||
                data?.operational_intermittent_faults
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#C2285A26",
        icon: "/assets/svg/service-kpi-3.svg",
        title: "Non-Critical Equipment Stopped",
        value: (
          data?.nonCriticalEquipmentStopped ||
          data?.non_critical_equipment_stopped
        )?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${
              (
                data?.nonCriticalEquipmentStopped ||
                data?.non_critical_equipment_stopped
              )?.hours
            } Hour(s)`,
      },
      {
        bgColor: "#1F98B226",
        icon: "/assets/svg/service-kpi-1.svg",
        title: "Entrapment",
        value: data?.entrapment?.attendance_next_business_day
          ? "Attend Next Business Day"
          : `${data?.entrapment?.hours} Hour(s)`,
      },
    ];
  }
  const list = [
    {
      item: "Service Contracts",
      link: "/service-contracts",
    },
    {
      item: "Contract Details",
      link: "#",
    },
  ];

  const handleActive = (key) => {
    setActive(key);
  };

  return (
    <div>
      <Breadcrumbs list={list} />
      {/* Contract Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl text-text_primary font-semibold">
            {contract?.contract_name ?? "Unnamed Contract"}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-text_secondary font-medium truncate max-w-[200px]">
              {contract?.contract_number ?? "N/A"}
            </p>
            <p className="w-1.5 h-1.5 bg-text_secondary rounded-full" />
            <p className="text-sm text-text_secondary font-medium">
              {contract?.linked_equipments?.length ?? 0} Equipment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="min-w-[200px]">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span
                className={`rounded-full text-sm text-white font-medium px-3 py-1 ${
                  contract?.active ? "bg-[#248EA5]" : "bg-gray-400"
                }`}
              >
                {contract?.active ? "Active" : "Inactive"}
              </span>
              <p className="text-sm text-text_secondary font-medium">
                {contract?.days_remaining != null
                  ? `${contract.days_remaining} Days left`
                  : "Days left: N/A"}
              </p>
            </div>
            <p className="text-sm text-text_primary font-semibold text-end">
              {contract?.start_date ? formatDate(contract.start_date) : "N/A"}{" "}
              <span className="text-text_secondary">to</span>{" "}
              {contract?.end_date ? formatDate(contract.end_date) : "N/A"}
            </p>
          </div>

          <div className="w-[1px] h-12 bg-[#EAECEF]" />

          <Button
            onClick={downloadPdf}
            className="w-fit h-11 rounded-full font-semibold"
          >
            Terms PDF Download
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 mt-5">
        <StatisticsCard
          title={"Contract Type"}
          subtitle={contract?.plan_and_pricing?.contract_type}
        />
        <StatisticsCard
          title={"Next Fee Adjustment Date"}
          subtitle={formatDate(
            contract?.plan_and_pricing?.next_fee_adjustment_date,
          )}
        />
        <StatisticsCard
          title={"Adjustment Rate"}
          subtitle={`${contract?.plan_and_pricing?.next_fee_adjustment_rate}%`}
        />
        <StatisticsCard
          title={"Contract Price"}
          subtitle={`${contract?.plan_and_pricing?.contract_price}`}
        />
        <StatisticsCard
          title={"Client Name"}
          subtitle={`${contract?.client_name}`}
        />
        <StatisticsCard
          title={"Service Provider Name"}
          subtitle={`${contract?.service_provider_details?.service_provider_name}`}
        />
        <StatisticsCard
          title={"Service Country Code"}
          subtitle={`${contract?.service_provider_details?.country_code}`}
        />
        <StatisticsCard
          title={"Service Phone Number"}
          subtitle={`${contract?.service_provider_details?.phone_no ?? ""}`}
        />
        <StatisticsCard
          title={"Service Person Name"}
          subtitle={`${contract?.service_provider_details?.contact_person_name ?? ""}`}
        />
        <StatisticsCard
          title={"Service Email"}
          subtitle={`${contract?.service_provider_details?.email ?? ""}`}
        />
      </div>

      {/* KPI Cards */}
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl text-black font-semibold">KPI Parameters</p>
          <div className="w-fit h-13 flex items-center rounded-2xl bg-white p-1">
            {kpiTabs?.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setKpiTab(tab?.key);
                }}
                className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
                  kpiTab === tab?.key
                    ? "bg-bg_primary text-text_primary"
                    : "text-text_secondary"
                }`}
              >
                {tab?.title}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {kpiTab === "overall" &&
            getOverallKpis()?.map((item, index) => (
              <KpiCard key={index} {...item} />
            ))}
          {kpiTab === "business" &&
            getBusinessKpis()?.map((item, index) => (
              <KpiCard key={index} {...item} />
            ))}
          {kpiTab === "after" &&
            getAfterKpis()?.map((item, index) => (
              <KpiCard key={index} {...item} />
            ))}
        </div>
      </div>

      {/* Equipment List */}

      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-3xl text-text_primary font-semibold">
            List of Equipment
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
                placeholder={`Try searching "property"`}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>
            <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
              <AdminEquipeentFilterPopup
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </div>
        </div>
        <div className="w-fit h-13 flex items-center rounded-2xl bg-white p-1 mt-5">
          {tabs?.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleActive(tab.key)}
              className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
                active === tab.key
                  ? "bg-bg_primary text-text_primary"
                  : "text-text_secondary"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {active == "equipment" && (
          <div className="overflow-x-auto w-full mt-8">
            <TableHeader
              onSetSortkey={setSortkey}
              onSetSortOrder={setSortOrder}
            />
            <div className="mt-2 min-w-[600px] space-y-2">
              {contract?.linked_equipments?.[0]?.equipment_ids?.length ? (
                [...(contract?.linked_equipments?.[0]?.equipment_ids || [])]
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
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      row={row}
                      equipmentsList={equipmentsList}
                    />
                  ))
              ) : (
                <p className="text-center text-text_secondary font-medium">
                  No linked equipments
                </p>
              )}
            </div>
          </div>
        )}
        {active == "building" && (
          <div className="overflow-x-auto w-full mt-8">
            <BuildingTableHeader />
            <div className="mt-2 min-w-[600px] space-y-2">
              {contract?.building_ids?.length ? (
                contract?.building_ids?.map((row) => {
                  return (
                    <BuildingTableRow
                      key={row?.id}
                      row={row}
                      buildingsListData={buildingsListData}
                    />
                  );
                })
              ) : (
                <p className="text-center text-text_secondary font-medium">
                  No linked equipments
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <Terms open={open} setOpen={setOpen} />
    </div>
  );
}

/* ------------------- Subcomponents ------------------- */

const StatisticsCard = ({ title, subtitle }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl py-5 px-6 flex flex-col gap-1">
    <p className="text-xs text-text_secondary font-semibold uppercase tracking-wide">
      {title}
    </p>
    <p className="text-sm text-text_primary font-bold break-words">
      {subtitle}
    </p>
  </div>
);

const KpiCard = ({ bgColor, icon, title, value, extra_label }) => (
  <div className="flex items-center gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-5">
    <div
      className="w-12 h-12 flex items-center justify-center rounded-full"
      style={{ background: bgColor }}
    >
      <img src={icon} alt="" width={28} height={28} />
    </div>
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-text_secondary font-semibold uppercase tracking-wide">
        {title}
      </p>
      <p className="text-sm text-text_primary font-bold break-words">{value}</p>
      {extra_label && (
        <p className="text-xs text-text_secondary font-medium">{extra_label}</p>
      )}
    </div>
  </div>
);

export const Terms = ({ open, setOpen }) => {
  const { id } = useParams();
  const { data } = useGetContractByIdQuery(id, { skip: !id });

  const pdfUrl = data?.data?.contract_terms_file_key;
  const downloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="min-w-[1100px] rounded-xl p-5"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-black font-semibold">
              Contract Terms
            </DialogTitle>

            <div className="flex items-center gap-2">
              <Button
                onClick={downloadPdf}
                className="w-[158px] h-11 rounded-full font-semibold gap-2"
              >
                <Download size={16} />
                Download PDF
              </Button>

              <button
                onClick={() => setOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-bg_primary rounded-full cursor-pointer"
              >
                <X size={20} color="#5B617F" />
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-bg_primary rounded-2xl p-4 h-[calc(100vh-150px)] overflow-y-auto">
          <img
            src="/assets/png/trems.png"
            alt="Contract Terms"
            width={680}
            height={962}
            className="mx-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

function BuildingTableRow({ row, buildingsListData }) {
  const building = buildingsListData?.find((item) => item.id == row);
  if (!building) {
    return;
  }

  return (
    <Link
      to={`/buildings/${building?.id}`}
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      <div className="w-[165px] flex items-center gap-2 text-sm text-text_primary font-semibold p-4">
        {building?.name}
      </div>
      <div className="w-[152px] flex items-center gap-2 text-sm text-text_secondary font-semibold p-4">
        {building?.total_floors}
      </div>
      <div className="w-[235px] flex items-center gap-2 text-sm text-text_secondary font-semibold p-4">
        {building?.building_owner.name}
      </div>
      <div className="w-[152px] flex items-center gap-2 text-sm text-text_primary font-semibold p-4">
        {building?.contact_person_name}
      </div>
      <div className="w-[170px] flex items-center gap-2 text-sm text-text_primary font-semibold p-4">
        {building?.country}
      </div>
      <div className="w-[120px] flex items-center gap-2 text-sm text-text_secondary font-semibold p-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded `}>
          {building?.state}
        </span>
      </div>
    </Link>
  );
}
