import Buildings from "@/components/admin/add-update-client/buildings";
import ClientInfo from "@/components/admin/add-update-client/client-info";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
const tabs = [{ key: "client-info", title: "Client Info" }];

export default function AddUpdateClient() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    navigate(`/admin/clients?clientId=${clientId}`, { replace: true });
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const active = tabs[activeIndex].key;
  const list = [
    {
      item: "Clients",
      link: "/admin/all-client",
    },
    {
      item: `${clientId ? "Update" : "Add"} Details`,
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={list} />

      <p className="text-3xl text-text_primary font-semibold">
        {clientId ? "Update" : "Add"} Client
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter client details below to {clientId ? "update" : "add a new"}{" "}
        client.
      </p>

      <div className="mt-5">
        {active === "client-info" && <ClientInfo handleNext={handleNext} />}

        {active === "buildings" && <Buildings handleBack={handleBack} />}
      </div>
    </div>
  );
}
