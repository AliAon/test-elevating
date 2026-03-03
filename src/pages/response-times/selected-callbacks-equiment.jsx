import CallbacksList from "@/components/response-times/callbacksList";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const statistics_list = [
  {
    icon: "/assets/svg/maint-8.svg",
    icon_bg: "#C2285A26",
    title: "Callbacks",
    value: "25",
    extra_label: "",
    des: "in last 12 months",
  },
  {
    icon: "/assets/svg/calender.svg",
    icon_bg: "#248EA526",
    title: "Avg. Response Time",
    value: "5 Days",
    extra_label: "",
    des: "in last 12 months",
  },
  {
    icon: "/assets/svg/meter.svg",
    icon_bg: "#B468B926",
    title: "Maintenance Performance",
    value: "98%",
    extra_label: "",
    des: "in last 12 months",
  },
];

export default function SelectedCallbacksEquiment() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mt-7">
        <div>
          <p className="text-4xl text-text_primary font-semibold">
            KONE MonoSpace® 500 DX
          </p>
          <p className="text-sm text-text_secondary font-medium mt-1">
            EN 81-20 / EN 81-50 (Base Compliance)
          </p>
        </div>
        <Button
          onClick={() => navigate("/response-time-equipment-details/1")}
          className="w-[200px] h-11 rounded-full text-sm font-semibold"
        >
          View Details
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        {statistics_list.map((item, index) => (
          <StatisticsCard key={index} item={item} />
        ))}
      </div>

      <CallbacksList />
    </div>
  );
}

const StatisticsCard = ({ item }) => {
  return (
    <div className="flex items-center gap-3 bg-bg_primary rounded-xl px-4 py-6">
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
          <p className="text-3xl text-text_primary font-semibold">
            {item.value}
          </p>
          {item.extra_label && (
            <>
              <p className="text-2xl text-[#898EA6] font-semibold">/</p>
              <p className="text-2xl text-[#C2285A] font-semibold">
                {item.extra_label}
              </p>
            </>
          )}
        </div>
        {item.des && (
          <p className="text-xs text-text_secondary font-medium">{item.des}</p>
        )}
      </div>
    </div>
  );
};
