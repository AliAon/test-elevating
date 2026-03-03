export const convertToFormData = (values) => {
  const formData = new FormData();

  formData.append("client_id", values.client_id);
  formData.append("contract_number", values.contract_number);
  formData.append("contract_name", values.contract_name);
  formData.append("es_subscription_id", values.es_subscription_id);
  formData.append("start_date", values.start_date);
  formData.append("end_date", values.end_date);
  formData.append("active", values.active == "active" ? true : false);

  formData.append(
    "service_provider_details",
    JSON.stringify(values.service_provider_details),
  );
  formData.append("plan_and_pricing", JSON.stringify(values.plan_and_pricing));

  formData.append("contractTerms", values?.contractTerms);
  formData.append("contract_kpis", JSON.stringify(values.contract_kpis));
  formData.append("equipment_kpis", JSON.stringify(values.equipment_kpis));
  formData.append(
    "business_hours_response_time",
    JSON.stringify(values.business_hours_response_time),
  );
  formData.append(
    "after_hours_response_time",
    JSON.stringify(values.after_hours_response_time),
  );

  if (
    Array.isArray(values.building_ids) &&
    values.building_ids.length > 0 &&
    !(values.building_ids.length === 1 && values.building_ids[0] === "")
  ) {
    formData.append("building_ids", JSON.stringify(values.building_ids));
  }
  values.level1_ids.length > 0 &&
    formData.append(
      "level1_ids",
      JSON.stringify(
        typeof values.level1_ids === "string"
          ? [values.level1_ids]
          : values.level1_ids || [],
      ),
    );
  values.level2_ids.length > 0 &&
    formData.append(
      "level2_ids",
      JSON.stringify(
        typeof values.level2_ids === "string"
          ? [values.level2_ids]
          : values.level2_ids || [],
      ),
    );
  // formData.append("linked_equipments", JSON.stringify([]));
  formData.append(
    "service_api_credentials",
    JSON.stringify(values.service_api_credentials || {}),
  );

  if (values.kpi_settings) {
    formData.append("kpi_settings", JSON.stringify(values.kpi_settings));
  }

  values?.group_ids?.length > 0 &&
    formData.append("group_ids", JSON.stringify(values.group_ids || []));

  return formData;
};

export const normalizeContractValues = (values) => {
  const toNumber = (v) => (v === "" || v === null || isNaN(v) ? 0 : Number(v));

  return {
    ...values,
    start_date: values.start_date
      ? new Date(values.start_date).toISOString().split("T")[0]
      : null,
    end_date: values.end_date
      ? new Date(values.end_date).toISOString().split("T")[0]
      : null,
    building_ids: values.building_ids || [],

    plan_and_pricing: {
      ...values.plan_and_pricing,
      contract_price: toNumber(values.plan_and_pricing?.contract_price),
      next_fee_adjustment_rate: toNumber(
        values.plan_and_pricing?.next_fee_adjustment_rate,
      ),
      next_fee_adjustment_date: values.plan_and_pricing
        ?.next_fee_adjustment_date
        ? new Date(values.plan_and_pricing?.next_fee_adjustment_date)
            .toISOString()
            .split("T")[0]
        : null,
    },

    contract_kpis: Object.fromEntries(
      Object.entries(values.contract_kpis || {}).map(([k, v]) => [
        k,
        toNumber(v),
      ]),
    ),

    equipment_kpis: Object.fromEntries(
      Object.entries(values.equipment_kpis || {}).map(([k, v]) => [
        k,
        toNumber(v),
      ]),
    ),

    service_provider_details: {
      ...values.service_provider_details,
      country_code: values.service_provider_details?.country_code || "+1",
    },

    kpi_settings: values.kpi_settings
      ? Object.fromEntries(
          Object.entries(values.kpi_settings).map(([category, cfg]) => [
            category,
            {
              ...cfg,
              target: toNumber(cfg.target),
              penalty_rate: toNumber(cfg.penalty_rate),
            },
          ]),
        )
      : undefined,
  };
};

export const getTypeColors = () => {
  const colorOptions = [
    { bg: "#8B5CF626", text: "#8B5CF6" }, // Soft Violet
    { bg: "#EC489926", text: "#EC4899" }, // Rose Pink
    { bg: "#F59E0B26", text: "#F59E0B" }, // Warm Amber
    { bg: "#10B98126", text: "#10B981" }, // Mint Green
    { bg: "#06B6D426", text: "#06B6D4" }, // Cyan Blue
    { bg: "#3B82F626", text: "#3B82F6" }, // Sky Blue
    { bg: "#A855F726", text: "#A855F7" }, // Lavender
    { bg: "#22C55E26", text: "#22C55E" }, // Fresh Green
  ];

  const randomIndex = Math.floor(Math.random() * colorOptions.length);
  return colorOptions[randomIndex];
};
