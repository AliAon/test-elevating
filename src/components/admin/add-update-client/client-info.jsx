import { Button } from "@/components/ui/button";
import CountryCodeSelector from "@/components/ui/country-code-selector";
import InputField from "@/components/ui/input-field";
import AddressZipLookup from "@/components/ui/address-zip-lookup";
import Selector from "@/components/ui/selector";
import { getDialCodeForCountryName } from "@/helpers/addressLookup";
import {
  useCreateClientMutation,
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from "@/redux/services/admin-client";
import { useFormik } from "formik";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const contactPersonPositions = [
  "General Manager",
  "Operations Manager",
  "Sales Manager",
  "Marketing Manager",
  "Human Resources Manager",
  "Finance Manager",
  "IT Manager",
  "Facilities Manager",
  "Customer Service Manager",
  "Project Manager",
];

const validationSchema = Yup.object({
  client_name: Yup.string().required("Business name is required"),
  registered_ABN: Yup.string().required("Registered ABN is required"),
  legal_entity_name: Yup.string().required("Legal entity name is required"),
  HQ_address: Yup.string(),
  country: Yup.string(),
  state: Yup.string(),
  city: Yup.string(),
  postal_code: Yup.string().matches(/^\d+$/, "ZIP code must be numeric"),
  contact_person: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  contact_person_position: Yup.string(),
  country_code: Yup.string(),
  phone_number: Yup.string().matches(/^[0-9]{6,15}$/, "Invalid phone number"),
});

export default function ClientInfo({ Onboarding, handleNext }) {
  const navigate = useNavigate();
  const [params, setSearchParams] = useSearchParams();
  const clientId = params.get("clientId");
  const fileInputRef = useRef(null);
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [file, setFile] = useState(null);

  const { data } = useGetClientByIdQuery(clientId, { skip: !clientId });
  const client = data?.data;

  const handleAddressChange = (field, value) => {
    formik.setFieldValue(field, value);

    if (field === "country") {
      const dialCode = getDialCodeForCountryName(value);
      if (dialCode) {
        formik.setFieldValue("country_code", dialCode);
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      registered_ABN: client?.registered_ABN || "",
      legal_entity_name: client?.legal_entity_name || "",
      country: client?.country || "",
      state: client?.state || "",
      city: client?.city || "",
      postal_code: client?.postal_code || "",
      contact_person: client?.contact_person || "",
      email: client?.email ?? "",
      contact_person_position: client?.contact_person_position || "",
      country_code: client?.country_code || "+1",
      phone_number: client?.phone_number || "",
      client_name: client?.client_name || "",
      HQ_address: client?.HQ_address || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (file) {
        formData.append("logo", file);
      }

      if (clientId) {
        updateClient({ id: clientId, formData })
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Client updated successfully.");
            setSearchParams({
              clientId: res?.data?.client_id,
            });
            handleNext();
          })
          .catch((err) => {
            toast.error(
              err?.data?.message || "Something went wrong! please try again.",
            );
          });
      } else {
        createClient(formData)
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Client created successfully.");
            setSearchParams({
              clientId: res?.data?.client_id,
            });
            handleNext();
          })
          .catch((err) => {
            toast.error(
              err?.data?.message || "Something went wrong! please try again.",
            );
          });
      }
    },
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  useEffect(() => {
    setFile(client?.logo_url);
  }, [client]);

  const isImage = file && file?.type?.startsWith("image/");
  const isUrl = typeof file === "string";

  return (
    <div>
      <div className="bg-bg_primary rounded-xl p-7">
        <p className="text-2xl text-black font-semibold">Client Details</p>
        <div className="flex gap-5 mt-5">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <div
              onClick={handleClick}
              className="w-[207px] h-[159px] rounded-2xl bg-white border border-[#898EA6] border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
              <img
                src="/assets/svg/uplaod-img.svg"
                width={24}
                height={24}
                alt=""
              />
              <p className="text-sm text-text_primary font-semibold text-center mt-3">
                Add Logo
              </p>
              <p className="text-xs text-text_secondary font-medium text-center mt-1">
                Max 2mb JPEG/PNG
              </p>
            </div>
          ) : (
            <div className="w-[207px] h-[159px] rounded-2xl bg-white border border-[#898EA6] flex flex-col items-center justify-center relative overflow-hidden">
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full cursor-pointer">
                <Trash2 size={16} className="text-red-600" />
              </button>
              {isUrl ? (
                <img
                  src={file}
                  alt="Client Logo"
                  className="object-cover w-full h-full rounded-2xl"
                />
              ) : isImage ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded Preview"
                  className="object-cover w-full h-full rounded-2xl"
                />
              ) : (
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
          )}

          <div className="flex-1 space-y-3">
            <InputField
              label="Business Name"
              placeholder="Enter business name"
              onChange={formik.handleChange}
              name="client_name"
              required
              value={formik.values.client_name}
              error={formik.touched.client_name && formik.errors.client_name}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Registered ABN"
                placeholder="Enter registered ABN"
                onChange={formik.handleChange}
                value={formik.values.registered_ABN}
                name="registered_ABN"
                required
                error={
                  formik.touched.registered_ABN && formik.errors.registered_ABN
                }
              />
              <InputField
                label="Legal Entity Name"
                placeholder="Enter legal entity name"
                onChange={formik.handleChange}
                value={formik.values.legal_entity_name}
                name="legal_entity_name"
                error={
                  formik.touched.legal_entity_name &&
                  formik.errors.legal_entity_name
                }
                required
              />
            </div>

            <AddressZipLookup
              country={formik.values.country}
              state={formik.values.state}
              city={formik.values.city}
              postalCode={formik.values.postal_code}
              onChange={handleAddressChange}
              errors={formik.errors}
              touched={formik.touched}
              fieldNames={{
                country: "country",
                state: "state",
                city: "city",
                postalCode: "postal_code",
              }}
              labels={{
                country: "Country",
                state: "State",
                city: "City",
                postalCode: "ZIP Code",
              }}
            />

            <InputField
              label="Address"
              placeholder="Enter address"
              onChange={formik.handleChange}
              value={formik.values.HQ_address}
              name="HQ_address"
              error={formik.touched.HQ_address && formik.errors.HQ_address}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Contact Person"
                placeholder="Enter contact person"
                onChange={formik.handleChange}
                value={formik.values.contact_person}
                name="contact_person"
                error={
                  formik.touched.contact_person && formik.errors.contact_person
                }
              />
              <InputField
                label="Email Address"
                placeholder="Enter email address"
                onChange={formik.handleChange}
                value={formik.values.email}
                name="email"
                error={formik.touched.email && formik.errors.email}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Selector
                  label="Contact Person Position"
                  placeholder="Select Contact Person Position"
                  options={contactPersonPositions}
                  onChange={(val) => {
                    formik.setFieldValue("contact_person_position", val);
                  }}
                  value={formik.values.contact_person_position}
                  error={
                    formik.touched.contact_person_position &&
                    formik.errors.contact_person_position
                  }
                />
              </div>
              <CountryCodeSelector
                onChange={(val) => formik.setFieldValue("country_code", val)}
                value={formik.values.country_code}
              />
              <div className="flex-1">
                <InputField
                  label="Phone Number"
                  placeholder="Enter phone number"
                  onChange={formik.handleChange}
                  value={formik.values.phone_number}
                  name="phone_number"
                  error={
                    formik.touched.phone_number && formik.errors.phone_number
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          // disabled={true}
          onClick={() => {
            navigate(-1);
          }}>
          Back
        </Button>

        <Button
          className="w-[98px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={() => {
            formik.handleSubmit();
          }}>
          {isLoading || isUpdating ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}
