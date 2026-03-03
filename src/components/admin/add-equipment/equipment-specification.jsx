import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import React from "react";

export default function EquipmentSpecification({
  values,
  setFieldValue,
  handleChange,
  errors,
}) {
  const { equipment_type } = values;

  const escalator =
    equipment_type.toUpperCase() === "ESCALATOR" ||
    equipment_type.toUpperCase() === "MOVING WALK" ||
    equipment_type.toUpperCase() === "PLATFORM";
  const elevator =
    equipment_type.toUpperCase() === "ELEVATOR" ||
    equipment_type.toUpperCase() === "DUMB WAITER";

  return (
    <div className="bg-bg_primary rounded-xl p-8 mt-5">
      <p className="text-2xl text-black font-semibold">
        Specification of the Equipment
      </p>
      {escalator && (
        <Escalator
          values={values}
          setFieldValue={setFieldValue}
          handleChange={handleChange}
          errors={errors}
        />
      )}
      {elevator && (
        <Elevator
          values={values}
          setFieldValue={setFieldValue}
          handleChange={handleChange}
          errors={errors}
        />
      )}
    </div>
  );
}

const DESIGN_TYPE_OPTIONS = {
  ESCALATOR: [{ label: "Escalator", value: "Escalator" }],
  "MOVING WALK": [
    { label: "Travelator", value: "Travelator" },
    { label: "Travelator Inclined", value: "Travelator Inclined" },
  ],
  PLATFORM: [{ label: "Platform", value: "Platform" }],
  ELEVATOR: [
    { label: "MRL", value: "MRL" },
    { label: "Traction Machine Room", value: "Traction Machine Room" },
    { label: "Hydraulic", value: "Hydraulic" },
  ],
  "DUMB WAITER": [{ label: "Dumb Waiter", value: "Dumb Waiter" }],
};

const Escalator = ({ values, setFieldValue, handleChange, errors }) => {
  const designTypeOptions =
    DESIGN_TYPE_OPTIONS[values?.equipment_type?.toUpperCase()] || [];
  return (
    <div className="space-y-3 mt-4">
      <SelectorWithObjects
        label="Design Type"
        placeholder="Select Design Type"
        options={designTypeOptions}
        value={values?.specification.design_type || ""}
        onChange={(val) => setFieldValue("specification.design_type", val || "")}
        error={errors.specification?.design_type}
      />

      <div className="grid grid-cols-4 gap-3">
        <InputField
          label={"Speed"}
          placeholder={"2 Miles Per hour"}
          name={`specification.speed`}
          value={values?.specification.speed || ""}
          onChange={handleChange}
          error={errors.specification?.speed}
        />
        <InputField
          label={"Inclination"}
          placeholder={"-"}
          name={`specification.inclination`}
          value={values?.specification.inclination ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.inclination}
        />
        <InputField
          label={"Height"}
          placeholder={"500 feet"}
          name={`specification.height`}
          value={values?.specification.height || ""}
          onChange={handleChange}
          error={errors.specification?.height}
        />
        <InputField
          label={"Width"}
          placeholder={"2 Meter"}
          name={`specification.width`}
          value={values?.specification.width || ""}
          onChange={handleChange}
          error={errors.specification?.width}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label={"Floor From"}
          placeholder={"01"}
          name={`specification.floor_from`}
          value={values?.specification.floor_from ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.floor_from}
        />
        <InputField
          label={"Floor To"}
          placeholder={"08"}
          name={`specification.floor_to`}
          value={values?.specification.floor_to ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.floor_to}
        />
        <InputField
          label={"Controller Model"}
          placeholder={"KONE Contract"}
          name={`specification.controller_model`}
          value={values?.specification.controller_model || ""}
          onChange={handleChange}
          error={errors.specification?.controller_model}
        />
        <InputField
          label={"Drive Model"}
          placeholder={"MonoSpace"}
          name={`specification.drive_model`}
          value={values?.specification.drive_model || ""}
          onChange={handleChange}
          error={errors.specification?.drive_model}
        />
      </div>
    </div>
  );
};

