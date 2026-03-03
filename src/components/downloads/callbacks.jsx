import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import Selector from "../ui/selector";
import { useState, useRef, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Button } from "../ui/button";
import * as Yup from "yup";
import { useGetLvl3ListQuery } from "@/redux/services/subscription";
import { useUser } from "@/hooks/useUserType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { format } from "date-fns";
import { useLazyGetMaintenanceSummaryQueryReportQuery } from "@/redux/services/call-backs-api";
import { useSelector } from "react-redux";
const csvConfig = mkConfig({
  filename: "callbacks_export",
  useKeysAsHeaders: true,
  // optionally override defaults:
  fieldSeparator: ",",
  quoteStrings: '"',
  useBom: true,
});
export default function CallBacks() {
  const user = useUser();
  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const { data } = useGetLvl3ListQuery({
    search: null,
    page: null,
    limit: 100,
    clientId: user?.es_subscriptions[0]?.client_id,
  });
  const [getMaintenanceSummaryQueryReport, { isLoading: isLoadingEquipments }] =
    useLazyGetMaintenanceSummaryQueryReportQuery();

  // --- YUP VALIDATION SCHEMA ---
  const validationSchema = Yup.object().shape({
    dateFrom: Yup.string().required("Start date is required"),
    dateTo: Yup.string()
      .required("End date is required")
      .test("is-after", "End date must be after start date", function (value) {
        return new Date(value) >= new Date(this.parent.dateFrom);
      }),
    buildingId: Yup.string().required("Building is required"),
    oemId: Yup.string().required("OEM is required"),
  });

  return (
    <div>
      <Formik
        initialValues={{
          dateFrom: "",
          dateTo: "",
          buildingId: "",
          equipmentType: "all",
          status: "all",
          oemId: "",
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { resetForm }) => {
          const payload = {
            ...values,
          };
          const filterObject = {
            es_subscription_id,
            dateFrom: format(payload.dateFrom, "yyyy-MM-dd"),
            dateTo: format(payload.dateTo, "yyyy-MM-dd"),
            buildingId: payload.buildingId,
            oemId: payload.oemId,
            equipmentType: payload.equipmentType,
            jobType: "callback",
            status: payload.status,
          };
          if (payload.equipmentType === "all")
            delete filterObject.equipmentType;

          if (payload.status === "all") delete filterObject.status;
          const result = await getMaintenanceSummaryQueryReport(filterObject);
          // Extract the data array
          const dataForCSV = result?.data?.data?.filtered_records || [];

          const flatDataForCSV = dataForCSV.map((item) => ({
            id: item.id,
            property_id: item.property_id,
            property_name: item.property_name,
            equipment_id: item.equipment_id,
            equipment_name: item.equipment_name,
            stopped_date: item.stopped_date,
            solve_date: item.solve_date,
            status: item.status,
            problem: item.problem,

            // detailed_info (level 1)
            detailed_equipment_id: item.detailed_info?.equipment_id,
            detailed_unique_servie_id: item.detailed_info?.unique_servie_id,
            detailed_service_provider_brand:
              item.detailed_info?.service_provider_brand,
            detailed_equipment_number: item.detailed_info?.equipment_number,
            detailed_created_date: item.detailed_info?.created_date,
            detailed_jobType: item.detailed_info?.jobType,
            detailed_updated_date: item.detailed_info?.updated_date,

            // callback_data (level 2)
            callback_country: item.detailed_info?.callback_data?.country,
            callback_purchaseOrderNumber:
              item.detailed_info?.callback_data?.purchaseOrderNumber,
            callback_jobDate: item.detailed_info?.callback_data?.jobDate,
            callback_modifiedDateTime:
              item.detailed_info?.callback_data?.modifiedDateTime,
            callback_jobType: item.detailed_info?.callback_data?.jobType,
            callback_equipmentNumber:
              item.detailed_info?.callback_data?.equipmentNumber,
            callback_jobNumber: item.detailed_info?.callback_data?.jobNumber,

            // callback (level 3)
            callback_jobStatus:
              item.detailed_info?.callback_data?.callback?.jobStatus,
            callback_backInServiceDateTime:
              item.detailed_info?.callback_data?.callback
                ?.backInServiceDateTime,
            callback_isPersonTrapped:
              item.detailed_info?.callback_data?.callback?.isPersonTrapped,
            callback_description:
              item.detailed_info?.callback_data?.callback?.description,
            callback_resolution:
              item.detailed_info?.callback_data?.callback?.resolution,
            callback_callerName:
              item.detailed_info?.callback_data?.callback?.callerName,
            callback_estimatedArrivalDateTime:
              item.detailed_info?.callback_data?.callback
                ?.estimatedArrivalDateTime,
            callback_isCarBlocked:
              item.detailed_info?.callback_data?.callback?.isCarBlocked,
            callback_additionalDescription:
              item.detailed_info?.callback_data?.callback
                ?.additionalDescription,
            callback_rootCause:
              item.detailed_info?.callback_data?.callback?.rootCause,
            callback_departureDateTime:
              item.detailed_info?.callback_data?.callback?.departureDateTime,
            callback_isNoise:
              item.detailed_info?.callback_data?.callback?.isNoise,
            callback_arrivalDateTime:
              item.detailed_info?.callback_data?.callback?.arrivalDateTime,
            callback_callerPhone:
              item.detailed_info?.callback_data?.callback?.callerPhone,
          }));
          resetForm();

          if (flatDataForCSV.length === 0) {
            return;
          }
          const csvOutput = generateCsv(csvConfig)(flatDataForCSV);

          download(csvConfig)(csvOutput);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-1 gap-4">
              {/* DATE RANGE */}
              <div className="flex flex-col gap-2">
                <Label className={"text-base font-semibold"}>Date Range</Label>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                  <div>
                    <DatePicker
                      label="Start Date"
                      placeholder="Date From"
                      value={values.dateFrom}
                      onChange={(date) => setFieldValue("dateFrom", date)}
                    />
                    <ErrorMessage
                      name="dateFrom"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <DatePicker
                      label="End Date"
                      placeholder="Date To"
                      value={values.dateTo}
                      onChange={(date) => setFieldValue("dateTo", date)}
                    />
                    <ErrorMessage
                      name="dateTo"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              {/* BUILDING */}
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <label className="text-base font-semibold text-text_primary mb-2">
                    Building
                  </label>

                  <Select
                    value={values.buildingId}
                    onValueChange={(val) => setFieldValue("buildingId", val)}
                  >
                    <SelectTrigger className="bg-white py-6.5 px-4 w-full rounded-2xl border border-[#EAECEF] text-sm text-text_primary font-semibold placeholder:text-[#898EA6] shadow-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>

                    <SelectContent className={"w-full"}>
                      {data?.data?.map((item) => (
                        <SelectItem key={item?.id} value={item?.id}>
                          {item?.building_owner?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ErrorMessage
                  name="buildingId"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className={"text-base font-semibold text-text_primary"}>
                  Status
                </p>
                <ToggleGroup
                  type="single"
                  value={values.status}
                  className="flex gap-1"
                  onValueChange={(val) => {
                    setFieldValue("status", val);
                  }}
                >
                  <ToggleGroupItem
                    value="all"
                    aria-label="Toggle all"
                    className={`border font-semibold p-4 !rounded-xl  transition-colors ${
                      values.status == "all"
                        ? " !text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    All
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="open"
                    aria-label="Toggle open"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.status == "open"
                        ? " !text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    Open
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="closed"
                    aria-label="Toggle closed"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.status == "closed"
                        ? " !text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    Closed
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="pending"
                    aria-label="Toggle Pending"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.status == "pending"
                        ? " !text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    Pending
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>{" "}
              {/* EQUIPMENT TYPE */}
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-text_primary">
                  Equipment Type
                </p>

                <ToggleGroup
                  type="single"
                  value={values.equipmentType}
                  className="flex gap-1"
                  onValueChange={(val) => {
                    setFieldValue("equipmentType", val);
                  }}
                >
                  <ToggleGroupItem
                    value="all"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.equipmentType === "all"
                        ? "!text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    All
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="ESCALATOR"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.equipmentType === "ESCALATOR"
                        ? "!text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    Escalator
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="ELEVATOR"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.equipmentType === "ELEVATOR"
                        ? "!text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    Elevator
                  </ToggleGroupItem>
                </ToggleGroup>

                <ErrorMessage
                  name="equipmentType"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* OEM */}
              <div className="flex flex-col gap-2">
                <Selector
                  label="OEM"
                  options={["Schindler"]}
                  value={values.oemId}
                  placeholder="Select"
                  labelClassName="text-base font-semibold text-text_primary mb-2"
                  parentClassName="bg-transparent p-0"
                  triggerClassName="bg-white py-6.5 px-4 rounded-2xl border border-[#EAECEF] text-sm text-text_primary font-semibold placeholder:text-text_primary shadow-none placeholder:text-[#898EA6]"
                  onChange={(val) => setFieldValue("oemId", val)}
                />
                <ErrorMessage
                  name="oemId"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* SERVICE CONTRACTOR */}
              <div className="flex flex-col gap-2">
                <Button className={"w-fit"} type="submit">
                  {isLoadingEquipments ? <Loader2 /> : "Generate Report"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function Autocomplete({ items = [], onSelect, label }) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef(null);

  const filtered = items?.filter((item) =>
    item?.toLowerCase()?.includes(inputValue.toLowerCase()),
  );

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filtered.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev === 0 ? filtered.length - 1 : prev - 1,
      );
    }

    if (e.key === "Enter" && highlightIndex >= 0) {
      const selected = filtered[highlightIndex];
      setInputValue(selected);
      setOpen(false);
      onSelect?.(selected);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input with Search Icon */}

      <p className={"text-base font-semibold text-text_primary mb-2"}>
        {label}
      </p>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          className="w-full rounded-2xl  border border-[#EAECEF] bg-white px-10 py-4 text-sm focus:outline-none "
          placeholder="Search for address"
          triggerClassName="py-6.5 px-4 rounded-2xl border  border-[#EAECEF] text-sm text-text_primary font-semibold  placeholder:text-text_primary shadow-none placeholder:text-[#898EA6]"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
        />
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#EAECEF] bg-white shadow-lg max-h-60 overflow-auto">
          {filtered.map((item, index) => (
            <div
              key={index}
              onMouseDown={() => {
                setInputValue(item);
                setOpen(false);
                onSelect?.(item);
              }}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightIndex ? "bg-gray-100" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {open && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg p-3 text-center text-sm text-gray-500">
          No results found.
        </div>
      )}
    </div>
  );
}
