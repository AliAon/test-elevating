import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import React from "react";

const TARGET_INTERVAL_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannual", label: "Biannual" },
  { value: "annually", label: "Annually" },
];

const KPI_SETTINGS_CATEGORIES = [
  {
    key: "response_time",
    label: "Response Time",
    targetLabel: "Target KPI (in %)",
    penaltyLabel: "Penalty Amount ($) per incident",
  },
  {
    key: "maintenance",
    label: "Maintenance",
    targetLabel: "Target KPI (%)",
    penaltyLabel: "Penalty Amount ($)",
  },
  {
    key: "repeat_callbacks",
    label: "Repeat Callbacks",
    targetLabel: "Target Max Repeat Failure per Equipment",
    penaltyLabel: "Penalty Amount ($) per failed equipment",
  },
  {
    key: "availability",
    label: "Availability / Uptime",
    targetLabel: "Target Uptime KPI (in %)",
    penaltyLabel: "Penalty Amount ($) per 1% below KPI target",
  },
];

export default function KpiConfig({
  values,
  handleChange,
  setFieldValue,
  errors,
  touched,
}) {
  return (
    <div>
      <p className="text-2xl text-black font-semibold">KPI Configurations</p>

      {/* CONTRACT KPIs */}
      <p className="text-base text-black font-semibold mt-5">Contract KPIs</p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <InputField
          label="Maintenance Visit Per Equipment"
          placeholder="12"
          name="contract_kpis.maintenance_visit_per_equipment"
          value={values?.contract_kpis?.maintenance_visit_per_equipment}
          onChange={handleChange}
          unit="visits/year"
          type="number"
          error={
            touched?.contract_kpis?.maintenance_visit_per_equipment &&
            errors?.contract_kpis?.maintenance_visit_per_equipment
          }
          required
        />
        <InputField
          label="Rate of Breakdown"
          placeholder="2"
          name="contract_kpis.rate_of_breakdown"
          value={values.contract_kpis.rate_of_breakdown}
          onChange={handleChange}
          unit="Technical Callbacks (Targets) & Callbacks/year"
          type="number"
          error={
            touched?.contract_kpis?.rate_of_breakdown &&
            errors?.contract_kpis?.rate_of_breakdown
          }
          required
        />
        <InputField
          label="Annual Safety Test Report"
          placeholder="1"
          name="contract_kpis.annual_safety_test_report"
          value={values.contract_kpis.annual_safety_test_report}
          onChange={handleChange}
          unit="reports/year"
          type="number"
          error={
            touched?.contract_kpis?.annual_safety_test_report &&
            errors?.contract_kpis?.annual_safety_test_report
          }
          required
        />
        <InputField
          label="Minor Response Time (Maximum)"
          placeholder="4"
          name="contract_kpis.minor_response_time"
          value={values.contract_kpis.minor_response_time}
          onChange={handleChange}
          unit="Hours"
          type="number"
        />
        <InputField
          label="Annual Man Trapped Event (Target)"
          placeholder="0"
          name="equipment_kpis.annual_man_trapped_event"
          value={values.equipment_kpis.annual_man_trapped_event}
          onChange={handleChange}
          unit="Hours"
          type="number"
          error={
            touched?.contract_kpis?.annual_man_trapped_event &&
            errors?.contract_kpis?.annual_man_trapped_event
          }
          required
        />
        <InputField
          label="Equipment Availability (Target)"
          placeholder="99.5"
          name="equipment_kpis.equipment_availability_target"
          value={values.equipment_kpis.equipment_availability_target}
          onChange={handleChange}
          unit="%"
          type="number"
          error={
            touched?.contract_kpis?.equipment_availability_target &&
            errors?.contract_kpis?.equipment_availability_target
          }
          required
        />
      </div>

      {/* EQUIPMENT KPIs */}
      <p className="text-base text-black font-semibold mt-5">Business Hours</p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <InputField
          label="Entrapment"
          placeholder="2"
          name="business_hours_response_time.entrapment.hours"
          value={values.business_hours_response_time.entrapment.hours}
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.business_hours_response_time.entrapment
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "business_hours_response_time.entrapment.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.business_hours_response_time?.entrapment?.hours &&
            errors?.business_hours_response_time?.entrapment?.hours
          }
          required
        />
        <InputField
          label="Critical Equipment Stopped"
          placeholder="4"
          name="business_hours_response_time.criticalEquipmentStopped.hours"
          value={
            values.business_hours_response_time.criticalEquipmentStopped.hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.business_hours_response_time.criticalEquipmentStopped
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "business_hours_response_time.criticalEquipmentStopped.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.business_hours_response_time?.criticalEquipmentStopped
              ?.hours &&
            errors?.business_hours_response_time?.criticalEquipmentStopped
              ?.hours
          }
          required
        />
        <InputField
          label="Non-Critical Equipment Stopped"
          placeholder="4"
          name="business_hours_response_time.nonCriticalEquipmentStopped.hours"
          value={
            values.business_hours_response_time.nonCriticalEquipmentStopped
              .hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.business_hours_response_time.nonCriticalEquipmentStopped
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "business_hours_response_time.nonCriticalEquipmentStopped.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.business_hours_response_time?.nonCriticalEquipmentStopped
              ?.hours &&
            errors?.business_hours_response_time?.nonCriticalEquipmentStopped
              ?.hours
          }
          required
        />
        <InputField
          label="Operational Equipment Fault’s"
          placeholder="4"
          name="business_hours_response_time.operationalIntermittentFaults.hours"
          value={
            values.business_hours_response_time.operationalIntermittentFaults
              .hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.business_hours_response_time.operationalIntermittentFaults
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "business_hours_response_time.operationalIntermittentFaults.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.business_hours_response_time?.operationalIntermittentFaults
              ?.hours &&
            errors?.business_hours_response_time?.operationalIntermittentFaults
              ?.hours
          }
          required
        />
        <InputField
          label="Non-Operational Equipment Fault’s"
          placeholder="4"
          name="business_hours_response_time.nonOperationalOrAestheticFaults.hours"
          value={
            values.business_hours_response_time.nonOperationalOrAestheticFaults
              .hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.business_hours_response_time.nonOperationalOrAestheticFaults
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "business_hours_response_time.nonOperationalOrAestheticFaults.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.business_hours_response_time
              ?.nonOperationalOrAestheticFaults?.hours &&
            errors?.business_hours_response_time
              ?.nonOperationalOrAestheticFaults?.hours
          }
          required
        />
      </div>

      <p className="text-base text-black font-semibold mt-5">After Hours</p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <InputField
          label="Entrapment"
          placeholder="2"
          name="after_hours_response_time.entrapment.hours"
          value={values.after_hours_response_time.entrapment.hours}
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.after_hours_response_time.entrapment
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "after_hours_response_time.entrapment.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.after_hours_response_time?.entrapment?.hours &&
            errors?.after_hours_response_time?.entrapment?.hours
          }
          required
        />
        <InputField
          label="Critical Equipment Stopped"
          placeholder="4"
          name="after_hours_response_time.criticalEquipmentStopped.hours"
          value={
            values.after_hours_response_time.criticalEquipmentStopped.hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.after_hours_response_time.criticalEquipmentStopped
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "after_hours_response_time.criticalEquipmentStopped.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.after_hours_response_time?.criticalEquipmentStopped
              ?.hours &&
            errors?.after_hours_response_time?.criticalEquipmentStopped?.hours
          }
          required
        />
        <InputField
          label="Non-Critical Equipment Stopped"
          placeholder="4"
          name="after_hours_response_time.nonCriticalEquipmentStopped.hours"
          value={
            values.after_hours_response_time.nonCriticalEquipmentStopped.hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.after_hours_response_time.nonCriticalEquipmentStopped
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "after_hours_response_time.nonCriticalEquipmentStopped.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.after_hours_response_time?.nonCriticalEquipmentStopped
              ?.hours &&
            errors?.after_hours_response_time?.nonCriticalEquipmentStopped
              ?.hours
          }
          required
        />
        <InputField
          label="Operational Equipment Fault’s"
          placeholder="4"
          name="after_hours_response_time.operationalIntermittentFaults.hours"
          value={
            values.after_hours_response_time.operationalIntermittentFaults.hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.after_hours_response_time.operationalIntermittentFaults
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "after_hours_response_time.operationalIntermittentFaults.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.after_hours_response_time?.operationalIntermittentFaults
              ?.hours &&
            errors?.after_hours_response_time?.operationalIntermittentFaults
              ?.hours
          }
          required
        />
        <InputField
          label="Non-Operational Equipment Fault’s"
          placeholder="4"
          name="after_hours_response_time.nonOperationalOrAestheticFaults.hours"
          value={
            values.after_hours_response_time.nonOperationalOrAestheticFaults
              .hours
          }
          onChange={handleChange}
          unit="Hours"
          type="number"
          showCheckbox
          checked={
            values.after_hours_response_time.nonOperationalOrAestheticFaults
              .attendance_next_business_day
          }
          onCheckedChange={(checked) => {
            handleChange({
              target: {
                name: "after_hours_response_time.nonOperationalOrAestheticFaults.attendance_next_business_day",
                value: checked,
              },
            });
          }}
          error={
            touched?.after_hours_response_time?.nonOperationalOrAestheticFaults
              ?.hours &&
            errors?.after_hours_response_time?.nonOperationalOrAestheticFaults
              ?.hours
          }
          required
        />
      </div>

      {/* KPI SETTINGS */}
      <p className="text-base text-black font-semibold mt-5">KPI Settings</p>
      <p className="text-sm text-text_secondary mt-1 mb-4">
        Define penalty rates and target intervals for each KPI category.
      </p>
      {KPI_SETTINGS_CATEGORIES.map(
        ({ key, label, targetLabel, penaltyLabel }) => (
          <div key={key} className="mb-5">
            <p className="text-sm font-semibold text-text_primary mb-2">
              {label}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label={targetLabel}
                placeholder="0"
                name={`kpi_settings.${key}.target`}
                value={values.kpi_settings?.[key]?.target ?? ""}
                onChange={handleChange}
                type="number"
                error={
                  touched?.kpi_settings?.[key]?.target &&
                  errors?.kpi_settings?.[key]?.target
                }
              />
              <InputField
                label={penaltyLabel}
                placeholder="0"
                name={`kpi_settings.${key}.penalty_rate`}
                value={values.kpi_settings?.[key]?.penalty_rate ?? ""}
                onChange={handleChange}
                type="number"
                error={
                  touched?.kpi_settings?.[key]?.penalty_rate &&
                  errors?.kpi_settings?.[key]?.penalty_rate
                }
              />
              <SelectorWithObjects
                label="Measured Frequency"
                placeholder="Select frequency"
                options={TARGET_INTERVAL_OPTIONS}
                value={values.kpi_settings?.[key]?.target_interval || ""}
                onChange={(val) =>
                  setFieldValue(`kpi_settings.${key}.target_interval`, val)
                }
                error={
                  touched?.kpi_settings?.[key]?.target_interval &&
                  errors?.kpi_settings?.[key]?.target_interval
                }
              />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
