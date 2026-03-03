import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { useChangePasswordMutation } from "@/redux/services/auth-api";
import toast from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- Password Strength Helper ---------------- */
const getPasswordStrength = (password = "") => {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  return score;
};

/* ---------------- Validation Schema ---------------- */
const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string().required("New password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Repeat password is required"),
});

export default function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const router = useNavigate();

  const [show, setShow] = useState({
    current: false,
    new: false,
    repeat: false,
  });

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  };

  const handleSubmit = (values) => {
    const strength = getPasswordStrength(values.newPassword);

    if (strength < 60) {
      toast.error("Password is too weak. Please create a stronger password.");
      return;
    }

    changePassword(values)
      .unwrap()
      .then((res) => toast.success(res?.message))
      .catch((err) =>
        toast.error(err?.data?.message || "Something went wrong")
      );

    router("/profile");
  };

  return (
    <div className="bg-bg_primary p-8 rounded-xl max-w-full">
      <p className="text-2xl font-semibold text-text_primary">
        Change Password
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => {
          const strength = getPasswordStrength(values.newPassword);

          return (
            <Form className="grid grid-cols-2  gap-6 mt-6">
              <div>
                <div className="mb-4">
                  {/* Current Password */}
                  <InputField
                    type={show.current ? "text" : "password"}
                    label="Current Password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    error={touched.currentPassword && errors.currentPassword}
                    rightIcon={show.current ? <EyeOff /> : <Eye />}
                    onRightIconClick={() =>
                      setShow((s) => ({ ...s, current: !s.current }))
                    }
                  />
                </div>
                <div className="mb-4">
                  {/* New Password */}
                  <InputField
                    type={show.new ? "text" : "password"}
                    label="New Password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    error={touched.newPassword && errors.newPassword}
                    rightIcon={show.new ? <EyeOff /> : <Eye />}
                    onRightIconClick={() =>
                      setShow((s) => ({ ...s, new: !s.new }))
                    }
                  />
                </div>
                <div className="mb-4">
                  {/* Repeat Password */}
                  <InputField
                    type={show.repeat ? "text" : "password"}
                    label="Repeat Password"
                    name="repeatPassword"
                    value={values.repeatPassword}
                    onChange={handleChange}
                    error={touched.repeatPassword && errors.repeatPassword}
                    rightIcon={show.repeat ? <EyeOff /> : <Eye />}
                    onRightIconClick={() =>
                      setShow((s) => ({ ...s, repeat: !s.repeat }))
                    }
                  />
                </div>

                {/* Password Strength */}
                <div className="col-span-2 mb-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className={`h-full ${
                        strength < 60
                          ? "bg-red-500"
                          : strength < 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">
                    Strength: {strength}%{" "}
                    {strength < 60 && "(Use uppercase, number & symbol)"}
                  </p>
                </div>

                {/* Submit */}
                <div className="col-span-2 ">
                  <Button
                    type="submit"
                    disabled={strength < 60 || isLoading}
                    className="h-12 rounded-full"
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
