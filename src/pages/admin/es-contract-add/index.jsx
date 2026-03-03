import LevelConfig from "@/components/admin/add-update-client/level-config";
import LevelDetails from "@/components/admin/add-update-client/level-details";
import ClientContactPerson from "@/components/admin/es-contract-add/client-contact-person";
import ContractInformation from "@/components/admin/es-contract-add/contract-information";
import { Button } from "@/components/ui/button";
import { useSubscriptionInitialValues } from "@/helpers/useSubscriptionInitialValues";
import { useGetSubscriptionByIdQuery } from "@/redux/services/subscription";
import { es_client_tabs } from "@/static/es-client";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminEsContractFlow } from "./helper-hooks/useAdminEsContractFlow";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export default function AdminEsContractAdd() {
  const [regionAvailable, setRegionAvailable] = useState(true);
  const [cityAvailable, setCityAvailable] = useState(true);
  const [levelConfig, setLevelConfig] = useState({
    level_1: "",
    level_2: "",
    level_3: "Buildings",
  });

  const [params] = useSearchParams();
  const subscriptionId = params.get("subscriptionId");
  const { data } = useGetSubscriptionByIdQuery(subscriptionId);
  const subscription = data?.data;

  const { initialValues } = useSubscriptionInitialValues(subscription);
  // [formik state]
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
  });

  const handleLevelChange = (e) => {
    setLevelConfig({
      ...levelConfig,
      [e.target.name]: e.target.value,
    });
  };

  const {
    active,
    activeIndex,
    activeLevel,
    setActiveLevel,
    handleNext,
    handleBack,
    isLoading,
  } = useAdminEsContractFlow(formik, subscriptionId);
  const breadlist = [
    {
      item: "ES Pulse Subscription",
      link: "/admin/capital-budget",
    },

    {
      item: `${subscriptionId ? "Update" : "Add"} ES Pulse Subscription`,
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={breadlist} />

      <p className="text-3xl text-text_primary font-semibold">
        {subscriptionId ? "Update" : "Add"} ES Pulse Subscription
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter your ES Pulse Subscription below to update
      </p>

      <div className="w-fit h-13 flex items-center rounded-2xl bg-bg_primary p-1 mt-5">
        {es_client_tabs.map((tab, index) => (
          <button
            key={tab.key}
            className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
              activeIndex === index
                ? "bg-white text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div>
        {active === "subscription-info" && (
          <ContractInformation
            values={formik.values}
            setValues={formik.setFieldValue}
            handleChange={formik.handleChange}
          />
        )}
        {active === "client-info" && (
          <ClientContactPerson
            values={formik.values}
            setValues={formik.setFieldValue}
            handleChange={formik.handleChange}
          />
        )}
        {active === "level-config" && (
          <LevelConfig
            levelConfig={levelConfig}
            handleLevelChange={handleLevelChange}
            regionAvailable={regionAvailable}
            setRegionAvailable={setRegionAvailable}
            cityAvailable={cityAvailable}
            setCityAvailable={setCityAvailable}
            values={formik.values}
            setValues={formik.setFieldValue}
            handleChange={formik.handleChange}
          />
        )}
        {active === "level-details" && (
          <LevelDetails
            levelConfig={formik.values.level_config}
            setValues={formik.setFieldValue}
            values={formik.values}
            active={activeLevel}
            setActive={setActiveLevel}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={handleBack}
          disabled={activeIndex === 0}
        >
          {activeIndex === 0 ? "Close" : "Back"}
        </Button>

        <Button
          className="w-[98px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={handleNext}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Next"}
        </Button>
      </div>
    </div>
  );
}
