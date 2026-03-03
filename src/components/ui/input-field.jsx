import React from "react";
import { Input } from "./input";
import { Switch } from "./switch";
import { Checkbox } from "./checkbox";

export default function InputField({
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
  onKeyDown,
  type = "text",
  error,
  className = {},
  disabled = false,
  showCheckbox = false,
  checked = false,
  onCheckedChange,
  required = false,
}) {
  return (
    <div
      className={`w-full flex items-center justify-between bg-white rounded-md gap-5 px-2 pt-1 ${
        !checked ? "pb-2" : "pb-4"
      } ${className.Wrapper}`}>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor={label}
            className="text-sm text-text_secondary font-medium">
            {label} <span className="text-red-500">{required && "*"}</span>
          </label>
          {showCheckbox && (
            <div className="flex items-center gap-2">
              <label
                htmlFor={"checkbox"}
                className="text-xs text-text_secondary font-medium">
                Attend Next Business Day
              </label>
              <Checkbox
                id={"checkbox"}
                checked={checked}
                onCheckedChange={onCheckedChange}
              />
            </div>
          )}
        </div>
        {!checked && (
          <div className="flex items-center gap-2">
            {start_icon && (
              <img src="/assets/svg/search.svg" alt="" width={18} height={18} />
            )}
            <Input
              id={label}
              value={value}
              name={name}
              onKeyDown={onKeyDown}
              onChange={onChange}
              placeholder={placeholder}
              type={type}
              className={`flex-1 h-8 px-4 outline-none focus:shadow-none focus:ring-0 border-[#06060600] text-sm text-text_primary font-semibold px-2 placeholder:text-text_secondary/30 bg-[#06060605] ${className.Input}`}
              disabled={disabled}
            />
            {unit && (
              <p className="text-sm text-text_secondary font-medium">{unit}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
        )}
      </div>

      {isSwitch && (
        <Switch checked={available} onCheckedChange={setAvailable} />
      )}
    </div>
  );
}

export function InputFieldSkeleton() {
  return (
    <div className="w-full flex items-center justify-between bg-white rounded-lg gap-5 px-4 pt-4 pb-2 animate-pulse">
      <div className="flex-1">
        <div className="w-24 h-4 bg-gray-200 rounded-md mb-2" />

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />

          <div className="flex-1 h-8 bg-gray-200 rounded-md" />

          <div className="w-10 h-4 bg-gray-200 rounded-md" />
        </div>

        <div className="w-32 h-3 bg-gray-200 rounded-md mt-2" />
      </div>

      <div className="w-10 h-6 bg-gray-200 rounded-full" />
    </div>
  );
}
