import { CalendarPicker } from "@/components/ui/calendar-picker";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";

const subscriptionTypes = [
  { label: "Premium", value: "Premium" }
];

export default function ContractInformation({
  values,
  setValues,
  handleChange,
}) {
  return (
    <div className="bg-bg_primary rounded-xl p-8 mt-5">
      <p className="text-2xl text-black font-semibold">
        Subscription Information
      </p>

      <div className="space-y-3 mt-4">
        <InputField
          label="ES Subscription Number"
          placeholder="Enter subscription number"
          value={values?.es_subscription_number}
          onChange={handleChange}
          name="es_subscription_number"
        />

        <InputField
          label="Subscription Title"
          placeholder="Enter subscription title"
          value={values?.es_subscription_name}
          onChange={handleChange}
          name="es_subscription_name"
        />
        {/*<InputField*/}
        {/*  label="Adjustment"*/}
        {/*  placeholder="Enter adjustment"*/}
        {/*  value={values?.adjustment_per_year}*/}
        {/*  onChange={handleChange}*/}
        {/*  name="adjustment_per_year"*/}
        {/*/>*/}

        <div className="grid grid-cols-2 gap-3">
          <CalendarPicker
            label="Start Date"
            value={values?.start_date}
            onChange={(date) => setValues("start_date", date)}
            placeholder="Start Date"
          />
          <CalendarPicker
            label="End Date"
            value={values?.end_date}
            onChange={(date) => setValues("end_date", date)}
            placeholder="End Date"
          />
        </div>

        <SelectorWithObjects
          label="Subscription Type"
          value={values?.subscription_type}
          options={subscriptionTypes}
          onChange={(value) => setValues("subscription_type", value)}
          placeholder="Select subscription type"
        />
      </div>
    </div>
  );
}
