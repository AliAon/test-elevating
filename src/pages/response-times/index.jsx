import React, { useState } from "react";
import { useSelector } from "react-redux";
import ResponseSelectedMonth from "@/components/response-times/selected-month";
import ResponseTimeChart from "@/components/response-times/response-time-chart";
import ResponseHistory from "@/components/response-times/callbacks-history";
import {
  useGetResponseTimeBuildingQuery,
  useGetResponseTimeQuery,
} from "@/redux/services/response-time";
import SummaryResponseTimeChart from "./summary-building";
import SelectedMonthAverageResponseTime from "@/components/response-times/selected-month-average-response-time";
import LevelsSelector from "@/components/common/levels-selector";
import { Link } from "react-router-dom";
import AverageResponseTimeCircleChartDistribution from "@/components/response-times/average-response-time-chart-circle";
// check
export default function ResponseTimes() {
  const [date, setDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [serviceContract] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: summary, isLoading } = useGetResponseTimeQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
    },
    { skip: !subscription_id },
  );

  const { data: perfromance, isLoading: isPerfromanceLoading } =
    useGetResponseTimeBuildingQuery(
      {
        es_subscription_id: subscription_id,
        month: selectedMonth,
        service_contract: serviceContract,
        level1: level1?.level1_id,
        level2: level2?.level2_id,
        level3: level3,
        user_id: user?.user_id,
      },
      {
        skip: !subscription_id || !selectedMonth || !user?.user_id,
      },
    );

  const statistics_list = [
    {
      icon: "/assets/svg/call-back-1.svg",
      icon_bg: "#1F98B226",
      title: "Total Callbacks",
      value: summary?.data?.total_callbacks ?? "-",
      extra_label: "",
      des: "In last 12 months",
      link: "/callbacks-overview",
    },
    {
      icon: "/assets/svg/maint-1.svg",
      icon_bg: "#248EA526",
      title: "Equipment Stopped",
      value: summary?.data?.total_stopped_equipments ?? "-",
      extra_label: "",
      des: "In last 12 months",
      link: "/equipments",
    },
    {
      icon: "/assets/svg/call-back-2.svg",
      icon_bg: "#C2285A26",
      title: "Total Open Callbacks",
      value: `${summary?.data?.total_open_callbacks ?? "-"}%`,
      extra_label: "",
      des: "As of today",
      link: "/callbacks-overview",
    },
    {
      icon: "/assets/svg/call-back-3.svg",
      icon_bg: "#B468B926",
      title: "Trapped Passengers",
      value: summary?.data?.total_trapped_callbacks ?? "-",
      extra_label: "",
      des: "In last 30 days",
      link: "/response-times",
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
              {level3 ? (
                <SummaryResponseTimeChart
                  data={summary?.data?.avg_response_hours_graph}
                  isLoading={isLoading}
                  serviceContract={serviceContract}
                  setSelectedMonth={setSelectedMonth}
                  setLevel3={setLevel3}
                  level1={level1}
                  level2={level2}
                  level3={level3}
                  subscription_id={subscription_id}
                />
              ) : (
                <ResponseTimeChart
                  data={summary?.data?.response_time_percentage_graph}
                  setSelectedMonth={setSelectedMonth}
                  serviceContract={serviceContract}
                  selectedMonth={selectedMonth}
                />
              )}

              <AverageResponseTimeCircleChartDistribution
                serviceContract={serviceContract}
                level1={level1?.level1_id}
                level2={level2?.level2_id}
                level3={level3}
                subscription_id={subscription_id}
              />
            </div>
          )}
          {/* Show graph when month is seleceted */}
          {selectedMonth && (
            <div className="flex gap-5 mt-5">
              <ResponseSelectedMonth
                data={perfromance?.data?.graph_callbacks_per_building}
                isLoading={isPerfromanceLoading}
                setSelectedMonth={setSelectedMonth}
                setLevel3={setLevel3}
                selectedMonth={selectedMonth}
              />
              <SelectedMonthAverageResponseTime
                data={perfromance?.data?.graph_avg_response_hours_per_building}
              />
            </div>
          )}
          <ResponseHistory
            subscription_id={subscription_id}
            from_date={date}
            to_date={toDate}
            buildingId={level3}
            data={perfromance?.data?.monthly_callbacks}
            selectedMonth={selectedMonth}
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
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
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
