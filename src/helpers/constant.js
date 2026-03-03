export const tabs = [
  {
    key: "equipment-details",
    title: "Equipment Details",
  },
  {
    key: "equipment-specification",
    title: "Equipment Specification",
  },
];
export const equipmentTypeOptions = [
  { label: "ESCALATOR", value: "ESCALATOR" },
  { label: "MOVING WALK", value: "MOVING WALK" },
  { label: "PLATFORM", value: "PLATFORM" },
  { label: "ELEVATOR", value: "ELEVATOR" },
  { label: "DUMB WAITER", value: "DUMB WAITER" },
];
export function getInitialValues(data) {
  return {
    client_id: data?.client_id,
    building_ids: data?.building_ids || [],
    contract_number: data?.contract_number || "",
    contract_name: data?.contract_name || "",
    es_subscription_id: data?.es_subscription_id || "",
    // contractTerms: data?.contract_terms_url || [],
    contractTerms: data?.contract_terms_file_key || [],

    client_name: data?.client_name,
    start_date: data?.start_date || "",
    end_date: data?.end_date || "",
    active: data?.active ?? "active",

    service_provider_details: {
      service_provider_name:
        data?.service_provider_details?.service_provider_name || "",
      contact_person_name:
        data?.service_provider_details?.contact_person_name || "",
      country_code: data?.service_provider_details?.country_code || "+1",
      phone_no: data?.service_provider_details?.phone_no || "",
      email: data?.service_provider_details?.email || "",
    },

    plan_and_pricing: {
      contract_type: data?.plan_and_pricing?.contract_type || "",
      next_fee_adjustment_date:
        data?.plan_and_pricing?.next_fee_adjustment_date || "",
      contract_price: data?.plan_and_pricing?.contract_price || 0,
      next_fee_adjustment_rate:
        data?.plan_and_pricing?.next_fee_adjustment_rate || 0,
    },

    service_api_credentials: {
      brand_id: data?.service_api_credentials?.brand_id || "",
      client_id: data?.service_api_credentials?.client_id || "",
      client_secret: data?.service_api_credentials?.client_secret || "",
      auth_username: data?.service_api_credentials?.auth_username || "",
      auth_password: data?.service_api_credentials?.auth_password || "",
      grant_type: data?.service_api_credentials?.grant_type || "",
      ocp_apim_subscription_key:
        data?.service_api_credentials?.ocp_apim_subscription_key || "",
      country_code: data?.service_api_credentials?.country_code || "",
      customer_id: data?.service_api_credentials?.customer_id || "",
      contract_no: data?.service_api_credentials?.contract_no || "",
      subscription_key:
        data?.service_api_credentials?.subscription_key ||
        data?.service_api_credentials?.ocp_apim_subscription_key ||
        "",
      repair_subscription_key:
        data?.service_api_credentials?.repair_subscription_key || "",
      maintainance_subscription_key:
        data?.service_api_credentials?.maintainance_subscription_key || "",
      callback_subscription_key:
        data?.service_api_credentials?.callback_subscription_key || "",
      scope: data?.service_api_credentials?.scope || "",
    },

    contract_kpis: {
      maintenance_visit_per_equipment:
        data?.contract_kpis?.maintenance_visit_per_equipment || 0,
      annual_safety_test_report:
        data?.contract_kpis?.annual_safety_test_report || 0,
      rate_of_breakdown: data?.contract_kpis?.rate_of_breakdown || 0,
      minor_response_time: data?.contract_kpis?.minor_response_time || 0,
    },

    equipment_kpis: {
      annual_man_trapped_event:
        data?.equipment_kpis?.annual_man_trapped_event || 0,
      equipment_availability_target:
        data?.equipment_kpis?.equipment_availability_target || 0,
    },

    business_hours_response_time: {
      entrapment: {
        attendance_next_business_day:
          data?.business_hours_response_time?.entrapment
            ?.attendance_next_business_day || false,
        hours: data?.business_hours_response_time?.entrapment?.hours || 0,
      },

      criticalEquipmentStopped: {
        attendance_next_business_day:
          data?.business_hours_response_time?.nonCriticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.criticalEquipmentStopped?.hours ||
          0,
      },
      nonCriticalEquipmentStopped: {
        attendance_next_business_day:
          data?.business_hours_response_time?.nonCriticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.nonCriticalEquipmentStopped
            ?.hours || 0,
      },
      operationalIntermittentFaults: {
        attendance_next_business_day:
          data?.business_hours_response_time?.operationalIntermittentFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.operationalIntermittentFaults
            ?.hours || 0,
      },
      nonOperationalOrAestheticFaults: {
        attendance_next_business_day:
          data?.business_hours_response_time?.nonOperationalOrAestheticFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.business_hours_response_time?.nonOperationalOrAestheticFaults
            ?.hours || 0,
      },
      required: false,
    },

    after_hours_response_time: {
      entrapment: {
        attendance_next_business_day:
          data?.after_hours_response_time?.entrapment
            ?.attendance_next_business_day || false,
        hours: data?.after_hours_response_time?.entrapment?.hours || 0,
      },
      criticalEquipmentStopped: {
        attendance_next_business_day:
          data?.after_hours_response_time?.criticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.criticalEquipmentStopped?.hours || 0,
      },
      nonCriticalEquipmentStopped: {
        attendance_next_business_day:
          data?.after_hours_response_time?.nonCriticalEquipmentStopped
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.nonCriticalEquipmentStopped?.hours ||
          0,
      },
      operationalIntermittentFaults: {
        attendance_next_business_day:
          data?.after_hours_response_time?.operationalIntermittentFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.operationalIntermittentFaults
            ?.hours || 0,
      },
      nonOperationalOrAestheticFaults: {
        attendance_next_business_day:
          data?.after_hours_response_time?.nonOperationalOrAestheticFaults
            ?.attendance_next_business_day || false,
        hours:
          data?.after_hours_response_time?.nonOperationalOrAestheticFaults
            ?.hours || 0,
      },
    },

    level1_ids: data?.level1_ids || [],
    level2_ids: data?.level2_ids || [],

    kpi_settings: {
      response_time: {
        target: data?.kpi_settings?.response_time?.target ?? 95,
        penalty_rate: data?.kpi_settings?.response_time?.penalty_rate ?? 0.5,
        target_interval:
          data?.kpi_settings?.response_time?.target_interval || "monthly",
      },
      maintenance: {
        target: data?.kpi_settings?.maintenance?.target ?? 100,
        penalty_rate: data?.kpi_settings?.maintenance?.penalty_rate ?? 1.0,
        target_interval:
          data?.kpi_settings?.maintenance?.target_interval || "quarterly",
      },
      repeat_callbacks: {
        target: data?.kpi_settings?.repeat_callbacks?.target ?? 5,
        penalty_rate:
          data?.kpi_settings?.repeat_callbacks?.penalty_rate ?? 0.25,
        target_interval:
          data?.kpi_settings?.repeat_callbacks?.target_interval || "monthly",
      },
      availability: {
        target: data?.kpi_settings?.availability?.target ?? 99,
        penalty_rate: data?.kpi_settings?.availability?.penalty_rate ?? 2.0,
        target_interval:
          data?.kpi_settings?.availability?.target_interval || "monthly",
      },
    },
  };
}
export const capitalTabs = [
  {
    key: "all",
    title: "All",
  },
  {
    key: "ESCALATOR",
    title: "Escalators",
  },
  {
    key: "MOVING WALK",
    title: "Moving Walk",
  },
  {
    key: "PLATFORM",
    title: "Platform",
  },
  {
    key: "ELEVATOR",
    title: "Elevators",
  },
  {
    key: "DUMB WAITER",
    title: "Dumb Waiters",
  },
];
export const servicelist = [
  {
    id: 1,
    contract: {
      label: "KONE Contract #1",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 1",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 2,
    contract: {
      label: "KONE Contract #2",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 3,
    contract: {
      label: "KONE Contract #3",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 4,
    contract: {
      label: "KONE Contract #4",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 1",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 5,
    contract: {
      label: "KONE Contract #5",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 2",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
  {
    id: 6,
    contract: {
      label: "KONE Contract #6",
      code: "ID. CTR-002",
      by: "By KONE",
    },

    contract_type: "Type 3",
    contract_price: "$120,000 / year",
    next_date: "01 Jan 2025",
    start_end: {
      start: "Mar 19, 2025",
      end: "Dec 31, 2025",
      day_left: "197 Days left",
    },
    status: "+5%",
  },
];
export const mL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
