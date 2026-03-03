import CapitalBudget from "@/components/equipments/equipment-details/capital-budget";
import KpiParameters from "@/components/equipments/equipment-details/kpi-parameters";
import { Button } from "@/components/ui/button";
import {
  useGetEquipmentByIdQuery,
  useGetGroupByIdQuery,
} from "@/redux/services/groups";
import { useGetServiceContractByIdQuery } from "@/redux/services/service-contracts";
import React from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import AdminCapitalBudgetSingleSkeleton from "./capital-budget-skeleton";
import RecommenededYearParamteres from "@/components/equipments/equipment-details/RecommenededYearParamteres";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export default function AdminCapitalBudgetSingle() {
  const { id } = useParams();

  const { data, isLoading } = useGetEquipmentByIdQuery(id, { skip: !id });
  const {
    equipment_name,
    equipment_type,
    equipment_life,
    brand_name,
    equipment_id,
    capital_budget,
    group_id,
    es_pulse_equipment_number,
    oem_service_equipment_number,
    client_equipment_number,
    group_name,
    design_code,
    year_of_installation,
    next_modernization_date,
    last_modernization_date,
    last_modernization_parts,
    specification,
    status,
    model_number,
  } = data?.data || {};

  const { data: groupData } = useGetGroupByIdQuery(group_id, {
    skip: !group_id,
  });

  const { isLoading: isLoadingContract } = useGetServiceContractByIdQuery(
    groupData?.service_contract_id,
    {
      skip: !groupData?.service_contract_id,
    },
  );

  const {
    design_type,
    function_type,
    max_load,
    stops,
    speed,
    height,
    width,
    length,
    suspension_type,
    travel,
    floor_from,
    floor_to,
    controller_model,
    drive_model,
    door_controller_model,
    door_controller_brand,
    in_car_media_model,
    in_car_media_brand,
  } = specification || {};

  const toK = (value) => `${value / 1000}K`;

  const caplist = [
    {
      icon: "/assets/svg/equp-5.svg",
      icon_bg: "#248EA526",
      title: "Age",
      value: `${new Date().getFullYear() - year_of_installation} Years`,
      time_left: "",
    },
    {
      icon: "/assets/svg/equp-5.svg",
      icon_bg: "#248EA526",
      title: "Life",
      value: `${equipment_life} Years`,
      time_left: "",
    },
    {
      icon: "/assets/svg/capital-5.svg",
      icon_bg: "#C2285A26",
      title: "Replacement Year",
      value: `${capital_budget?.recomended_replacement_year} `,
      time_left: "Recommended",
    },

    {
      icon: "/assets/svg/equp-6.svg",
      icon_bg: "#F06B3C26",
      title: "Capital Budget",
      value: `${toK(capital_budget?.min_price)} - ${toK(capital_budget?.max_price)}`,
      time_left: "",
    },
  ];

  if (isLoading) {
    return <AdminCapitalBudgetSingleSkeleton />;
  }
  const breadlist = [
    {
      item: "Capital Budget",
      link: "/admin/capital-budget",
    },

    {
      item: `Capital Budget Detail`,
      link: "#",
    },
    {
      item: `Capital Budget Equipment Detail`,
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={breadlist} />

      <div className="flex items-start gap-5">
        <div className="w-[328px] h-full flex items-center justify-center border border-[#EAECEF] rounded-2xl">
          <img src="/assets/png/equip-1.png" alt="" className="w-full h-full" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl text-text_primary font-semibold">
                {equipment_name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <p className="bg-[#EAECEF] rounded-full text-xs text-[#5B617F] font-medium px-2 py-1">
                  {equipment_type}
                </p>
                <p className="text-sm text-text_secondary font-medium">
                  {brand_name} / {model_number} | {design_code} (Base
                  Compliance)
                </p>
              </div>
            </div>
            <div>
              <Link
                to={`/admin/capital-budget/single-equipment/edit-capital-budget/${equipment_id}`}
              >
                <Button
                  className={
                    "bg-bg_secondary text-text_primary rounded-full font-semibold"
                  }
                >
                  Edit Capital Budget
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <DetailCard
              title="ES Pulse Equipment Number"
              value={es_pulse_equipment_number}
            />
            <DetailCard
              title="OEM/Service Equipment Number"
              value={oem_service_equipment_number}
            />
            <DetailCard
              title="Client Equipment Number"
              value={client_equipment_number}
            />
            <DetailCard title="Group Name" value={group_name} />
            <DetailCard title="Design Code" value={design_code} />
            <DetailCard title="Manufacturer" value={brand_name} />
            <DetailCard
              title="Year of Installation"
              value={year_of_installation}
            />
            <DetailCard
              title="Last Modernization Date"
              value={dayjs(last_modernization_date).format("YYYY-MM-DD")}
            />
            <DetailCard
              title="Last Modernized Parts"
              value={last_modernization_parts}
            />

            <DetailCard title="Equipment Life" value={equipment_life} />
            <DetailCard title="Status" value={status} />
            <DetailCard
              title="Next Modernization Date"
              value={dayjs(next_modernization_date).format("YYYY-MM-DD")}
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
              value={
                data?.data?.last_modernization_date
                  ? new Date(
                      data?.data?.last_modernization_date,
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <DetailCard
              title="Floor"
              value={`${data?.data?.specification.floor_from} to ${data?.data?.specification.floor_to} Floor`}
            />

            <DetailCard
              title="Model Number"
              value={`${data?.data?.model_number}`}
            />

            <DetailCard
              title="Subscription Name"
              value={`${data?.data?.subscription_name}`}
            />

            <DetailCard title="Sub-Type" value="MRL (Machine Room Less)" />
            <DetailCard title="Purpose" value="Passenger" />
            <DetailCard
              title="Capacity (in KGs)"
              value={data?.data?.specification?.max_load}
            />
            <DetailCard
              title="Stops"
              value={data?.data?.specification?.stops}
            />
            <DetailCard
              title="Speed (in m/s)"
              value={data?.data?.specification?.speed}
            />
            <DetailCard
              title="Height"
              value={data?.data?.specification?.height}
            />

            <DetailCard
              title="Equipment Type"
              value={`${data?.data?.equipment_type}`}
            />

            <DetailCard
              title="Brand Name"
              value={`${data?.data?.brand_name}`}
            />
          </div>
        </div>
      </div>
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <p className="text-2xl font-semibold text-black">
          Specification Information
        </p>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2 mt-8">
            {Array.from({ length: 18 }).map((_, index) => (
              <DetailCardSkeleton key={index} bg="white" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-8">
            {renderCard("Design Type", design_type)}
            {renderCard("Function Type", function_type)}
            {renderCard("Max Load", max_load)}
            {renderCard("Stops", stops)}
            {renderCard("Speed", speed)}
            {renderCard("Height", height)}
            {renderCard("Width", width)}
            {renderCard("Length", length)}
            {renderCard("Suspension Type", suspension_type)}
            {renderCard("Travel", travel)}

            <DetailCard
              bg="white"
              title="Floor From & To"
              value={`${floor_from} - ${floor_to}`}
            />

            {renderCard("Controller Model", controller_model)}
            {renderCard("Drive Model", drive_model)}
            {renderCard("Door Controller Brand", door_controller_brand)}
            {renderCard("Door Controller Model", door_controller_model)}
            {renderCard("In Car Media Brand", in_car_media_brand)}
            {renderCard("In Car Media Model", in_car_media_model)}
          </div>
        )}
      </div>
      <KpiParameters />
      <RecommenededYearParamteres list={caplist} />

      <ConditionAdvisoryNotes data={data?.data} />
      {/* Show only CapitalBudjet when difference is 10 years or less between year of installation and recomended replacement year */}

      <CapitalBudget
        data={data?.data?.capital_budget}
        isLoading={isLoading}
        year_of_installation={year_of_installation}
      />
      <ContractInformation
        contractData={data?.data?.linked_contracts}
        isLoading={isLoadingContract}
      />
    </div>
  );
}

const DetailCard = ({ title, value, bg = "#f6f6f8" }) => {
  return (
    <div
      style={{ backgroundColor: bg }}
      className="bg-bg_primary rounded-lg p-4"
    >
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

function ConditionAdvisoryNotes({ data }) {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">
        Condition & Advisory Notes
      </p>

      <div className="grid grid-cols-2 gap-2 mt-8">
        <ConditionCard
          title="Recommendation"
          value={data?.capital_budget?.recomendation ?? "-"}
        />
        <ConditionCard title="Risk" value={data?.capital_budget?.risk ?? "-"} />
      </div>
      <div className="mt-2">
        <ConditionCard
          title="ES Comments"
          value={data?.capital_budget?.es_comments ?? "-"}
        />
      </div>
    </div>
  );
}
function ContractInformation({ contractData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <p className="text-2xl font-semibold text-black">
          Contract Information
        </p>
        <div className="grid grid-cols-3 gap-2 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 h-16 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <p className="text-2xl font-semibold text-black">
          Contract Information
        </p>
        <p className="text-center text-gray-500 mt-8">
          No contract information available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black mb-6">
        Contract Information
      </p>

      {/* Contract Details */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Contract Details
        </p>
        <div className="grid grid-cols-3 gap-2">
          <ConditionCard
            title="Contract Number"
            value={contractData?.contract_number || "N/A"}
          />
          <ConditionCard
            title="Contract Name"
            value={contractData?.contract_name || "N/A"}
          />
          <ConditionCard
            title="Start Date"
            value={
              contractData?.start_date
                ? dayjs(contractData.start_date).format("DD/MM/YYYY")
                : "N/A"
            }
          />
          <ConditionCard
            title="End Date"
            value={
              contractData?.end_date
                ? dayjs(contractData.end_date).format("DD/MM/YYYY")
                : "N/A"
            }
          />
        </div>
      </div>

      {/* Service Provider Information */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Service Provider Information
        </p>
        <div className="grid grid-cols-3 gap-2">
          <ConditionCard
            title="Service Provider Name"
            value={contractData?.service_provider_name || "N/A"}
          />
          <ConditionCard title="Phone Number" value={contractData.phone_no} />
          <ConditionCard title="Email" value={contractData?.email || "N/A"} />
        </div>
      </div>

      {/* KPIs */}
      <div>
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Contract KPIs
        </p>
        <div className="grid grid-cols-3 gap-2">
          <ConditionCard
            title="Annual Safety Test Report"
            value={contractData?.annual_safety_test_report || "N/A"}
          />
          <ConditionCard
            title="Maintenance Visit Per Equipment"
            value={contractData?.maintenance_visit_per_equipment || "N/A"}
          />
          <ConditionCard
            title="Minor Response Time"
            value={contractData?.minor_response_time || "N/A"}
          />
          <ConditionCard
            title="Rate of Breakdown"
            value={contractData?.rate_of_breakdown || "N/A"}
          />
        </div>
      </div>
    </div>
  );
}

const ConditionCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

const renderCard = (title, value) => {
  if (value === null || value === undefined || value === "") return null;
  return <DetailCard bg="white" title={title} value={value} />;
};
