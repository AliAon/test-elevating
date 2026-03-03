import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import AddressZipLookup from "@/components/ui/address-zip-lookup";
import { getDialCodeForCountryName } from "@/helpers/addressLookup";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import {
  useGetLvl1BySubscriptionIdQuery,
  useGetLvl2BySubscriptionIdQuery,
  useGetSubscriptionsQuery,
} from "@/redux/services/subscription";
import { useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";

export default function AddBuilding({
  values,
  setValues,
  handleChange,
  Onboarding,
  errors,
  touched,
}) {
  const [params] = useSearchParams();
  const buildingId = params.get("uuid");
  const { data: subscriptionsData, isLoading: isSubLoading } =
    useGetSubscriptionsQuery({ serach: "", page: 1, limit: 100 });
  const { data: clients, isLoading } = useGetAllClientsQuery({
    limit: 100,
  });
  const options = clients?.data?.map((client) => ({
    value: client.client_id,
    label: client.client_name,
  }));

  const { data: lvl1 } = useGetLvl1BySubscriptionIdQuery(
    { subscriptionId: values?.es_subscription_id },
    {
      skip: !values?.es_subscription_id,
    },
  );

  const { data: lvl2, isLoading: isLvl2Loading } =
    useGetLvl2BySubscriptionIdQuery(
      { subscriptionId: null, parentId: values?.level_1 },
      {
        skip: !values?.level_1,
      },
    );

  const contractOptions =
    subscriptionsData?.data?.map((sub) => ({
      value: sub?.subscription_id,
      label: sub?.es_subscription_name,
    })) || [];

  const lvl1Options =
    lvl1?.data?.map((level2) => ({
      value: level2?.id,
      label: level2?.name,
    })) || [];

  const lvl2Options =
    lvl2?.data?.map((level2) => ({
      value: level2?.id,
      label: level2?.name,
    })) || [];

  const isSubscriptionShow = buildingId
    ? values?.es_subscription_id && !isSubLoading
    : true;

  const isLvl2Show = buildingId
    ? values?.parent_level_id && !isLvl2Loading && subscriptionsData
    : subscriptionsData;

  const level_1_label =
    subscriptionsData?.data?.find(
      (sub) => sub?.subscription_id === values?.es_subscription_id,
    )?.level_config?.level_1?.name || "level 1";

  const level_2_label =
    subscriptionsData?.data?.find(
      (sub) => sub?.subscription_id === values?.es_subscription_id,
    )?.level_config?.level_2?.name || "level 2";

  return (
    <div>
      <form className="bg-bg_primary rounded-xl p-8 mt-5 space-y-6">
        {!Onboarding && (
          <div className="flex flex-row items-center gap-4 mb-2">
            <h3 className="font-bold text-gray-400 uppercase mb-0">
              Building Mapping
            </h3>
            <hr className="flex-grow text-gray-300" />
          </div>
        )}
        <div className="space-y-3">
          {/* {!Onboarding && (
            <div className="space-y-3 mt-4">
              <SelectorWithObjects
                label="Select Subscription"
                value={values.es_subscription_id}
                onChange={(val) => setValues("es_subscription_id", val)}
                options={contractOptions}
                placeholder="Select subscription"
                disabled={isSubLoading}
              />
            </div>
          )} */}
          {!Onboarding && (
            <div className="space-y-3 mt-4">
              {" "}
              {isLoading ? (
                <div className="flex space-y-3  items-center ">
                  <Loader className="animate-spin" size={20} />
                </div>
              ) : (
                <SelectorWithObjects
                  label={"Choose a Client"}
                  options={options}
                  value={values?.client_id}
                  onChange={(value) => setValues("client_id", value)}
                  disabled={isLoading}
                />
              )}
            </div>
          )}
          {!Onboarding &&
            (isSubLoading ? (
              <div className="flex space-y-3  items-center ">
                <Loader className="animate-spin" size={20} />
              </div>
            ) : (
              <SelectorWithObjects
                label="Select Subscription"
                value={values.es_subscription_id}
                onChange={(val) => setValues("es_subscription_id", val)}
                options={contractOptions}
                placeholder="Select subscription"
                disabled={isSubLoading}
              />
            ))}

          {subscriptionsData &&
            !Onboarding &&
            (isSubLoading ? (
              <div className="flex space-y-3  items-center ">
                <Loader className="animate-spin" size={20} />
              </div>
            ) : (
              <SelectorWithObjects
                label={`Select ${level_1_label}`}
                value={values.level_1}
                onChange={(val) => setValues("level_1", val)}
                options={lvl1Options}
                placeholder="Select parent level"
                disabled={!values.es_subscription_id}
              />
            ))}

          {!Onboarding &&
            (isSubLoading ? (
              <div className="flex space-y-3  items-center ">
                <Loader className="animate-spin" size={20} />
              </div>
            ) : (
              <SelectorWithObjects
                label={`Select ${level_2_label}`}
                value={values.parent_level_id}
                onChange={(val) => setValues("parent_level_id", val)}
                options={lvl2Options}
                placeholder="Select parent level"
                disabled={!values?.level_1}
              />
            ))}
        </div>

        <div className="flex flex-row items-center gap-4 mb-2">
          <h3 className="font-bold text-gray-400 uppercase mb-0">
            Building Details
          </h3>
          <hr className="flex-grow text-gray-300" />
        </div>
        <div className="space-y-3 mt-4">
          <InputField
            label="Name of the Building"
            placeholder="Enter building name"
            value={values.name}
            onChange={handleChange}
            name="name"
            error={touched.name && errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Building Category"
              placeholder="Enter building category"
              value={values.building_category}
              onChange={handleChange}
              name="building_category"
            />
            <InputField
              label="Total Floors"
              placeholder="Enter total floors"
              value={values.total_floors}
              onChange={handleChange}
              name="total_floors"
              type="number"
              error={touched.total_floors && errors.total_floors}
              required
            />
          </div>

          <div className="flex flex-row items-center gap-4 mb-2 mt-4">
            <h3 className="font-bold text-gray-400 uppercase mb-0">
              Building Address
            </h3>
            <hr className="flex-grow text-gray-300" />
          </div>
          <AddressZipLookup
            country={values.country}
            state={values.state}
            city={values.city}
            postalCode={values.postal_code}
            onChange={(field, value) => {
              setValues(field, value);

              if (field === "country") {
                const dialCode = getDialCodeForCountryName(value);
                if (dialCode) {
                  setValues("country_code", dialCode);
                }
              }
            }}
            errors={errors}
            touched={touched}
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
              postalCode: "Postal Code",
            }}
          />

          <InputField
            label="Address"
            placeholder="Enter address"
            value={values.address}
            onChange={handleChange}
            name="address"
          />

          <div className="grid grid-cols-3 gap-3">
            <InputField
              label="Contact Person"
              placeholder="Enter contact person"
              value={values.contact_person_name}
              onChange={handleChange}
              name="contact_person_name"
            />
            <InputField
              label="Contact Person Job Title"
              placeholder="Enter job title"
              value={values.contact_person_job_title}
              onChange={handleChange}
              name="contact_person_job_title"
            />
            <InputField
              label="Contact Person Organization"
              placeholder="Enter organization"
              value={values.contact_person_organization}
              onChange={handleChange}
              name="contact_person_organization"
            />
          </div>

          <div className="flex gap-3 items-center">
            <CountryCodeSelector
              value={values.country_code}
              onChange={(val) => setValues("country_code", val)}
            />
            <InputField
              label="Phone Number"
              placeholder="Enter phone number"
              value={values.phone_number}
              onChange={handleChange}
              name="phone_number"
            />
          </div>

          <InputField
            label="Email Address"
            placeholder="Enter email address"
            value={values.email}
            onChange={handleChange}
            name="email"
          />
        </div>
      </form>
      <div>
        <h1 className="text-2xl font-bold py-4">Building Owner</h1>
        <form className="bg-bg_primary rounded-xl p-8 space-y-6">
          <InputField
            label="Building Owner Name"
            placeholder="Enter building owner name"
            value={values.building_owner?.name}
            onChange={handleChange}
            name="building_owner.name"
          />
          <InputField
            label="Email Address"
            placeholder="Enter email address"
            value={values.building_owner?.email}
            onChange={handleChange}
            name="building_owner.email"
          />

          <div className="flex gap-3 items-center">
            <CountryCodeSelector
              value={values.building_owner?.country_code}
              onChange={(val) => setValues("building_owner.country_code", val)}
            />
            <InputField
              label="Phone Number"
              placeholder="Enter phone number"
              value={values.building_owner?.phone_number}
              onChange={handleChange}
              name="building_owner.phone_number"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
