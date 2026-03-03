import React from "react";

export default function KpiParameters({ contract_kpis }) {
  const list = [
    {
      icon: "/assets/svg/equp-4.svg",
      icon_bg: "#C2285A26",
      title: "Maintenance Visit Per Equipment",
      value: contract_kpis?.maintenance_visit_per_equipment,
      time_left: "in last 12 months",
    },
    {
      icon: "/assets/svg/equp-2.svg",
      icon_bg: "#248EA526",
      title: "Rate of Breakdown",
      value: contract_kpis?.rate_of_breakdown,
      time_left: "in last 12 months",
    },
    {
      icon: "/assets/svg/equp-6.svg",
      icon_bg: "#F06B3C26",
      title: "Minor Response Time",
      value: contract_kpis?.minor_response_time,
      time_left: "in last 12 months",
    },
    {
      icon: "/assets/svg/maint-7.svg",
      icon_bg: "#1F98B226",
      title: "Annual Safety Test Report",
      value: contract_kpis?.annual_safety_test_report,
      time_left: "in last 12 months",
    },
    // {
    //   icon: "/assets/svg/equp-8.svg",
    //   icon_bg: "#B468B926",
    //   title: "Trapped Passenger",
    //   value: "49",
    //   time_left: "in last 12 months",
    // },
  ];
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">KPI Parameters</p>
      <div className="grid grid-cols-5 gap-3 mt-5">
        {list?.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export const Card = ({ item, bg = "#fff" }) => {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: bg,
      }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{ backgroundColor: item.icon_bg }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>

      <div className="mt-3">
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
        <p className="text-2xl text-text_primary font-semibold">{item.value}</p>
        <p className="text-xs text-text_secondary font-medium">
          {item.time_left}
        </p>
      </div>
    </div>
  );
};
