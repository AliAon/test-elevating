import BasicDetails from "@/components/admin/service-contract-update/basic-details";
import KpiConfig from "@/components/admin/service-contract-update/kpi-config";
import LevelConfig2 from "@/components/admin/service-contract-update/leve-config-2";
import { Button } from "@/components/ui/button";
import { convertToFormData, normalizeContractValues } from "@/helpers/contract";
import {
  useCreateContractMutation,
  useGetContractByIdQuery,
  useUpdateContractMutation,
} from "@/redux/services/contract";
import { useUpdateGroupMutation } from "@/redux/services/groups";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

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

const validationSchema = Yup.object({
  contract_number: Yup.string().required("Contract number is required"),
  contract_name: Yup.string().required("Contract name is required"),
  start_date: Yup.string().required("Start date is required"),
  end_date: Yup.string().required("End date is required"),
  plan_and_pricing: Yup.object({
    contract_type: Yup.string().required("Contract type is required"),
    contract_price: Yup.string().required("Contract price is required"),
  }),
  service_api_credentials: Yup.object({
    brand_id: Yup.string().required("Brand is required"),
    country_code: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) => schema.required("Country code is required"),
      otherwise: (schema) => schema,
    }),
    customer_id: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) => schema.required("Customer ID is required"),
      otherwise: (schema) => schema,
    }),
    contract_no: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) => schema.required("Contract no is required"),
      otherwise: (schema) => schema,
    }),
    subscription_key: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) => schema.required("Subscription key is required"),
      otherwise: (schema) => schema,
    }),
    repair_subscription_key: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) => schema.required("Repair subscription key is required"),
      otherwise: (schema) => schema,
    }),
    maintainance_subscription_key: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) =>
        schema.required("Maintainance subscription key is required"),
      otherwise: (schema) => schema,
    }),
    callback_subscription_key: Yup.string().when("brand_id", {
      is: "OTIS",
      then: (schema) =>
        schema.required("Callback subscription key is required"),
      otherwise: (schema) => schema,
    }),
  }),
  contract_kpis: Yup.object({
    maintenance_visit_per_equipment: Yup.string().required(
      "Maintenance visit per equipment is required",
    ),
    annual_safety_test_report: Yup.string().required(
      "Annual safety test report is required",
    ),
    rate_of_breakdown: Yup.string().required("Rate of breakdown is required"),
  }),

  equipment_kpis: Yup.object({
    annual_man_trapped_event: Yup.string().required(
      "Annual man trapped event is required",
    ),
    equipment_availability_target: Yup.string().required(
      "Equipment availability target is required",
    ),
  }),
  business_hours_response_time: Yup.object({
    entrapment: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    criticalEquipmentStopped: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    nonCriticalEquipmentStopped: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    operationalIntermittentFaults: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    nonOperationalOrAestheticFaults: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
  }),
  after_hours_response_time: Yup.object({
    entrapment: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    criticalEquipmentStopped: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    nonCriticalEquipmentStopped: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    operationalIntermittentFaults: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
    nonOperationalOrAestheticFaults: Yup.object({
      attendance_next_business_day: Yup.string().required(
        "Attendance next business day is required",
      ),
      hours: Yup.string().required("Hours is required"),
    }),
  }),
});

