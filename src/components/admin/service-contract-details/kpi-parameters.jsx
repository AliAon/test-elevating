import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import AdminServiceContractDeatilsCard from "./card";
import { useNavigate, useParams } from "react-router-dom";

const tabs = [
  {
    key: "over-all",
    title: "Overall",
  },
  {
    key: "business-hours",
    title: "Business Hours",
  },
  {
    key: "after-hours",
    title: "After Hours",
  },
];

export default function KpiParameters({ contract }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [active, setActive] = useState(tabs[0].key);
  const list = getList(contract?.contract_kpis, contract?.equipment_kpis);
  const after = getAfterHoursList(contract?.after_hours_response_time);
  const business = getBusinessHoursList(contract?.business_hours_response_time);
  const handleActive = (key) => {
    setActive(key);
  };

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">KPI Parameters</p>

        <div className="w-fit h-13 flex items-center rounded-2xl bg-white p-1 mt-5">
          {tabs.map((tab, index) => (
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

        <Button
          onClick={() =>
            navigate(`/admin/services-contracts-update?contract_id=${id}`)
          }
          className="w-[136px] bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary"
        >
          Edit Details <ChevronRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {active === "over-all" &&
          list.map((item, index) => (
            <AdminServiceContractDeatilsCard key={index} item={item} />
          ))}
        {active === "business-hours" &&
          business.map((item, index) => (
            <AdminServiceContractDeatilsCard key={index} item={item} />
          ))}
        {active === "after-hours" &&
          after.map((item, index) => (
            <AdminServiceContractDeatilsCard key={index} item={item} />
          ))}
      </div>

      {active === "over-all" && contract?.kpi_settings && (
        <div className="mt-6">
          <p className="text-lg font-semibold text-black mb-3">KPI Settings</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                key: "response_time",
                label: "Response Time",
                targetLabel: "Target KPI (in %)",
                penaltyLabel: "Penalty Amount ($) per incident",
              },
              {
                key: "maintenance",
                label: "Maintenance",
                targetLabel: "Target KPI (%)",
                penaltyLabel: "Penalty Amount ($)",
              },
              {
                key: "repeat_callbacks",
                label: "Repeat Callbacks",
                targetLabel: "Target Max Repeat Failure per Equipment",
                penaltyLabel: "Penalty Amount ($) per failed equipment",
              },
              {
                key: "availability",
                label: "Availability / Uptime",
                targetLabel: "Target Uptime KPI (in %)",
                penaltyLabel: "Penalty Amount ($) per 1% below KPI target",
              },
            ].map(({ key, label, targetLabel, penaltyLabel }) => {
              const cfg = contract.kpi_settings[key];
              if (!cfg) return null;
              return (
                <div
                  key={key}
                  className="bg-white rounded-xl p-4 flex flex-col gap-2"
                >
                  <p className="text-sm font-semibold text-text_primary">
                    {label}
                  </p>
                  <div className="flex items-center justify-between text-sm text-text_secondary">
                    <span>{targetLabel}</span>
                    <span className="font-medium text-text_primary">
                      {cfg.target}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text_secondary">
                    <span>{penaltyLabel}</span>
                    <span className="font-medium text-text_primary">
                      ${cfg.penalty_rate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text_secondary">
                    <span>Measured Frequency</span>
                    <span className="font-medium text-text_primary capitalize">
                      {cfg.target_interval}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getList(data, equipment_kpis) {
  return [
    {
      icon: "/assets/svg/service-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Maintenance Visit Per Equipment ",
      label: data?.maintenance_visit_per_equipment,
    },
    {
      icon: "/assets/svg/service-detail-2.svg",
      icon_bg: "#248EA526",
      title: "Rate of Breakdown",
      label: data?.rate_of_breakdown,
    },
    {
      icon: "/assets/svg/service-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Annual Safety Test Report",
      label: data?.annual_safety_test_report,
    },
    {
      icon: "/assets/svg/service-detail-4.svg",
      icon_bg: "#B468B926",
      title: "Minor Response Time",
      label: `${data?.minor_response_time} hrs`,
    },
    {
      icon: "/assets/svg/service-detail-8.svg",
      icon_bg: "#C2285A26",
      title: "Equipment Availability ",
      label: `≥  ${equipment_kpis?.equipment_availability_target} %`,
    },
  ];
}

function getBusinessHoursList(data) {
  if (!data) return [];
  return [
    {
      icon: "/assets/svg/service-detail-2.svg",
      icon_bg: "#248EA526",
      title: "Critical Equipment Stopped",
      label: data.criticalEquipmentStopped?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.criticalEquipmentStopped?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-5.svg",
      icon_bg: "#F06B3C26",
      title: "Non-Operational/Aesthetic Faults",
      label: data.nonOperationalOrAestheticFaults?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.nonOperationalOrAestheticFaults?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-4.svg",
      icon_bg: "#B468B926",
      title: "Operational/Intermittent Faults",
      label: data.operationalIntermittentFaults?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.operationalIntermittentFaults?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Non-Critical Equipment Stopped",
      label: data.nonCriticalEquipmentStopped?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.nonCriticalEquipmentStopped?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Entrapment",
      label: data.entrapment?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.entrapment?.hours} Hour(s)`,
    },
  ];
}

function getAfterHoursList(data) {
  if (!data) return [];
  return [
    {
      icon: "/assets/svg/service-detail-2.svg",
      icon_bg: "#248EA526",
      title: "Critical Equipment Stopped",
      label: data.criticalEquipmentStopped?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.criticalEquipmentStopped?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-5.svg",
      icon_bg: "#F06B3C26",
      title: "Non-Operational/Aesthetic Faults",
      label: data.nonOperationalOrAestheticFaults?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.nonOperationalOrAestheticFaults?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-4.svg",
      icon_bg: "#B468B926",
      title: "Operational/Intermittent Faults",
      label: data.operationalIntermittentFaults?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.operationalIntermittentFaults?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Non-Critical Equipment Stopped",
      label: data.nonCriticalEquipmentStopped?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.nonCriticalEquipmentStopped?.hours} Hour(s)`,
    },
    {
      icon: "/assets/svg/service-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Entrapment",
      label: data.entrapment?.attendance_next_business_day
        ? "Attend Next Business Day"
        : `${data.entrapment?.hours} Hour(s)`,
    },
  ];
}
