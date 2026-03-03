import React, { useState } from "react";
import { Skeleton, StatisticsCard } from "../maintenance";
import KPIPaneltyDistribution from "../../components/kpi-penalty/kpi-distribution";
import RecentKpiPenalties from "@/components/kpi-penalty/recent-kpi-penalties";
import KPIPanaltySelectedMonth from "@/components/kpi-penalty/selected-month";
import SelectedBuildingKpiPanaltyForecast from "@/components/kpi-penalty/selected-building-kpi-panalty-forecast";
import { useSelector } from "react-redux";
import {
  useGetKpiPenaltyDashboardQuery,
  useGetKpiPenaltySelectedBuildingQuery,
  useGetKpiPenaltySelectedMonthQuery,
} from "@/redux/services/dashboard-api";
import LevelsSelector from "@/components/common/levels-selector";
import { Link } from "react-router-dom";
import Paginate from "@/components/common/paginate";
import { useDebounce } from "@/hooks/useDebounce";

export default function KPIPenality() {
  const [date, setDate] = useState(undefined);
  const [setToDate] = useState(undefined);
  const [selectedState, setSelectedState] = useState(""); // State for selected value
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);

  const { data: pkiData, isLoading } = useGetKpiPenaltyDashboardQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: selectedState,
      page: page,
      date_from: filters?.date_from,
      date_to: filters?.date_to,
      property: filters?.property,
      equipment_id: filters?.equipment_id,
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );
  const { data: buildingData } = useGetKpiPenaltySelectedBuildingQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: selectedState,
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );

  const paginations = pkiData?.pagination;

  const { data: kpiData, isLoading: kpiDataLoading } =
    useGetKpiPenaltySelectedMonthQuery(
      {
        es_subscription_id: subscription_id,
        level1: level1?.level1_id,
        level2: level2?.level2_id,
        level3: selectedState,
        month: selectedMonth,
        page: page,
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        property: filters?.property,
        equipment_id: filters?.equipment_id,
      },
      {
        skip:
          !subscription_id || !level1 || !level2 || !level3 || !selectedMonth,
      },
    );
  const kpiDataPagination = kpiData?.data?.pagination;
  const showClear = date;
  // const showClear = date;

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num?.toString();
  };

  const statistics_list_buildings = [
    {
      icon: "/assets/svg/penalty.svg",
      icon_bg: "#8CAA0026",
      title: "Total Penalty",
      value: `$${formatNumber(buildingData?.data?.total_penalty ?? 0)}`,
      extra_label: "",
      des: "In last 12 months",
      link: "/kpi-penalty",
    },
    {
      icon: "/assets/svg/kpi-failed.svg",
      icon_bg: "#C2285A26",
      title: "KPI Failed",
      value: buildingData?.data?.total_failed_kpi ?? 0,
      extra_label: "",
      des: "In last 12 months",

      link: "/kpi-penalty",
    },
    {
      icon: "/assets/svg/downtime.svg",
      icon_bg: "#1F98B226",
      title: "Total Downtime",
      value: `${buildingData?.data?.total_downtime_hours.toFixed(1) ?? 0} h`,
      extra_label: "",
      des: "In last 12 months",

      link: "/kpi-penalty",
    },
    {
      icon: "/assets/svg/call-back.svg",
      icon_bg: "#FFDED0",
      title: "Callbacks",
      value: buildingData?.data?.total_callbacks ?? 0,
      extra_label: "",
      des: "In last 12 months",

      link: "/callbacks-overview",
    },
    {
      icon: "/assets/svg/passenger-traped.svg",
      icon_bg: "#B468B926",
      title: "Passenger Trapped",
      value: buildingData?.data?.total_trapped_events ?? 0,
      extra_label: "",
      des: "In last 12 months",

      link: "/kpi-penalty",
    },
    {
      icon: "/assets/svg/maintaince.svg",
      icon_bg: "#1F98B226",
      title: "Maintenance",
      value: "0",
      extra_label: "",
      des: "In last 12 months",

      link: "/maintenance-overview",
    },
  ];
  const statistics_list = [
    {
      icon: "/assets/svg/penalty.svg",
      icon_bg: "#8CAA0026",
      title: "Total Penalty",
      // value: `$ ${formatNumber(total_penalty) ?? 0}`,
      value: `$ ${formatNumber(kpiData?.data?.total_penalty) ?? 0}`,
      extra_label: "",
      des: `In last ${selectedMonth}`,
    },
    {
      icon: "/assets/svg/kpi-failed.svg",
      icon_bg: "#C2285A26",
      title: "KPI Failed",
      // value: KPI_failed ?? 0,
      value: kpiData?.data?.total_failed_kpi ?? 0,
      extra_label: "",
      des: "",
    },
    {
      icon: "/assets/svg/downtime.svg",
      icon_bg: "#1F98B226",
      title: "Total Downtime",
      // value: `${totaLDowntimeHours ?? 0} h`,
      value: `${kpiData?.data?.total_downtime_hours.toFixed(2) ?? 0} h`,
      extra_label: "",
      des: "",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div>
            <div className="flex items-center xl:flex-row flex-col  xl:justify-between gap-2">
              <LevelsSelector
                level1={level1}
                setLevel1={setLevel1}
                level2={level2}
                setLevel2={setLevel2}
                level3={level3}
                setLevel3={setLevel3}
                setSelectedState={setSelectedState}
              />

              <div className="flex items-center gap-3">
                {showClear && (
                  <Button
                    onClick={() => {
                      setDate(undefined);
                      setToDate(undefined);
                    }}
                    className="min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            {selectedState && !selectedMonth && (
              <div className="grid grid-cols-6 gap-3 mt-5">
                {statistics_list_buildings?.map((item, index) => (
                  <Link to={item.link}>
                    <StatisticsCard key={index} item={item} />
                  </Link>
                ))}
              </div>
            )}

            {selectedMonth && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {statistics_list?.map((item, index) => (
                  <StatisticsCard key={index} item={item} />
                ))}
              </div>
            )}
            <div className="flex xl:flex-row flex-col gap-5 mt-5">
              {selectedMonth && (
                <KPIPanaltySelectedMonth
                  setSelectedMonth={setSelectedMonth}
                  selectedMonth={selectedMonth}
                  level1={level1}
                  level2={level2}
                  level3={level3}
                  kpiData={kpiData?.data}
                  isLoading={kpiDataLoading}
                  setSelectedState={setSelectedState}
                />
              )}

              {selectedMonth && (
                <KPIPaneltyDistribution
                  selectedMonth={selectedMonth}
                  total_callbacks={kpiData?.data?.total_callbacks}
                  downtime_percentage={kpiData?.data?.downtime_percentage ?? 0}
                  isLoading={kpiDataLoading}
                  total_trapped_events={kpiData?.data?.total_trapped_events}
                />
              )}
              {!selectedMonth && (
                <SelectedBuildingKpiPanaltyForecast
                  setSelectedState={setSelectedState}
                  level1={level1}
                  level2={level2}
                  selectedState={selectedState}
                  setSelectedMonth={setSelectedMonth}
                />
              )}
            </div>
            {!selectedMonth && (
              <RecentKpiPenalties
                buildingData={pkiData?.all_kpis}
                level1={level1}
                level2={level2}
                selectedState={selectedState}
                filters={filters}
                setFilters={setFilters}
                search={search}
                setSearch={setSearch}
              />
            )}
            {!selectedMonth && (
              <div>
                <Paginate
                  totalPages={paginations?.total_pages}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
            {selectedMonth && (
              <RecentKpiPenalties
                buildingData={kpiData?.data?.all_kpis_selected_month}
                level1={level1}
                level2={level2}
                selectedState={selectedState}
                kpiDataLoading={kpiDataLoading}
                filters={filters}
                setFilters={setFilters}
                search={search}
              />
            )}
            {selectedMonth && (
              <div>
                <Paginate
                  totalPages={kpiDataPagination?.total_pages}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