export default function ServiceContract({ handleBack }) {
  const [params, searchParams] = useSearchParams();
  const contract_id = params.get("contract_id");
  const buildingId = params.get("uuid");
  const clientId = params.get("clientId");
  const groupId = params.get("groupId");
  const subscriptionId = params.get("subscriptionId");
  const [active, setActive] = useState(tabs[0].key);
  const navigate = useNavigate();
  const [createContract, { isLoading }] = useCreateContractMutation();
  const [updateContract, { isLoading: updateLoading }] =
    useUpdateContractMutation();
  const [updatingGroup] = useUpdateGroupMutation();
  const { data } = useGetContractByIdQuery(contract_id, { skip: !contract_id });
  const contract = data?.data;

  const handleUpdateGroup = (contract_id) => {
    updatingGroup({
      group_id: groupId,
      es_subscription_id: subscriptionId,
      service_contract_id: contract_id,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(contract, subscriptionId, clientId),
    validationSchema,
    onSubmit: async (values) => {
      try {
        let normalized = normalizeContractValues(values);

        if (!normalized.service_provider_details?.email) {
          delete normalized.service_provider_details.email;
        }

        const formData = convertToFormData(normalized);

        if (contract_id) {
          const res = await updateContract({
            id: contract_id,
            formData,
          }).unwrap();
          toast.success(res?.message || "Contract updated successfully");

          await handleUpdateGroup(contract_id);
        } else {
          const res = await createContract(formData).unwrap();
          toast.success(res?.message || "Contract created successfully");
          const newparams = new URLSearchParams(params);
          newparams.set("contract_id", res?.data?.contract_id);
          searchParams(newparams);
          await handleUpdateGroup(res?.data?.contract_id);
        }

        navigate(`/admin/clients?clientId=${clientId}`);
      } catch (err) {
        toast.error(err?.data?.message || "Something went wrong");
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

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.key === active);
    if (currentIndex < tabs.length - 1) {
      setActive(tabs[currentIndex + 1].key);
    }
  };
  return (
    <div>
      <p className="text-3xl text-text_primary font-semibold">
        {contract_id ? "Update" : "Add"} Service Contract
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter your Service Contract below to {contract_id ? "update" : "add"}
      </p>

      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <BasicDetails {...formikProps} onBoarding />
      </div>
      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <KpiConfig {...formikProps} />
      </div>
      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <LevelConfig2 values={formik.values} setValues={formik.setFieldValue} />
      </div>
      <div className="flex items-center justify-between mt-5">
        <Button
          type="button"
          onClick={() => {
            handleBack();
            navigate(
              `/admin/onboarding-client?clientId=${clientId}&uuid=${buildingId}&subscriptionId=${subscriptionId}&groupId=${groupId}&next=false`,
              {
                replace: true,
              },
            );
          }}
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold"
        >
          Back
        </Button>
        <Button
          className={`w-[167px] h-12 rounded-full font-semibold `}
          type="submit"
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          {isLoading || updateLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Save Contract"
          )}
        </Button>
      </div>
    </div>
  );
}

export function getInitialValues(data, subscriptionId, clientId) {
  return {
    client_id: data?.client_id || clientId,
    building_ids: data?.building_ids || [],
    contract_number: data?.contract_number || "",
    contract_name: data?.contract_name || "",
    es_subscription_id: data?.es_subscription_id || subscriptionId || "",
    contractTerms: data?.contract_terms_url || [],
    client_name: data?.client_name,
    start_date: data?.start_date || "",
    end_date: data?.end_date || "",
    active: data?.active ?? "active",

    service_provider_details: {
      service_provider_name:
        data?.service_provider_details?.service_provider_name || "",
      contact_person_name:
        data?.service_provider_details?.contact_person_name || "",
      country_code: data?.service_provider_details?.country_code || "+1",
      phone_no: data?.service_provider_details?.phone_no || "",
      email: data?.service_provider_details?.email || "",
    },

    plan_and_pricing: {
      contract_type: data?.plan_and_pricing?.contract_type || "",
      next_fee_adjustment_date:
        data?.plan_and_pricing?.next_fee_adjustment_date || "",
      contract_price: data?.plan_and_pricing?.contract_price || 0,
      next_fee_adjustment_rate:
        data?.plan_and_pricing?.next_fee_adjustment_rate || 0,
    },

    service_api_credentials: {
      brand_id: data?.service_api_credentials?.brand_id || "",
      client_id: data?.service_api_credentials?.client_id || "",
      client_secret: data?.service_api_credentials?.client_secret || "",
      auth_username: data?.service_api_credentials?.auth_username || "",
      auth_password: data?.service_api_credentials?.auth_password || "",
      grant_type: data?.service_api_credentials?.grant_type || "",
      ocp_apim_subscription_key:
        data?.service_api_credentials?.ocp_apim_subscription_key || "",
      country_code: data?.service_api_credentials?.country_code || "",
      customer_id: data?.service_api_credentials?.customer_id || "",
      contract_no: data?.service_api_credentials?.contract_no || "",
      subscription_key:
        data?.service_api_credentials?.subscription_key ||
        data?.service_api_credentials?.ocp_apim_subscription_key ||
        "",
      repair_subscription_key:
        data?.service_api_credentials?.repair_subscription_key || "",
      maintainance_subscription_key:
        data?.service_api_credentials?.maintainance_subscription_key || "",
      callback_subscription_key:
        data?.service_api_credentials?.callback_subscription_key || "",
      scope: data?.service_api_credentials?.scope || "",
    },

    contract_kpis: {
      maintenance_visit_per_equipment:
        data?.contract_kpis?.maintenance_visit_per_equipment || 0,
      annual_safety_test_report:
        data?.contract_kpis?.annual_safety_test_report || 0,
      rate_of_breakdown: data?.contract_kpis?.rate_of_breakdown || 0,
      minor_response_time: data?.contract_kpis?.minor_response_time || 0,
    },

    equipment_kpis: {
      annual_man_trapped_event:
        data?.equipment_kpis?.annual_man_trapped_event || 0,
      equipment_availability_target:
        data?.equipment_kpis?.equipment_availability_target || 0,
    },

    business_hours_response_time: {
      entrapment: {
        attendance_next_business_day:
          data?.business_hours_response_time?.entrapment
            ?.attendance_next_business_day || false,
        hours: data?.business_hours_response_time?.entrapment?.hours || 0,
      },

      criticalEquipmentStopped: {
        attendance_next_business_day:
          data?.business_hours_response_time?.nonCriticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.criticalEquipmentStopped?.hours ||
          0,
      },
      nonCriticalEquipmentStopped: {
        attendance_next_business_day:
          data?.business_hours_response_time?.nonCriticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.nonCriticalEquipmentStopped
            ?.hours || 0,
      },
      operationalIntermittentFaults: {
        attendance_next_business_day:
          data?.business_hours_response_time?.operationalIntermittentFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.operationalIntermittentFaults
            ?.hours || 0,
      },
      nonOperationalOrAestheticFaults: {
        attendance_next_business_day:
          data?.business_hours_response_time?.nonOperationalOrAestheticFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.nonOperationalOrAestheticFaults
            ?.hours || 0,
      },
      required: false,
    },

    after_hours_response_time: {
      entrapment: {
        attendance_next_business_day:
          data?.after_hours_response_time?.entrapment
            ?.attendance_next_business_day || false,
        hours: data?.after_hours_response_time?.entrapment?.hours || 0,
      },
      criticalEquipmentStopped: {
        attendance_next_business_day:
          data?.after_hours_response_time?.criticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.criticalEquipmentStopped?.hours || 0,
      },
      nonCriticalEquipmentStopped: {
        attendance_next_business_day:
          data?.after_hours_response_time?.nonCriticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.nonCriticalEquipmentStopped?.hours ||
          0,
      },
      operationalIntermittentFaults: {
        attendance_next_business_day:
          data?.after_hours_response_time?.operationalIntermittentFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.operationalIntermittentFaults
            ?.hours || 0,
      },
      nonOperationalOrAestheticFaults: {
        attendance_next_business_day:
          data?.after_hours_response_time?.nonOperationalOrAestheticFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.nonOperationalOrAestheticFaults
            ?.hours || 0,
      },
    },

    level1_ids: data?.level1_ids || [],
    level2_ids: data?.level2_ids || [],
  };
}
