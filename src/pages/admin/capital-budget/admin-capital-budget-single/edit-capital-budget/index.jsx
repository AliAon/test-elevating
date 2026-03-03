import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import {
  useGetEquipmentByIdQuery,
  useUpdateCapitalBudgetMutation,
} from "@/redux/services/groups";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

// ------------ VALIDATION SCHEMA -----------------
const validationSchema = Yup.object({
  recomended_replacement_year: Yup.string().required("Required"),
  replacement_recomendation: Yup.string().required("Required"),
  risk: Yup.string().required("Required"),
  recomendation: Yup.string().required("Required"),
  es_comments: Yup.string().required("Required"),
});

export default function EditCapitalBudget() {
  const navigate = useNavigate();
  const [updateCapitalBudget, { isLoading }] = useUpdateCapitalBudgetMutation();
  const { id } = useParams();

  const { data, isLoading: isLoadingData } = useGetEquipmentByIdQuery(id, {
    skip: !id,
  });
  const { capital_budget } = data?.data || {};

  const initialValues = {
    recomended_replacement_year: capital_budget?.recomended_replacement_year,
    replacement_recomendation: capital_budget?.replacement_recomendation,
    risk: capital_budget?.risk,
    recomendation: capital_budget?.recomendation,
    es_comments: capital_budget?.es_comments,
  };

  // -------- HANDLE SUBMIT ----------
  const handleSubmit = async (values) => {
    const payload = {
      capital_budget: {
        ...values,
        recomended_replacement_year: Number(values.recomended_replacement_year),
      },
    };

    try {
      await updateCapitalBudget({
        body: payload,
        id,
      }).unwrap();
      toast.success("Capital budget updated successfully");
      navigate("/admin/capital-budget");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update capital budget");
    }
  };

  if (isLoadingData) return <EditCapitalBudgetSkeleton />;

  return (
    <div>
      <p className="text-3xl text-text_primary font-semibold">
        Edit Capital Budget
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Update Equipment’s Capital Budget
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <div className="bg-bg_primary rounded-xl p-8 mt-5 space-y-6">
              <p className="text-2xl text-text_primary font-semibold">
                Recommendation and Budget
              </p>

              <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 space-y-3 mt-4">
                {/* Selector field */}
                <YearPickerField
                  label="Recommended Replacement Year"
                  value={values.recomended_replacement_year}
                  onChange={(val) =>
                    setFieldValue("recomended_replacement_year", val)
                  }
                  className="mb-0"
                  error={
                    touched.recomended_replacement_year &&
                    errors.recomended_replacement_year
                  }
                />

                {touched.recomended_replacement_year &&
                  errors.recomended_replacement_year && (
                    <p className="text-red-500 text-sm">
                      {errors.recomended_replacement_year}
                    </p>
                  )}

                <InputField
                  label="Replacement Recommendation"
                  placeholder="Enter replacement recommendation"
                  name="replacement_recomendation"
                  value={values.replacement_recomendation}
                  onChange={handleChange}
                  error={
                    touched.replacement_recomendation &&
                    errors.replacement_recomendation
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-2 space-y-3 mt-4">
                <InputField
                  label="Risk"
                  placeholder="Enter risk"
                  name="risk"
                  value={values.risk}
                  onChange={handleChange}
                  error={touched.risk && errors.risk}
                />

                <InputField
                  label="Recommendation"
                  placeholder="Enter recommendation"
                  name="recomendation"
                  value={values.recomendation}
                  onChange={handleChange}
                  error={touched.recomendation && errors.recomendation}
                />

                <InputField
                  label="ES Comments"
                  placeholder="Enter ES comments"
                  name="es_comments"
                  value={values.es_comments}
                  onChange={handleChange}
                  error={touched.es_comments && errors.es_comments}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 mt-5">
              <Button
                type="button"
                className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
                onClick={() => navigate("/admin/capital-budget")}
              >
                Close
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-[150px] h-12 rounded-full font-semibold disabled:opacity-50"
              >
                {isLoading ? <Loader /> : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function YearPickerField({ label, value, onChange, error, className = {} }) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 100 }, (_, i) => currentYear - 10 + i);

  return (
    <div
      className={`w-full flex items-center justify-between bg-white rounded-2xl gap-5 px-4 pt-4 mb-0  ${className.Wrapper}`}
    >
      <div className="flex-1">
        {/* LABEL */}
        <div className="flex items-center justify-between">
          <label
            htmlFor={label}
            className="text-sm text-text_secondary font-medium"
          >
            {label}
          </label>
        </div>

        {/* INPUT FIELD STYLE */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <div
                className={`flex-1 h-8 flex items-center border-0 text-sm text-text_primary font-semibold p-0 ${
                  value ? "" : "text-text_secondary/30"
                }`}
              >
                {value || "Select replacement year"}
              </div>

              {/* <img
                src="/assets/svg/chevron-down.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-60"
              /> */}
              <ChevronDown size={16} />
            </div>
          </PopoverTrigger>

          {/* YEAR DROPDOWN */}
          <PopoverContent className="w-[240px] p-2">
            <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onChange(year.toString());
                    setOpen(false);
                  }}
                  className={`p-2 text-sm border rounded-md hover:bg-accent transition ${
                    value == year ? "bg-primary text-white border-primary" : ""
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* ERROR */}
        {error && (
          <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

function EditCapitalBudgetSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-6 w-1/4" />

      {/* Form Skeleton */}
      <div className="bg-bg_primary rounded-xl p-8 space-y-6 mt-5">
        <Skeleton className="h-6 w-1/2" /> {/* Section title */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>

      {/* Footer Buttons Skeleton */}
      <div className="flex items-center justify-between gap-3 mt-5">
        <Skeleton className="h-12 w-[167px] rounded-full" />
        <Skeleton className="h-12 w-[150px] rounded-full" />
      </div>
    </div>
  );
}
