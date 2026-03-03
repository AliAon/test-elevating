import {
  useGetLvl1BySubscriptionIdQuery,
  useGetLvl2BySubscriptionIdQuery,
} from "@/redux/services/subscription";

export function useSubscriptionInitialValues(subscriptionData) {
  const subscriptionId = subscriptionData?.subscription_id;

  const { data: level1Res, isFetching: isLevel1Loading } =
    useGetLvl1BySubscriptionIdQuery(
      { subscriptionId: subscriptionId },
      {
        skip: !subscriptionId,
      }
    );

  const { data: level2Res, isFetching: isLevel2Loading } =
    useGetLvl2BySubscriptionIdQuery(
      { subscriptionId },
      {
        skip: !subscriptionId,
      }
    );

  const createEmptyLevel = () => ({
    id: null,
    name: "",
    address: "",
    contact_person_name: "",
    phone_number: "",
    country_code: "+61",
    email: "",
    city: "",
    state: "",
    pin: "",
    country: "",
  });

  const baseValues = {
    es_subscription_number: subscriptionData?.es_subscription_number || "",
    es_subscription_name: subscriptionData?.es_subscription_name || "",
    purchse_order_no: subscriptionData?.purchse_order_no || "",
    start_date: subscriptionData?.start_date || "",
    end_date: subscriptionData?.end_date || "",
    subscription_status: subscriptionData?.subscription_status || "active",
    subscription_type: subscriptionData?.subscription_type || "",
    user_number: subscriptionData?.user_number || "USR-001",
    client_id: subscriptionData?.client_id || "",
    subscription_price: subscriptionData?.subscription_price || 10,
    adjustment_per_year: subscriptionData?.adjustment_per_year || 0,
    next_adjustment: subscriptionData?.next_adjustment || 0,

    client_contact_person: {
      contact_person:
        subscriptionData?.client_contact_person?.contact_person || "",
      position_title:
        subscriptionData?.client_contact_person?.position_title || "",
      country_code:
        subscriptionData?.client_contact_person?.country_code || "+61",
      phone_no: subscriptionData?.client_contact_person?.phone_no || "",
      email: subscriptionData?.client_contact_person?.email || "",
    },

    level1_ids: subscriptionData?.level1_ids || [],
    level2_ids: subscriptionData?.level2_ids || [],
    building_ids: subscriptionData?.building_ids || [],

    subscription_owner: {
      contact_person:
        subscriptionData?.subscription_owner?.contact_person || "",
      position_title:
        subscriptionData?.subscription_owner?.position_title || "",
      country_code: subscriptionData?.subscription_owner?.country_code || "+61",
      phone_no: subscriptionData?.subscription_owner?.phone_no || "",
      email: subscriptionData?.subscription_owner?.email || "",
    },

    level_config: {
      level_1: {
        name: subscriptionData?.level_config?.level_1?.name || "",
        availability:
          subscriptionData?.level_config?.level_1?.availability || false,
      },
      level_2: {
        name: subscriptionData?.level_config?.level_2?.name || "",
        availability:
          subscriptionData?.level_config?.level_2?.availability || false,
      },
      level_3: {
        name: subscriptionData?.level_config?.level_3?.name || "level_3",
        availability:
          subscriptionData?.level_config?.level_3?.availability || true,
      },
    },

    report_download_access: subscriptionData?.report_download_access || false,
    service_contract_doc_download_access:
      subscriptionData?.service_contract_doc_download_access || false,
  };

  const initialValues = {
    ...baseValues,
    regions: (level1Res?.data && level1Res.data.length > 0
      ? level1Res.data
      : [createEmptyLevel()]) || [createEmptyLevel()],
    cities: (level2Res?.data && level2Res.data.length > 0
      ? level2Res.data
      : [createEmptyLevel()]) || [createEmptyLevel()],
    buildings: subscriptionData?.buildings || [],
  };

  const isLoading = isLevel1Loading || isLevel2Loading;

  return { initialValues, isLoading };
}
