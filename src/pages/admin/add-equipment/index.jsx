import EquipmentDetails from "@/components/admin/add-equipment/equipment-details";
import EquipmentSpecification from "@/components/admin/add-equipment/equipment-specification";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { InputFieldSkeleton } from "@/components/ui/input-field";
import { tabs } from "@/helpers/constant";
import { useGetAllBrandQuery } from "@/redux/services/brand-api";
import {
  useAddEquipmentMutation,
  useGetEquipmentByIdQuery,
  useGetGroupByIdQuery,
  useUpdateEquipmentMutation,
} from "@/redux/services/groups";
import { useGetServiceContractByIdQuery } from "@/redux/services/service-contracts";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const validationSchema = Yup.object({
  equipment_name: Yup.string().required("Equipment name is required"),
  equipment_type: Yup.string().required("Equipment type is required"),
  brand_id: Yup.string().required("Brand is required"),
  es_pulse_equipment_number: Yup.string().required(
    "ES Pulse equipment number is required",
  ),
  oem_service_equipment_number: Yup.string().required(
    "Oem Service number is required",
  ),
  client_equipment_number: Yup.string().required(
    "Client Equipment number is required",
  ),
  model_number: Yup.string().required("Model number is required"),
  design_code: Yup.string().required("String is required"),
  year_of_installation: Yup.string().required(
    "Year of installation is required",
  ),
  plant_registration_date: Yup.string().required(
    "Plant registration date is required",
  ),
  equipment_life: Yup.string().required("Equipment life is required"),
});

