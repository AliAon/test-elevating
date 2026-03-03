import React from "react";
import { Input } from "./input";
import { ActiveSwitch } from "./active";

export default function InputSwitch({
  label,
  placeholder,
  unit,
  start_icon = false,
  isSwitch = false,
  value,
  name,
  onChange,
  available,
  setAvailable,
}) {
  return (
    <div className="w-full flex items-center justify-between bg-white rounded-lg gap-5 px-4 pt-4 pb-2">
      <div className="flex-1">
        <label
          htmlFor={label}
          className="text-sm text-text_secondary font-medium"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          {start_icon && (
            <img src="/assets/svg/search.svg" alt="" width={18} height={18} />
          )}
          <Input
            id={label}
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 h-8 border-0 text-sm text-text_primary font-semibold p-0 placeholder:text-text_secondary"
          />
          {unit && (
            <p className="text-sm text-text_secondary font-medium">{unit}</p>
          )}
        </div>
      </div>
      {isSwitch && (
        <ActiveSwitch checked={available} onCheckedChange={setAvailable} />
      )}
    </div>
  );
}
