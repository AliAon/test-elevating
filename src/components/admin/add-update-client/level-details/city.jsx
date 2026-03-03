import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import AddressZipLookup from "@/components/ui/address-zip-lookup";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetLvl1BySubscriptionIdQuery } from "@/redux/services/subscription";
import { useCreatedSubscriptionId } from "@/redux/slices/subscriptionFlowSlice";

export const City = ({
  onChange,
  title,
  parentTitle,
  data,
  index,
  total,
  onBoarding,
}) => {
  const { createdSubscriptionId } = useCreatedSubscriptionId();

  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const { data: level1 } = useGetLvl1BySubscriptionIdQuery(
    { subscriptionId: createdSubscriptionId },
    {
      skip: !createdSubscriptionId,
    },
  );

  const level1Options = level1?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  return (
    <div className="bg-bg_primary rounded-xl p-7">
      {/*<div className="flex items-center justify-between mb-5">*/}
      {/*  <p className="text-xl text-black font-semibold">{title} #{total - index}</p>*/}
      {/*</div>*/}

      <div className="space-y-3">
        <SelectorWithObjects
          options={level1Options || []}
          label={parentTitle + "*"}
          placeholder={"Select " + parentTitle}
          value={data?.parent_level_id}
          onChange={(value) => handleInputChange("parent_level_id", value)}
        />
        <InputField
          label={title + " Name*"}
          placeholder={"Enter your " + title}
          value={data?.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        <AddressZipLookup
          country={data?.country}
          state={data?.state}
          city={data?.city}
          postalCode={data?.pin}
          onChange={(field, value) => {
            handleInputChange(field, value);

            // if (field === "country") {
            //   const dialCode = getDialCodeForCountryName(value);
            //   if (dialCode) {
            //     handleInputChange("country_code", dialCode);
            //   }
            // }
          }}
          fieldNames={{
            country: "country",
            state: "state",
            city: "city",
            postalCode: "pin",
          }}
          labels={{
            country: "Country",
            state: "State",
            city: "City",
            postalCode: "ZIP Code",
          }}
        />
        <InputField
          label="Address"
          placeholder="Enter your address"
          value={data?.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
        />
        <InputField
          label="Contact Person"
          placeholder="Enter contact person"
          value={data?.contact_person_name}
          onChange={(e) =>
            handleInputChange("contact_person_name", e.target.value)
          }
        />
        <div className="flex items-center gap-3">
          <CountryCodeSelector
            onChange={(value) => handleInputChange("country_code", value)}
            value={data?.country_code}
          />
          <div className="flex-1">
            <InputField
              label="Phone Number"
              placeholder="Enter number"
              value={data?.phone_number}
              onChange={(e) =>
                handleInputChange("phone_number", e.target.value)
              }
            />
          </div>
        </div>
        <InputField
          label="Email Address"
          placeholder="Enter your email address"
          value={data?.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </div>
    </div>
  );
};
