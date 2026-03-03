import { CalendarPicker } from "@/components/ui/calendar-picker";
import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetAllBrandQuery } from "@/redux/services/brand-api";
import { useGetSubscriptionsQuery } from "@/redux/services/subscription";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "react-international-phone/style.css";

export default function BasicDetails({
  values,
  setFieldValue,
  handleChange,
  errors,
  touched,
  onBoarding = false,
}) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { data: esContracts, isFetching } = useGetSubscriptionsQuery({
    search: "",
    limit: 1000,
  });
  useEffect(() => {
    // Ensure `active` is set once via Formik's setter instead of mutating `values`
    if (values?.active !== "active") {
      setFieldValue("active", "active");
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const file = event.target.files[0];

    const updatedFiles = [...files, ...selectedFiles].slice(0, 4);
    setFiles(updatedFiles);
    setFieldValue("contractTerms", file);
    event.target.value = "";
  };

  const handleRemove = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  useEffect(() => {
    if (values?.contractTerms) {
      if (Array.isArray(values?.contractTerms)) {
        setFiles(values?.contractTerms);
      } else {
        setFiles([values?.contractTerms]);
      }
    } else {
      setFiles([]);
    }
  }, [values?.contractTerms]);

  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrandQuery({
    limit: 1000,
  });

  const brandOptions = brands?.data?.brands?.map((brand) => ({
    label: brand.brand_name,
    value: brand.id,
  }));

  const options = esContracts?.data?.map((esContract) => ({
    value: esContract.subscription_id,
    label: esContract.es_subscription_name,
  }));

  const contractTypeOptions = [
    { value: "Non-Comprehensive", label: "Non-Comprehensive" },
    { value: "Semi-Comprehensive", label: "Semi-Comprehensive" },
    { value: "Comprehensive", label: "Comprehensive" },
  ];

  const selectedBrand = brands?.data?.brands?.find(
    (brand) => brand.id === values.service_api_credentials.brand_id,
  )?.brand_name;

  return (
    <div>
      <p className="text-2xl text-black font-semibold">
        Basic Contract Details
      </p>

      <div className="space-y-3 mt-4">
        <InputField
          label="Contract Number"
          placeholder="Enter contract number"
          name="contract_number"
          value={values?.contract_number}
          onChange={handleChange}
          error={touched.contract_number && errors.contract_number}
          required
        />

        <InputField
          label="Contract Name"
          placeholder="Enter contract name"
          name="contract_name"
          value={values?.contract_name}
          onChange={handleChange}
          error={touched.contract_name && errors.contract_name}
          required
        />
        {!onBoarding && (
          <SelectorWithObjects
            label="Linked ES Pulse subscription"
            value={values.es_subscription_id}
            onChange={(val) => {
              setFieldValue("es_subscription_id", val);
              const contract = esContracts.data.find(
                (contract) => contract.subscription_id === val,
              );
              setFieldValue("client_id", contract.client_id);
              setFieldValue("client_name", contract.client_name);
            }}
            placeholder="Select an option"
            options={options}
            disabled={isFetching}
          />
        )}

        <div className="grid grid-cols-3 gap-3">
          <CalendarPicker
            label="Start Date"
            value={values?.start_date}
            onChange={(date) => setFieldValue("start_date", date)}
            error={touched.start_date && errors.start_date}
            required
          />

          <CalendarPicker
            label="End Date"
            value={values?.end_date}
            onChange={(date) => setFieldValue("end_date", date)}
            error={touched.end_date && errors.end_date}
            required
          />

          <SelectorWithObjects
            label="Contract Status"
            placeholder="Select an option"
            options={[
              { value: "active", label: "Active" },
              { value: "block", label: "Inactive" },
            ]}
            value={values?.active}
            onChange={(value) => setFieldValue("active", value)}
          />
        </div>
      </div>

      {/* --- Service Provider Details --- */}
      <p className="text-2xl text-black font-semibold mt-5">
        Service Provider Details
      </p>

      <div className="space-y-3 mt-4">
        <InputField
          label="Service Provider Name"
          name="service_provider_details.service_provider_name"
          placeholder="Enter service provider name"
          value={values.service_provider_details.service_provider_name}
          onChange={handleChange}
        />

        <InputField
          label="Service Provider Contact Person"
          name="service_provider_details.contact_person_name"
          placeholder="Enter contact person name"
          value={values.service_provider_details.contact_person_name}
          onChange={handleChange}
        />

        <div className="flex items-center gap-3">
          <CountryCodeSelector
            value={values.service_provider_details.country_code}
            onChange={(value) =>
              setFieldValue("service_provider_details.country_code", value)
            }
            className={{
              Wrapper: "w-[400px]",
              name: "max-w-[300px]",
            }}
          />

          <div className="flex-1">
            <InputField
              label="Service Provider Contact Number"
              name="service_provider_details.phone_no"
              placeholder="Enter phone number"
              value={values.service_provider_details.phone_no}
              onChange={handleChange}
            />
          </div>
        </div>

        <InputField
          label="Service Provider Contact Email"
          name="service_provider_details.email"
          placeholder="Enter email address"
          value={values.service_provider_details.email}
          onChange={handleChange}
        />
      </div>

      {/* --- Plan and Pricing --- */}
      <p className="text-2xl text-black font-semibold mt-5">Plan and Pricing</p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <SelectorWithObjects
          label="Contract Type"
          placeholder="Select Contract Type"
          value={values.plan_and_pricing?.contract_type}
          onChange={(val) =>
            setFieldValue("plan_and_pricing.contract_type", val)
          }
          options={contractTypeOptions}
          error={
            touched?.plan_and_pricing?.contract_type &&
            errors?.plan_and_pricing?.contract_type
          }
          required
        />

        <InputField
          label="Contract Price (This Financial Year)"
          name="plan_and_pricing.contract_price"
          placeholder="Enter contract price"
          value={values.plan_and_pricing.contract_price}
          onChange={handleChange}
          error={
            touched?.plan_and_pricing?.contract_price &&
            errors?.plan_and_pricing?.contract_price
          }
          required
        />

        <CalendarPicker
          label="Next Fee Adjustment Date"
          value={values.plan_and_pricing.next_fee_adjustment_date}
          onChange={(date) =>
            setFieldValue("plan_and_pricing.next_fee_adjustment_date", date)
          }
        />

        <InputField
          label="Next Fee Adjustment Rate (%)"
          name="plan_and_pricing.next_fee_adjustment_rate"
          placeholder="Enter next fee adjustment rate (%)"
          value={values.plan_and_pricing.next_fee_adjustment_rate}
          onChange={handleChange}
        />
      </div>

      <p className="text-2xl text-black font-semibold mt-5">
        Service API Credentials
      </p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <SelectorWithObjects
          label="Brand"
          placeholder="Select Brand"
          value={values.service_api_credentials.brand_id}
          onChange={(val) =>
            setFieldValue("service_api_credentials.brand_id", val)
          }
          options={brandOptions}
          disabled={isLoadingBrands}
          error={
            touched?.service_api_credentials?.brand_id &&
            errors?.service_api_credentials?.brand_id
          }
          required
        />
      </div>

      {selectedBrand === "KONE" && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <InputField
            label="Client ID"
            name="service_api_credentials.client_id"
            placeholder="Enter client ID"
            value={values.service_api_credentials.client_id}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.client_id &&
              errors.service_api_credentials?.client_id
            }
          />
          <InputField
            label="Client Secret"
            name="service_api_credentials.client_secret"
            placeholder="Enter client secret"
            value={values.service_api_credentials.client_secret}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.client_secret &&
              errors.service_api_credentials?.client_secret
            }
          />
          <InputField
            label="Grant Type"
            name="service_api_credentials.grant_type"
            placeholder="Enter grant type"
            value={values.service_api_credentials.grant_type}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.grant_type &&
              errors.service_api_credentials?.grant_type
            }
          />
          <InputField
            label="Scope"
            name="service_api_credentials.scope"
            placeholder="Enter scope"
            value={values.service_api_credentials.scope}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.scope &&
              errors.service_api_credentials?.scope
            }
          />
          <InputField
            label="Auth Username"
            name="service_api_credentials.auth_username"
            placeholder="Enter auth username"
            value={values.service_api_credentials.auth_username}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.auth_username &&
              errors.service_api_credentials?.auth_username
            }
          />
          <InputField
            label="Auth Password"
            name="service_api_credentials.auth_password"
            placeholder="Enter auth password"
            type="password"
            value={values.service_api_credentials.auth_password}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.auth_password &&
              errors.service_api_credentials?.auth_password
            }
          />
        </div>
      )}

      {selectedBrand === "Schindler" && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <InputField
            label="Client ID"
            name="service_api_credentials.client_id"
            placeholder="Enter client ID"
            value={values.service_api_credentials.client_id}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.client_id &&
              errors.service_api_credentials?.client_id
            }
          />
          <InputField
            label="Client Secret"
            name="service_api_credentials.client_secret"
            placeholder="Enter client secret"
            value={values.service_api_credentials.client_secret}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.client_secret &&
              errors.service_api_credentials?.client_secret
            }
          />
          <InputField
            label="Grant Type"
            name="service_api_credentials.grant_type"
            placeholder="Enter grant type"
            value={values.service_api_credentials.grant_type}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.grant_type &&
              errors.service_api_credentials?.grant_type
            }
          />
          <InputField
            label="Ocp-Apim-Subscription-Key"
            name="service_api_credentials.ocp_apim_subscription_key"
            placeholder="Enter Ocp-Apim-Subscription-Key"
            value={values.service_api_credentials.ocp_apim_subscription_key}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.ocp_apim_subscription_key &&
              errors.service_api_credentials?.ocp_apim_subscription_key
            }
          />
        </div>
      )}

      {selectedBrand === "OTIS" && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <InputField
            label="Country Code"
            name="service_api_credentials.country_code"
            placeholder="Enter country code"
            value={values.service_api_credentials.country_code}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.country_code &&
              errors.service_api_credentials?.country_code
            }
          />
          <InputField
            label="Customer ID"
            name="service_api_credentials.customer_id"
            placeholder="Enter customer ID"
            value={values.service_api_credentials.customer_id}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.customer_id &&
              errors.service_api_credentials?.customer_id
            }
          />
          <InputField
            label="Contract No"
            name="service_api_credentials.contract_no"
            placeholder="Enter contract no"
            value={values.service_api_credentials.contract_no}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.contract_no &&
              errors.service_api_credentials?.contract_no
            }
          />
          <InputField
            label="Subscription Key"
            name="service_api_credentials.subscription_key"
            placeholder="Enter subscription key"
            value={values.service_api_credentials.subscription_key}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.subscription_key &&
              errors.service_api_credentials?.subscription_key
            }
          />
          <InputField
            label="Repair Subscription Key"
            name="service_api_credentials.repair_subscription_key"
            placeholder="Enter repair subscription key"
            value={values.service_api_credentials.repair_subscription_key}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.repair_subscription_key &&
              errors.service_api_credentials?.repair_subscription_key
            }
          />
          <InputField
            label="Maintainance Subscription Key"
            name="service_api_credentials.maintainance_subscription_key"
            placeholder="Enter maintainance subscription key"
            value={values.service_api_credentials.maintainance_subscription_key}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.maintainance_subscription_key &&
              errors.service_api_credentials?.maintainance_subscription_key
            }
          />
          <InputField
            label="Callback Subscription Key"
            name="service_api_credentials.callback_subscription_key"
            placeholder="Enter callback subscription key"
            value={values.service_api_credentials.callback_subscription_key}
            onChange={handleChange}
            error={
              touched.service_api_credentials?.callback_subscription_key &&
              errors.service_api_credentials?.callback_subscription_key
            }
          />
        </div>
      )}

      {/* --- Contract Terms (File Uploads) --- */}
      <p className="text-2xl text-black font-semibold mt-5">Contract Terms</p>

      <div className="grid grid-cols-4 gap-3 mt-4">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {files?.map((file, index) => {
          const isFileObject = file instanceof File;

          const fileURL = isFileObject ? URL.createObjectURL(file) : file;
          const fileName = isFileObject
            ? file.name
            : typeof file === "string"
              ? file.split("/").pop().split("?")[0]
              : "Unknown file";

          const fileType = isFileObject
            ? file.type
            : fileName.endsWith(".pdf")
              ? "application/pdf"
              : fileName.endsWith(".doc") || fileName.endsWith(".docx")
                ? "application/msword"
                : "";

          const isImage = fileType.startsWith("image/");
          const isPDF = fileType === "application/pdf";
          const isDoc =
            fileType === "application/msword" ||
            fileType ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

          return (
            <div
              key={index}
              className="h-[163px] rounded-2xl bg-white border border-[#898EA6] flex flex-col items-center justify-center relative overflow-hidden"
            >
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>

              {/* 🖼️ Image Preview */}
              {isImage && (
                <img
                  src={fileURL}
                  alt={file.name}
                  className="object-cover w-full h-full rounded-2xl"
                />
              )}

              {/* 📄 PDF Preview */}
              {isPDF && (
                <iframe
                  src={fileURL}
                  title={file.name}
                  className="w-full h-full rounded-2xl"
                ></iframe>
              )}

              {/* 🧾 DOC/DOCX or unknown file */}
              {isDoc && (
                <div className="flex flex-col items-center justify-center h-full px-3 text-center">
                  <img
                    src="/assets/svg/doc-icon.svg"
                    width={28}
                    height={28}
                    alt="Word Document"
                  />
                  <p className="text-xs mt-2 font-medium text-gray-700 truncate w-[90%]">
                    {file.name}
                  </p>
                </div>
              )}

              {/* ❔ Fallback for any other file type */}
              {!isImage && !isPDF && !isDoc && (
                <div className="flex flex-col items-center justify-center h-full px-3 text-center">
                  <img
                    src="/assets/svg/file-icon.svg"
                    width={28}
                    height={28}
                    alt="file"
                  />
                  <p className="text-xs mt-2 font-medium text-gray-700 truncate w-[90%]">
                    {file.name}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {files?.length < 1 && (
          <div
            onClick={handleClick}
            className="h-[163px] rounded-2xl bg-white border border-[#898EA6] border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          >
            <img
              src="/assets/svg/uplaod-img.svg"
              width={24}
              height={24}
              alt=""
            />
            <p className="text-sm text-text_primary font-semibold text-center mt-3">
              Upload Contract Terms
            </p>
            <p className="text-xs text-text_secondary font-medium text-center mt-1">
              Max 20mb doc/pdf
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
