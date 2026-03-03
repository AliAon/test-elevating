import InputField from "@/components/ui/input-field";
import React from "react";

export default function LevelConfig({
  values,
  setValues,
  handleChange,
  errors,
  touched,
}) {
  return (
    <div className="bg-bg_primary rounded-xl p-7 mt-5">
      <p className="text-2xl text-black font-semibold">Level Config</p>

      <div className="flex-1 space-y-2 mt-5">
        <InputField
          name={"level_config.level_1.name"}
          label={"Level 1"}
          placeholder={"Enter your region"}
          available={values?.level_config?.level_1?.availability}
          setAvailable={(check) =>
            setValues("level_config.level_1.availability", check)
          }
          value={values?.level_config?.level_1?.name}
          onChange={handleChange}
          isSwitch
          error={
            touched?.level_config?.level_1?.name &&
            errors?.level_config?.level_config?.level_1?.name
          }
          required
        />
        <InputField
          label={"Level 2"}
          placeholder={"Enter your city"}
          value={values?.level_config?.level_2?.name}
          name={"level_config.level_2.name"}
          onChange={handleChange}
          available={values?.level_config?.level_2?.availability}
          setAvailable={(check) =>
            setValues("level_config.level_2.availability", check)
          }
          isSwitch
          error={
            touched?.level_config?.level_2?.name &&
            errors?.level_config?.level_config?.level_2?.name
          }
          required
        />
        <InputField
          name={"level_config.level_3.name"}
          value={"Buildings"}
          onChange={handleChange}
          label={"Level 3"}
          placeholder={"Building"}
          disabled={true}
        />
      </div>
    </div>
  );
}
