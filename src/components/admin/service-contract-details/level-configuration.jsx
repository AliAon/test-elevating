import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import AdminServiceContractDeatilsCard from "./card";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLvl3ListQuery } from "@/redux/services/subscription";

export default function LevelConfiguration({ contract }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: level3List } = useGetLvl3ListQuery({
    limit: 100,
  });

  const buildings = level3List?.data || [];
  const list = getList(contract, buildings);

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Level Configuration</p>
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
        {list?.map((item, index) => (
          <AdminServiceContractDeatilsCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function getList(data, buildings) {
  const filteredBuildings = buildings?.filter((building) =>
    data?.building_ids?.includes(building?.id),
  );

  return [
    {
      icon: "/assets/svg/service-detail-14.svg",
      icon_bg: "#1F98B226",
      title: "Level 1",
      label: data?.level1_details?.[0]?.name ?? "-",
    },
    {
      icon: "/assets/svg/service-detail-15.svg",
      icon_bg: "#248EA526",
      title: "Level 2",
      label: data?.level2_details?.[0]?.name ?? "-",
    },
    {
      icon: "/assets/svg/service-detail-16.svg",
      icon_bg: "#C2285A26",
      title: "Level 3",
      label: filteredBuildings?.[0]?.name ?? "-",
    },
  ];
}
