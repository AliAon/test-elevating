import { Breadcrumbs } from "@/components/common/breadcrumbs";
import CapitalBudget from "@/components/equipments/equipment-details/capital-budget";
import ContractInformation from "@/components/equipments/equipment-details/contract-information";
import KpiParameters from "@/components/equipments/equipment-details/kpi-parameters";
import RecommenededYearParamteres from "@/components/equipments/equipment-details/RecommenededYearParamteres";
import SpecificationInformation from "@/components/equipments/equipment-details/specification-information";
import { useGetEquipmentByIdQuery } from "@/redux/services/groups";
import dayjs from "dayjs";
import React from "react";
import { useParams } from "react-router-dom";

export default function CapitalBudgetSingle() {
  const { id } = useParams();
  const { data, isLoading } = useGetEquipmentByIdQuery(id, { skip: !id });

  const formatPrice = (value) => {
    if (!value) return "";
    return value > 10000 ? Math.round(value / 1000) + "k" : value;
  };

  const equipmentAge = (() => {
    const install = data?.data?.year_of_installation;
    const fallback = data?.data?.equipment_life;
    if (!install && (fallback === undefined || fallback === null)) return "-";
    const currentYear = dayjs().year();
    let installYear = null;
    if (install !== undefined && install !== null) {
      const installStr = String(install);
      installYear = /^\d{4}$/.test(installStr)
        ? Number(installStr)
        : dayjs(install).year();
    }
    const age = installYear
      ? Math.max(0, currentYear - installYear)
      : fallback || 0;
    return `${age} Years`;
  })();

  const list = [
    {
      icon: "/assets/svg/capital-4.svg",
      icon_bg: "#248EA526",
      title: "Age",
      value: equipmentAge,
      time_left: "",
    },
    {
      icon: "/assets/svg/capital-1.svg",
      icon_bg: "#ffA74526",
      title: "Design Life",
      value: `${data?.data?.equipment_life} Years`,
      time_left: "",
    },
    {
      icon: "/assets/svg/capital-5.svg",
      icon_bg: "#C2285A26",
      title: "Replacement Year",
      value: `${data?.data?.capital_budget?.recomended_replacement_year}`,
      time_left: "Recommended",
    },
    {
      icon: "/assets/svg/capital-3.svg",
      icon_bg: "#F06B3C26",
      title: "Capital Budget",
      value: `$${formatPrice(data?.data?.capital_budget?.max_price)} - $${formatPrice(data?.data?.capital_budget?.min_price)}`,
      time_left: "",
    },
  ];
  const bglist = [
    {
      item: "Equipment List",
      link: "/equipments",
    },
    {
      item: "Equipment Details",
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={bglist} />

      {isLoading ? (
        <CapitalBudgetSingleSkeleton />
      ) : (
        <>
          <div className="flex items-start gap-5">
            <div className="w-[328px] h-full flex items-center justify-center border border-[#EAECEF] rounded-2xl">
              <img
                src="/assets/png/equip-1.png"
                alt=""
                className="w-full h-full"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl text-text_primary font-semibold flex items-center gap-3">
                    {data?.data?.equipment_name}
                    <small
                      className={
                        (data?.data?.equipment_status === "ACTIVE"
                          ? "bg-green-600"
                          : "bg-red-600") +
                        " text-white py-1 px-3 rounded-full text-xs"
                      }
                    >
                      {data?.data?.equipment_status.replaceAll("_", " ")}
                    </small>
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="bg-[#EAECEF] rounded-full text-xs text-[#5B617F] font-medium px-2 py-1">
                      {data?.data?.equipment_type}
                    </p>
                    <p className="text-sm text-text_secondary font-medium">
                      {data?.data?.brand_name} - {data?.data?.model_number} /{" "}
                      {data?.data?.design_code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-5">
                <div className="grid grid-cols-3 gap-2">
                  <DetailCard
                    title="Brand"
                    value={data?.data?.brand_name || "-"}
                  />
                  <DetailCard
                    title="Year of Installation"
                    value={data?.data?.year_of_installation || "-"}
                  />
                  {/* <DetailCard
                    title="Location"
                    value="Melbourne VIC 3003, Australia"
                  /> */}
                  <DetailCard
                    title="Status"
                    value={`${data?.data?.status ?? "-"}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <DetailCard
                    title="Client Equipment Number"
                    value={data?.data?.client_equipment_number || "-"}
                  />
                  <DetailCard
                    title="ES Pulse Equipment Number"
                    value={data?.data?.es_pulse_equipment_number || "-"}
                  />
                  <DetailCard
                    title="OEM Service Equipment Number"
                    value={data?.data?.oem_service_equipment_number || "-"}
                  />
                  <DetailCard
                    title="Design Code"
                    value={data?.data?.design_code || "-"}
                  />

                  <DetailCard
                    title="Plant Registration Date"
                    value={(() => {
                      const raw = data?.data?.plant_registration_date;
                      if (!raw) return "-";
                      const d = new Date(raw);
                      if (Number.isNaN(d.getTime())) return "-";
                      return d.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                      });
                    })()}
                  />

                  <DetailCard
                    title="Installed On"
                    value={data?.data?.year_of_installation || "-"}
                  />
                  <DetailCard
                    title="Latest Modernisation Date"
                    value={(() => {
                      const raw = data?.data?.last_modernization_date;
                      if (!raw) return "-";

                      // If already MM/DD/YYYY → return as is
                      if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
                        return raw;
                      }

                      // If ISO format (2026-02-25 or 2026-02-25T00:00:00)
                      const d = new Date(raw);
                      if (Number.isNaN(d.getTime())) return "-";

                      return d.toLocaleDateString("en-US");
                    })()}
                  />

                  <DetailCard
                    title="Speed (in m/s)"
                    value={
                      Number(data?.data?.specification?.speed).toFixed(2) +
                      " (m/s)"
                    }
                  />
                  <DetailCard
                    title="Height"
                    value={data?.data?.specification?.height + " m"}
                  />
                  <DetailCard
                    title="Floor"
                    value={`${data?.data?.specification.floor_from} to ${data?.data?.specification.floor_to} Floor`}
                  />
                  <DetailCard
                    title="Equipment Life"
                    value={`${data?.data?.equipment_life + " years"}`}
                  />
                  <DetailCard
                    title="Installed On"
                    value={`${data?.data?.year_of_installation}`}
                  />
                  <DetailCard
                    title="Equipment Type"
                    value={`${data?.data?.equipment_type}`}
                  />
                  <DetailCard
                    title="Model Number"
                    value={`${data?.data?.model_number}`}
                  />
                  <DetailCard
                    title="Group Name"
                    value={`${data?.data?.group_name}`}
                  />
                  <DetailCard
                    title="Brand Name"
                    value={`${data?.data?.brand_name}`}
                  />
                  <DetailCard
                    title="Subscription Name"
                    value={`${data?.data?.subscription_name}`}
                  />
                </div>
              </div>
            </div>
          </div>
          <SpecificationInformation
            specification={data?.data?.specification}
            equipment_type={data?.data?.equipment_type}
          />

          {/* Additional sections */}
          <KpiParameters
            contract_kpis={data?.data?.linked_contracts?.contract_kpis}
          />
          <RecommenededYearParamteres list={list} />
          <CapitalBudget data={data?.data?.capital_budget} />
          <ConditionAdvisoryNotes data={data?.data?.capital_budget} />
          <ContractInformation
            contractinformation={data?.data?.linked_contracts}
          />
        </>
      )}
    </div>
  );
}

const DetailCard = ({ title, value }) => {
  return (
    <div className="bg-bg_primary rounded-2xl p-4">
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

export function ConditionAdvisoryNotes({ data }) {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">
        Condition & Advisory Notes
      </p>

      <div className="grid grid-cols-2 gap-2 mt-8">
        <ConditionCard
          title="Recommendation"
          value={data?.recomendation ?? "-"}
        />
        <ConditionCard title="Risk" value={data?.risk ?? "-"} />
      </div>
      <div className="mt-2">
        <ConditionCard title="ES Comments" value={data?.es_comments ?? "-"} />
      </div>
    </div>
  );
}

const ConditionCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

function CapitalBudgetSingleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start gap-5">
        {/* Left Image */}
        <div className="w-[328px] h-[530px] bg-gray-200 rounded-2xl" />

        {/* Right Side */}
        <div className="flex-1">
          {/* Title Section */}
          <div className="flex items-start justify-between">
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded" />

              <div className="flex items-center gap-2 mt-3">
                <div className="h-5 w-20 bg-gray-200 rounded-full" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* KPI Cards Skeleton (3 cards) */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-20 bg-gray-300 rounded" />
                  <div className="h-6 w-24 bg-gray-300 rounded" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Detail Cards */}
          <div className="space-y-2 mt-5">
            <div className="grid grid-cols-2 gap-2">
              {[1, 2].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl p-4 space-y-2">
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                  <div className="h-4 w-48 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            <div className="bg-gray-200 rounded-2xl p-4 space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-4 w-64 bg-gray-300 rounded" />
            </div>

            <div className="bg-gray-200 rounded-2xl p-4 space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-4 w-4/5 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Condition Advisory Notes */}
      <div className="bg-gray-200 rounded-xl p-6 mt-5">
        <div className="h-6 w-56 bg-gray-300 rounded" />

        <div className="grid grid-cols-2 gap-2 mt-8">
          {[1, 2].map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-2xl p-4 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-44 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        <div className="mt-2 bg-gray-300 rounded-2xl p-4 space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Capital Budget Component Skeleton */}
      <div className="bg-gray-200 rounded-xl mt-5 p-6 h-[300px]" />
    </div>
  );
}
