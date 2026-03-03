import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AddBuildings from "../buildings/add-buildings";
import ServiceContract from "../../../components/admin/onboarding/ServiceContract";
import ClientInfo from "@/components/admin/onboarding/client-info";
import { ChevronRight } from "lucide-react";
import Subscription from "@/components/admin/onboarding/subscription";
import AddOnBoardGroup from "../add-groups";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const tabs = [
  { key: "client-info", title: "Client Info" },
  { key: "buildings", title: "Buildings" },
  { key: "group", title: "Group" },
  { key: "subscription", title: "Subscription" },
  { key: "service-contract", title: "Service Contract" },
];

export default function Onboarding() {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
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
  const list = [
    {
      item: "Clients",
      link: "/admin/all-client",
    },
    {
      item: `Onboarding`,
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={list} />

      <p className="text-3xl text-text_primary font-semibold">
        {clientId ? "Update" : "Add"} Onboarding Details
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter your onboarding details below to update
      </p>
      <div className="w-fit h-13 flex rounded-2xl bg-bg_primary p-1 mt-5">
        {" "}
        {tabs.map((tab, index) => (
          <div key={tab.key} className="flex items-center">
            <button
              className={`h-full px-4 text-sm font-medium cursor-pointer rounded-2xl transition-colors
          ${
            activeIndex === index
              ? "bg-white text-text_primary"
              : "text-text_secondary"
          }
        `}
            >
              {tab.title}
            </button>

            {/* Arrow between steps */}
            {index < tabs.length - 1 && (
              <ChevronRight
                size={16}
                className={`mx-2 transition-colors
            ${activeIndex > index ? "text-text_primary" : "text-text_secondary"}
          `}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-5">
        {active === "client-info" && (
          <ClientInfo Onboarding={true} handleNext={handleNext} />
        )}
        {active === "buildings" && (
          <AddBuildings
            Onboarding={true}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {active === "group" && (
          <AddOnBoardGroup
            Onboarding={true}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        )}
        {active === "subscription" && (
          <Subscription handleNext={handleNext} handleBack={handleBack} />
        )}

        {active === "service-contract" && (
          <ServiceContract handleNext={handleNext} handleBack={handleBack} />
        )}
      </div>
    </div>
  );
}
