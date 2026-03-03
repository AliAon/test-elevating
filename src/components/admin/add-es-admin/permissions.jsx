"use client";

import React, { useState } from "react";
import InputField from "@/components/ui/input-field";
import { X } from "lucide-react";

export default function Permissions() {
  const [clients, setClients] = useState([]);
  const [clientInput, setClientInput] = useState("");

  const [contracts, setContracts] = useState([]);
  const [contractInput, setContractInput] = useState("");

  const handleClientKeyDown = (e) => {
    if (e.key === "Enter" && clientInput.trim() !== "") {
      setClients((prev) => [...prev, clientInput.trim()]);
      setClientInput("");
    }
  };

  const handleContractKeyDown = (e) => {
    if (e.key === "Enter" && contractInput.trim() !== "") {
      setContracts((prev) => [...prev, contractInput.trim()]);
      setContractInput("");
    }
  };

  const removeClient = (index) => {
    setClients((prev) => prev.filter((_, i) => i !== index));
  };

  const removeContract = (index) => {
    setContracts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* CLIENTS FIELD */}
      <div className="bg-bg_primary rounded-xl p-7">
        <p className="text-2xl text-black font-semibold mb-4">Clients</p>

        <InputField
          label="Select Client"
          placeholder="Enter Client Name"
          value={clientInput}
          onChange={(e) => setClientInput(e.target.value)}
          onKeyDown={handleClientKeyDown}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {clients.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 bg-transparent border-[1px] border-text_secondary text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
            >
              {item}
              <X
                size={18}
                className="cursor-pointer"
                onClick={() => removeClient(i)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* CONTRACTS FIELD */}
      <div className="bg-bg_primary rounded-xl p-7 mt-8">
        <p className="text-2xl text-black font-semibold mb-4">
          Select Contracts
        </p>

        <InputField
          label="Select ES Subscription"
          placeholder="Enter Contract Name"
          value={contractInput}
          onChange={(e) => setContractInput(e.target.value)}
          onKeyDown={handleContractKeyDown}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {contracts.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 bg-transparent border-[1px] border-text_secondary text-text_secondary px-5 py-3 rounded-full text-sm font-semibold"
            >
              {item}
              <X
                size={18}
                className="cursor-pointer"
                onClick={() => removeContract(i)}
              />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
