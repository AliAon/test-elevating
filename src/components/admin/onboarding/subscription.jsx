import { Button } from "@/components/ui/button";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LevelConfig from "./level-config";
import LevelDetails from "./level-details";
import { useOnBoardSubscriptionInitialValues } from "@/helpers/onboard-sub";
import { useAdminSubFlow } from "./use-sub-flow";
import ClientContactPerson from "./client-infor";
import { useGetSubscriptionByIdQuery } from "@/redux/services/subscription";
import * as Yup from "yup";

const validationSchema = Yup.object({
  es_subscription_number: Yup.string().required(
    "Subscription number is Required",
  ),
  es_subscription_name: Yup.string().required("Subscription name is Required"),
  start_date: Yup.string().required("Start date is Required"),
  end_date: Yup.string().required("End date is Required"),
  subscription_type: Yup.string().required("Subscription type is Required"),
  client_id: Yup.string().required("Client is Required"),
  level_config: Yup.object({
    level_1: Yup.object({
      name: Yup.string().required("Level 1 name is Required"),
      availability: Yup.string().required("Level 1 availability is Required"),
    }),
    level_2: Yup.object({
      name: Yup.string().required("Level 1 name is Required"),
      availability: Yup.string().required("Level 1 availability is Required"),
    }),
  }),
});

const subscriptionTypes = [
  { label: "Premium", value: "Premium" }
];

export default function Subscription({ handleBack, handleNext: handNext }) {
  const [params] = useSearchParams();

  const clientId = params.get("clientId");
  const next = params.get("next");
  const subscriptionId = params.get("subscriptionId");
  const building_id = params.get("uuid");
  const groupId = params.get("groupId");
  const { data } = useGetSubscriptionByIdQuery(subscriptionId, {
    skip: !subscriptionId,
  });
  const subscription = data?.data;
  const navigate = useNavigate();

  const { initialValues } = useOnBoardSubscriptionInitialValues(
    clientId,
    subscription,
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
  });

  const { activeIndex, activeLevel, setActiveLevel, handleNext, isLoading } =
    useAdminSubFlow(
      formik,
      subscriptionId,
      clientId,
      building_id,
      groupId,
      navigate,
    );

  const { values, handleChange, setFieldValue, errors, touched, handleSubmit } =
    formik;
  useEffect(() => {
    if (activeIndex === 3 && next === "true") {
      handNext();
      navigate(
        `/admin/onboarding-client?clientId=${clientId}&uuid=${building_id}&subscriptionId=${subscriptionId}&groupId=${groupId}&next=false`,
        { replace: true },
      );
    }
  }, [next, activeIndex, handleNext]);

  return (
    <>
      {activeIndex !== 3 && (
        <>
          <div className="bg-bg_primary rounded-xl p-8 mt-5">
            <p className="text-2xl text-black font-semibold">
              Subscription Information
            </p>

            <div className="space-y-3 mt-4">
              <InputField
                label="Contract Number"
                placeholder="Enter contract number"
                value={values?.es_subscription_number}
                onChange={handleChange}
                name="es_subscription_number"
                error={
                  touched.es_subscription_number &&
                  errors.es_subscription_number
                }
                required
              />

              <InputField
                label="Contract Name"
                placeholder="Enter contract name"
                value={values?.es_subscription_name}
                onChange={handleChange}
                name="es_subscription_name"
                error={
                  touched.es_subscription_name && errors.es_subscription_name
                }
                required
              />
              <InputField
                label="Adjustment"
                placeholder="Enter adjustment"
                value={values?.adjustment_per_year}
                onChange={handleChange}
                name="adjustment_per_year"
              />

              <div className="grid grid-cols-2 gap-3">
                <CalendarPicker
                  label="Start Date"
                  value={values?.start_date}
                  onChange={(date) => setFieldValue("start_date", date)}
                  placeholder="Start Date"
                  error={touched.start_date && errors.start_date}
                  required
                />
                <CalendarPicker
                  label="End Date"
                  value={values?.end_date}
                  onChange={(date) => setFieldValue("end_date", date)}
                  placeholder="End Date"
                  error={touched.end_date && errors.end_date}
                  required
                />
              </div>

              <SelectorWithObjects
                label="Subscription Type"
                value={values?.subscription_type}
                options={subscriptionTypes}
                onChange={(value) => setFieldValue("subscription_type", value)}
                placeholder="Select subscription type"
                error={touched.subscription_type && errors.subscription_type}
                required
              />
            </div>
          </div>

          <ClientContactPerson
            values={values}
            setValues={setFieldValue}
            handleChange={handleChange}
          />
          <LevelConfig
            values={values}
            setValues={setFieldValue}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />
        </>
      )}

      {activeIndex === 3 && (
        <LevelDetails
          levelConfig={values.level_config}
          setValues={setFieldValue}
          values={values}
          active={activeLevel}
          setActive={setActiveLevel}
        />
      )}
      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          onClick={handleBack}
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          type="submit"
          className="min-w-[167px] h-12 rounded-full font-semibold disabled:opacity-50"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Save Subscription"
          )}
        </Button>
      </div>
    </>
  );
}
