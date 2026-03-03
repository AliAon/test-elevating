import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import InputSwitch from "@/components/ui/input-switch";
import React, { useState } from "react";

export default function ClientInfo() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  return (
    <div className="bg-bg_primary rounded-xl p-7">
      <p className="text-2xl text-black font-semibold">User Information</p>
      <div className="flex-1 space-y-3 mt-5">
        <div className="grid grid-cols-2 gap-3">
          <InputField label={" Name"} placeholder={"JW Marriott"} />
          <InputField
            label={"Email Address"}
            placeholder={"daniel.thompson@auslift.com"}
          />
        </div>
        <div className="flex items-center gap-3">
          <CountryCodeSelector />
          <div className="flex-1">
            <InputField label={"Phone Number"} placeholder={"29123 4567"} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={"Company Name"}
            placeholder={"Crown Hotel Limited"}
          />
          <InputField
            label={"Email Address"}
            placeholder={"daniel.thompson@auslift.com"}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label={"Password"} placeholder={"ABC@12345"} />
          <InputSwitch
            label={"Select Status"}
            isSwitch
            available={isSwitchOn}
            setAvailable={setIsSwitchOn}
            placeholder={"Active"}
          />
        </div>
      </div>
    </div>
  );
}
