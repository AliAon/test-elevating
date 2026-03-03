import { toast } from "react-toastify";
import {
  useCreateLevel1Mutation,
  useUpdateLevel1Mutation,
  useCreateLevel2Mutation,
  useUpdateLevel2Mutation,
  useCreateLevel3Mutation,
  useUpdateLevel3Mutation,
  useUpdateSubscriptionMutation,
  useCreateSubscriptionMutation,
} from "@/redux/services/subscription";

export function useLevelActions() {
  const [createLevel1] = useCreateLevel1Mutation();
  const [updateLevel1] = useUpdateLevel1Mutation();
  const [createLevel2] = useCreateLevel2Mutation();
  const [updateLevel2] = useUpdateLevel2Mutation();
  const [createLevel3] = useCreateLevel3Mutation();
  const [updateLevel3] = useUpdateLevel3Mutation();

  const buildPayload = (item, subId, clientId) => {
    const payload = {
      client_id: clientId,
      es_subscription_id: subId,
      parent_level_id: item?.parent_level_id || null,
      name: item.name,
      address: item.address || "",
      contact_person_name: item.contact_person_name || "",
      phone_number: item.phone_number || "",
      country_code: item.country_code || "+61",
      city: item.city || "",
      postal_code: item.pin || item.postal_code || "",
      country: item.country || "",
      state: item.state || "",
    };

    if (item.email && item.email.trim() !== "") {
      payload.email = item.email;
    }

    return payload;
  };

  const processLevels = async ({
    action,
    levelList,
    createFn,
    updateFn,
    key,
    es_subscription_id,
    clientId,
  }) => {
    if (!Array.isArray(levelList) || levelList.length === 0) return [];

    const createdOrUpdatedIds = [];

    try {
      if (action === "create") {
        const payload = {
          [`${key}s`]: levelList.map((item) =>
            buildPayload(item, es_subscription_id, clientId),
          ),
        };
        const res = await createFn(payload).unwrap();
        const ids = res?.data?.map((lvl) => lvl?.id || lvl?.data?.id) || [];
        createdOrUpdatedIds.push(...ids);
      }

      if (action === "update") {
        const toCreate = levelList.filter(
          (lvl) => !lvl.id || typeof lvl.id === "number",
        );

        const toUpdate = levelList.filter(
          (lvl) => lvl.id && typeof lvl.id === "string",
        );

        if (toCreate.length > 0) {
          const payload = {
            [`${key}s`]: toCreate.map((item) =>
              buildPayload(item, es_subscription_id, clientId),
            ),
          };
          const res = await createFn(payload).unwrap();
          const ids = res?.data?.map((lvl) => lvl?.id || lvl?.data?.id) || [];
          createdOrUpdatedIds.push(...ids);
        }

        if (toUpdate.length > 0) {
          await Promise.all(
            toUpdate.map((item) =>
              updateFn({
                id: item.id,
                body: buildPayload(item, es_subscription_id, clientId),
              }).unwrap(),
            ),
          );
          createdOrUpdatedIds.push(...toUpdate.map((u) => u.id));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || `Failed to process ${key} data`);
      throw error;
    }

    return createdOrUpdatedIds;
  };

  const handleLevel1 = (params) => {
    return processLevels({
      ...params,
      createFn: createLevel1,
      updateFn: updateLevel1,
      key: "level1",
    });
  };

  const handleLevel2 = (params) => {
    return processLevels({
      ...params,
      createFn: createLevel2,
      updateFn: updateLevel2,
      key: "level2",
    });
  };

  const handleLevel3 = (params) => {
    return processLevels({
      ...params,
      createFn: createLevel3,
      updateFn: updateLevel3,
      key: "level3",
    });
  };

  return { handleLevel1, handleLevel2, handleLevel3 };
}

export function useSubscriptionActions() {
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();

  const handleSubscription = async ({
    subscriptionValues,
    subscriptionId,
    action,
  }) => {
    try {
      const cleanedValues = { ...subscriptionValues };

      if (!cleanedValues?.client_contact_person?.email) {
        delete cleanedValues.client_contact_person?.email;
      }

      if (!cleanedValues?.subscription_owner?.email) {
        delete cleanedValues.subscription_owner?.email;
      }

      let subscriptionRes;
      let finalSubscriptionId = subscriptionId;

      if (action === "create") {
        subscriptionRes = await createSubscription(cleanedValues).unwrap();
        finalSubscriptionId = subscriptionRes?.data?.subscription_id;
      } else {
        const subscriptionData = { ...subscriptionValues };
        if (
          subscriptionData.subscription_owner.email === "" ||
          subscriptionData.subscription_owner.email === null
        ) {
          delete subscriptionData.subscription_owner.email;
        }
        if (
          subscriptionData.client_contact_person.email === "" ||
          subscriptionData.client_contact_person.email === null
        ) {
          delete subscriptionData.client_contact_person.email;
        }
        subscriptionRes = await updateSubscription({
          values: cleanedValues,
          subscriptionId,
        }).unwrap();
      }

      return { subscriptionRes, subscriptionId: finalSubscriptionId };
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to process subscription");
      throw error;
    }
  };

  return { handleSubscription, isLoading: isLoading || isUpdating };
}
