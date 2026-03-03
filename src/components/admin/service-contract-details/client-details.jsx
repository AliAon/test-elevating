import { Button } from "@/components/ui/button";
import { useGetClientByIdQuery } from "@/redux/services/admin-client";
import dayjs from "dayjs";
import { ChevronRight, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminServiceContractDeatilsCard from "./card";
import {
  useUploadCallbacksCsvMutation,
  useUploadMaintenanceCsvMutation,
} from "@/redux/services/call-backs-api";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function ClientDetails({ contract }) {
  const navigate = useNavigate();
  const { data, isLoading } = useGetClientByIdQuery(contract?.client_id, {
    skip: !contract?.client_id,
  });
  const [uploadCallbacksCsv, { isLoading: isUploading }] =
    useUploadCallbacksCsvMutation();
  const [uploadMaintenanceCsv, { isLoading: isUploadingMaintenance }] =
    useUploadMaintenanceCsvMutation();
  const fileInputRef = useRef(null);
  const file2InputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // open file picker
  };

  const handleMaintainceButtonClick = () => {
    file2InputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // backend key name

    try {
      await uploadCallbacksCsv({
        contractId: contract?.contract_id,
        formData,
      })
        .unwrap()
        .then((res) => {
          toast.success(res?.message || "CSV uploaded successfully");
        });
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  if (!contract || isLoading) return null;

  const list = [
    {
      icon: "/assets/svg/service-detail-1.svg",
      icon_bg: "#1F98B226",
      title: "Contract Name",
      label: contract?.contract_name,
    },
    {
      icon: "/assets/svg/service-detail-2.svg",
      icon_bg: "#248EA526",
      title: "Contract ID",
      label: contract?.contract_number,
    },
    {
      icon: "/assets/svg/service-detail-3.svg",
      icon_bg: "#C2285A26",
      title: "Linked ES Subscription",
      label: contract?.es_subscription_name || "—",
    },
    {
      icon: "/assets/svg/service-detail-4.svg",
      icon_bg: "#B468B926",
      title: "Contact Owner",
      label: contract?.client_name || "—",
    },
    {
      icon: "/assets/svg/service-detail-5.svg",
      icon_bg: "#F06B3C26",
      title: "Service Provider Name",
      label: contract?.service_provider_details?.service_provider_name,
    },
    {
      icon: "/assets/svg/service-detail-6.svg",
      icon_bg: "#1F98B226",
      title: "Service Provider Contact Person",
      label: contract?.service_provider_details?.contact_person_name,
    },
    {
      icon: "/assets/svg/service-detail-7.svg",
      icon_bg: "#248EA526",
      title: "Service Provider Contact Number",
      label: contract?.service_provider_details?.phone_no,
    },
    {
      icon: "/assets/svg/service-detail-8.svg",
      icon_bg: "#C2285A26",
      title: "Service Provider Contact Email",
      label: contract?.service_provider_details?.email,
    },
    {
      icon: "/assets/svg/service-detail-9.svg",
      icon_bg: "#B468B926",
      title: "Contract Price",
      label: "$" + contract?.plan_and_pricing?.contract_price,
    },
    {
      icon: "/assets/svg/service-detail-10.svg",
      icon_bg: "#F06B3C26",
      title: "Contract Type",
      label: contract?.plan_and_pricing?.contract_type,
    },
    {
      icon: "/assets/svg/service-detail-12.svg",
      icon_bg: "#1F98B226",
      title: "Next Fee Adjustment Date",
      label: dayjs(contract?.plan_and_pricing?.next_fee_adjustment_date).format(
        "DD-MM-YYYY",
      ),
    },
    {
      icon: "/assets/svg/service-detail-13.svg",
      icon_bg: "#248EA526",
      title: "Next Fee Adjustment Rate (%)",
      label: contract?.plan_and_pricing?.next_fee_adjustment_rate + "%",
    },
  ];

  const handleMaintanceFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadMaintenanceCsv({
        contractId: contract?.contract_id,
        formData,
      })
        .unwrap()
        .then((res) => {
          toast.success(
            res?.message || "Maintenance CSV uploaded successfully",
          );
          // ✅ reset input
          if (file2InputRef.current) {
            file2InputRef.current.value = null;
          }
        });
    } catch (error) {
      console.error("Maintenance upload failed", error);
    }
  };
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Client Details</p>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate(
                `/admin/services-contracts-update?contract_id=${contract?.contract_id}`,
              )
            }
            className="w-[136px] bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary"
          >
            Edit Details <ChevronRight size={16} />
          </Button>
          {/* Hidden File Input */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Button */}
          <Button
            onClick={handleButtonClick}
            className="w-fit bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary"
          >
            {isUploading ? <Loader /> : "Upload Callbacks"}
            <ChevronRight size={16} />
          </Button>

          {/* Hidden CSV Input */}
          <input
            type="file"
            accept=".csv"
            ref={file2InputRef}
            className="hidden"
            onChange={handleMaintanceFileChange}
          />

          {/* Button */}
          <Button
            onClick={handleMaintainceButtonClick}
            className="w-fit bg-[#EAECEF] h-11 rounded-full text-sm font-semibold text-text_primary"
          >
            {isUploadingMaintenance ? <Loader /> : "Upload Maintenance"}
            <ChevronRight size={16} />
          </Button>
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
