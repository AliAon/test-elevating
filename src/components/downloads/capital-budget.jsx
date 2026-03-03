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
import { useLazyGetCapitalBudgetSummaryQueryReportQuery } from "@/redux/services/call-backs-api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
const csvConfig = mkConfig({
  filename: "capital_budjet_export",
  useKeysAsHeaders: true,
  // optionally override defaults:
  fieldSeparator: ",",
  quoteStrings: '"',
  useBom: true,
});
export default function CapitalBudget() {
  const user = useUser();
  const { data } = useGetLvl3ListQuery({
    search: null,
    page: null,
    limit: 100,
    clientId: user?.es_subscriptions[0]?.client_id,
  });
  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const [
    getCapitalBudgetSummaryQueryReport,
    { isLoading: isLoadingEquipments },
  ] = useLazyGetCapitalBudgetSummaryQueryReportQuery();
  const regionOptions = data?.data?.map((item) => item.state);

  // --- YUP VALIDATION SCHEMA ---
  const validationSchema = Yup.object().shape({
    dateFrom: Yup.string().required("Start date is required"),
    dateTo: Yup.string()
      .required("End date is required")
      .test("is-after", "End date must be after start date", function (value) {
        return new Date(value) >= new Date(this.parent.dateFrom);
      }),
    region: Yup.string().required("Region is required"),
    siteId: Yup.string().required("Site is required"),
    buildingId: Yup.string().required("Building is required"),
    oemId: Yup.string().required("OEM is required"),
  });

  return (
    <div>
      <Formik
        initialValues={{
          dateFrom: "",
          dateTo: "",
          region: "",
          buildingId: "",
          siteId: "",
          oemId: "",
          equipmentType: "all",
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { resetForm }) => {
          const payload = {
            ...values,
          };
          const filterObject = {
            dateFrom: format(payload.dateFrom, "yyyy-MM-dd"),
            dateTo: format(payload.dateTo, "yyyy-MM-dd"),
            es_subscription_id,
            region: payload.region,
            siteId: payload.siteId,
            buildingId: payload.buildingId,
            // oemId: payload.oemId,
            equipmentType: payload.equipmentType,
          };
          if (payload.equipmentType === "all")
            delete filterObject.equipmentType;

          const result = await getCapitalBudgetSummaryQueryReport(filterObject);
          // Extract the data array
          const dataForCSV = result?.data?.data || [];

          const flatDataForCSV = dataForCSV?.map((item) => ({
            equipment_id: item.equipment_id,
            building_id: item.building_id,
            equipment_name: item.equipment_name,
            equipment_type: item.equipment_type,
            brand_id: item.brand_id,
            // Flatten capital_budget
            replacement_recomendation:
              item.capital_budget?.replacement_recomendation,
            es_comments: item.capital_budget?.es_comments,
            recomended_replacement_year:
              item.capital_budget?.recomended_replacement_year,
            max_price: item.capital_budget?.max_price,
            min_price: item.capital_budget?.min_price,
            recomendation: item.capital_budget?.recomendation,
            risk: item.capital_budget?.risk,
            year_of_installation: item?.capital_budget?.year_of_installation,
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

              {/* REGION */}
              <div className="flex flex-col gap-2">
                <Autocomplete
                  items={regionOptions}
                  onSelect={(val) => setFieldValue("region", val)}
                  label="Region"
                />
                <ErrorMessage
                  name="region"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* SITE */}
              <div className="flex flex-col gap-2">
                <label className="text-base font-semibold text-text_primary mb-2">
                  Site
                </label>
                <Select
                  value={values.siteId}
                  onValueChange={(val) => setFieldValue("siteId", val)}
                >
                  <SelectTrigger className="bg-white py-6.5 px-4 w-full rounded-2xl border border-[#EAECEF] text-sm text-text_primary font-semibold placeholder:text-[#898EA6] shadow-none">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent className={"w-full"}>
                    {data?.data
                      ?.filter((item) => item.state == values.region)
                      ?.map((item) => (
                        <SelectItem key={item.city} value={item.city}>
                          {item.city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="siteId"
                  component="p"
                  className="text-red-500 text-sm"
                />
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
                      {data?.data
                        ?.filter((item) => item?.state == values?.region)
                        ?.map((item) => (
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
