import React from "react";
import AdminUser from "@/components/admin/es-admin-list/adminUser";
import { useGetDashboardAdminStatsQuery } from "@/redux/services/dashboard-api";

export default function EsAdmin() {
  const { data } = useGetDashboardAdminStatsQuery();

  const list = [
    {
      icon: "/assets/svg/admin-dashboard-1.svg",
      icon_bg: "#1F98B226",
      title: "Active Users",
      value: data?.activeUsers?.count,
      extra_label: data?.activeUsers?.percentage,
    },
    {
      icon: "/assets/svg/admin-dashboard-2.svg",
      icon_bg: "#248EA526",
      title: "Users",
      value: data?.users?.count,
      extra_label: data?.users?.percentage,
    },
    {
      icon: "/assets/svg/admin-dashboard-3.svg",
      icon_bg: "#C2285A26",
      title: "Buildings",
      value: data?.buildings?.count,
      extra_label: data?.buildings?.percentage,
    },
    {
      icon: "/assets/svg/admin-dashboard-4.svg",
      icon_bg: "#B468B926",
      title: "Equipment",
      value: data?.equipment?.count,
      extra_label: data?.equipment?.percentage,
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-bg_primary rounded-xl px-4 py-6"
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
              <p className="text-3xl text-text_primary font-semibold">
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
      <AdminUser />
    </>
  );
}
