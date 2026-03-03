import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export default function GiveAccess({ values, setValues }) {
  return (
    <div className="bg-bg_primary rounded-xl p-8 mt-5">
      <p className="text-2xl text-black font-semibold">Give Access</p>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-[#EAECEF]">
          <Checkbox
            id="access-report"
            checked={values.report_download_access}
            onCheckedChange={(checked) =>
              setValues("report_download_access", checked)
            }
          />
          <label
            htmlFor="access-report"
            className="text-sm text-text_primary font-semibold"
          >
            Access to Download Report
          </label>
        </div>

        <div className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-[#EAECEF]">
          <Checkbox
            id="access-service"
            checked={values.service_contract_download_access}
            onCheckedChange={(checked) =>
              setValues("service_contract_download_access", checked)
            }
          />
          <label
            htmlFor="access-service"
            className="text-sm text-text_primary font-semibold"
          >
            Access to Service Contract Document
          </label>
        </div>
      </div>
    </div>
  );
}
