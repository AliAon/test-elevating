import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/components/ui/input-field";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CountryCodeSelector from "@/components/ui/country-code-selector";
import {
  authApi,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
} from "@/redux/services/auth-api";
import { useUser } from "@/hooks/useUserType";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function EditProfile() {
  const [logoPreview, setLogoPreview] = useState(null);
  const user = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading: profileLoading } = useGetUserByIdQuery(
    user?.user_id,
    {
      skip: !user?.user_id,
    },
  );
  const profile = data?.data;
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  // ✅ Initial values (ALL fields)
  const initialValues = {
    company: profile?.company,
    address: profile?.address,
    position: profile?.position,
    name: profile?.fullname,
    email: profile?.email,
    country_code: profile?.country_code,
    phone_number: profile?.phone_number,
    logo: profile?.profile_image_url,
  };

  // ✅ Validation schema (ALL fields)
  const validationSchema = Yup.object({
    company: Yup.string().required("Company is required"),
    address: Yup.string().required("Address is required"),
    position: Yup.string().required("Position is required"),

    name: Yup.string().required("Name is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    country_code: Yup.string().required("Country code is required"),

    phone_number: Yup.string().required("Phone number is required"),
  });

  // ✅ Submit handler (profile payload only)
  const handleSubmit = (values) => {
    const formData = new FormData();
    // console.log("values", values);

    formData.append("company", values.company);
    formData.append("address", values.address);
    formData.append("position", values.position);
    formData.append("fullname", values.name);
    formData.append("email", values.email);
    formData.append("country_code", values.country_code);
    formData.append("phone_number", values.phone_number);

    if (!values?.logo?.toString()?.startsWith("https://")) {
      formData.append("profile_image", values.logo);
    }

    updateProfile(formData)
      .unwrap()
      .then((res) => {
        toast.success(res?.message || "Profile updated successfully");
        dispatch(authApi.util.invalidateTags(["User"]));
        if (user.user_type_name == "superadmin") {
          navigate("/admin/profile");
          return;
        }
        navigate("/profile");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong");
      });
  };

  //Set profile img
  useEffect(() => {
    if (profile?.profile_image_url) {
      setLogoPreview(profile?.profile_image_url);
    }
  }, [profile?.profile_image_url]);

  return (
    <div>
      <p className="text-3xl text-text_primary font-semibold">Update Details</p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter your profile details below to update
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <div className="flex items-start gap-10 bg-bg_primary p-8 my-4 rounded-xl">
            {/* Logo Upload */}
            <div>
              <div className="h-[200px] w-[200px] rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("logo", file);
                      const reader = new FileReader();
                      reader.onloadend = () => setLogoPreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {!logoPreview ? (
                  <label htmlFor="logo" className="cursor-pointer text-center">
                    <p className="font-semibold">Upload Logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 20MB</p>
                  </label>
                ) : (
                  <div className="text-center">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="max-h-[120px] mx-auto mb-2 rounded-md"
                    />
                    <button
                      type="button"
                      className="text-red-500 text-sm"
                      onClick={() => {
                        setLogoPreview(null);
                        setFieldValue("logo", "");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            {profileLoading ? (
              <ProfileFormSkeleton />
            ) : (
              <Form className="space-y-6 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Name"
                    name="name"
                    placeholder="Enter name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && errors.name}
                  />

                  <InputField
                    label="Email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    disabled
                    error={touched.email && errors.email}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Company"
                    name="company"
                    placeholder="Enter company name"
                    value={values.company}
                    disabled
                    onChange={handleChange}
                    error={touched.company && errors.company}
                  />

                  <InputField
                    label="Address"
                    name="address"
                    placeholder="Enter address"
                    value={values.address}
                    onChange={handleChange}
                    error={touched.address && errors.address}
                  />
                </div>

                <div className="flex gap-3 items-start">
                  <CountryCodeSelector
                    value={values.country_code}
                    onChange={(val) => setFieldValue("country_code", val)}
                  />

                  <InputField
                    label="Phone Number"
                    name="phone_number"
                    placeholder="Enter phone number"
                    value={values.phone_number}
                    onChange={handleChange}
                    error={touched.phone_number && errors.phone_number}
                  />
                </div>

                <InputField
                  label="Position"
                  name="position"
                  placeholder="Enter position"
                  value={values.position}
                  onChange={handleChange}
                  disabled
                  error={touched.position && errors.position}
                />
                {user?.user_type_name === "superadmin" && "Super Admin" && (
                  <>
                    {" "}
                    <div className="flex items-center gap-4">
                      <Link to="/admin/profile">
                        <Button
                          type="button"
                          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary"
                        >
                          Back
                        </Button>
                      </Link>

                      <button
                        type="submit"
                        className="w-[167px] h-12 rounded-full bg-primary text-white font-semibold cursor-pointer"
                      >
                        {isUpdating ? "Saving..." : "Save Details"}
                      </button>
                    </div>
                  </>
                )}
                {user?.user_type_name !== "superadmin" && "Super Admin" && (
                  <>
                    {" "}
                    <div className="flex items-center gap-4">
                      <Link to="/profile">
                        <Button
                          type="button"
                          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary"
                        >
                          Back
                        </Button>
                      </Link>

                      <button
                        type="submit"
                        className="w-[167px] h-12 rounded-full bg-primary text-white font-semibold cursor-pointer"
                      >
                        {isUpdating ? "Saving..." : "Save Details"}
                      </button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </div>
        )}
      </Formik>
    </div>
  );
}
const ProfileFormSkeleton = () => (
  <div className="space-y-6 w-full">
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-16 w-full bg-gray-200" />
      <Skeleton className="h-16 w-full bg-gray-200" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-16 w-full bg-gray-200" />
      <Skeleton className="h-16 w-full bg-gray-200" />
    </div>

    <div className="flex gap-3">
      <div className="h-12 w-28 bg-gray-200 rounded-xl animate-pulse" />
      <div className="flex-1">
        <Skeleton className="h-16 w-full bg-gray-200" />
      </div>
    </div>

    <Skeleton className="h-16 w-full bg-gray-200" />

    <div className="flex gap-4">
      <Skeleton className="h-16 w-full bg-gray-200" />
      <Skeleton className="h-16 w-full bg-gray-200" />
    </div>
  </div>
);
