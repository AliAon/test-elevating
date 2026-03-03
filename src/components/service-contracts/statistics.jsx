import React from "react";
import { Link } from "react-router-dom";

export default function ServicesStatistics({ summary }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card
        bgColor={"#248EA526"}
        icon={"/assets/svg/contract-user-1.svg"}
        title={"Active Contracts"}
        value={summary?.total_active_contracts}
        link={"/service-contracts"}
      />
      <Card
        bgColor={"#C2285A26"}
        icon={"/assets/svg/contract-user-2.svg"}
        title={"Equipment"}
        value={summary?.total_equipments}
        link={"/equipments"}
      />
      <Card
        bgColor={"#1F98B226"}
        icon={"/assets/svg/contract-user-3.svg"}
        title={"Contracts Expiring"}
        value={summary?.contracts_expiring_soon}
        extra_label={"in next 120 days"}
        link={"/service-contracts"}
      />
    </div>
  );
}

const Card = ({ bgColor, icon, title, value, extra_label, link }) => {
  return (
    <Link to={link}>
      <div className="flex items-center gap-3 bg-[#f6f6f8] rounded-xl p-5">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{
            background: bgColor,
          }}
        >
          <img src={icon} alt="" width={24} height={24} />
        </div>

        <div>
          <p className="text-text_primary text-sm font-medium">{title}</p>
          <p className="text-text_primary text-3xl font-semibold">{value}</p>
          {extra_label && (
            <p className="text-xs text-text_secondary font-medium">
              {extra_label}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
