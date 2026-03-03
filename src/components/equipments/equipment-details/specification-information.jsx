import React from "react";
export default function SpecificationInformation({
  specification,
  equipment_type,
}) {
  const ELEVATOR = [
    { title: "Controller Model", value: specification?.controller_model },
    { title: "Suspension Type", value: specification?.suspension_type },
    {
      title: "Door Controller Brand",
      value: specification?.door_controller_brand,
    },
    {
      title: "Door Controller Model",
      value: specification?.door_controller_model,
    },
    { title: "In-Car Media Brand", value: specification?.in_car_media_brand },
    { title: "In-Car Media Model", value: specification?.in_car_media_model },
    { title: "Function Type", value: specification?.function_type },
    { title: "Design Type", value: specification?.design_type },
    { title: "Speed", value: specification?.speed + " Miles Per Hour" },
    { title: "Max Load", value: specification?.max_load },
    { title: "Length", value: specification?.length + " Meter" },
    { title: "Width", value: specification?.width + " Meter" },
    { title: "Height", value: specification?.height + "Feet" },
    { title: "Floor From", value: specification?.floor_from },
    { title: "Floor To", value: specification?.floor_to },
    { title: "Stops", value: "Maximum " + specification?.stops },
    { title: "Travel", value: specification?.travel },
    { title: "Drive Model", value: specification?.drive_model },
  ];

  const ESCALATOR = [
    { title: "Inclination", value: specification?.inclination },
    { title: "Controller Model", value: specification?.controller_model },
    { title: "Floor From", value: specification?.floor_from },
    { title: "Width", value: specification?.width + " Meter" },
    { title: "Drive Model", value: specification?.drive_model },
    { title: "Floor To", value: specification?.floor_to },
    { title: "Design Type", value: specification?.design_type },
    { title: "Speed", value: specification?.speed + " Miles Per Hour" },
    { title: "Height", value: specification?.height + " Feet" },
  ];

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">
        Specification Information
      </p>

      <div className="grid grid-cols-3 gap-2 mt-8">
        {(equipment_type === "ELEVATOR" ? ELEVATOR : ESCALATOR)?.map(
          (item, index) => (
            <Card key={index} title={item.title} value={item.value} />
          ),
        )}
      </div>
    </div>
  );
}

const Card = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};