export default function AddEquipment() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const group_id = searchParams.get("group_id");
  const equipment_id = searchParams.get("equipment_id");
  const [creatingEquipment, { isLoading }] = useAddEquipmentMutation();
  const [UpdatingEquipment, { isLoading: isUpdating }] =
    useUpdateEquipmentMutation();
  const navigate = useNavigate();

  const { data: groupData } = useGetGroupByIdQuery(group_id, {
    skip: !group_id,
  });

  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrandQuery({});
  const { data: serviceContract } = useGetServiceContractByIdQuery(
    groupData?.data?.service_contract_id,
    { skip: !groupData?.data?.service_contract_id },
  );

  const { data, isLoading: isLoadingEquipment } = useGetEquipmentByIdQuery(
    equipment_id,
    { skip: !equipment_id },
  );

  const active = tabs[activeIndex].key;

  const handleNext = () => {
    if (activeIndex < tabs.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const formik = useFormik({
    initialValues: {
      client_id: data?.data?.client_id || groupData?.data?.client_id || "",
      building_id:
        groupData?.data?.building_id || data?.data?.building_id || "",
      group_id: groupData?.data?.id || data?.data?.group_id || "",
      equipment_type:
        data?.data?.equipment_type?.toLowerCase() || "elevator",
      brand_id:
        serviceContract?.data?.service_api_credentials?.brand_id ||
        groupData?.data?.brand_id ||
        data?.data?.brand_id ||
        "",
      equipment_name: data?.data?.equipment_name || "",
      model_number: data?.data?.model_number || "",
      es_pulse_equipment_number: data?.data?.es_pulse_equipment_number || "",
      oem_service_equipment_number:
        data?.data?.oem_service_equipment_number || "",
      manufacturer: data?.data?.manufacturer || "",
      client_equipment_number: data?.data?.client_equipment_number || "",
      design_code: data?.data?.design_code || "",
      year_of_installation: data?.data?.year_of_installation || "",
      last_modernization_date: data?.data?.last_modernization_date || "",
      last_modernization_parts: data?.data?.last_modernization_parts || "",
      equipment_life: data?.data?.equipment_life || "",
      next_modernization_date: data?.data?.next_modernization_date || "",
      plant_registration_date: data?.data?.plant_registration_date || "",

      specification: {
        design_type: data?.data?.specification?.design_type || "",
        speed: data?.data?.specification?.speed || "",
        height: data?.data?.specification?.height || "",
        width: data?.data?.specification?.width || "",
        floor_from: data?.data?.specification?.floor_from || "",
        floor_to: data?.data?.specification?.floor_to || "",
        controller_model: data?.data?.specification?.controller_model || "",
        drive_model: data?.data?.specification?.drive_model || "",
        inclination: data?.data?.specification?.inclination || "",
        function_type: data?.data?.specification?.function_type || "",
        max_load: data?.data?.specification?.max_load || "",
        stops: data?.data?.specification?.stops || "",
        length: data?.data?.specification?.length || "",
        suspension_type: data?.data?.specification?.suspension_type || "",
        door_controller_brand:
          data?.data?.specification?.door_controller_brand || "",
        door_controller_model:
          data?.data?.specification?.door_controller_model || "",
        in_car_media_brand: data?.data?.specification?.in_car_media_brand || "",
        in_car_media_model: data?.data?.specification?.in_car_media_model || "",
        travel: data?.data?.specification?.travel || "",
      },
      capital_budget: {
        recomended_replacement_year:
          data?.data?.capital_budget?.recomended_replacement_year,
      },
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const escaltor =
        values?.equipment_type.toLowerCase() === "escalator" ||
        values?.equipment_type.toLowerCase() === "moving walk" ||
        values?.equipment_type.toLowerCase() === "platform";

      const escaltorValues = {
        client_id: values?.client_id,
        building_id: values?.building_id,
        group_id: values?.group_id,
        equipment_type: values?.equipment_type.toUpperCase(),
        brand_id: values?.brand_id,
        equipment_name: values?.equipment_name,
        model_number: values?.model_number,
        es_pulse_equipment_number: values?.es_pulse_equipment_number,
        oem_service_equipment_number: values?.oem_service_equipment_number,
        client_equipment_number: values?.client_equipment_number,
        design_code: values?.design_code,
        year_of_installation: Number(values?.year_of_installation),
        last_modernization_date:
          values?.last_modernization_date &&
          dayjs(values?.last_modernization_date).isValid()
            ? dayjs(values?.last_modernization_date).format("YYYY-MM-DD")
            : null,
        plant_registration_date:
          values?.plant_registration_date &&
          dayjs(values?.plant_registration_date).isValid()
            ? dayjs(values?.plant_registration_date).format("YYYY-MM-DD")
            : null,
        last_modernization_parts: values?.last_modernization_parts,
        equipment_life: Number(values?.equipment_life),
        next_modernization_date: dayjs(values?.next_modernization_date).format(
          "YYYY-MM-DD",
        ),

        specification: {
          design_type: values?.specification.design_type,
          speed: Number(values?.specification.speed),
          height: Number(values?.specification.height),
          width: Number(values?.specification.width),
          floor_from: Number(values?.specification.floor_from),
          floor_to: Number(values?.specification.floor_to),
          controller_model: values?.specification.controller_model,
          drive_model: values?.specification.drive_model,
          inclination: Number(values?.specification.inclination),
        },
        capital_budget: {
          recomended_replacement_year: Number(
            values.capital_budget.recomended_replacement_year,
          ),
        },
      };

      const elevatorValues = {
        client_id: values?.client_id,
        building_id: values?.building_id,
        group_id: values?.group_id,
        equipment_type: values?.equipment_type.toUpperCase(),
        brand_id: values?.brand_id,
        equipment_name: values?.equipment_name,
        model_number: values?.model_number,
        es_pulse_equipment_number: values?.es_pulse_equipment_number,
        oem_service_equipment_number: values?.oem_service_equipment_number,
        client_equipment_number: values?.client_equipment_number,
        design_code: values?.design_code,
        year_of_installation: Number(values?.year_of_installation),
        last_modernization_date:
          values?.last_modernization_date &&
          dayjs(values?.last_modernization_date).isValid()
            ? dayjs(values?.last_modernization_date).format("YYYY-MM-DD")
            : null,
        plant_registration_date:
          values?.plant_registration_date &&
          dayjs(values?.plant_registration_date).isValid()
            ? dayjs(values?.plant_registration_date).format("YYYY-MM-DD")
            : null,
        last_modernization_parts: values?.last_modernization_parts,
        equipment_life: Number(values?.equipment_life),
        next_modernization_date: dayjs(values?.next_modernization_date).format(
          "YYYY-MM-DD",
        ),

        specification: {
          design_type: values?.specification.design_type,
          speed: Number(values?.specification.speed),
          height: Number(values?.specification.height),
          width: Number(values?.specification.width),
          floor_from: Number(values?.specification.floor_from),
          floor_to: Number(values?.specification.floor_to),
          controller_model: values?.specification.controller_model,
          drive_model: values?.specification.drive_model,
          function_type: values?.specification.function_type,
          max_load: Number(values?.specification.max_load),
          stops: Number(values?.specification.stops),
          length: Number(values?.specification.length),
          suspension_type: values?.specification.suspension_type,
          door_controller_brand: values?.specification.door_controller_brand,
          door_controller_model: values?.specification.door_controller_model,
          in_car_media_brand: values?.specification.in_car_media_brand,
          in_car_media_model: values?.specification.in_car_media_model,
          travel: Number(values?.specification?.travel),
        },
        capital_budget: {
          recomended_replacement_year: Number(
            values.capital_budget.recomended_replacement_year,
          ),
        },
      };

      if (equipment_id) {
        UpdatingEquipment({
          id: equipment_id,
          body: escaltor ? escaltorValues : elevatorValues,
        })
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Equipment Updated successfully");
            navigate(`/admin/equipment-details/${equipment_id}`);
          })
          .catch((err) => {
            toast.error(err?.data?.message || "Something went wrong");
          });
      } else {
        creatingEquipment(escaltor ? escaltorValues : elevatorValues)
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Equipment created successfully");
            navigate("/admin/groups");
          })
          .catch((err) => {
            toast.error(err?.data?.message || "Something went wrong");
          });
      }
    },
  });

  const formikMap = {
    values: formik.values,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    setFieldValue: formik.setFieldValue,
    errors: formik.errors,
    touched: formik.touched,
  };

  if (isLoadingEquipment) {
    return (
      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <div className="space-y-3 mt-4">
          <InputFieldSkeleton />
          <InputFieldSkeleton />
          <InputFieldSkeleton />
          <InputFieldSkeleton />
          <div className="grid grid-cols-2 gap-3">
            <InputFieldSkeleton />
            <InputFieldSkeleton />
            <InputFieldSkeleton />
            <InputFieldSkeleton />
          </div>

          <InputFieldSkeleton />

          <div className="grid grid-cols-3 gap-3">
            <InputFieldSkeleton />
            <InputFieldSkeleton />
            <InputFieldSkeleton />
            <InputFieldSkeleton />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <InputFieldSkeleton />
            <InputFieldSkeleton />
            <InputFieldSkeleton />
            <InputFieldSkeleton />
          </div>
        </div>
      </div>
    );
  }
  const equipmentlist = [
    {
      item: "Group List",
      link: "/admin/groups",
    },
    {
      item: `Group Detail`,
      link: "#",
    },
    {
      item: `${equipment_id ? "Update" : "Add"} Equipment`,
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={equipmentlist} />

      <p className="text-3xl text-text_primary font-semibold">
        {equipment_id ? "Update" : "Add"} Equipment
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter your Equipment Details below to {equipment_id ? "update" : "add"}
      </p>

      <div className="w-fit h-13 flex items-center rounded-2xl bg-bg_primary p-1 mt-5">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
              activeIndex === index
                ? "bg-white text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div>
        {active === "equipment-details" && (
          <EquipmentDetails
            {...formikMap}
            // groups={groups}
            brands={brands}
            // buildings={buildings}
            // isLoadingGroups={isLoadingGroups}
            isLoadingBrands={isLoadingBrands}
            // isLoadingBuildings={isLoadingBuildings}
          />
        )}
        {active === "equipment-specification" && (
          <EquipmentSpecification {...formikMap} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          type="button"
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={handleBack}
          disabled={activeIndex === 0}
        >
          Back
        </Button>

        <Button
          type="button"
          disabled={
            isLoading || isUpdating || formik.values.equipment_type === ""
          }
          className="w-[98px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={async () => {
            if (activeIndex === 0) {
              const errors = await formik.validateForm();
              if (Object.keys(errors).length === 0) {
                handleNext();
              } else {
                formik.setTouched(
                  Object.keys(errors).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                  }, {}),
                  true,
                );
              }
            } else {
              formik.handleSubmit();
            }
          }}
        >
          {isLoading || isUpdating ? (
            <Loader />
          ) : activeIndex === 0 ? (
            "Next"
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}
