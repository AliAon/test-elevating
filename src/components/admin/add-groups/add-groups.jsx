import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
const brands = [
  {
    id: "acfbad24-ccc3-45b6-9ed4-8dc4ffcd978a",
    brand_name: "Schindler",
  },
  {
    id: "1b6520f4-6ef0-4008-b567-1e5ff10ae0d5",
    brand_name: "KONE",
  },
];

import { Plus } from "lucide-react";

const AddGroup = ({
  values,
  setValues,
  handleChange: formikHandleChange,
  errors,
  touched,
}) => {
  const equipments = values.equipments || [];

  const handleChange = (name, value, index = 0) => {
    const updated = [...equipments];

    const setNestedValue = (obj, path, val) => {
      const keys = path.split(".");
      let temp = obj;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) temp[key] = val;
        else {
          temp[key] = temp[key] || {};
          temp = temp[key];
        }
      });
    };

    updated[index] = { ...updated[index] };
    setNestedValue(updated[index], name, value);

    if (setValues) setValues("equipments", updated);
    if (formikHandleChange)
      formikHandleChange(`equipments.${index}.${name}`, value);
  };

  const handleAddEquipment = () => {
    if (setValues) setValues("equipments", [...equipments, {}]);
  };

  const getError = (path, index) => {
    if (!errors || !touched) return "";
    const e = errors.equipments?.[index];
    if (!e) return "";
    const keys = path.split(".");
    let errorObj = e;
    for (let k of keys) {
      if (!errorObj) break;
      errorObj = errorObj[k];
    }
    return errorObj ? errorObj : "";
  };

  return (
    <div className="w-full bg-[#F6F6F8] rounded-2xl p-6 space-y-6 mt-5">
      {/* ========== BASIC INFO ========== */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="Group Name"
            value={values.groupName}
            onChange={(e) => setValues("groupName", e.target.value)}
            className={{ Wrapper: "bg-gray-100" }}
            placeholder="Enter group name"
          />
          {errors?.groupName && (
            <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>
          )}
        </div>
      </div>

      {equipments.map((equipment, eqIndex) => (
        <div key={eqIndex} className="rounded-2xl p-6 space-y-8">
          <div className="h-[1px] bg-gray-200 w-full"></div>
          <div className="bg-white p-4 rounded-2xl">
            {/* ========== EQUIPMENT INFO ========== */}
            <div className="grid grid-cols-2 gap-3 py-4">
              <div>
                <InputField
                  label="Equipment Name"
                  value={equipment.equipment_name}
                  onChange={(e) =>
                    handleChange("equipment_name", e.target.value, eqIndex)
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
                {getError("equipment_name", eqIndex) && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("equipment_name", eqIndex)}
                  </p>
                )}
              </div>
              <div>
                <SelectorWithObjects
                  label="Equipment Type"
                  value={equipment.equipment_type}
                  onChange={(val) =>
                    handleChange("equipment_type", val, eqIndex)
                  }
                  parentClassName={"!bg-gray-100"}
                  options={[
                    { label: "ELEVATOR", value: "ELEVATOR" },
                    { label: "ESCALATOR", value: "ESCALATOR" },
                    { label: "MOVING WALK", value: "MOVING WALK" },
                    { label: "PLATFORM", value: "PLATFORM" },
                    { label: "DUMB WAITER", value: "DUMB WAITER" },
                  ]}
                />
                {getError("equipment_type", eqIndex) && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("equipment_type", eqIndex)}
                  </p>
                )}
              </div>
            </div>

            {/* ========== BRAND & MODEL ========== */}
            <div className="grid grid-cols-2 gap-3 py-4">
              <div>
                {/* <InputField
                  label="Brand ID"
                  value={equipment.brand_id}
                  onChange={(e) =>
                    handleChange("brand_id", e.target.value, eqIndex)
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                /> */}
                <SelectorWithObjects
                  label="Brand ID"
                  value={equipment.brand_id}
                  onChange={(val) => handleChange("brand_id", val, eqIndex)}
                  parentClassName={"!bg-gray-100"}
                  options={brands?.map((b) => ({
                    label: b.brand_name,
                    value: b.id,
                  }))}
                />
                {getError("brand_id", eqIndex) && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("brand_id", eqIndex)}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  label="Model Number"
                  value={equipment.model_number}
                  onChange={(e) =>
                    handleChange("model_number", e.target.value, eqIndex)
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
                {getError("model_number", eqIndex) && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("model_number", eqIndex)}
                  </p>
                )}
              </div>
            </div>

            {/* ========== ES / OEM / CLIENT NUMBERS ========== */}
            <div className="grid grid-cols-3 gap-3 py-4">
              <div>
                <InputField
                  label="ES Pulse Equipment Number"
                  value={equipment.es_pulse_equipment_number}
                  onChange={(e) =>
                    handleChange(
                      "es_pulse_equipment_number",
                      e.target.value,
                      eqIndex
                    )
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
              <div>
                <InputField
                  label="OEM Service Equipment Number"
                  value={equipment.oem_service_equipment_number}
                  onChange={(e) =>
                    handleChange(
                      "oem_service_equipment_number",
                      e.target.value,
                      eqIndex
                    )
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
              <div>
                <InputField
                  label="Client Equipment Number"
                  value={equipment.client_equipment_number}
                  onChange={(e) =>
                    handleChange(
                      "client_equipment_number",
                      e.target.value,
                      eqIndex
                    )
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
            </div>

            {/* ========== DESIGN & INSTALLATION ========== */}
            <div className="grid grid-cols-2 gap-3 py-4">
              <div>
                <InputField
                  label="Design Code"
                  value={equipment.design_code}
                  onChange={(e) =>
                    handleChange("design_code", e.target.value, eqIndex)
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
              <div>
                <InputField
                  label="Year of Installation"
                  type="number"
                  value={equipment.year_of_installation}
                  onChange={(e) =>
                    handleChange(
                      "year_of_installation",
                      Number(e.target.value),
                      eqIndex
                    )
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
            </div>

            {/* ========== MODERNIZATION ========== */}
            <div className="grid grid-cols-2 gap-3 py-4">
              <div>
                <InputField
                  label="Last Modernization Date"
                  type="date"
                  value={equipment.last_modernization_date}
                  onChange={(e) =>
                    handleChange(
                      "last_modernization_date",
                      e.target.value,
                      eqIndex
                    )
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
              <div>
                <InputField
                  label="Next Modernization Date"
                  type="date"
                  value={equipment.next_modernization_date}
                  onChange={(e) =>
                    handleChange(
                      "next_modernization_date",
                      e.target.value,
                      eqIndex
                    )
                  }
                  className={{ Wrapper: "!bg-gray-100" }}
                />
              </div>
            </div>

            <div>
              <InputField
                label="Last Modernization Parts"
                value={equipment.last_modernization_parts}
                onChange={(e) =>
                  handleChange(
                    "last_modernization_parts",
                    e.target.value,
                    eqIndex
                  )
                }
                className={{ Wrapper: "!bg-gray-100" }}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Equipment Life"
                value={equipment.equipment_life}
                onChange={(e) =>
                  handleChange("equipment_life", e.target.value, eqIndex)
                }
                className={{ Wrapper: "!bg-gray-100" }}
              />
            </div>

            {/* ========== SPECIFICATIONS ========== */}
            <div className="grid grid-cols-4 gap-3 pt-4">
              {[
                "design_type",
                "speed",
                "height",
                "width",
                "floor_from",
                "floor_to",
                "controller_model",
                "drive_model",
                "function_type",
                "max_load",
                "stops",
                "travel",
                "length",
                "suspension_type",
                "door_controller_brand",
                "door_controller_model",
                "in_car_media_brand",
                "in_car_media_model",
              ].map((field) => (
                <div key={field}>
                  <InputField
                    label={field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={equipment.specification?.[field]}
                    onChange={(e) => {
                      let value = e.target.value;

                      // Convert to number for specific fields
                      if (
                        ["floor_from", "floor_to", "travel", "stops"].includes(
                          field
                        )
                      ) {
                        value = value === "" ? "" : Number(value);
                      }

                      handleChange(`specification.${field}`, value, eqIndex);
                    }}
                    className={{ Wrapper: "!bg-gray-100" }}
                  />
                  {getError(`specification.${field}`, eqIndex) && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError(`specification.${field}`, eqIndex)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* ========== ADD BUTTON ========== */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-[#EAECEF] hover:bg-[#EAECEF] rounded-full"
          onClick={handleAddEquipment}
        >
          <Plus size={16} /> Add Another Equipment
        </Button>
      </div>
    </div>
  );
};

export default AddGroup;
