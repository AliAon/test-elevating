import React, { useState } from "react";
import EquipmentSplits from "@/components/equipments/equipment-splits";
import EquipTable from "@/components/equipments/equip-table";
import LevelsSelector from "@/components/common/levels-selector";
import {
  useGetEquipmentsSplitQuery,
  useGetEquipmentsStatsQuery,
} from "@/redux/services/equipments-api";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/loader";

export default function Equipments() {
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const navigate = useNavigate();

  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const { data: stats, isLoading: isLoadingStats } = useGetEquipmentsStatsQuery(
    {
      es_subscription_id: es_subscription_id,
      level3: level3,
    },
    {
      skip: !es_subscription_id,
    },
  );

  const { data: splitData, isLoading: equipmentLoading } =
    useGetEquipmentsSplitQuery(
      {
        es_subscription_id,
        level1: level1?.level1_id,
        level2: level2?.level2_id,
        level3: level3,
      },
      { skip: !es_subscription_id },
    );

  const statistics_list = [
    {
      icon: "/assets/svg/equp-2.svg",
      icon_bg: "#248EA526",
      title: "Elevators Active / Stopped",
      value: stats?.elevators?.active,
      extra_label: stats?.elevators?.stopped,
      des: "",
    },
    {
      icon: "/assets/svg/equp-3.svg",
      icon_bg: "#C2285A26",
      title: "Escalators Active / Stopped",
      value: stats?.escalators?.active,
      extra_label: stats?.escalators?.stopped,
      des: "",
    },
    {
      icon: "/assets/svg/equp-1.svg",
      icon_bg: "#1F98B226",
      title: "Moving Walks Active / Stopped",
      value: stats?.moving_walks?.active,
      extra_label: stats?.moving_walks?.stopped,
      des: "Moving Walks",
    },
    {
      icon: "/assets/svg/equp-2.svg",
      icon_bg: "#248EA526",
      title: "Platforms Active / Stopped",
      value: stats?.platforms?.active,
      extra_label: stats?.platforms?.stopped,
      des: "",
    },
    {
      icon: "/assets/svg/equp-3.svg",
      icon_bg: "#C2285A26",
      title: "Dumb Waiters Active / Stopped",
      value: stats?.dumb_waiters?.active,
      extra_label: stats?.dumb_waiters?.stopped,
      des: "",
    },
    {
      icon: "/assets/svg/equp-1.svg",
      icon_bg: "#1F98B226",
      title: "Others",
      value: stats?.dumb_waiters?.active,
      extra_label: stats?.dumb_waiters?.stopped,
      des: "",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <div className="flex lg:flex-row flex-col items-center justify-between w-full">
          <LevelsSelector
            level1={level1}
            setLevel1={setLevel1}
            level2={level2}
            setLevel2={setLevel2}
            level3={level3}
            setLevel3={setLevel3}
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                navigate("/buildings");
              }}
            >
              Buildings
            </Button>
          </div>
        </div>
      </div>

      {isLoadingStats || equipmentLoading ? (
        <div className="flex items-center justify-center p-4 h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex xl:flex-row flex-col gap-5 mt-5">
            <div className="grid lg:col-span-9 flex-1">
              <div className="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-3 h-fit">
                {statistics_list?.map((item, index) => {
                  return (
                    item.value != 0 && (
                      <StatisticsCard key={index} item={item} index={index} />
                    )
                  );
                })}
              </div>
            </div>
            <div>
              <EquipmentSplits splitData={splitData} />
            </div>
          </div>
          <EquipTable buildingId={level3} />
        </>
      )}
    </div>
  );
}

const StatisticsCard = ({ item, index }) => {
  const cardContent = (
    <div className="flex items-center gap-3 bg-gray-50 max-h-[150px] h-full border border-gray-200 shadow-sm rounded-xl px-4 py-4  hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{
          background: item.icon_bg,
        }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>

      <div className="space-y-0.5">
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl text-text_primary font-semibold">
            {item.value}
          </p>
          <p>/</p>
          {item.extra_label && (
            <>
              <p className="text-xl text-[#898EA6] font-semibold">/</p>
              <p className="text-xl text-[#C2285A] font-semibold">
                {item.extra_label}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (index === 0) {
    return <Link to="/buildings">{cardContent}</Link>;
  }

  return cardContent;
};
