import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import GroupCard from "./group-card";
import { equipmentTypeOptions } from "@/helpers/constant";

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

const ChildCard = ({
  onRemove,
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
  const [open, setOpen] = useState(true);

  const specification =
    values?.groups?.[groupIndex]?.equipments?.[equipmentIndex]?.specification ||
    {};

  const equipment_type =
    values?.groups?.[groupIndex]?.equipments?.[
      equipmentIndex
    ]?.equipment_type?.toUpperCase();

  const escalator =
    equipment_type === "ESCALATOR" ||
    equipment_type === "MOVING WALK" ||
    equipment_type === "PLATFORM";
  const elevator =
    equipment_type === "ELEVATOR" || equipment_type === "DUMB WAITER";

  const hasEquipmentErrors = !!(
    errors.groups?.[groupIndex]?.equipments?.[equipmentIndex] &&
    Object.keys(errors.groups[groupIndex].equipments[equipmentIndex]).length > 0
  );

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden ${
        hasEquipmentErrors ? "border-red-500" : "border-[#EAECEF]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#EAECEF] p-4">
        <ChevronRight
          size={24}
          color="#5B617F"
          className={`cursor-pointer transform transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
          onClick={() => setOpen((p) => !p)}
        />

        <div className="flex-1 flex items-center gap-3">
          {/* Equipment Name */}
          <InputField
            label="Equipment Name"
            placeholder="Kone 12589"
            name={`groups[${groupIndex}].equipments[${equipmentIndex}].equipment_name`}
            value={
              values?.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                ?.equipment_name || ""
            }
            onChange={handleChange}
            className={{
              Wrapper: "!flex-1 !bg-bg_primary border border-[#EAECEF]",
            }}
            onBlur={handleBlur}
            error={
              errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                ?.equipment_name
            }
            disabled={disabled}
            required
          />

          {/* Equipment Type */}
          <SelectorWithObjects
            label="Equipment Type"
            placeholder="Select Equipment Type"
            parentClassName="!w-[307px] !bg-bg_primary border border-[#EAECEF]"
            options={equipmentTypeOptions}
            value={
              values?.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                ?.equipment_type.toUpperCase() || "ELEVATOR"
            }
            onChange={(val) =>
              setFieldValue(
                `groups[${groupIndex}].equipments[${equipmentIndex}].equipment_type`,
                val,
              )
            }
            onBlur={handleBlur}
            error={
              errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                ?.equipment_type
            }
            disabled={disabled}
            required
          />
        </div>
        {!disabled && (
          <Trash2
            size={24}
            color="#C2285A"
            className="cursor-pointer"
            onClick={onRemove}
          />
        )}
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden p-6"
          >
            <div className="grid grid-cols-12 gap-3">
              <GroupCard
                values={values.groups[groupIndex].equipments[equipmentIndex]}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                groupIndex={groupIndex}
                equipmentIndex={equipmentIndex}
                errors={errors}
                handleBlur={handleBlur}
                disabled={disabled}
                serviceContract={serviceContract}
                onBoarding={onBoarding}
              />

              <div className="flex flex-row items-center gap-4">
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Specifications
                </h3>
              </div>

              {/* Design Type */}
              <SelectorWithObjects
                label="Design Type"
                placeholder="Select Design Type"
                options={
                  DESIGN_TYPE_OPTIONS[equipment_type] || []
                }
                value={specification?.design_type || ""}
                onChange={(val) =>
                  setFieldValue(
                    `groups[${groupIndex}].equipments[${equipmentIndex}].specification.design_type`,
                    val || "",
                  )
                }
                parentClassName="col-span-12 !bg-bg_primary border border-[#EAECEF]"
                disabled={disabled}
                error={
                  errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                    ?.specification?.design_type
                }
              />

              {/* Specifications: Speed, Travel, Height, Width, Depth */}
              <InputField
                label="Speed (m/s)"
                placeholder={`Enter speed`}
                name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.speed`}
                value={specification?.speed || ""}
                onChange={handleChange}
                type="number"
                className={{
                  Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
                }}
                onBlur={handleBlur}
                error={
                  errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                    ?.specification?.speed
                }
                disabled={disabled}
              />

              <InputField
                label="Travel (meter)"
                placeholder={`Enter travel`}
                name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.travel`}
                value={specification?.travel || ""}
                onChange={handleChange}
                type="number"
                className={{
                  Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
                }}
                onBlur={handleBlur}
                error={
                  errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                    ?.specification?.travel
                }
                disabled={disabled}
              />

              <InputField
                label="Car Height (mm)"
                placeholder={`Enter car height`}
                name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.height`}
                value={specification?.height || ""}
                onChange={handleChange}
                type="number"
                className={{
                  Wrapper: "col-span-4 !bg-bg_primary border border-[#EAECEF]",
                }}
                onBlur={handleBlur}
                error={
                  errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                    ?.specification?.height
                }
                disabled={disabled}
              />

              <InputField
                label="Car Width (mm)"
                placeholder={`Enter car width`}
                name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.width`}
                value={specification?.width || ""}
                onChange={handleChange}
                type="number"
                className={{
                  Wrapper: "col-span-6 !bg-bg_primary border border-[#EAECEF]",
                }}
                onBlur={handleBlur}
                error={
                  errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                    ?.specification?.width
                }
                disabled={disabled}
              />

              <InputField
                label="Car Depth (mm)"
                placeholder={`Enter car depth`}
                name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.length`}
                value={specification?.length || ""}
                onChange={handleChange}
                type="number"
                className={{
                  Wrapper: "col-span-6 !bg-bg_primary border border-[#EAECEF]",
                }}
                onBlur={handleBlur}
                error={
                  errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                    ?.specification?.length
                }
                disabled={disabled}
              />

              {/* Inclination (Escalator only) */}
              {escalator && (
                <InputField
                  label="Inclination"
                  placeholder="-"
                  name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.inclination`}
                  value={specification?.inclination || ""}
                  onChange={handleChange}
                  type="number"
                  className={{
                    Wrapper:
                      "col-span-12 !bg-bg_primary border border-[#EAECEF]",
                  }}
                  onBlur={handleBlur}
                  error={
                    errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                      ?.specification?.inclination
                  }
                  disabled={disabled}
                />
              )}

              {/* Floor From / To (for non-elevator) OR Stops + Floor From/To (for elevator) */}
              {elevator ? (
                <div className="col-span-12 grid grid-cols-12 gap-3">
                  <InputField
                    label={"No. of Stops"}
                    placeholder={`Enter stops`}
                    name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.stops`}
                    value={specification?.stops || ""}
                    onChange={handleChange}
                    type="number"
                    className={{
                      Wrapper:
                        "col-span-4 !bg-bg_primary border border-[#EAECEF]",
                    }}
                    onBlur={handleBlur}
                    error={
                      errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                        ?.specification?.stops
                    }
                    disabled={disabled}
                    required
                  />

                  <InputField
                    label={"Floor From"}
                    placeholder={"01"}
                    name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.floor_from`}
                    value={specification?.floor_from || ""}
                    onChange={handleChange}
                    type="number"
                    className={{
                      Wrapper:
                        "col-span-4 !bg-bg_primary border border-[#EAECEF]",
                    }}
                    onBlur={handleBlur}
                    error={
                      errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                        ?.specification?.floor_from
                    }
                    disabled={disabled}
                  />

                  <InputField
                    label={"Floor To"}
                    placeholder={"08"}
                    name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.floor_to`}
                    value={specification?.floor_to || ""}
                    onChange={handleChange}
                    type="number"
                    className={{
                      Wrapper:
                        "col-span-4 !bg-bg_primary border border-[#EAECEF]",
                    }}
                    onBlur={handleBlur}
                    error={
                      errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                        ?.specification?.floor_to
                    }
                    disabled={disabled}
                  />
                </div>
              ) : (
                ["floor_from", "floor_to"].map((field) => (
                  <InputField
                    key={field}
                    label={field === "floor_from" ? "Floor From" : "Floor To"}
                    placeholder={field === "floor_from" ? "01" : "08"}
                    name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.${field}`}
                    value={specification?.[field] || ""}
                    onChange={handleChange}
                    type="number"
                    className={{
                      Wrapper:
                        "col-span-6 !bg-bg_primary border border-[#EAECEF]",
                    }}
                    error={
                      errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                        ?.specification?.[field]
                    }
                    disabled={disabled}
                  />
                ))
              )}

              {/* Controller / Drive Model */}
              {["controller_model", "drive_model"].map((field) => (
                <InputField
                  key={field}
                  label={
                    field === "controller_model"
                      ? "Controller Model"
                      : "Drive Model"
                  }
                  placeholder={
                    field === "controller_model" ? "KONE Contract" : "MonoSpace"
                  }
                  name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.${field}`}
                  value={specification?.[field] || ""}
                  onChange={handleChange}
                  className={{
                    Wrapper:
                      "col-span-6 !bg-bg_primary border border-[#EAECEF]",
                  }}
                  disabled={disabled}
                  error={
                    errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                      ?.specification?.[field]
                  }
                />
              ))}
            </div>

            {/* Elevator extra fields */}
            {elevator && (
              <>
                {/* Function / Max Load / Stops */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <InputField
                    label="Function Type"
                    placeholder="Select Function Type"
                    name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.function_type`}
                    alue={specification?.function_type || ""}
                    onChange={handleChange}
                    className={{
                      Wrapper: "!bg-bg_primary border border-[#EAECEF]",
                    }}
                    disabled={disabled}
                    error={
                      errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                        ?.specification?.function_type
                    }
                  />

                  {["max_load"].map((field) => (
                    <InputField
                      key={field}
                      label={field === "max_load" ? "Max Load" : field}
                      placeholder={`Enter ${field.replace("_", " ")}`}
                      name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.${field}`}
                      value={specification?.[field] || ""}
                      type={field === "max_load" ? "text" : "text"}
                      onChange={handleChange}
                      className={{ Wrapper: "!bg-gray-100" }}
                      disabled={disabled}
                      error={
                        errors.groups?.[groupIndex]?.equipments?.[
                          equipmentIndex
                        ]?.specification?.[field]
                      }
                    />
                  ))}

                  {/* Suspension */}
                  <InputField
                    label={"Suspension Type"}
                    placeholder={`Enter Suspension Type`}
                    name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.suspension_type`}
                    value={specification?.suspension_type || ""}
                    type={"text"}
                    onChange={handleChange}
                    className={{ Wrapper: "!bg-gray-100" }}
                    disabled={disabled}
                    error={
                      errors.groups?.[groupIndex]?.equipments?.[equipmentIndex]
                        ?.specification?.suspension_type
                    }
                  />
                </div>

                {/* Door + Media */}

                <div className="grid grid-cols-4 gap-3 pt-4">
                  {[
                    "door_controller_brand",
                    "door_controller_model",
                    "in_car_media_brand",
                    "in_car_media_model",
                  ].map((field) => (
                    <InputField
                      key={field}
                      label={field
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                      placeholder={`Enter ${field.replaceAll("_", " ")}`}
                      name={`groups[${groupIndex}].equipments[${equipmentIndex}].specification.${field}`}
                      value={specification?.[field] || ""}
                      onChange={handleChange}
                      className={{ Wrapper: "!bg-gray-100" }}
                      disabled={disabled}
                      error={
                        errors.groups?.[groupIndex]?.equipments?.[
                          equipmentIndex
                        ]?.specification?.[field]
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChildCard;
