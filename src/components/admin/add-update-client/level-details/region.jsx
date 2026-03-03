import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import AddressZipLookup from "@/components/ui/address-zip-lookup";

export const Region = ({
  onRemove,
  title,
  onChange,
  data,
  onBoarding = false,
}) => {
  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  return (
    <div className="bg-bg_primary rounded-xl p-7">
      <div className="space-y-3 mt-5">
        <InputField
          label={title + " Name"}
          placeholder={"Enter" + title + " Name"}
          value={data?.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        <AddressZipLookup
          country={data?.country}
          state={data?.state}
          city={data?.city}
          postalCode={data?.postal_code}
          onChange={(field, value) => {
            handleInputChange(field, value);
          }}
          fieldNames={{
            country: "country",
            state: "state",
            city: "city",
            postalCode: "postal_code",
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
            value={data?.country_code || "+61"}
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
