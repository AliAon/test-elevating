import React from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ElevatorInput from "@/components/dashdoard/add-product/ElevatorInput";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateCostInfoMutation,
  useGetAllCostInfosQuery,
  useUpdateCostMutation,
} from "@/redux/services/cost-api";
import { validationSchema } from "@/components/admin/cost-info/valdiationSchem";
import { useEffect, useState } from "react";

export default function CostInfo() {
  const [createCostInfo, { isLoading }] = useCreateCostInfoMutation();
  const [updateCost, { isLoading: isUpdating }] = useUpdateCostMutation();
  const { data: costInfoData, isLoading: isFetchingCostInfo } =
    useGetAllCostInfosQuery();
  const [initialValues, setInitialValues] = useState({
    ESCALATOR_low_price: "",
    ESCALATOR_high_price: "",
    MOVING_WALK_low_price: "",
    MOVING_WALK_high_price: "",
    PLATFORM_low_price: "",
    PLATFORM_high_price: "",
    DUMB_WAITER_low_price: "",
    DUMB_WAITER_high_price: "",
    ELEVATOR: {
      2: { low_price: "", high_price: "" },
    },
  });

  useEffect(() => {
    if (costInfoData?.cost_infos && costInfoData.cost_infos.length > 0) {
      const existingCost = costInfoData.cost_infos[0];

      setInitialValues({
        ESCALATOR_low_price: existingCost.ESCALATOR?.low_price || "",
        ESCALATOR_high_price: existingCost.ESCALATOR?.high_price || "",
        MOVING_WALK_low_price: existingCost.MOVING_WALK?.low_price || "",
        MOVING_WALK_high_price: existingCost.MOVING_WALK?.high_price || "",
        PLATFORM_low_price: existingCost.PLATFORM?.low_price || "",
        PLATFORM_high_price: existingCost.PLATFORM?.high_price || "",
        DUMB_WAITER_low_price: existingCost.DUMB_WAITER?.low_price || "",
        DUMB_WAITER_high_price: existingCost.DUMB_WAITER?.high_price || "",
        ELEVATOR: existingCost.ELEVATOR || {
          2: { low_price: "", high_price: "" },
        },
      });
    }
  }, [costInfoData]);

  const renderCostFields = (
    nameLow,
    nameHigh,
    placeholderLow,
    placeholderHigh,
    errors,
    touched,
    handleChange,
    handleBlur,
    values,
  ) => (
    <div className="grid lg:grid-cols-2 gap-3">
      {/* Min Cost */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="font-medium text-gray-600 text-sm mb-1">Min Cost</p>
        <Input
          type="number"
          name={nameLow}
          placeholder={placeholderLow}
          value={values[nameLow]}
          onChange={handleChange}
          onBlur={handleBlur}
          className="font-semibold text-base text-gray-900 border border-gray-200 rounded px-2 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none focus:border-gray-300"
        />
        {touched[nameLow] && errors[nameLow] && (
          <p className="text-red-500 text-xs mt-1">{errors[nameLow]}</p>
        )}
      </div>

      {/* Max Cost */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="font-medium text-gray-600 text-sm mb-1">Max Cost</p>
        <Input
          type="number"
          name={nameHigh}
          placeholder={placeholderHigh}
          value={values[nameHigh]}
          onChange={handleChange}
          onBlur={handleBlur}
          className="font-semibold text-base text-gray-900 border border-gray-200 rounded px-2 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none focus:border-gray-300"
        />
        {touched[nameHigh] && errors[nameHigh] && (
          <p className="text-red-500 text-xs mt-1">{errors[nameHigh]}</p>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ESCALATOR: {
          high_price: values.ESCALATOR_high_price.toString(),
          low_price: values.ESCALATOR_low_price.toString(),
        },
        MOVING_WALK: {
          high_price: values.MOVING_WALK_high_price.toString(),
          low_price: values.MOVING_WALK_low_price.toString(),
        },
        PLATFORM: {
          high_price: values.PLATFORM_high_price.toString(),
          low_price: values.PLATFORM_low_price.toString(),
        },
        DUMB_WAITER: {
          high_price: values.DUMB_WAITER_high_price.toString(),
          low_price: values.DUMB_WAITER_low_price.toString(),
        },
        ELEVATOR: values.ELEVATOR,
      };

      const existingCostId = costInfoData?.cost_infos?.[0]?.id;

      if (existingCostId) {
        await updateCost({ id: existingCostId, body: payload }).unwrap();
        toast.success("Cost info updated successfully");
      } else {
        await createCostInfo(payload).unwrap();
        toast.success("Cost info created successfully");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err?.data?.message || "Failed to save cost info");
    }
  };

  if (isFetchingCostInfo) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="mt-6 space-y-4">
          {/* Equipment Types Grid Skeleton */}
          <div className="grid lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid lg:grid-cols-2 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Elevator Section Skeleton */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64 mb-5" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="grid lg:grid-cols-2 gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-full mt-4" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Skeleton className="h-11 w-24" />
          <Skeleton className="h-11 w-36" />
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        touched,
        errors,
      }) => (
        <Form>
          <div>
            <h2 className="font-bold text-3xl text-gray-900">
              {costInfoData?.cost_infos?.[0]?.id ? "Update" : "Add"} Cost Info
            </h2>
            <p className="font-medium text-base text-gray-600 mt-2">
              Set minimum and maximum costs for each equipment type
            </p>

            {/* Main Form */}
            <div className="mt-6 space-y-4">
              {/* Equipment Types Grid */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Escalator Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    Escalator
                  </h3>
                  {renderCostFields(
                    "ESCALATOR_low_price",
                    "ESCALATOR_high_price",
                    "Enter min price",
                    "Enter max price",
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    values,
                  )}
                </div>

                {/* Moving Walk Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    Moving Walk
                  </h3>
                  {renderCostFields(
                    "MOVING_WALK_low_price",
                    "MOVING_WALK_high_price",
                    "Enter min price",
                    "Enter max price",
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    values,
                  )}
                </div>

                {/* Platform Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    Platform
                  </h3>
                  {renderCostFields(
                    "PLATFORM_low_price",
                    "PLATFORM_high_price",
                    "Enter min price",
                    "Enter max price",
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    values,
                  )}
                </div>

                {/* Dumb Waiter Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    Dumb Waiter
                  </h3>
                  {renderCostFields(
                    "DUMB_WAITER_low_price",
                    "DUMB_WAITER_high_price",
                    "Enter min price",
                    "Enter max price",
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    values,
                  )}
                </div>
              </div>

              {/* Elevator Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <ElevatorInput
                  values={values}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="px-6 h-11 rounded-lg font-semibold"
                disabled={isLoading || isUpdating || isFetchingCostInfo}
              >
                {isLoading || isUpdating ? (
                  <Loader className="animate-spin" />
                ) : costInfoData?.cost_infos?.[0]?.id ? (
                  "Update Cost Info"
                ) : (
                  "Save Cost Info"
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
