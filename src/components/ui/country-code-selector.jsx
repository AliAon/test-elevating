import React, { useEffect, useRef } from "react";
import { CountrySelector, usePhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function CountryCodeSelector({
  value,
  onChange,
  className = {},
}) {
  const { country, setCountry } = usePhoneInput({
    defaultCountry: "",
    value: value || "+61",
  });

  const containerRef = useRef(null);

  const openSelector = () => {
    const btn = containerRef.current?.querySelector("button");
    if (btn) {
      btn.click();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-[220px] h-full bg-white rounded-lg px-2 pt-1 pb-1 ${className.Wrapper}`}>
      <p className="text-sm text-text_secondary font-medium">Country Code</p>
      <div className="flex items-center gap-2">
        <CountrySelector
          selectedCountry={country.iso2}
          onSelect={(value) => {
            if (value && typeof value === "object") {
              setCountry(value.iso2);
              onChange(value.dialCode);
            } else {
              setCountry(value);
              onChange(value);
            }
          }}
        />

        <div
          className="flex items-center cursor-pointer"
          onClick={openSelector}>
          <p
            className={`max-w-[80px] text-sm font-semibold text-text_primary truncate ${className.name}`}>
            {country?.name}
          </p>
          <p className="text-sm font-semibold text-text_primary">
            (+{country?.dialCode})
          </p>
        </div>
      </div>
    </div>
  );
}
