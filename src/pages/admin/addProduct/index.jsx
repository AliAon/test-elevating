import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  useCreateBrandMutation,
  useGetBrandDetailsQuery,
  useUpdateBrandMutation,
} from "@/redux/services/brand-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { validationSchema } from "@/components/dashdoard/add-product/valdiationSchem";
import { toast } from "react-toastify";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export default function AddProduct() {
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product_id");

  const { data, isLoading: isGetting } = useGetBrandDetailsQuery(product_id, {
    skip: !product_id,
  });

  useEffect(() => {
    if (data?.logo_url) {
      setLogoPreview(data.logo_url);
    }
  }, [data]);

  const initialValues = {
    brand_name: data?.brand_name || "",
    logo: data?.logo_url || null,
    ESCALATOR_low_price: "",
    ESCALATOR_high_price: "",
    MOVING_WALK_low_price: "",
    MOVING_WALK_high_price: "",
    PLATFORM_low_price: "",
    PLATFORM_high_price: "",
    DUMB_WAITER_low_price: "",
    DUMB_WAITER_high_price: "",
    ELEVATOR: {
      1: { low_price: "", high_price: "" },
    },
  };

  const breadlist = [
    {
      item: "Brands",
      link: "/admin/brands",
    },

    {
      item: `Brand Detail`,
      link: "#",
    },
  ];

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("brand_name", values.brand_name);
      formData.append("logo", values.logo);
      if (product_id) {
        await updateBrand({ id: product_id, body: formData }).unwrap();
      } else {
        await createBrand(formData).unwrap();
      }

      toast.success("Brand created");
      navigate("/admin/brands");

      setLogoPreview(null);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, touched, errors }) => (
        <Form>
          <div>
            <Breadcrumbs list={breadlist} />

            <h2 className="font-bold text-3xl text-gray-900">
              {product_id ? "Update" : "Add"} Brand
            </h2>
            <p className="font-medium text-base text-gray-600 mt-2">
              {product_id
                ? "Update your brand details below"
                : "Add a new brand to your system"}
            </p>

            {/* Main Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-sm">
              {isGetting ? (
                <div className="flex items-center justify-center h-40">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Upload Logo */}
                  <div className="lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-900 mb-3">
                      Brand Logo
                    </label>
                    <div className="h-[200px] rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition relative">
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
                          <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-900 font-semibold text-center">
                            Upload Logo
                          </p>
                          <p className="text-xs text-gray-500 font-medium text-center mt-1">
                            PNG, JPG up to 20MB
                          </p>
                        </label>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="max-w-full max-h-[140px] object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            className="text-sm text-red-500 hover:text-red-700 mt-3 font-medium"
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
                        <p className="text-red-500 text-xs mt-1 absolute -bottom-6">
                          {errors.logo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Brand Name Field */}
                  <div className="lg:col-span-8 flex flex-col">
                    <label className="text-sm font-semibold text-gray-900 mb-3">
                      Brand Name
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-[200px] flex flex-col">
                      <Field
                        as={Input}
                        name="brand_name"
                        placeholder="Enter brand name"
                        className="font-semibold text-base text-gray-900 border border-gray-200 rounded px-3 py-2 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none focus:border-gray-300"
                      />
                      {touched.brand_name && errors.brand_name && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.brand_name}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-3">
                        This is the name that will be displayed across the
                        system.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <Link to="/admin/brands">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 h-11 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                className="px-6 h-11 rounded-lg font-semibold"
                disabled={isLoading || isUpdating}
              >
                {isLoading || isUpdating ? (
                  <Loader className="animate-spin" />
                ) : product_id ? (
                  "Update Brand"
                ) : (
                  "Add Brand"
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
