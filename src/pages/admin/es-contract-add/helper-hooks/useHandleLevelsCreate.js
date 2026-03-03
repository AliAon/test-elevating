import { toast } from "react-toastify";
import { useLevelActions } from "./useCreateLevelsAndSubscription";
import { useNavigate, useSearchParams } from "react-router-dom";

const sanitizeLevelList = (list = []) =>
  list.map((item) => {
    const copy = { ...item };
    if (copy.email === null || copy.email === "") {
      delete copy.email;
    }
    return copy;
  });

export function useHandleLevelsCreate() {
  const { handleLevel1, handleLevel2 } = useLevelActions();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const building_id = params.get("uuid");
  const groupId = params.get("groupId");

  const handleLevelsCreate = async ({
    activeLevel,
    formik,
    action,
    subscriptionId,
    setActiveLevel,
    setIsLoading,
  }) => {
    try {
      setIsLoading(true);
      const payload = {
        clientId: formik.values?.client_id,
        subscriptionId: subscriptionId,
        action,
      };
      const leve_1 = {
        levelList: sanitizeLevelList(formik.values?.regions),
      };

      const leve_2 = {
        levelList: sanitizeLevelList(formik.values?.cities),
      };

      if (activeLevel === "region") {
        await handleLevel1({
          ...payload,
          levelList: leve_1.levelList,
        });
        toast.success(
          action === "create"
            ? "Level 1 created successfully"
            : "Level 1 updated successfully",
        );
        setActiveLevel("city");
      } else if (activeLevel === "city") {
        await handleLevel2({
          ...payload,
          levelList: leve_2.levelList,
        });
        toast.success(
          action === "create"
            ? "Level 2 created successfully"
            : "Level 2 updated successfully",
        );
        if (clientId) {
          navigate(
            `/admin/onboarding-client?clientId=${clientId}&uuid=${building_id}&subscriptionId=${subscriptionId}&groupId=${groupId}&next=true`,
            {
              replace: true,
            },
          );
        }
        if (!clientId) {
          navigate(`/admin/es-contracts-details/${subscriptionId}`);
        }
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLevelsCreate };
}
