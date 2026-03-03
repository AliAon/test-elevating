import { CalendarPicker } from "@/components/ui/calendar-picker";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { equipmentTypeOptions } from "@/helpers/constant";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function EquipmentDetails({
  values,
  setFieldValue,
  handleChange,
  brands,
  errors,
}) {
  const [searchParams] = useSearchParams();

  const equipmentId = searchParams.get("equipment_id");

  const brandOptions = brands?.data?.brands?.map((brand) => ({
    label: brand.brand_name,
    value: brand.id,
  }));

  const { data: clients } = useGetAllClientsQuery({});

  const options = clients?.data?.map((client) => ({
    value: client.client_id,
    label: client.client_name,
  }));
  useEffect(() => {
    const year = Number(values?.year_of_installation);
    const life = Number(values?.equipment_life);

    if (!year || !life) {
      setFieldValue("next_modernization_date", "");
      return;
    }

    // Add equipment life to installation year
    const modernizationYear = year + life;

    // Create date (you can change month/day if needed)
    const modernizationDate = `${modernizationYear}-01-01`;

    setFieldValue("next_modernization_date", modernizationDate);
    setFieldValue(
      "capital_budget.recomended_replacement_year",
      modernizationYear,
    );
  }, [values.year_of_installation, values.equipment_life]);
  return (
    <div className="bg-bg_primary rounded-xl p-8 mt-5">
      <p className="text-2xl text-black font-semibold">Details of Equipment</p>

      <div className="space-y-3 mt-4">
        {equipmentId ? null : (
          <SelectorWithObjects
            label={"Choose a Client"}
            placeholder="Select Client"
            options={options}
            value={values?.client_id}
            onChange={(value) => setFieldValue("client_id", value)}
            error={errors.client_id}
          />
        )}
        
        <div className="grid grid-cols-2 gap-3">
        <SelectorWithObjects
          label="Equipment Type"
          placeholder="Select Equipment Type"
          options={equipmentTypeOptions}
          value={
            values?.equipment_type
              ? values.equipment_type.toUpperCase()
              : "ELEVATOR"
          }
          onChange={(selectedOption) => {
            setFieldValue(
              "equipment_type",
              selectedOption ? selectedOption.toLowerCase() : "",
            );
          }}
          error={errors.equipment_type}
        />
        <SelectorWithObjects
          label="Brand"
          placeholder="Select Brand Type"
          options={brandOptions}
          value={values?.brand_id || ""}
          onChange={(selectedOption) => {
            setFieldValue("brand_id", selectedOption || "");
          }}
          disabled={true}
          error={errors.brand_id}
        />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={"Equipment Name"}
            placeholder={"KONE MonoSpace® 500 DX"}
            name={`equipment_name`}
            value={values?.equipment_name || ""}
            onChange={handleChange}
            error={errors.equipment_name}
          />
          <InputField
            label={"Model Number"}
            placeholder={"EN 81-20 / EN 81-50"}
            name={`model_number`}
            value={values?.model_number || ""}
            onChange={handleChange}
            error={errors.model_number}
          />
          <InputField
            label={"ES Pulse Equipment Number"}
            placeholder={"ES 81-50"}
            name={`es_pulse_equipment_number`}
            value={values?.es_pulse_equipment_number || ""}
            onChange={handleChange}
            error={errors.es_pulse_equipment_number}
          />
          <InputField
            label={"OEM/Service Equipment Number"}
            placeholder={"OEM 81-50"}
            name={"oem_service_equipment_number"}
            value={values?.oem_service_equipment_number || ""}
            onChange={handleChange}
            error={errors.oem_service_equipment_number}
          />
        </div>
        <InputField
          label={"Client Equipment Number"}
          placeholder={"Contract #1"}
          name={"client_equipment_number"}
          value={values?.client_equipment_number || ""}
          onChange={handleChange}
          error={errors.client_equipment_number}
        />
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={"Design Code"}
            placeholder={"ASME BPVC"}
            name={"design_code"}
            value={values?.design_code || ""}
            onChange={handleChange}
            error={errors.design_code}
          />

          <InputField
            label={"Year of Installation"}
            placeholder={"2024"}
            name={"year_of_installation"}
            value={values?.year_of_installation || ""}
            onChange={handleChange}
            error={errors.year_of_installation}
          />
        </div>

        <div className="grid grid-cols-4 gap-3">
          <CalendarPicker
            label={"Last Modernization Date"}
            placeholder="05-08-2025"
            value={values?.last_modernization_date}
            onChange={(val) => {
              if (val && !isNaN(new Date(val).getTime())) {
                setFieldValue(`last_modernization_date`, val);
              } else {
                setFieldValue(`last_modernization_date`, null);
              }
            }}
            error={errors.last_modernization_date}
          />
          <CalendarPicker
            label="Plant Registration Date"
            placeholder="Enter Plant Registration date"
            required
            value={values?.plant_registration_date || ""}
            onChange={(val) => {
              if (val && !isNaN(new Date(val).getTime())) {
                setFieldValue("plant_registration_date", val);
              } else {
                setFieldValue("plant_registration_date", null);
              }
            }}
            error={errors.plant_registration_date}
            noDate
          />

          <InputField
            label={"Last Modernized Parts"}
            placeholder={"Kone"}
            name={"last_modernization_parts"}
            value={values?.last_modernization_parts || ""}
            onChange={handleChange}
            error={errors.last_modernization_parts}
          />
          <InputField
            label={"Equipment Life"}
            placeholder={"14 Years"}
            name={"equipment_life"}
            value={values?.equipment_life || ""}
            onChange={handleChange}
            error={errors.equipment_life}
          />
          <CalendarPicker
            label={"Next Modernization Date"}
            placeholder="05-08-2025"
            value={values?.next_modernization_date}
            onChange={(val) => setFieldValue(`next_modernization_date`, val)}
            error={errors.next_modernization_date}
          />
        </div>
      </div>
    </div>
  );
}
