import LinkedUser from "@/components/admin/es-client-list/linkedUser";
import { useGetDashboardClientsStatsQuery } from "@/redux/services/dashboard-api";
import React from "react";

export default function EsClient() {
  const { data: dataDashboardClients } = useGetDashboardClientsStatsQuery();
  const list = [
    {
      icon: "/assets/svg/admin-dashboard-1.svg",
      icon_bg: "#1F98B226",
      title: "Active Users",
      value: dataDashboardClients?.activeUsers?.count,
      extra_label: dataDashboardClients?.activeUsers?.percentage,
    },
    {
      icon: "/assets/svg/admin-dashboard-2.svg",
      icon_bg: "#248EA526",
      title: "Users",
      value: dataDashboardClients?.users?.count,
      extra_label: dataDashboardClients?.users?.percentage,
    },
    {
      icon: "/assets/svg/admin-dashboard-3.svg",
      icon_bg: "#C2285A26",
      title: "Buildings",
      value: dataDashboardClients?.buildings?.count,
      extra_label: dataDashboardClients?.buildings?.percentage,
    },
    {
      icon: "/assets/svg/admin-dashboard-4.svg",
      icon_bg: "#B468B926",
      title: "Equipment",
      value: dataDashboardClients?.equipment?.count,
      extra_label: dataDashboardClients?.equipment?.percentage,
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-4 py-4"
          >
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full"
              style={{ background: item.icon_bg }}
            >
              <img src={item.icon} alt={item.title} width={24} height={24} />
            </div>

            <div>
              <p className="text-sm text-text_primary font-medium">
                {item.title}
              </p>
              <p className="text-2xl text-text_primary font-semibold">
                {item.value}
              </p>
              <p className="text-xs text-text_secondary font-medium mt-1">
                <span
                  className={
                    item.extra_label >= 5 ? "text-[#248EA5]" : "text-[#C2285A]"
                  }
                >
                  {item.extra_label}%{" "}
                  {item.extra_label >= 5 ? "Increase" : "Decrease"}
                </span>{" "}
                from previous year
              </p>
            </div>
          </div>
        ))}
      </div>
      <LinkedUser />
    </>
  );
}
