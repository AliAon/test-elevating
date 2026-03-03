import React from "react";

export default function ContractInformation({ contractinformation }) {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">Contract Information</p>

      <div className="grid grid-cols-3 gap-2 mt-8">
        <Card
          title="Contract Number"
          value={contractinformation?.contract_number}
        />
        <Card
          title="Contract Name"
          value={contractinformation?.contract_name}
        />
        <Card
          title="Service Provider"
          value={contractinformation?.service_provider_details?.service_provider_name}
        />
        <Card
          title="Start Date"
          value={new Date(contractinformation?.start_date).toLocaleDateString()}
        />
        <Card
          title="End Date"
          value={new Date(contractinformation?.end_date).toLocaleDateString()}
        />
        <Card
          title="Contract Status"
          value={contractinformation?.active ? "Active" : "Inactive"}
        />
        <Card
          title="Contact Person"
          value={contractinformation?.service_provider_details?.contact_person_name}
        />
        <Card title="Email" value={contractinformation?.service_provider_details?.email} />
        <Card title="Phone" value={'+'+contractinformation?.service_provider_details?.country_code + ' ' + contractinformation?.service_provider_details?.phone_no} />

        <Card title="Maintenance Visit (per year)" value={contractinformation?.contract_kpis?.maintenance_visit_per_equipment + " per equipment"} />
        <Card title="Callback Rate (per year)" value={contractinformation?.contract_kpis?.rate_of_breakdown + " per equipment"} />
        <Card title="Availability" value={contractinformation?.equipment_kpis?.equipment_availability_target + "%"} />
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
