import BasicDetails from "@/components/admin/service-contract-update/basic-details";
import KpiConfig from "@/components/admin/service-contract-update/kpi-config";
import LevelConfig2 from "@/components/admin/service-contract-update/leve-config-2";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { getInitialValues } from "@/helpers/constant";
import { convertToFormData, normalizeContractValues } from "@/helpers/contract";
import { cn } from "@/lib/utils";
import {
  useCreateContractMutation,
  useGetContractByIdQuery,
  useUpdateContractMutation,
} from "@/redux/services/contract";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const tabs = [
  {
    key: "contract-details",
    title: "Contract Details",
  },
  {
    key: "kpi-config",
    title: "KPI Config",
  },
  {
    key: "level-config",
    title: "Level Config",
  },
];

export default function AdminServiceContractUpdate() {
  const [params] = useSearchParams();
  const contract_id = params.get("contract_id");
  const [active, setActive] = useState(tabs[0].key);
  const navigate = useNavigate();
  const [createContract, { isLoading }] = useCreateContractMutation();
  const [updateContract, { isLoading: updateLoading }] =
    useUpdateContractMutation();
  const { data } = useGetContractByIdQuery(contract_id, { skip: !contract_id });

  const contract = data?.data;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(contract),
    onSubmit: (values) => {
      const normalized = normalizeContractValues(values);
      const formData = convertToFormData(normalized);

      if (contract_id) {
        updateContract({ id: contract_id, formData })
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Contract updated successfully");
            navigate(`/admin/services-contracts-details/${contract_id}`);
          })
          .catch((err) => {
            toast.error(err?.data?.message || "Something went wrong");
          });
      } else {
        createContract(formData)
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Contract created successfully");
            navigate("/admin/service-contracts");
          })
          .catch((err) => {
            toast.error(err?.data?.message || "Something went wrong");
          });
      }
    },
  });

  const formikProps = {
    values: formik.values,
    setFieldValue: formik.setFieldValue,
    errors: formik.errors,
    touched: formik.touched,
    handleChange: formik.handleChange,
    contract: contract,
  };

  const handleClick = (key) => {
    setActive(key);
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.key === active);
    if (currentIndex < tabs.length - 1) {
      setActive(tabs[currentIndex + 1].key);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.key === active);
    if (currentIndex > 0) {
      setActive(tabs[currentIndex - 1].key);
    }
  };
  const list = [
    {
      item: "Service Contracts",
      link: "/admin/services-contracts-details/",
    },
    {
      item: `${contract_id ? "Update" : "Add"} Service Contract`,
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={list} />

      <p className="text-3xl text-text_primary font-semibold">
        {contract_id ? "Update" : "Add"} Service Contract
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter your Service Contract below to {contract_id ? "update" : "add"}
      </p>

      <div className="w-[450px] h-13 grid grid-cols-3 rounded-2xl bg-bg_primary p-1 mt-5">
        {tabs.map((tab) => (
          <button
            onClick={() => handleClick(tab.key)}
            key={tab.key}
            className={`h-full text-sm font-medium cursor-pointer rounded-xl ${
              active === tab.key
                ? "bg-white text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        {active === "contract-details" && <BasicDetails {...formikProps} />}
        {active === "kpi-config" && <KpiConfig {...formikProps} />}
        {active === "level-config" && (
          <LevelConfig2
            values={formik.values}
            setValues={formik.setFieldValue}
          />
        )}
      </div>
      <div className="flex items-center justify-between mt-5">
        <Button
          className={cn(
            "w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold",
            active === "contract-details" && "invisible",
          )}
          onClick={handleBack}
        >
          {active === "contract-details" ? "Close and Save" : "Back"}
        </Button>
        <Button
          className={`h-12 rounded-full font-semibold ${
            active === "level-config" ? "w-[167px]" : "w-[98px]"
          }`}
          type="submit"
          onClick={() => {
            if (active === "level-config") {
              formik.handleSubmit();
            } else {
              handleNext();
            }
          }}
        >
          {isLoading || updateLoading ? (
            <Loader />
          ) : active === "level-config" ? (
            "Save Contract"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}
