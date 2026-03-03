import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { Switch } from "@/components/ui/switch";
import { getUserTypeOptions } from "@/helpers/userHelpers";
import { useGetUserTypesQuery } from "@/redux/services/user_type";
import { useSearchParams } from "react-router-dom";

export default function UserInfo({ values, setValues, handleChange }) {
  const [params] = useSearchParams();
  const type = params.get("type");
  const { data } = useGetUserTypesQuery();

  const userTypeOptions = getUserTypeOptions(data?.data || [], type);

  return (
    <div className="bg-bg_primary rounded-xl p-8 mt-5">
      <p className="text-2xl text-black font-semibold">User Information</p>

      <div className="space-y-3 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={"Name"}
            placeholder={"Enter full name"}
            value={values?.fullname}
            onChange={handleChange}
            name={"fullname"}
          />
          <InputField
            label={"Email Address"}
            placeholder={"Enter email address"}
            value={values?.email}
            onChange={handleChange}
            name={"email"}
          />
        </div>
        <div className="flex gap-4">
          <CountryCodeSelector
            onChange={(val) => setValues("country_code", val)}
            value={values.country_code}
          />
          <div className="flex-1">
            <InputField
              label={"Phone Number"}
              placeholder={"Enter phone number"}
              value={values?.phone_number}
              onChange={handleChange}
              name={"phone_number"}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={"Company Name"}
            placeholder={"Enter company name"}
            value={values?.company}
            onChange={handleChange}
            name={"company"}
          />
          <InputField
            label={"Position Title"}
            placeholder={"Enter position title"}
            value={values?.position}
            onChange={handleChange}
            name={"position"}
          />{" "}
        </div>
        <SelectorWithObjects
          label={"Select User Type"}
          placeholder={type === "es-admin" ? "Super Admin" : "Manager"}
          value={values?.user_type_id}
          onChange={(val) => {
            setValues("user_type_id", val);
          }}
          name={"user_type_id"}
          options={userTypeOptions}
        />
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={"Password"}
            placeholder={"Enter password"}
            value={values?.password}
            onChange={handleChange}
            name={"password"}
            type="password"
          />
          <div className="bg-white rounded-md py-3 px-2 flex items-center justify-between">
            <div>
              <label
                htmlFor=""
                className="text-sm font-medium text-text_secondary">
                Select Status
              </label>
              <p className="text-sm font-semibold">
                {values?.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <Switch
              checkedLabel="Active"
              uncheckedLabel="Inactive"
              checked={values?.is_active}
              onCheckedChange={(value) => setValues("is_active", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
