import Callbacks from "@/components/downloads/callbacks";
import CapitalBudget from "@/components/downloads/capital-budget";
import Equipment from "@/components/downloads/equipment";
import KpiPenalty from "@/components/downloads/kpi-penalty";
import Maintenance from "@/components/downloads/maintaince";
import React, { useState } from "react";
const tabs = [
  { key: "equipment", title: "Equipment" },
  { key: "maintenance", title: "Maintenance" },
  { key: "callbacks", title: "Callbacks" },
  { key: "kpi-penalty", title: "KPI Penalty" },
  { key: "capital-budget", title: "Capital Budget" },
];

export default function Downloads() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = tabs[activeIndex].key;

  return (
    <div className="bg-bg_primary p-7 rounded-xl">
      <p className="text-3xl text-text_primary font-semibold">Genrate Report</p>
      <div className=" overflow-auto no-scrollbar">
        <div className="max-w-fit lg:min-w-full min-w-[680px]  h-13 grid grid-cols-5 justify-between rounded-2xl bg-white p-1 mt-5  ">
          {tabs.map((tab, index) => (
            <button
              onClick={() => {
                setActiveIndex(index);
              }}
              key={tab.key}
              className={`h-full max-w-full w-full text-sm font-medium cursor-pointer px-4 rounded-2xl transition-colors ${
                activeIndex === index
                  ? "bg-bg_primary text-text_primary"
                  : "text-text_secondary"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5">{active === "equipment" && <Equipment />}</div>
      <div className="mt-5">{active === "maintenance" && <Maintenance />}</div>
      <div className="mt-5">{active === "callbacks" && <Callbacks />}</div>
      <div className="mt-5">{active === "kpi-penalty" && <KpiPenalty />}</div>
      <div className="mt-5">
        {active === "capital-budget" && <CapitalBudget />}
      </div>
    </div>
  );
}
