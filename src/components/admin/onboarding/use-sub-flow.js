import { useState } from "react";
import { toast } from "react-toastify";
import { useCreatedSubscriptionId } from "@/redux/slices/subscriptionFlowSlice";
import { useSubscriptionActions } from "@/pages/admin/es-contract-add/helper-hooks/useCreateLevelsAndSubscription";
import { useOnBoardHandleLevelsCreate } from "@/pages/admin/es-contract-add/helper-hooks/obboardHandleLevels";

export function useAdminSubFlow(
  formik,
  subscriptionId,
  clientId,
  building_id,
  groupId,
  navigate,
) {
  const { handleSubscription } = useSubscriptionActions();
  const { handleLevelsCreate } = useOnBoardHandleLevelsCreate();
  const { saveSubscriptionId } = useCreatedSubscriptionId();

  const [activeIndex, setActiveIndex] = useState(2);
  const [activeLevel, setActiveLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subsId, setSubsId] = useState(null);

  const handleNext = async () => {
    try {
      setIsLoading(true);

      if (activeIndex === 2) {
        const res = await handleSubscription({
          subscriptionValues: formik.values,
          subscriptionId,
          action: subscriptionId !== null ? "update" : "create",
        });
        saveSubscriptionId(res?.subscriptionId);
        if (clientId) {
          navigate(
            `/admin/onboarding-client?clientId=${clientId}&uuid=${building_id}&subscriptionId=${res?.subscriptionId}&groupId=${groupId}`,
            { replace: true },
          );
        }
        setSubsId(res?.subscriptionId);
        setActiveIndex((prev) => prev + 1);
        toast.success(
          subscriptionId
            ? "ES Subscription Updated successfully"
            : "ES Subscription Created successfully",
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
    activeIndex,
    activeLevel,
    setActiveLevel,
    handleNext,
    handleBack,
    isLoading,
  };
}
