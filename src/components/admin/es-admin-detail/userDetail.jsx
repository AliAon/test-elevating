import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminServiceContractDeatilsCard from "../service-contract-details/card";

const list = [
  {
    icon: "/assets/svg/client-detail-2.svg",
    icon_bg: "#248EA526",
    title: "Contact Person",
    label: "Daniel Thompson",
  },

  {
    icon: "/assets/svg/client-detail-3.svg",
    icon_bg: "#C2285A26",
    title: "Phone Number",
    label: "+61 2 9123 4567",
  },
  {
    icon: "/assets/svg/client-detail-4.svg",
    icon_bg: "#B468B926",
    title: "Email Address",
    label: "daniel.thompson@auslift.com",
  },
  {
    icon: "/assets/svg/client-detail-1.svg",
    icon_bg: "#1F98B226",
    title: "Company Name",
    label: "Jw Marriott",
  },
  {
    icon: "/assets/svg/client-detail-6.svg",
    icon_bg: "#1F98B226",
    title: "Position",
    label: "Admin",
  },
  {
    icon: "/assets/svg/client-detail-7.svg",
    icon_bg: "#248EA526",
    title: "Status",
    label: "Active",
  },
];

export default function UserDetails() {
  const navigate = useNavigate();
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Client Details</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {list.map((item, index) => (
          <AdminServiceContractDeatilsCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
