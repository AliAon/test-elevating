import { Button } from "@/components/ui/button";
import { admin_create_users_tabs } from "@/static/es-client";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateClientMutation } from "@/redux/services/auth-api";
import UserInfo from "../create-users/user-info";
import AccessPermission from "./access-permission";
import GiveAccess from "./give-access";

export default function AdminCreateUpdateUser() {
  const [createUser, { isLoading }] = useCreateClientMutation();
  const navigate = useNavigate();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(),
    onSubmit: handleSubmit,
  });

  function handleSubmit(values) {
    const payload = {
      user_type_id: values?.user_type_id,
      fullname: values?.fullname,
      email: values?.email,
      password: values?.password,
      company: values?.company,
      position: values?.position,
      is_active: values?.is_active,
      report_download_access: values?.report_download_access,
      service_contract_download_access:
        values?.service_contract_download_access,
    };
    console.log("payload", payload);

    createUser(payload)
      .unwrap()
      .then((res) => {
        toast.success(res?.message || "User created successfully");
        navigate("/admin/es-admin");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong");
      });
  }

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < admin_create_users_tabs.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const active = admin_create_users_tabs[activeIndex].key;

  return (
    <div>
      <p className="text-3xl text-text_primary font-semibold">
        Add ES Admin Users
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter Your Admin Users Details below to update
      </p>

      {/* <div className="w-fit h-13 flex items-center rounded-2xl bg-bg_primary p-1 mt-5">
        {admin_create_users_tabs.map((tab, index) => (
          <button
            key={tab.key}
            className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
              activeIndex === index
                ? "bg-white text-text_primary"
                : "text-text_secondary"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div> */}

      <div>
        {active === "user-information" && (
          <>
            <UserInfo
              values={formik.values}
              setValues={formik.setFieldValue}
              handleChange={formik.handleChange}
            />
            <GiveAccess
              values={formik.values}
              setValues={formik.setFieldValue}
              handleChange={formik.handleChange}
            />
          </>
        )}
        {active === "access-permission" && <AccessPermission />}
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          type="button"
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={handleBack}
          disabled={activeIndex === 0}
        >
          {activeIndex === 0 ? "Close" : "Back"}
        </Button>

        <Button
          type="button"
          className="w-[98px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={() => {
            // if (activeIndex === admin_create_users_tabs.length - 1) {
            formik.handleSubmit();
            // } else {
            // handleNext();
            // }
          }}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

function getInitialValues() {
  return {
    user_type_id: "",
    fullname: "",
    email: "",
    password: "",
    company: "",
    position: "",
    is_active: false,
    report_download_access: false,
    service_contract_download_access: false,
  };
}
