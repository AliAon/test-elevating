import React, { useState } from "react";
import CallbacksChart from "@/components/callbacks/callbacks-chart";
import TotalCallbacksChart from "@/components/callbacks/total-callbacks-chart";
import CallbacksSelectedMonth from "@/components/callbacks/selected-month";
import CallbacksHistory from "@/components/callbacks/callbacks-history";
import Trapped from "@/components/callbacks/trapped";
import {
  useGetCallbackDashboardStatsQuery,
  useGetCallbacksPerformaceQuery,
  useGetCallBacksSummaryQuery,
  useGetCallbacksTrappedPessangerGraphQuery,
} from "@/redux/services/call-backs-api";
import { useSelector } from "react-redux";
import LevelsSelector from "@/components/common/levels-selector";
import { Link } from "react-router-dom";
import { useGetClientDashboardFoucsQuery } from "@/redux/services/dashboard-api";
export default function CallbacksOverView() {
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const { data: summary, isLoading } = useGetCallBacksSummaryQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
    },
    { skip: !subscription_id || !level1 || !level2 || !level3 },
  );

  const { data: focusEquipment } = useGetClientDashboardFoucsQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );

  const { data: trappedData } = useGetCallbacksTrappedPessangerGraphQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
    },
    { skip: !subscription_id || !level1 || !level2 || !level3 },
  );

  const { data: perfromance, isLoading: isPerfromanceLoading } =
    useGetCallbacksPerformaceQuery(
      {
        es_subscription_id: subscription_id,
        month: selectedMonth,
      },
      { skip: !subscription_id || !selectedMonth },
    );

  const { data: dashboardStats } = useGetCallbackDashboardStatsQuery(
    {
      es_subscription_id: subscription_id,
    },
    {
      skip: !subscription_id,
    },
  );
  const dashboardStatsData = dashboardStats?.data;

  const statistics_list = [
    {
      icon: "/assets/svg/call-back-1.svg",
      icon_bg: "#1F98B226",
      title: "Total Callbacks",
      value: dashboardStatsData?.total_callbacks_last_12_months ?? "-",
      extra_label: "",
      des: "In last 12 months",
      link: "/callbacks-overview",
    },
    {
      icon: "/assets/svg/maint-1.svg",
      icon_bg: "#248EA526",
      title: "Equipment Stopped",
      value: dashboardStatsData?.stopped_equipment_last_year ?? "-",
      extra_label: "",
      des: "In last 12 months",
      link: "/equipments",
    },
    {
      icon: "/assets/svg/call-back-1.svg",
      icon_bg: "#1F98B226",
      title: "Callbacks",
      value: `${dashboardStatsData?.callbacks_last_30_days ?? "-"}`,
      extra_label: "",
      des: "In last 30 days",
      link: "/callbacks-overview",
    },

    {
      icon: "/assets/svg/call-back-3.svg",
      icon_bg: "#B468B926",
      title: "Trapped Passengers",
      value: dashboardStatsData?.trapped_passengers_last_month ?? "-",
      extra_label: "",
      des: "In last 30 days",
      link: "/callbacks-overview",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <LevelsSelector
              level1={level1}
              setLevel1={setLevel1}
              level2={level2}
              setLevel2={setLevel2}
              level3={level3}
              setLevel3={setLevel3}
            />
          </div>

          <div className="grid grid-cols-4 gap-3 mt-5">
            {statistics_list.map((item, index) => (
              <Link to={item.link}>
                <StatisticsCard key={index} item={item} />
              </Link>
            ))}
          </div>

          {!selectedMonth && (
            <div className="flex gap-5 mt-5">
              <CallbacksChart
                data={summary?.data?.month_wise_last_12_months}
                setSelectedMonth={setSelectedMonth}
              />
              <TotalCallbacksChart data={focusEquipment?.data?.data} />
            </div>
          )}
          {selectedMonth && (
            <div className="flex gap-5 mt-5">
              <CallbacksSelectedMonth
                data={perfromance?.data?.results}
                isLoading={isPerfromanceLoading}
                setSelectedMonth={setSelectedMonth}
                setLevel3={setLevel3}
                selectedMonth={selectedMonth}
              />
              <Trapped data={trappedData?.data?.results} />
            </div>
          )}
          <CallbacksHistory
            subscription_id={subscription_id}
            buildingId={level3}
            level1={level1?.level1_id}
            level2={level2?.level2_id}
          />
        </>
      )}
    </div>
  );
}

const StatisticsCard = ({ item }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-4 py-4">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{
          background: item.icon_bg,
        }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>

      <div className="space-y-0.5">
        <h4 className="text-md text-text_primary font-bold">{item.title}</h4>
        <div className="flex items-center gap-1">
          <p className="text-2xl text-text_primary font-semibold">
            {item.value}
          </p>
          {item.extra_label && (
            <>
              <p className="text-xl text-[#898EA6] font-semibold">/</p>
              <p className="text-xl text-[#C2285A] font-semibold">
                {item.extra_label}
              </p>
            </>
          )}
        </div>
        {item.des && (
          <p className="text-xs text-text_secondary font-medium">{item.des}</p>
        )}
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between w-full animate-pulse">
        <div className="flex items-center gap-1">
          <div className="w-[165px] h-11 bg-[#F6F6F8] rounded-l-full" />
          <div className="w-[171px] h-11 bg-[#F6F6F8] rounded-none" />
          <div className="w-[205px] h-11 bg-[#F6F6F8] rounded-r-full" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-[90px] h-11 bg-[#F6F6F8] rounded-full" />

          <div className="w-[155px] h-11 bg-[#F6F6F8] rounded-full" />

          <div className="w-[155px] h-11 bg-[#F6F6F8] rounded-full" />

          <div className="w-[148px] h-11 bg-[#F6F6F8] rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl px-4 py-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" />

          <div className="flex flex-col gap-2 w-full">
            <div className="w-24 h-3 bg-gray-200 rounded" />

            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
            </div>

            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl px-4 py-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" />

          <div className="flex flex-col gap-2 w-full">
            <div className="w-24 h-3 bg-gray-200 rounded" />

            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
            </div>

            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl px-4 py-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" />

          <div className="flex flex-col gap-2 w-full">
            <div className="w-24 h-3 bg-gray-200 rounded" />

            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
            </div>

            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div className="flex gap-5 mt-5">
        <div className="flex-1 h-150 bg-[#F6F6F8] rounded-xl" />
        <div className="w-[420px] h-150 bg-[#F6F6F8] rounded-xl" />
      </div>
    </div>
  );
};
