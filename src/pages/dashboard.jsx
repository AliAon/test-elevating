import React, { useState } from "react";
import StatsCard from "../components/dashdoard/StatsCard";
import ActiveEquipment from "../../public/assets/svg/activeEquipment.svg";
import OnlineElevatorsLabel from "../../public/assets/svg/onlineelevatorslabel.svg";
import openCallbacks from "../../public/assets/svg/opencallbacks.svg";
import OnlineEscalatorsLabel from "../../public/assets/svg/onlineescalatorslabel.svg";
import OpenPlannedMaintenance from "../../public/assets/svg/openplannedmaintenance.svg";
import Callback from "../components/dashdoard/callback";
import FocusEquipment from "../components/dashdoard/focusEquipment";
import Share from "../assets/svg/share.svg";
import ResponseTimeChart from "../components/dashdoard/ResponseTimeChart";
import PlannedMaintenanceChart from "../components/dashdoard/PlannedMaintenanceChart";
import YearCapital from "../components/dashdoard/year-capital-chart";
import KpiPenaltyChart from "../components/dashdoard/kpi-penalty";
import RecentCallbacks from "../components/dashdoard/recent-callbacks";
import {
  useGetClientDashboardAvgResponseQuery,
  useGetClientDashboardFoucsQuery,
  useGetClientDashboardStatesQuery,
  useGetClientGraphCallbacksQuery,
} from "@/redux/services/dashboard-api";
import { useSelector } from "react-redux";
import { useGetSummaryQuery } from "@/redux/services/capital-buget-api";

