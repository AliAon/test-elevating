import InputField from "@/components/ui/input-field";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";

const tabs = [
  { key: "level-1", title: "Level 1" },
  { key: "level-2", title: "Level 2" },
  { key: "level-3", title: "Level 3" },
];

export default function LevelConfig({ values, setFieldValue, contract }) {
  const [active, setActive] = useState(tabs[0].key);

  const [inputs, setInputs] = useState({
    level1: "",
    level2: "",
    level3: "",
  });

  // Initialize levels from formik values (if coming from API)
  const [level1, setLevel1] = useState(values?.level1_ids || []);
  const [level2, setLevel2] = useState(values?.level2_ids || []);
  const [level3, setLevel3] = useState(values?.level3_ids || []);

  // Keep Formik in sync when levels update
  useEffect(() => {
    setFieldValue("level1_ids", level1);
  }, [level1]);

  useEffect(() => {
    setFieldValue("level2_ids", level2);
  }, [level2]);

  useEffect(() => {
    setFieldValue("level3_ids", level3);
  }, [level3]);

  const handleActive = (key) => setActive(key);

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleKeyDown = (e, levelKey) => {
    if (e.key === "Enter" && inputs[levelKey].trim() !== "") {
      if (levelKey === "level1")
        setLevel1((prev) => [...prev, inputs[levelKey]]);
      if (levelKey === "level2")
        setLevel2((prev) => [...prev, inputs[levelKey]]);
      if (levelKey === "level3")
        setLevel3((prev) => [...prev, inputs[levelKey]]);

      setInputs((prev) => ({ ...prev, [levelKey]: "" }));
    }
  };

  const removeItem = (levelKey, index) => {
    if (levelKey === "level1")
      setLevel1((prev) => prev.filter((_, i) => i !== index));
    if (levelKey === "level2")
      setLevel2((prev) => prev.filter((_, i) => i !== index));
    if (levelKey === "level3")
      setLevel3((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-2xl text-black font-semibold">Level Config</p>

      <div className="w-fit h-13 flex items-center rounded-2xl bg-white p-1 mt-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleActive(tab.key)}
            className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
              active === tab.key
                ? "bg-bg_primary text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {active === "level-1" && (
          <>
            <InputField
              label="Level 1"
              placeholder="Type and press Enter"
              start_icon
              value={inputs.level1}
              onChange={(e) => handleChange("level1", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "level1")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {level1.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 bg-white text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
                >
                  {item}
                  <X
                    size={18}
                    className="cursor-pointer"
                    onClick={() => removeItem("level1", i)}
                  />
                </span>
              ))}
            </div>
          </>
        )}

        {active === "level-2" && (
          <>
            <InputField
              label="Level 2"
              placeholder="Type and press Enter"
              start_icon
              value={inputs.level2}
              onChange={(e) => handleChange("level2", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "level2")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {level2.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 bg-white text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
                >
                  {item}
                  <X
                    size={18}
                    className="cursor-pointer"
                    onClick={() => removeItem("level2", i)}
                  />
                </span>
              ))}
            </div>
          </>
        )}

        {active === "level-3" && (
          <>
            <InputField
              label="Level 3"
              placeholder="Type and press Enter"
              start_icon
              value={inputs.level3}
              onChange={(e) => handleChange("level3", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "level3")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {level3.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 bg-white text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
                >
                  {item}
                  <X
                    size={18}
                    className="cursor-pointer"
                    onClick={() => removeItem("level3", i)}
                  />
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
