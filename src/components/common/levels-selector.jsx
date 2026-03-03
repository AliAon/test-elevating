import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetsAccessQuery } from "@/redux/services/capital-buget-api";
import { useSelector } from "react-redux";

export default function LevelsSelector({
  level1,
  setLevel1,
  level2,
  setLevel2,
  level3,
  setLevel3,
  setSelectedState = () => {},
}) {
  const { subscription_id } = useSelector((state) => state.subscription_id);

  const { data: access } = useGetsAccessQuery(
    { es_subscription_id: subscription_id },
    { skip: !subscription_id },
  );

  const level_1_options =
    access?.data?.accesses?.map((level_1) => ({
      value: level_1,
      label: level_1?.level1_name,
    })) || [];

  const level_2_options =
    level1?.accessLevel2s?.map((level_2) => ({
      value: level_2,
      label: level_2?.level2_name,
    })) || [];

  const level_3_options =
    level2?.access_level3?.map((level_3) => ({
      value: level_3?.level3_id,
      label: level_3?.level3_name,
    })) || [];

  useEffect(() => {
    if (level_1_options.length > 0) {
      setLevel1(level_1_options[0].value);
      setLevel2(null);
      setLevel3(null);
      setSelectedState(null);
    }
  }, [level_1_options]);

  useEffect(() => {
    if (level1 && level_2_options.length > 0) {
      setLevel2(level_2_options[0].value);
      setLevel3(null);
      setSelectedState(null);
    }
  }, [level1, level_2_options]);

  useEffect(() => {
    if (level2 && level_3_options.length > 0) {
      const value = level_3_options[0].value;
      setLevel3(value);
      setSelectedState(value);
    }
  }, [level2, level_3_options]);

  return (
    <div className="flex items-center gap-1">
      <Select value={level1} onValueChange={setLevel1}>
        <SelectTrigger className="w-[165px] min-h-11 bg-[#F6F6F8] rounded-l-full font-semibold text-black">
          <SelectValue placeholder="Select Level 1" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {level_1_options.length === 0 ? (
            <p className="text-sm text-text_secondary text-center">
              No option available
            </p>
          ) : (
            level_1_options.map((item) => (
              <SelectItem key={item?.value} value={item?.value}>
                {item?.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={level2} onValueChange={setLevel2}>
        <SelectTrigger className="w-[171px] min-h-11 bg-[#F6F6F8] rounded-none">
          <SelectValue placeholder="Select Level 2" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {level_2_options.length === 0 ? (
            <p className="text-sm text-text_secondary text-center">
              No option available
            </p>
          ) : (
            level_2_options.map((item) => (
              <SelectItem key={item?.value} value={item?.value}>
                {item?.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={level3} onValueChange={setLevel3}>
        <SelectTrigger className="w-[205px] min-h-11 bg-[#F6F6F8] rounded-r-full">
          <SelectValue placeholder="Select Building" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {level_3_options.length === 0 ? (
            <p className="text-sm text-text_secondary text-center">
              No option available
            </p>
          ) : (
            level_3_options.map((item) => (
              <SelectItem key={item?.value} value={item?.value}>
                {item?.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