const Elevator = ({ values, setFieldValue, handleChange, errors }) => {
  const designTypeOptions =
    DESIGN_TYPE_OPTIONS[values?.equipment_type?.toUpperCase()] || [];
  return (
    <div className="space-y-3 mt-4">
      <SelectorWithObjects
        label="Design Type"
        placeholder="Select Design Type"
        options={designTypeOptions}
        value={values?.specification.design_type || ""}
        onChange={(val) => setFieldValue("specification.design_type", val || "")}
        error={errors.specification?.design_type}
      />
      <div className="grid grid-cols-4 gap-3">
        <InputField
          label={"Function Type"}
          placeholder="Passenger Lift"
          name={`specification.function_type`}
          value={values?.specification.function_type || ""}
          onChange={handleChange}
          error={errors.specification?.function_type}
        />
        <InputField
          label={"Max Load (in Kg)"}
          placeholder={"500"}
          name={`specification.max_load`}
          type="number"
          value={values?.specification.max_load ?? 0}
          onChange={handleChange}
          error={errors.specification?.max_load}
        />
        <InputField
          label={"Speed (m/s)"}
          placeholder={"2"}
          name={`specification.speed`}
          type="number"
          value={values?.specification.speed ?? 0}
          onChange={handleChange}
          error={errors.specification?.speed}
        />
        <InputField
          label={"Lift's Travel (in Meters)"}
          placeholder={"Travel of the lift"}
          name={`specification.travel`}
          value={values?.specification.travel ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.travel}
        />
        <InputField
          label={"Stops"}
          placeholder={"08"}
          name={`specification.stops`}
          value={values?.specification.stops ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.stops}
          required
        />
        <InputField
          label={"Height (in MM)"}
          placeholder={"Height of the car"}
          name={`specification.height`}
          value={values?.specification.height ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.height}
        />
        <InputField
          label={"Width (in MM)"}
          placeholder={"Width of the car"}
          name={`specification.width`}
          value={values?.specification.width ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.width}
        />
        <InputField
          label={"Depth (in MM)"}
          placeholder={"Depth of the car"}
          name={`specification.length`}
          value={values?.specification.length ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.length}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label={"Floor From"}
          placeholder={"01"}
          name={`specification.floor_from`}
          value={values?.specification.floor_from ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.floor_from}
        />
        <InputField
          label={"Floor To"}
          placeholder={"08"}
          name={`specification.floor_to`}
          value={values?.specification.floor_to ?? 0}
          onChange={handleChange}
          type="number"
          error={errors.specification?.floor_to}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <InputField
          label={"Suspension Type"}
          placeholder="Enter Suspension Type"
          name={`specification.suspension_type`}
          value={values?.specification.suspension_type || ""}
          onChange={handleChange}
          error={errors.specification?.suspension_type}
        />
        <InputField
          label={"Controller Model"}
          placeholder={"KONE Contract"}
          name={`specification.controller_model`}
          value={values?.specification.controller_model || ""}
          onChange={handleChange}
          error={errors.specification?.controller_model}
        />
        <InputField
          label={"Drive Model"}
          placeholder={"MonoSpace"}
          name={`specification.drive_model`}
          value={values?.specification.drive_model || ""}
          onChange={handleChange}
          error={errors.specification?.drive_model}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <InputField
          label={"Door Controller Brand"}
          placeholder={"KONE Contract"}
          name={`specification.door_controller_brand`}
          value={values?.specification.door_controller_brand || ""}
          onChange={handleChange}
          error={errors.specification?.door_controller_brand}
        />
        <InputField
          label={"Door Controller Model"}
          placeholder={"MonoSpace"}
          name={`specification.door_controller_model`}
          value={values?.specification.door_controller_model || ""}
          onChange={handleChange}
          error={errors.specification?.door_controller_model}
        />
        <InputField
          label={"In Car Media Brand"}
          placeholder={"KONE"}
          name={`specification.in_car_media_brand`}
          value={values?.specification.in_car_media_brand || ""}
          onChange={handleChange}
          error={errors?.specification?.in_car_media_brand}
        />
        <InputField
          label={"In Car Media Model"}
          placeholder={"Mono"}
          name={`specification.in_car_media_model`}
          value={values?.specification.in_car_media_model || ""}
          onChange={handleChange}
          error={errors?.specification?.in_car_media_model}
        />
      </div>
    </div>
  );
};
