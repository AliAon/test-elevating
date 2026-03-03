import { Checkbox } from "@/components/ui/checkbox";
import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import React, { useState } from "react";

export default function ClientContactPerson({
  values,
  setValues,
  handleChange,
}) {
  const { data: clients, isLoading } = useGetAllClientsQuery({});
  const [sameAsAbove, setSameAsAbove] = useState(false);

  const options = clients?.data?.map((client) => ({
    value: client.client_id,
    label: client.client_name,
  }));

  const handleSameAsAbove = (checked) => {
    setSameAsAbove(checked);

    if (checked) {
      setValues("subscription_owner", {
        ...values.client_contact_person,
      });
    } else {
      setValues("subscription_owner", {
        contact_person: "",
        country_code: "",
        phone_no: "",
        email: "",
      });
    }
  };

  return (
    <>
      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <p className="text-2xl text-black font-semibold">Select Client</p>
        <div className="space-y-3 mt-4">
          <SelectorWithObjects
            label={"Choose a Client"}
            options={options}
            value={values?.client_id}
            onChange={(value) => setValues("client_id", value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <p className="text-2xl text-black font-semibold">
          Client Contact Person
        </p>
        <div className="space-y-3 mt-4">
          <InputField
            label={"Contact Person"}
            placeholder={"Enter contact person"}
            value={values?.client_contact_person?.contact_person}
            onChange={handleChange}
            name={"client_contact_person.contact_person"}
          />
          <div className="flex items-center gap-3">
            <CountryCodeSelector
              onChange={(value) =>
                setValues("client_contact_person.country_code", value)
              }
              value={values?.client_contact_person?.country_code}
            />
            <div className="flex-1">
              <InputField
                label={"Phone Number"}
                placeholder={"Enter phone number"}
                value={values?.client_contact_person?.phone_no}
                onChange={handleChange}
                name={"client_contact_person.phone_no"}
              />
            </div>
          </div>
          <InputField
            label={"Email Address"}
            placeholder={"Enter email address"}
            value={values?.client_contact_person?.email}
            onChange={handleChange}
            name={"client_contact_person.email"}
          />
        </div>
      </div>

      <div className="bg-bg_primary rounded-xl p-8 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-black font-semibold">
            Subscription Owner Name
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="same-as" className="text-sm">
              Same as above
            </label>
            <Checkbox
              id="same-as"
              checked={sameAsAbove}
              onCheckedChange={handleSameAsAbove}
              className={"bg-white w-5 h-5 border border-black"}
            />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <InputField
            label={"Contract Owner"}
            placeholder={"Enter contract owner"}
            value={values?.subscription_owner?.contact_person}
            onChange={handleChange}
            name={"subscription_owner.contact_person"}
          />
          <div className="flex items-center gap-3">
            <CountryCodeSelector
              onChange={(value) =>
                setValues("subscription_owner.country_code", value)
              }
              value={values?.subscription_owner?.country_code}
            />
            <div className="flex-1">
              <InputField
                label={"Phone Number"}
                placeholder={"Enter phone number"}
                value={values?.subscription_owner?.phone_no}
                onChange={handleChange}
                name={"subscription_owner.phone_no"}
              />
            </div>
          </div>
          <InputField
            label={"Email Address"}
            placeholder={"Enter email address"}
            value={values?.subscription_owner?.email}
            onChange={handleChange}
            name={"subscription_owner.email"}
          />
        </div>
      </div>
    </>
  );
}
