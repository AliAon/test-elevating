import ClientDetails from "@/components/admin/service-contract-details/client-details";
import KpiParameters from "@/components/admin/service-contract-details/kpi-parameters";
import LevelConfiguration from "@/components/admin/service-contract-details/level-configuration";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Terms } from "@/pages/contract-details";
import { useGetContractByIdQuery } from "@/redux/services/contract";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminServiceContractsDetails() {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { data } = useGetContractByIdQuery(id);
  const contract = data?.data;
  const pdfUrl = data?.data?.contract_terms_file_key;

  const downloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const list = [
    {
      item: "Service Contracts",
      link: "/admin/service-contracts",
    },
    {
      item: `Service Contracts Details`,
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={list} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl text-text_primary font-semibold">
            {contract?.contract_name}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-text_secondary font-medium">
              ID. {contract?.contract_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-sm text-text_primary font-semibold">
              {dayjs(contract?.start_date).format("MMM DD, YYYY")}{" "}
              <span className="text-text_secondary">to</span>{" "}
              {dayjs(contract?.end_date).format("MMM DD, YYYY")}
            </p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <p className="text-sm text-text_secondary font-medium">
                {contract?.days_remaining} Days left
              </p>
              <p className="bg-[#248EA5] rounded-full text-sm text-white font-medium px-3 py-1">
                Active
              </p>
            </div>
          </div>
          <div className="w-[1px] h-12 bg-[#EAECEF]" />
          <Button
            className="w-[162px] h-11 rounded-full font-semibold"
            onClick={downloadPdf}
          >
            <Download size={16} />
            Contract Terms
          </Button>
        </div>
      </div>
      <Terms open={open} setOpen={setOpen} />
      <ClientDetails contract={contract} />
      <KpiParameters contract={contract} />
      <LevelConfiguration contract={contract} />
    </div>
  );
}
