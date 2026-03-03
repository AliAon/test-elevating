import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatisticsCard } from "../maintenance";
import CapitalBudgetForecast from "./capital-budget-forecast ";
import CapitalTable from "./capital-table";
import { useGetSummaryQuery } from "@/redux/services/capital-buget-api";
import { useSelector } from "react-redux";
import LevelsSelector from "@/components/common/levels-selector";
import CapitalBudgetDistribution from "@/components/capital-budget-distribution";
import CapitalBudgetSelectedYear from "@/components/capital-budget-distribution/selected-year";

export default function CapitalBudget() {
  const [date, setDate] = useState(undefined);
  const [selectedState, setSelectedState] = useState(""); // State for selected value
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [equiment_type, setEquimentType] = useState("all");
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const showClear = date;
  const showMaintenance = !date;
  const showMaintenanceSelected = date;

  const { data: summary, isLoading } = useGetSummaryQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: selectedBuildingId ?? level3,
      equiment_type,
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );

  const formatPrice = (value) => {
    if (!value) return "";
    return value > 10000 ? Math.round(value / 1000) + "k" : value;
  };

  const statistics_list = [
    {
      icon: "/assets/svg/capital-1.svg",
      icon_bg: "#C2285A26",
      title: "Immediate Replacement Cost",
      value: `${summary?.data?.immediate_replacement_cost}`,
      extra_label: "",
      des: "",
    },
    {
      icon: "/assets/svg/capital-2.svg",
      icon_bg: "#F06B3C26",
      title: "Replacement Require (Next 20 years)",
      value: `${summary?.data?.replacement_require_next_5_years}`,
      extra_label: "",
      des: "",
    },
    {
      icon: "/assets/svg/capital-3.svg",
      icon_bg: "#1F98B226",
      title: "Capital Budget (Next 20 years)",
      value: `$${formatPrice(summary?.data?.capital_budget_next_5_years)}`,
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
          <div className="flex items-center justify-between">
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
                    setDate(null);
                  }}
                  className="min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black"
                >
                  Clear
                </Button>
              )}

              <Select value={equiment_type} onValueChange={setEquimentType}>
                <SelectTrigger className="w-[148px] min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ESCALATOR">ESCALATOR</SelectItem>
                  <SelectItem value="MOVING WALK">MOVING WALK</SelectItem>
                  <SelectItem value="PLATFORM">PLATFORM</SelectItem>
                  <SelectItem value="DUMB WAITER">DUMB WAITER</SelectItem>
                  <SelectItem value="ELEVATOR">ELEVATOR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {statistics_list.map((item, index) => (
              <StatisticsCard key={index} item={item} />
            ))}
          </div>

          <div className="flex gap-5 mt-5">
            {showMaintenance && (
              <CapitalBudgetForecast
                data={summary?.data?.capital_budget_forecast}
                setDate={setDate}
              />
            )}
            {showMaintenanceSelected && (
              <CapitalBudgetSelectedYear
                showMaintenanceSelected={showMaintenanceSelected}
                es_subscription_id={subscription_id}
                setDate={setDate}
                setSelectedState={setSelectedState}
                setSelectedBuildingId={setSelectedBuildingId}
              />
            )}

            <CapitalBudgetDistribution equiment_type={equiment_type} />
          </div>
          <CapitalTable
            es_subscription_id={subscription_id}
            level1={level1}
            level2={level2}
            level3={level3}
            equiment_type={equiment_type}
          />
        </>
      )}
    </div>
  );
}

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
