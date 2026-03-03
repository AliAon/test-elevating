import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { CalendarDays, ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useGetsAccessQuery } from "@/redux/services/capital-buget-api";
import {
  setLevel1,
  setLevel2,
  setLevel3,
  setServiceContract,
  setDateFrom,
  setDateTo,
  clearFilters,
} from "@/redux/slices/subscription_id";

export default function Filters() {
  const dispatch = useDispatch();
  const {
    subscription_id,
    level_1,
    level_2,
    level_3,
    service_contract,
    date_from,
    date_to,
  } = useSelector((state) => state.subscription_id);

  const { data: access } = useGetsAccessQuery(
    { es_subscription_id: subscription_id },
    { skip: !subscription_id }
  );

  const level_1_options =
    access?.data?.accesses?.map((level_1) => ({
      value: level_1,
      label: level_1?.level1_name,
    })) || [];

  const level_2_options =
    level_1?.accessLevel2s?.map((level_2) => ({
      value: level_2,
      label: level_2?.level2_name,
    })) || [];

  const level_3_options =
    level_2?.access_level3?.map((level_3) => ({
      value: level_3,
      label: level_3?.level3_name,
    })) || [];

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {/* LEVEL 1 */}
        <Select
          value={level_1}
          onValueChange={(val) => dispatch(setLevel1(val))}
        >
          <SelectTrigger className="w-[165px] min-h-11 bg-[#F6F6F8] rounded-l-full font-semibold text-black">
            <SelectValue placeholder="Select Level 1" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {level_1_options?.length === 0 ? (
              <p className="text-sm text-text_secondary text-center">
                No option available
              </p>
            ) : (
              level_1_options?.map((item) => (
                <SelectItem key={item?.value} value={item?.value}>
                  {item?.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* LEVEL 2 */}
        <Select
          value={level_2}
          onValueChange={(val) => dispatch(setLevel2(val))}
        >
          <SelectTrigger className="w-[171px] min-h-11 bg-[#F6F6F8] rounded-none">
            <SelectValue placeholder="Select Level 2" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {level_2_options?.length === 0 ? (
              <p className="text-sm text-text_secondary text-center">
                No option available
              </p>
            ) : (
              level_2_options?.map((item) => (
                <SelectItem key={item?.value} value={item?.value}>
                  {item?.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* LEVEL 3 */}
        <Select
          value={level_3}
          onValueChange={(val) => dispatch(setLevel3(val))}
        >
          <SelectTrigger className="w-[205px] min-h-11 bg-[#F6F6F8] rounded-r-full">
            <SelectValue placeholder="Select Building" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {level_3_options?.length === 0 ? (
              <p className="text-sm text-text_secondary text-center">
                No option available
              </p>
            ) : (
              level_3_options?.map((item) => (
                <SelectItem key={item?.value} value={item?.value}>
                  {item?.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* DATES & SERVICE CONTRACT */}
      <div className="flex items-center gap-3">
        {date_from ||
          date_to ||
          level_1 ||
          level_2 ||
          level_3 ||
          (service_contract && (
            <Button
              onClick={() => dispatch(clearFilters())}
              className="min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black"
            >
              Clear
            </Button>
          ))}

        {/* FROM DATE */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-[155px] min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black border-transparent">
              <div className="flex items-center gap-2">
                <CalendarDays />
                {date_from ? date_from.toLocaleDateString() : "From Date"}
              </div>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date_from}
              onSelect={(date) => dispatch(setDateFrom(date))}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>

        {/* TO DATE */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-[155px] min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black border-transparent">
              <div className="flex items-center gap-2">
                <CalendarDays />
                {date_to ? date_to.toLocaleDateString() : "To Date"}
              </div>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date_to}
              onSelect={(date) => dispatch(setDateTo(date))}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>

        {/* SERVICE CONTRACT */}
        <Select
          value={service_contract}
          onValueChange={(val) => dispatch(setServiceContract(val))}
        >
          <SelectTrigger className="w-[148px] min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black">
            <SelectValue placeholder="All Contracts" />
          </SelectTrigger>
          <SelectContent>
            {user?.es_subscriptions[0]?.service_contracts?.map((item) => (
              <SelectItem key={item.contract_id} value={item.contract_id}>
                {item.contract_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
