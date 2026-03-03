import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import Selector from "../ui/selector";
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
import { useSelector } from "react-redux";
import { useLazyGetKpiPenaltySummaryQueryReportQuery } from "@/redux/services/call-backs-api";
const csvConfig = mkConfig({
  filename: "KpiPenalty_export",
  useKeysAsHeaders: true,
  fieldSeparator: ",",
  quoteStrings: '"',
  useBom: true,
});
export default function KpiPenalty() {
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
  const [getKpiPenaltySummaryQueryReport, { isLoading: isLoadingEquipments }] =
    useLazyGetKpiPenaltySummaryQueryReportQuery();

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
          };
          if (payload.equipmentType === "all")
            delete filterObject.equipmentType;

          const result = await getKpiPenaltySummaryQueryReport(filterObject);
          // Extract the data array
          const dataForCSV = result?.data?.data?.filtered_records || [];

          const flatDataForCSV = dataForCSV.map((item) => ({
            id: item.id,
            building_id: item.building_id,
            createdAt: item.createdAt,
            building_name: item.building_name,
            down_time_hours: item.down_time_hours,
            equipment_id: item.equipment_id,
            equipment_number: item.equipment_number,
            kpi_rebate_amount: item.kpi_rebate_amount,
            month: item.month,
            no_of_callbacks: item.no_of_callbacks,
            no_of_maintenances: item.no_of_maintenances,
            status: item.status,
            trapped_events: item.trapped_events,
            year: item.year,
            updatedAt: item.updatedAt,
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
                    <SelectTrigger className="bg-white py-6.5 px-4 w-full rounded-2xl border border-[#EAECEF] text-sm text-[text_primary] font-semibold placeholder:text-[#898EA6] shadow-none">
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
                    value="70b2569b-d79d-48bf-8fae-926aa0973a5c"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.equipmentType ===
                      "70b2569b-d79d-48bf-8fae-926aa0973a5c"
                        ? "!text-primary"
                        : "border-gray-300 text-text_primary"
                    }`}
                  >
                    Escalator
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="03805085-0ee5-423a-a11f-77b55caa7ff0"
                    className={`border p-4 !rounded-xl font-semibold transition-colors ${
                      values.equipmentType ===
                      "03805085-0ee5-423a-a11f-77b55caa7ff0"
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