import AvailabiltyChartDistribution from "@/components/availabilty-chart";
import LevelsSelector from "@/components/common/levels-selector";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState("year");
  const [view, setView] = useState("monthly");
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [serviceContract] = useState("");
  const { data: stats, isLoading: isStatsLoading } =
    useGetClientDashboardStatesQuery(
      {
        es_subscription_id: subscription_id,
        level1: level1?.level1_id,
        level2: level2?.level2_id,
        level3: level3,
        service_contract: serviceContract || "all",
      },
      {
        skip: !subscription_id || !level1 || !level2 || !level3,
      },
    );

  const {
    data: graphCallbacks,
    isLoading: isCallbacksLoading,
    isFetching: isCallbacksFetching,
  } = useGetClientGraphCallbacksQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
      service_contract: serviceContract || "all",
      tab: activeRange,
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );

  const {
    data: focusEquipment,
    isLoading: isFocusLoading,
    isFetching: isFocusFetching,
  } = useGetClientDashboardFoucsQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
      service_contract: serviceContract || "all",
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );

  const {
    data: avgResponse,
    isLoading: isavgResponseLoading,
    isFetching: isavgResponseFetching,
  } = useGetClientDashboardAvgResponseQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
      service_contract: serviceContract || "all",
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );

  const { data: capitalBudget, isLoading: isCapitalBudgetLoading } =
    useGetSummaryQuery(
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

  const statsData = [
    {
      id: 1,
      title: "Active Equipment",
      value: stats?.data?.active_equipments,
      subtitle: "56 Escalators and 81 Elevators",
      icon: ActiveEquipment,
      link: "/equipments",
    },
    {
      id: 2,
      title: "Stopped Equipment",
      value: stats?.data?.stopped_equipments,
      subtitle: "",
      icon: OnlineElevatorsLabel,
      link: "/equipments",
    },
    {
      id: 3,
      title: "Open Callbacks",
      value: stats?.data?.open_callbacks,
      subtitle: "",
      icon: openCallbacks,
      link: "/callbacks-overview",
    },
    {
      id: 4,
      title: "Open Entrapments",
      value: stats?.data?.open_entrapments,
      subtitle: "In the last 90 days",
      icon: OnlineEscalatorsLabel,
      link: "/maintenance-overview",
    },
    {
      id: 5,
      title: "Plan Maintenance",
      value: stats?.data?.open_maintenance,
      subtitle: "in next 2 days",
      icon: OpenPlannedMaintenance,
      link: "/maintenance-overview",
    },
  ];

  return (
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

      <div className=" flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full py-5">
          {isStatsLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            statsData?.map((item) => (
              <Link to={item.link}>
                <StatsCard key={item.id} item={item} />
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8 bg-gray-50 shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={Share} alt="" />
              <div>
                <h2 className="text-xl font-semibold">Callbacks</h2>
                <button className="bg-[#EAECEF] rounded-full px-2 py-1 font-medium text-xs text-[#5B617F]">
                  All Callbacks
                </button>
              </div>
            </div>

            <div className="flex bg-white rounded-xl p-1 w-fit">
              {[
                {
                  label: "Year",
                  value: "year",
                },
                {
                  label: "3 Year",
                  value: "3year",
                },
              ].map((label) => (
                <button
                  key={label.value}
                  onClick={() => setActiveRange(label.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition
                      ${
                        activeRange === label.value
                          ? "bg-[#F3F3F3] shadow text-black"
                          : "text-[#5B617F] hover:text-black"
                      }`}
                >
                  {label.label}
                </button>
              ))}
            </div>
          </div>
          <Link to={"/callbacks-overview"} className="cursor-pointer">
            <Callback
              activeRange={activeRange}
              data={graphCallbacks?.data}
              isLoading={isCallbacksLoading}
              isFetching={isCallbacksFetching}
            />
          </Link>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 bg-gray-50 shadow rounded-lg p-4">
          <div className="flex items-center gap-2">
            <img src={Share} alt="" />
            <div>
              <h2 className="text-xl font-semibold">Focus Equipment</h2>
              <p className=" font-medium text-xs text-[#5B617F]">
                Highest reported breakdown equipment last 90 days.
              </p>
            </div>
          </div>
          <Link to={"/equipments"}>
            <FocusEquipment
              data={focusEquipment?.data?.data ?? []}
              isLoading={isFocusLoading}
              isFetching={isFocusFetching}
            />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 py-6">
        <div className="bg-gray-50 shadow rounded-lg p-4 lg:col-span-5 xl:col-span-4">
          <div className="flex items-center gap-2">
            <img src={Share} alt="" />
            <div>
              <h2 className="text-xl font-semibold">
                Response Time Achive (%)
              </h2>
            </div>
          </div>
          <Link to={"/response-times"}>
            <ResponseTimeChart
              data={avgResponse?.data}
              isLoading={isavgResponseLoading}
              isFetching={isavgResponseFetching}
            />
          </Link>
        </div>

        <div className="bg-gray-50 shadow rounded-lg p-4 lg:col-span-7 xl:col-span-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={Share} alt="" />
              <div>
                <h2 className="text-xl font-semibold">
                  Planned Maintenance KPI
                </h2>
                <button className="bg-[#EAECEF] rounded-full px-2 py-1 font-medium text-xs text-[#5B617F]">
                  Compliance to PPM KPI
                </button>
              </div>
            </div>

            <div className="flex bg-white rounded-xl p-1 w-fit">
              {["monthly", "3year"]?.map((label) => (
                <button
                  key={label}
                  onClick={() => setView(label)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition
                      ${
                        view === label
                          ? "bg-[#F3F3F3] shadow text-black"
                          : "text-[#5B617F] hover:text-black"
                      }`}
                >
                  {label == "monthly" ? "Year" : "3 Years"}
                </button>
              ))}
            </div>
          </div>
          <Link to="/maintenance-overview">
            <PlannedMaintenanceChart activeRange={view} />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3  gap-6 pb-6">
        <AvailabiltyChartDistribution
          level1={level1}
          level2={level2}
          level3={level3}
          serviceContract={serviceContract}
        />
        <div className="bg-gray-50 shadow rounded-lg p-4">
          <div className="flex items-center gap-2">
            <img src={Share} alt="" />
            <div>
              <h2 className="text-xl font-semibold">10 Year Capital</h2>
              <div className="bg-[#EAECEF] w-fit rounded-full text-xs text-[#5B617F] font-medium px-3 py-1 mt-2">
                Capital budget estimates (avg. of low &amp; high)
              </div>
            </div>
          </div>
          <Link to="/capital-budget">
            <YearCapital
              data={capitalBudget?.data?.capital_budget_forecast}
              isLoading={isCapitalBudgetLoading}
            />
          </Link>
        </div>
        <div className="bg-gray-50 shadow rounded-lg p-4">
          <div className="flex items-center gap-2">
            <img src={Share} alt="" />
            <div>
              <h2 className="text-xl font-semibold">KPI Penalty</h2>
            </div>
          </div>
          <Link to="/kpi-penalty">
            <KpiPenaltyChart
              level1={level1?.level1_id}
              level2={level2?.level2_id}
              level3={level3}
            />
          </Link>
        </div>
      </div>
      <RecentCallbacks level3={level3} />
    </>
  );
}

function StatsCardSkeleton() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-32 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
