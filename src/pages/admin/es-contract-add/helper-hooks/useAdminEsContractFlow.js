import { es_client_tabs } from "@/static/es-client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSubscriptionActions } from "./useCreateLevelsAndSubscription";
import { useHandleLevelsCreate } from "./useHandleLevelsCreate";
import { useCreatedSubscriptionId } from "@/redux/slices/subscriptionFlowSlice";

export function useAdminEsContractFlow(formik, subscriptionId) {
  const { handleSubscription } = useSubscriptionActions();
  const { handleLevelsCreate } = useHandleLevelsCreate();
  const { saveSubscriptionId } = useCreatedSubscriptionId();

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLevel, setActiveLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subsId, setSubsId] = useState(null);

  const active = es_client_tabs[activeIndex]?.key;

  const handleNext = async () => {
    try {
      setIsLoading(true);

      if (activeIndex === 2) {
        const res = await handleSubscription({
          subscriptionValues: formik.values,
          subscriptionId,
          action: subscriptionId ? "update" : "create",
        });
        saveSubscriptionId(res?.subscriptionId);
        setSubsId(res?.subscriptionId);
        setActiveIndex((prev) => prev + 1);
        toast.success(
          subscriptionId
            ? "ES Subscription Updated successfully"
            : "ES Subscription Created successfully"
        );
      } else if (activeIndex === 3) {
        await handleLevelsCreate({
          activeLevel,
          formik,
          action: subscriptionId ? "update" : "create",
          subscriptionId: subsId || subscriptionId,
          setActiveLevel,
          setIsLoading,
        });
      } else {
        setActiveIndex((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  };

  return {
    active,
    activeIndex,
    activeLevel,
    setActiveLevel,
    handleNext,
    handleBack,
    isLoading,
  };
}
