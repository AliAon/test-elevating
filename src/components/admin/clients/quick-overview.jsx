import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function QuickOverview({ counts }) {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const navigate = useNavigate();

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8">
      <p className="text-2xl text-black font-semibold">Quick Overview</p>

      <div className="grid grid-cols-4 gap-4 mt-8">
        <Card
          title="ES Pulse Subcriptions"
          count={counts?.es_subscriptions || 0}
          icon="/assets/svg/admin-dashboard-1.svg"
          iconBg="#1F98B226"
          onClick={() =>
            navigate(
              `/admin/clients-details-es-pulse-contract?clientId=${clientId}`
            )
          }
        />
        <Card
          title="Service Contracts"
          count={counts?.service_contracts || 0}
          icon="/assets/svg/client-detail-1.svg"
          iconBg="#248EA526"
          onClick={() =>
            navigate(`/admin/clients-contracts?clientId=${clientId}`)
          }
        />

        <Card
          title="Level 1"
          count={counts?.level1s || 0}
          icon="/assets/svg/client-detail-6.svg"
          iconBg="#C2285A26"
          onClick={() => navigate(`/admin/level-1?clientId=${clientId}`)}
        />
        <Card
          title="Level 2"
          count={counts?.level2s || 0}
          icon="/assets/svg/client-detail-7.svg"
          iconBg="#B468B926"
          onClick={() => navigate(`/admin/level-2?clientId=${clientId}`)}
        />
        <Card
          title="Buildings"
          count={counts?.buildings || 0}
          icon="/assets/svg/buildings.svg"
          iconBg="#F06B3C26"
          onClick={() => navigate(`/admin/buildings?clientId=${clientId}`)}
        />
        <Card
          title="Groups"
          count={counts?.groups || 0}
          icon="/assets/svg/buildings.svg"
          iconBg="#03B37226"
          onClick={() => navigate(`/admin/groups?clientId=${clientId}`)}
        />
        <Card
          title="Equipments"
          count={counts?.equipments || 0}
          icon="/assets/svg/equipment.svg"
          iconBg="#1F98B226"
          onClick={() => navigate(`/admin/equipments?clientId=${clientId}`)}
        />
      </div>
    </div>
  );
}

const Card = ({
  title = "ES Pulse Subcriptions",
  count = 0,
  icon = "/assets/svg/admin-dashboard-1.svg",
  iconBg = "#1F98B226",
  onClick,
}) => {
  return (
    <div className="group flex items-center justify-between bg-white border border-gray-100 rounded-lg overflow-hidden h-24 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className="flex-1 flex items-center gap-3 p-5">
        <div
          className="w-11 h-11 flex items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: iconBg }}
        >
          <img src={icon} alt="" width={22} height={22} />
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl text-gray-900 font-bold mt-1">{count}</p>
        </div>
      </div>
      {onClick && (
        <div
          className="w-10 h-full bg-gradient-to-l from-gray-50 to-transparent flex items-center justify-center cursor-pointer hover:from-primary/10 transition-all duration-200"
          onClick={onClick}
        >
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors"
          />
        </div>
      )}
    </div>
  );
};
