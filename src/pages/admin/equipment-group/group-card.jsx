import { CalendarPicker } from "@/components/ui/calendar-picker";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetAllBrandQuery } from "@/redux/services/brand-api";
import React, { useEffect } from "react";

const GroupCard = ({
  values,
  setFieldValue,
  handleChange,
  groupIndex,
  equipmentIndex,
  errors,
  handleBlur,
  disabled = false,
  serviceContract,
  onBoarding = false,
}) => {
  const group = values;
  const { data } = useGetAllBrandQuery({});

  const brands = data?.data?.brands ?? [];

  const brandOptions = brands.map((brand) => ({
    label: brand.brand_name,
    value: brand.id,
  }));

  useEffect(() => {
    if (serviceContract) {
      setFieldValue(
        `groups[${groupIndex}].equipments[${equipmentIndex}].brand_id`,
        serviceContract?.service_api_credentials?.brand_id,
      );
    }
  }, [serviceContract]);

  useEffect(() => {
    if (group?.year_of_installation && group?.equipment_life) {
      const next_modernization_date =
        group?.year_of_installation + group?.equipment_life;
      setFieldValue(
        `groups[${groupIndex}].equipments[${equipmentIndex}].next_modernization_date`,
        next_modernization_date,
      );
    }
  }, [group?.year_of_installation, group?.equipment_life]);

  return (
    <div className="col-span-12">
      <div className="grid grid-cols-12 gap-4">
        <SelectorWithObjects
          options={brandOptions}
          placeholder="Brand Name"
          label="Select Brand"
          value={group?.brand_id}
          onChange={(val) =>
            setFieldValue(
              `groups[${groupIndex}].equipments[${equipmentIndex}].brand_id`,
              val,
            )
          }
          parentClassName={"col-span-4 !bg-bg_primary border border-[#EAECEF]"}
          onBlur={handleBlur}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]?.brand_id
          }
          disabled={!onBoarding}
          required
        />

        <InputField
          label="Model Number"
          placeholder="Enter model number"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].model_number`}
          value={group?.model_number}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.model_number
          }
          required
        />

        <InputField
          label="ES Pulse Equipment Number"
          placeholder="Enter es pulse equipment number"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].es_pulse_equipment_number`}
          value={group?.es_pulse_equipment_number}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.es_pulse_equipment_number
          }
          required
        />

        <InputField
          label="OEM / Service Equipment Number"
          placeholder="Enter oem / service equipment number"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].oem_service_equipment_number`}
          value={group?.oem_service_equipment_number}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.oem_service_equipment_number
          }
          required
        />

        <InputField
          label="Client Equipment Number"
          placeholder="Enter client equipment number"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].client_equipment_number`}
          value={group?.client_equipment_number}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.client_equipment_number
          }
          required
        />

        <InputField
          label="Design Code"
          placeholder="Enter design code"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].design_code`}
          value={group?.design_code}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.design_code
          }
          required
        />

        <InputField
          label="Year of Installation"
          placeholder="Enter year of installation"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].year_of_installation`}
          value={group?.year_of_installation}
          onChange={handleChange}
          type="number"
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.year_of_installation
          }
          required
        />

        <InputField
          label="Equipment Life"
          type="number"
          placeholder="Enter equipment life"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].equipment_life`}
          value={group?.equipment_life}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.equipment_life
          }
          required
        />

        <InputField
          label="Last Modernization Parts"
          placeholder="Enter last modernization parts"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].last_modernization_parts`}
          value={group?.last_modernization_parts}
          onChange={handleChange}
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.last_modernization_parts
          }
        />

        <CalendarPicker
          label="Plant Registration Date"
          required
          placeholder="Enter Plant Registration date"
          parentClassName={"col-span-4 !bg-bg_primary border border-[#EAECEF]"}
          triggerClassName={"bg-transparent"}
          value={group?.plant_registration_date || ""}
          onChange={(val) => {
            if (val && !isNaN(new Date(val).getTime())) {
              setFieldValue(
                `groups[${groupIndex}].equipments[${equipmentIndex}].plant_registration_date`,
                val,
              );
            } else {
              setFieldValue(
                `groups[${groupIndex}].equipments[${equipmentIndex}].plant_registration_date`,
                null,
              );
            }
          }}
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.plant_registration_date
          }
          noDate
        />

        <InputField
          label="Next Modernization Date"
          className={{
            Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
          }}
          type="number"
          name={`groups[${groupIndex}].equipments[${equipmentIndex}].next_modernization_date`}
          value={group?.next_modernization_date}
          onChange={handleChange}
          placeholder="Enter next modernization date"
          disabled
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.next_modernization_date
          }
          required
        />

        <CalendarPicker
          label="Last Modernization Date"
          parentClassName={"col-span-4 !bg-bg_primary border border-[#EAECEF]"}
          triggerClassName={"bg-transparent"}
          value={group?.last_modernization_date}
          onChange={(val) => {
            if (val && !isNaN(new Date(val).getTime())) {
              setFieldValue(
                `groups[${groupIndex}].equipments[${equipmentIndex}].last_modernization_date`,
                val,
              );
            } else {
              setFieldValue(
                `groups[${groupIndex}].equipments[${equipmentIndex}].last_modernization_date`,
                null,
              );
            }
          }}
          placeholder="Enter last modernization date"
          disabled={disabled}
          error={
            errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
              ?.last_modernization_date
          }
        />
      </div>
    </div>
  );
};

export default GroupCard;
