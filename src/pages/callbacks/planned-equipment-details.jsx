import CapitalBudget from "@/components/equipments/equipment-details/capital-budget";
import ContractInformation from "@/components/equipments/equipment-details/contract-information";
import React from "react";

export default function PlannedEquipmentDetails() {
  return (
    <div>
      <div className="flex items-start gap-5">
        <div className="w-[328px] h-[530px] flex items-center justify-center border border-[#EAECEF] rounded-2xl">
          <img src="/assets/png/equip-1.png" alt="" className="w-full h-full" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl text-text_primary font-semibold">
                KONE MonoSpace® 500 DX
              </p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-sm text-text_secondary font-medium">
                  EN 81-20 / EN 81-50 (Base Compliance)
                </p>
                <p className="bg-[#EAECEF] rounded-full text-xs text-[#5B617F] font-medium px-2 py-1">
                  Fire Lift
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-8">
            <div className="grid grid-cols-3 gap-2">
              <DetailCard title="Design Code" value="EN 81-20 / EN 81-50" />
              <DetailCard title="Plant Registration Date" value="12/08/2021" />
              <DetailCard
                title="Manufacturer"
                value="KONE Corporation, Finland"
              />
              <DetailCard title="Installed On" value="2022" />
              <DetailCard
                title="Latest Modernisation Date"
                value="2025 (Controller, Door Operators) "
              />
              <DetailCard title="Sub-Type" value="MRL (Machine Room Less)" />
              <DetailCard title="Purpose" value="Passenger" />
              <DetailCard title="Capacity (in KGs)" value="450 kg – 1600 kg" />
              <DetailCard title="Stops" value="Up to 24 stops" />
              <DetailCard title="Speed (in m/s)" value="1.0 m/s – 1.75 m/s" />
              <DetailCard title="Height" value="Up to ~75 m" />
              <DetailCard title="Floor" value="Basement (B2) to 12th Floor" />
            </div>
            <DetailCard
              title="Description"
              value="Machine-room-less (MRL) passenger elevator with energy-efficient gearless traction technology. Designed for mid-rise residential and commercial buildings."
            />
          </div>
        </div>
      </div>

      <ContractInformation />
      <CapitalBudget />
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
