import ESContractList from "@/components/admin/es-contract-list";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    key: "es-contracts",
    title: "ES Pulse Contracts",
  },
  {
    key: "services-contracts",
    title: "Service Contracts",
  },
];

export default function EsPluseContractLists() {
  const [active, setActive] = useState(tabs[0].key);
  const navigate = useNavigate();
  const handleClick = (key) => {
    setActive(key);
    navigate(`/admin/${key}`);
  };
  return (
    <div>
      <div className="w-[341px] h-13 grid grid-cols-2 rounded-2xl bg-bg_primary p-1">
        {tabs.map((tab) => (
          <button
            onClick={() => handleClick(tab.key)}
            key={tab.key}
            className={`h-full text-sm font-medium cursor-pointer rounded-2xl ${
              active === tab.key
                ? "bg-white text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <ESContractList />
    </div>
  );
}
