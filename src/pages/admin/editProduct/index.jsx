import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from "@/redux/services/brand-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { validationSchema } from "@/components/dashdoard/edit-product/valdiationSchem";
import ElevatorInput from "@/components/dashdoard/add-product/ElevatorInput";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const { data: brand } = useGetBrandByIdQuery(id, { skip: !id });
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();
  const initialValues = {
    brand_name: brand?.brand_name,
    logo: brand?.logo_url,
    ESCALATOR_low_price: brand?.ESCALATOR?.low_price,
    ESCALATOR_high_price: brand?.ESCALATOR?.high_price,
    MOVING_WALK_low_price: brand?.MOVING_WALK?.low_price,
    MOVING_WALK_high_price: brand?.MOVING_WALK?.high_price,
    PLATFORM_low_price: brand?.PLATFORM?.low_price,
    PLATFORM_high_price: brand?.PLATFORM?.high_price,
    DUMB_WAITER_low_price: brand?.DUMB_WAITER?.low_price,
    DUMB_WAITER_high_price: brand?.DUMB_WAITER?.high_price,
    ELEVATOR: brand?.ELEVATOR,
  };

  const renderCostFields = (
    nameLow,
    nameHigh,
    placeholderLow,
    placeholderHigh,
    errors,
    touched,
    handleChange,
    handleBlur,
    values
  ) => (
    <div className="grid lg:grid-cols-2 gap-2 mt-2 border-b border-[#EAECEF] pb-5">
      {/* Min Cost */}
      <div className="bg-[#F6F6F8] border border-[#EAECEF] rounded-[16px] p-3">
        <p className="font-medium text-[#5B617F] text-sm">Min Cost</p>
        <Input
          type="number"
          name={nameLow}
          placeholder={placeholderLow}
          value={values[nameLow]}
          onChange={handleChange}
          onBlur={handleBlur}
          className="font-semibold text-sm text-[#251A44] border-transparent p-0"
        />
        {touched[nameLow] && errors[nameLow] && (
          <p className="text-red-500 text-xs mt-1">{errors[nameLow]}</p>
        )}
      </div>

      {/* Max Cost */}
      <div className="bg-[#F6F6F8] border border-[#EAECEF] rounded-[16px] p-3">
        <p className="font-medium text-[#5B617F] text-sm">Max Cost</p>
        <Input
          type="number"
          name={nameHigh}
          placeholder={placeholderHigh}
          value={values[nameHigh]}
          onChange={handleChange}
          onBlur={handleBlur}
          className="font-semibold text-sm text-[#251A44] border-transparent p-0"
        />
        {touched[nameHigh] && errors[nameHigh] && (
          <p className="text-red-500 text-xs mt-1">{errors[nameHigh]}</p>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("brand_name", values.brand_name);
      formData.append("logo", values.logo);

      formData.append(
        "ESCALATOR",
        JSON.stringify({
          low_price: String(values.ESCALATOR_low_price),
          high_price: String(values.ESCALATOR_high_price),
        })
      );

      formData.append(
        "MOVING_WALK",
        JSON.stringify({
          low_price: String(values.MOVING_WALK_low_price),
          high_price: String(values.MOVING_WALK_high_price),
        })
      );

      formData.append(
        "PLATFORM",
        JSON.stringify({
          low_price: String(values.PLATFORM_low_price),
          high_price: String(values.PLATFORM_high_price),
        })
      );

      formData.append(
        "DUMB_WAITER",
        JSON.stringify({
          low_price: String(values.DUMB_WAITER_low_price),
          high_price: String(values.DUMB_WAITER_high_price),
        })
      );

      // Convert elevator values too
      const elevatorData = {};
      Object.entries(values.ELEVATOR).forEach(([key, val]) => {
        elevatorData[key] = {
          low_price: String(val.low_price),
          high_price: String(val.high_price),
        };
      });
      formData.append("ELEVATOR", JSON.stringify(elevatorData));

      await updateBrand({
        id,
        body: formData,
      }).unwrap();

      toast.success("Brand updated");
      navigate("/admin/brands");

      setLogoPreview(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (brand) {
      setLogoPreview(brand?.logo_url);
    }
  }, [brand]);

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
      }) => {
        return (
          <Form>
            <div>
              <h2 className="font-semibold text-2xl text-[#060606]">Brands</h2>
              <p className="font-medium text-sm text-[#5B617F] mt-2">
                Change your brand and product details below
              </p>

              {/* Main Form Box */}
              <div className="bg-[#F6F6F8] rounded-[20px] p-5 mt-5">
                <p className="font-semibold text-xl">Brands Info</p>

                <div className="grid lg:grid-cols-12 gap-5 mt-5">
                  {/* Upload Logo */}
                  <div className="lg:col-span-3 h-[163px] rounded-2xl bg-white border border-[#898EA6] border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("logo", file);
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setLogoPreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    {!logoPreview ? (
                      <label
                        htmlFor="logo"
                        className="cursor-pointer flex flex-col items-center justify-center h-full w-full"
                      >
                        <img
                          src="/assets/svg/uplaod-img.svg"
                          width={24}
                          height={24}
                          alt="Upload"
                        />
                        <p className="text-sm text-text_primary font-semibold text-center mt-3">
                          Upload Logo
                        </p>
                        <p className="text-xs text-text_secondary font-medium text-center mt-1">
                          Max 20mb image
                        </p>
                      </label>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-[100px] h-[100px] object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          className="text-xs text-red-500 mt-2 font-medium"
                          onClick={() => {
                            setLogoPreview(null);
                            setFieldValue("logo", null);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {touched.logo && errors.logo && (
                      <p className="text-red-500 text-xs mt-1 absolute bottom-2">
                        {errors.logo}
                      </p>
                    )}
                  </div>

                  {/* Brand & Product Fields */}
                  <div className="lg:col-span-9 flex flex-col gap-4">
                    {/* Brand Name */}
                    <div className="bg-white border border-[#EAECEF] rounded-[16px] p-3">
                      <p className="font-medium text-[#5B617F] text-sm">
                        Brand Name
                      </p>
                      <Field
                        as={Input}
                        name="brand_name"
                        placeholder="Enter name"
                        className="font-semibold text-sm text-[#251A44] border-transparent p-0"
                      />
                      {touched.brand_name && errors.brand_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.brand_name}
                        </p>
                      )}
                    </div>

                    {/* Static Products */}
                    <div className="bg-white border border-[#EAECEF] rounded-[16px] p-3">
                      <p className="font-semibold text-base">Escalator</p>
                      {renderCostFields(
                        "ESCALATOR_low_price",
                        "ESCALATOR_high_price",
                        "Enter escalator price",
                        "Enter escalator price",
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        values
                      )}

                      <p className="font-semibold text-base pt-5">
                        Moving Walk
                      </p>
                      {renderCostFields(
                        "MOVING_WALK_low_price",
                        "MOVING_WALK_high_price",
                        "Enter min price",
                        "Enter max price",
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        values
                      )}

                      <p className="font-semibold text-base pt-5">Platform</p>
                      {renderCostFields(
                        "PLATFORM_low_price",
                        "PLATFORM_high_price",
                        "Enter min price",
                        "Enter max price",
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        values
                      )}

                      <p className="font-semibold text-base pt-5">
                        Dumb Waiter
                      </p>
                      {renderCostFields(
                        "DUMB_WAITER_low_price",
                        "DUMB_WAITER_high_price",
                        "Enter min price",
                        "Enter max price",
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        values
                      )}

                      {/* Elevator Dynamic Component */}
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
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 mt-5">
                <Link to={"/admin/brands"}>
                  <Button
                    type="button"
                    className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold"
                  >
                    Back
                  </Button>
                </Link>

                <Button
                  type="submit"
                  className="w-[137px] h-12 rounded-full font-semibold"
                >
                  {isLoading ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
