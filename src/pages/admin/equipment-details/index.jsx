import { Button } from "@/components/ui/button";
import { useGetEquipmentByIdQuery } from "@/redux/services/groups";
import { PDFDownloadLink } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { ChevronRight, Download } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentDetailsPDF from "./pdf/EquipmentDetailsPDF";
import ContractInformation from "@/components/equipments/equipment-details/contract-information";
import CapitalBudget from "@/components/equipments/equipment-details/capital-budget";
import KpiParameters from "@/components/equipments/equipment-details/kpi-parameters";
import { ConditionAdvisoryNotes } from "@/pages/capital-budget/capital-budget-single";
import RecommenededYearParamteres from "@/components/equipments/equipment-details/RecommenededYearParamteres";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export default function AdminEquipmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useGetEquipmentByIdQuery(id, { skip: !id });
  const toK = (value) => `${value / 1000}K`;

  const {
    equipment_id,
    group_id,
    equipment_name,
    es_pulse_equipment_number,
    oem_service_equipment_number,
    client_equipment_number,
    group_name,
    design_code,
    brand_name,
    year_of_installation,
    next_modernization_date,
    last_modernization_date,
    last_modernization_parts,
    equipment_life,
    specification,
    equipment_status,
    equipment_type,
    model_number,
    subscription_name,
    capital_budget,
    createdAt,
  } = data?.data || {};

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
  const list = [
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
  const equipmentlist = [
    {
      item: "Group List",
      link: "/admin/groups",
    },
    {
      item: `Group Detail`,
      link: `/admin/equipments?group_id=${group_id}`,
    },
    {
      item: `Equipment Detail`,
      link: `/admin/equipment-details/${id}`,
    },
  ];

  return (
    <div>
      <Breadcrumbs list={equipmentlist} />

      <div className="flex items-start gap-5">
        <div className="w-[328px] h-full flex items-center justify-center border border-[#EAECEF] rounded-2xl">
          {isLoading ? (
            <div className="h-full w-full bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <img
              src="/assets/png/equip-1.png"
              alt=""
              className="w-full h-full"
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              {isLoading ? (
                <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl text-text_primary font-semibold flex items-center gap-3">
                  {equipment_name}
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
              )}
              {isLoading ? null : (
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-text_secondary font-medium">
                    {brand_name} / {model_number} | {design_code} (Base
                    Compliance)
                  </p>
                  <p className="bg-[#EAECEF] rounded-full text-xs text-[#5B617F] font-medium px-2 py-1">
                    {equipment_type}
                  </p>
                  <div className="w-[1px] h-5 bg-[#898EA6] rounded-full" />
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 border border-[#898EA6] rounded-full text-xs text-text_secondary font-medium px-2.5 py-1 cursor-pointer"
                  >
                    {group_name} <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
            {isLoading ? (
              <div></div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    navigate(`/add-equipment?equipment_id=${equipment_id}`)
                  }
                  className="w-[80px] h-13 rounded-full text-sm font-semibold"
                >
                  Edit
                </Button>
                <PDFDownloadLink
                  document={<EquipmentDetailsPDF data={data?.data} />}
                  // fileName={`equipment-${equipment.equipment_name}.pdf`}
                >
                  {({ loading }) => (
                    <Button className="w-[100px] h-13 rounded-full text-sm font-semibold">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </div>
          <div className="space-y-2 mt-8">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2 mt-8">
                {Array.from({ length: 12 }).map((_, index) => (
                  <DetailCardSkeleton key={index} />
                ))}
              </div>
            ) : (
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
                  value={dayjs(last_modernization_date).format("MM-DD-YYYY")}
                />
                <DetailCard
                  title="Last Modernized Parts"
                  value={last_modernization_parts}
                />
                <DetailCard title="Equipment Life" value={equipment_life} />
                <DetailCard
                  title="Status"
                  value={equipment_status.replaceAll("_", " ")}
                />

                <DetailCard
                  title="Next Modernization Date"
                  value={dayjs(next_modernization_date).format("MM-DD-YYYY")}
                />

                <DetailCard
                  title="OEM Service Equipment Number"
                  value={oem_service_equipment_number || "-"}
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
                  value={year_of_installation || "-"}
                />
                <DetailCard
                  title="Latest Modernisation Date"
                  value={
                    last_modernization_date
                      ? new Date(last_modernization_date).toLocaleDateString()
                      : "-"
                  }
                />

                <DetailCard
                  title="Floor"
                  value={`${specification.floor_from} to ${specification.floor_to} Floor`}
                />

                <DetailCard title="Model Number" value={`${model_number}`} />

                <DetailCard
                  title="Subscription Name"
                  value={`${subscription_name}`}
                />

                <DetailCard title="Sub-Type" value="MRL (Machine Room Less)" />
                <DetailCard title="Purpose" value="Passenger" />
                <DetailCard
                  title="Capacity (in KGs)"
                  value={specification?.max_load}
                />
                <DetailCard title="Stops" value={specification?.stops} />
                <DetailCard
                  title="Speed (in m/s)"
                  value={specification?.speed}
                />
                <DetailCard title="Height" value={specification?.height} />

                <DetailCard
                  title="Equipment Type"
                  value={`${equipment_type}`}
                />

                <DetailCard title="Brand Name" value={`${brand_name}`} />
              </div>
            )}
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
      <RecommenededYearParamteres list={list} />
      <CapitalBudget data={data?.data?.capital_budget} />

      <ConditionAdvisoryNotes data={data?.data?.capital_budget} />

      <ContractInformation contractinformation={data?.data?.linked_contracts} />
    </div>
  );
}

const DetailCard = ({ title, value, bg = "#F6F6F8" }) => {
  return (
    <div
      className="bg-bg_primary rounded-2xl p-4"
      style={{
        background: bg,
      }}
    >
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

const DetailCardSkeleton = ({ bg = "#F6F6F8" }) => {
  return (
    <div
      className="bg-bg_primary rounded-2xl p-4 animate-pulse"
      style={{
        background: bg,
      }}
    >
      <div className="h-3 w-1/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    </div>
  );
};

const renderCard = (title, value) => {
  if (value === null || value === undefined || value === "") return null;
  return <DetailCard bg="white" title={title} value={value} />;
};
