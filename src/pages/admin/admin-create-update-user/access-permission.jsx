import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import { X } from "lucide-react";
import React, { useState } from "react";

export default function AccessPermission() {
  const [select_client, setSelect_client] = useState([]);
  const [select_service, setSelect_service] = useState([]);

  const [inputs, setInputs] = useState({
    select_client: "",
    select_service: "",
  });

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleKeyDown = (e, levelKey) => {
    if (e.key === "Enter" && inputs[levelKey].trim() !== "") {
      if (levelKey === "select_client")
        setSelect_client((prev) => [...prev, inputs[levelKey]]);
      if (levelKey === "select_service")
        setSelect_service((prev) => [...prev, inputs[levelKey]]);

      setInputs((prev) => ({ ...prev, [levelKey]: "" }));
    }
  };

  const removeItem = (levelKey, index) => {
    if (levelKey === "select_client")
      setSelect_client((prev) => prev.filter((_, i) => i !== index));
    if (levelKey === "select_service")
      setSelect_service((prev) => prev.filter((_, i) => i !== index));
  };

  const { data: clients } = useGetAllClientsQuery({});

  const options = clients?.data?.map((client) => ({
    value: client.client_id,
    label: client.client_name,
  }));

  return (
    <>
      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <p className="text-2xl text-black font-semibold">Clients</p>
        <div className="mt-4 space-y-3">
          <SelectorWithObjects
            label="Select Clients"
            placeholder="Enter client name"
            value={inputs.select_client}
            onChange={(e) => handleChange("select_client", e.target.value)}
            options={options}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {select_client.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-3 bg-white text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
              >
                {item}
                <X
                  size={18}
                  className="cursor-pointer"
                  onClick={() => removeItem("select_client", i)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <p className="text-2xl text-black font-semibold">
          Select ES Pulse Subscription
        </p>
        <div className="mt-4 space-y-3">
          <InputField
            label="Select ES Subscription"
            placeholder="Enter contract name"
            start_icon
            value={inputs.select_service}
            onChange={(e) => handleChange("select_service", e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "select_service")}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {select_service.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-3 bg-white text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
              >
                {item}
                <X
                  size={18}
                  className="cursor-pointer"
                  onClick={() => removeItem("select_service", i)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
