export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const formatByDate = (date) => {
  if (!date) return "";

  return (
    date?.getFullYear() +
    "-" +
    String(date?.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date?.getDate()).padStart(2, "0")
  );
};
