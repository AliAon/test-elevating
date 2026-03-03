import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AdminServiceContractDeatilsCard from "../service-contract-details/card";

export default function UserDetails({ data, isFetching }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const type = params.get("type");

  const isAdmin = type === "es-admin";

  const user = data?.data;
  const list = [
    {
      icon: "/assets/svg/client-detail-2.svg",
      icon_bg: "#248EA526",
      title: "Contact Person",
      label: user?.fullname || "--",
    },
    {
      icon: "/assets/svg/client-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Phone Number",
      label: user?.country_code + user?.phone_number || "--",
    },
    {
      icon: "/assets/svg/client-detail-4.svg",
      icon_bg: "#B468B926",
      title: "Email Address",
      label: user?.email || "--",
    },
    {
      icon: "/assets/svg/client-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Company Name",
      label: user?.company || "--",
    },
    {
      icon: "/assets/svg/client-detail-6.svg",
      icon_bg: "#1F98B226",
      title: "Position",
      label: user?.position || "--",
    },
    {
      icon: "/assets/svg/client-detail-7.svg",
      icon_bg: "#248EA526",
      title: "Status",
      label: user?.is_active ? "Active" : "Inactive",
    },
  ];

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">User Details</p>
        <div className="flex items-center gap-4">
          <Button
            onClick={() =>
              navigate(
                `/create-users?id=${id}&type=${
                  isAdmin ? "es-admin" : "es-client"
                }`,
              )
            }
            className="w-[136px] bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary"
          >
            Edit Details <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {isFetching ? (
        <p className="mt-4 text-gray-500">Loading user details...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {list.map((item, index) => (
            <AdminServiceContractDeatilsCard key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
