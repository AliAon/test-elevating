import React, { useState } from "react";
import MaintenanceChart from "@/components/maintenance/maintenance-chart";
import TotalMaintenanceChart from "@/components/maintenance/total-maintenance-chart";
import MaintenanceHistory from "@/components/maintenance/maintenance-history";
import MaintenanceSelectedMoth from "@/components/maintenance/selected-month";
import { useSelector } from "react-redux";
import {
  useGetMaintenanceMonthlyQuery,
  useGetMaintenanceSummaryQuery,
  useGetYtdMaintenanceQuery,
} from "@/redux/services/maintenance";
import YtdMaintenanceChart from "@/components/maintenance/ytd-chart";
import LevelsSelector from "@/components/common/levels-selector";

export default function MaintenanceOverView() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");

  const {
    data: summary,
    isLoading,
    isFetching,
  } = useGetMaintenanceSummaryQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
    },
    { skip: !subscription_id },
  );

  const {
    data: ytd,
    isLoading: isYtdLoading,
    isFetching: isYtdFetching,
  } = useGetYtdMaintenanceQuery(
    {
      es_subscription_id: subscription_id,
      building_id: level3,
    },
    { skip: !subscription_id || !level3 },
  );

  const {
    data: monthly,
    isLoading: isMonthlyLoading,
    isFetching: isMonthlyFetching,
  } = useGetMaintenanceMonthlyQuery(
    {
      es_subscription_id: subscription_id,
      month: selectedMonth,
    },
    { skip: !subscription_id || !selectedMonth },
  );

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

          {!selectedMonth && (
            <div className="flex gap-5 mt-5">
              {/* {!level3 ? (
                <MaintenanceChart
                  data={summary?.data?.month_wise_last_12_months}
                  setSelectedMonth={setSelectedMonth}
                />
              ) : ( */}
              <YtdMaintenanceChart
                data={ytd?.data?.months}
                setLevel3={setLevel3}
                setSelectedMonth={setSelectedMonth}
                isYtdLoading={isYtdLoading}
                isYtdFetching={isYtdFetching}
              />
              {/* )} */}
              <TotalMaintenanceChart />
            </div>
          )}
          {selectedMonth && (
            <MaintenanceSelectedMoth
              data={monthly?.data?.results}
              selectedMonth={selectedMonth}
              isMonthlyLoading={isMonthlyLoading}
              isMonthlyFetching={isMonthlyFetching}
              setSelectedMonth={setSelectedMonth}
            />
          )}

          <MaintenanceHistory />
        </>
      )}
    </div>
  );
}

export const StatisticsCard = ({ item }) => {
  return (
    <div className="group flex flex-col gap-3 bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all rounded-lg p-5">
      <div className="flex items-center gap-2">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            background: item.icon_bg,
          }}
        >
          <img
            src={item.icon}
            alt=""
            width={24}
            height={24}
            className="p-0.5"
          />
        </div>
        {item.des && (
          <p className="text-xs text-text_secondary font-medium">{item.des}</p>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-text_secondary font-semibold uppercase tracking-wide">
          {item.title}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl text-text_primary font-bold">
            {item.value ?? 0}
          </p>
          {item.extra_label && (
            <p className="text-sm text-[#C2285A] font-semibold">
              {item.extra_label}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const Skeleton = () => {
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

      <div className="grid grid-cols-4 gap-4 mt-8">
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
