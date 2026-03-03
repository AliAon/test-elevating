export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const getUserTypeOptions = (data, type) => {
  if (!data?.length) return [];

  return data
    .filter((option) =>
      type === "es-admin"
        ? true
        : option?.type_name !== "admin" && option?.type_name !== "superadmin"
    )
    .map((option) => ({
      label: capitalize(option?.type_name),
      value: option?.user_type_id,
    }));
};
