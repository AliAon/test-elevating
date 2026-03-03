import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminServiceContractDeatilsCard from "../service-contract-details/card";
import AdminClientDetailsSkeleton from "@/components/skeleton/admin-client-details-skeleton";

export default function AdminClientDetails({ client, isLoading }) {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const navigate = useNavigate();
  if (isLoading || !client) {
    return <AdminClientDetailsSkeleton />;
  }

  const list = [
    {
      icon: "/assets/svg/client-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Registered ABN",
      label: client?.registered_ABN || "—",
    },
    {
      icon: "/assets/svg/client-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Legal Entity Name",
      label: client?.legal_entity_name || "—",
    },
    {
      icon: "/assets/svg/client-detail-2.svg",
      icon_bg: "#248EA526",
      title: "Contact Person",
      label: client?.contact_person || "—",
    },
    {
      icon: "/assets/svg/client-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Contact Person's Job Title",
      label: client?.contact_person_position || "—",
    },
    {
      icon: "/assets/svg/client-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Phone Number",
      label: `${client?.country_code || ""} ${client?.phone_number || "—"}`,
    },
    {
      icon: "/assets/svg/client-detail-4.svg",
      icon_bg: "#B468B926",
      title: "Email Address",
      label: client?.email || "—",
    },
    {
      icon: "/assets/svg/client-detail-5.svg",
      icon_bg: "#F06B3C26",
      title: "Head Quarters",
      label: client?.HQ_address || "—",
    },
    {
      icon: "/assets/svg/client-detail-6.svg",
      icon_bg: "#C2285A26",
      title: "City",
      label: client?.city || "—",
    },
    {
      icon: "/assets/svg/client-detail-7.svg",
      icon_bg: "#248EA526",
      title: "State",
      label: client?.state || "—",
    },
    {
      icon: "/assets/svg/client-detail-8.svg",
      icon_bg: "#1F98B226",
      title: "Country",
      label: client?.country || "—",
    },
    {
      icon: "/assets/svg/client-detail-5.svg",
      icon_bg: "#F06B3C26",
      title: "Postal Code",
      label: client?.postal_code || "—",
    },
  ];

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-black font-semibold">Client Details</h2>
        <div className="flex items-center gap-4">
          {/* <Button
            onClick={() =>
              navigate(`/admin/onboarding-client?clientId=${clientId}`)
            }
            className="bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary"
          >
            Re-launch Onboarding <ChevronRight size={16} />
          </Button> */}
          <Button
            onClick={() =>
              navigate(`/admin/add-update-client?clientId=${clientId}`)
            }
            className="w-[136px] bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary">
            Edit Details <ChevronRight size={16} />
          </Button>
          {/* <Button className="w-[136px] bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary">
            Linked Users <ChevronRight size={16} />
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {list.map((item, index) => (
          <AdminServiceContractDeatilsCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
