import Permissions from "@/components/admin/add-es-admin/permissions";
import ClientInfo from "@/components/admin/add-es-client/clientInfo";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const tabs = [
  { key: "user-information", title: "User Information" },
  { key: "access-permissions", title: "Access Permissions" },
];

export default function AddEsAdmin() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < tabs.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const active = tabs[activeIndex].key;

  return (
    <div>
      <p className="text-3xl text-text_primary font-semibold">
        Add ES Admin Users
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter Your Equipment Details below to update
      </p>

      <div className="w-[350px] h-13 grid grid-cols-2 rounded-2xl bg-bg_primary p-1 mt-5">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors ${
              activeIndex === index
                ? "bg-white text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {active === "user-information" && <ClientInfo />}
        {active === "access-permissions" && <Permissions />}
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={handleBack}
          disabled={activeIndex === 0}
        >
          {activeIndex === 1 ? "Close and Save" : "Back"}
        </Button>

        <Button
          className="w-[130px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={handleNext}
          disabled={activeIndex === tabs.length - 1}
        >
          Add Client
        </Button>
      </div>
    </div>
  );
}
