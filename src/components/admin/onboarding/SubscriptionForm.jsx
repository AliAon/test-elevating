import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import {
  useCreateLevel1Mutation,
  useCreateLevel2Mutation,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "@/redux/services/subscription";
import { useUpdateGroupMutation } from "@/redux/services/groups";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import LevelDetails from "../add-update-client/level-details";
import { toast } from "react-toastify";
import { useCreatedSubscriptionId } from "@/redux/slices/subscriptionFlowSlice";

/* =======================
   STEPS
======================= */
const STEPS = {
  SUBSCRIPTION: 1,
  LEVEL1: 2,
  LEVEL2: 3,
};

/* =======================
   VALIDATION
======================= */
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SubscriptionSchema = Yup.object({
  es_subscription_number: Yup.string().required(
    "Subscription number is Required"
  ),
  es_subscription_name: Yup.string().required("Subscription name is Required"),
  purchse_order_no: Yup.string().required("Purchase order number is Required"),
  start_date: Yup.string().required("Required"),
  end_date: Yup.string().required("Required"),
  subscription_type: Yup.string().required("Required"),
  subscription_price: Yup.number().required("Required"),
  adjustment_per_year: Yup.string().required("Required"),
  next_adjustment: Yup.string().required("Required"),
  user_number: Yup.string().required("Required"),
  subscription_owner: Yup.object({
    contact_person: Yup.string().required("Required"),
    position_title: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
  }),
  level1_ids: Yup.array().of(Yup.string().matches(uuidRegex)),
  level2_ids: Yup.array().of(Yup.string().matches(uuidRegex)),
});

/* =======================
   COMPONENT
======================= */
const SubscriptionForm = ({ handleBack, handleNext }) => {
  const [params, setParams] = useSearchParams();
  const clientId = params.get("clientId");
  const groupId = params.get("group_id");

  const [step, setStep] = useState(STEPS.SUBSCRIPTION);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeLevel, setActiveLevel] = useState("");

  const [createSubscription] = useCreateSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [createLevel1] = useCreateLevel1Mutation();
  const [createLevel2] = useCreateLevel2Mutation();
  const [updateGroup] = useUpdateGroupMutation();
  const { saveSubscriptionId } = useCreatedSubscriptionId();

  /* =======================
     INITIAL VALUES
  ======================= */
  const initialValues = {
    es_subscription_number: "",
    es_subscription_name: "",
    purchse_order_no: "",
    start_date: "",
    end_date: "",
    subscription_type: "",
    subscription_price: "",
    adjustment_per_year: "",
    next_adjustment: "",
    client_id: clientId,
    user_number: "",
    subscription_owner: {
      contact_person: "",
      position_title: "",
      email: "",
    },
    level_config: {
      level_1: { name: "", availability: false },
      level_2: { name: "", availability: false },
      level_3: { name: "Building", availability: true },
    },
    regions: [],
    cities: [],
    building_ids: [],
    service_contract_ids: [],
    report_download_access: false,
    service_contract_doc_download_access: false,
  };

  /* =======================
     HANDLE SUBMIT
  ======================= */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      /* ===== STEP 1: CREATE SUBSCRIPTION ===== */
      if (step === STEPS.SUBSCRIPTION) {
        const res = await createSubscription(values).unwrap();
        const subId = res?.data?.subscription_id;
        setSubscriptionId(subId);
        saveSubscriptionId(subId);

        const newParams = new URLSearchParams(params);
        newParams.set("subscription_id", subId);
        setParams(newParams);

        toast.success("Subscription saved");
        setStep(STEPS.LEVEL1);
        return;
      }

      /* ===== STEP 2: CREATE LEVEL1 ===== */
      if (step === STEPS.LEVEL1) {
        const regions = values.regions.map((region) => ({
          ...region,
          es_subscription_id: subscriptionId,
          client_id: clientId,
        }));

        const res = await createLevel1({ level1s: regions }).unwrap();
        const level1Ids = res.data.map((i) => i.id);

        await updateSubscription({
          subscriptionId,
          values: { level1_ids: level1Ids },
        }).unwrap();

        toast.success("Level 1 saved");
        setStep(STEPS.LEVEL2);
        setActiveLevel("city");
        return;
      }

      /* ===== STEP 3: CREATE LEVEL2 ===== */
      if (step === STEPS.LEVEL2) {
        const cities = values.cities.map((city, index) => ({
          ...city,
          es_subscription_id: subscriptionId,
          client_id: clientId,
        }));

        const res = await createLevel2({ level2s: cities }).unwrap();
        const level2Ids = res?.data?.map((i) => i.id);

        await updateSubscription({
          values: { level2_ids: level2Ids },
          subscriptionId,
        }).unwrap();

        await updateGroup({
          group_id: groupId,
          subscription_id: subscriptionId,
        }).unwrap();

        toast.success("Subscription completed");
        handleNext();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SubscriptionSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors }) => (
        <Form>
          <div className="w-full bg-[#F6F6F8] rounded-2xl p-6 space-y-6 mt-5">
            {/* ========== STEP 1: SUBSCRIPTION DETAILS ========== */}
            {step === STEPS.SUBSCRIPTION && (
              <>
                {/* GRID 2: Subscription Number & Name */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <InputField
                        label="Subscription Number"
                        value={values.es_subscription_number}
                        onChange={(e) =>
                          setFieldValue(
                            "es_subscription_number",
                            e.target.value
                          )
                        }
                        className={{ Wrapper: "bg-gray-100" }}
                      />
                      {errors.es_subscription_number && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.es_subscription_number}
                        </p>
                      )}
                    </div>

                    <div>
                      <InputField
                        label="Subscription Name"
                        value={values.es_subscription_name}
                        onChange={(e) =>
                          setFieldValue("es_subscription_name", e.target.value)
                        }
                        className={{ Wrapper: "bg-gray-100" }}
                      />
                      {errors.es_subscription_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.es_subscription_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Purchase Order */}
                  <div>
                    <InputField
                      label="Purchase Order No"
                      value={values.purchse_order_no}
                      onChange={(e) =>
                        setFieldValue("purchse_order_no", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.purchse_order_no && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.purchse_order_no}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid 2: Start & End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputField
                      label="Start Date"
                      type="date"
                      value={values.start_date}
                      onChange={(e) =>
                        setFieldValue("start_date", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.start_date}
                      </p>
                    )}
                  </div>
                  <div>
                    <InputField
                      label="End Date"
                      type="date"
                      value={values.end_date}
                      onChange={(e) =>
                        setFieldValue("end_date", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.end_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid 4: Subscription Info */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <InputField
                      label="Subscription Type"
                      value={values.subscription_type}
                      onChange={(e) =>
                        setFieldValue("subscription_type", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.subscription_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subscription_type}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Subscription Price"
                      type="number"
                      value={values.subscription_price}
                      onChange={(e) =>
                        setFieldValue(
                          "subscription_price",
                          Number(e.target.value)
                        )
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.subscription_price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subscription_price}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Adjustment / Year"
                      value={values.adjustment_per_year}
                      onChange={(e) =>
                        setFieldValue("adjustment_per_year", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.adjustment_per_year && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.adjustment_per_year}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Next Adjustment"
                      type="date"
                      value={values.next_adjustment}
                      onChange={(e) =>
                        setFieldValue("next_adjustment", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.next_adjustment && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.next_adjustment}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid 2: User Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputField
                      label="User Number"
                      value={values.user_number}
                      onChange={(e) =>
                        setFieldValue("user_number", e.target.value)
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.user_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.user_number}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid 3: Subscription Owner */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <InputField
                      label="Contact Person"
                      value={values.subscription_owner.contact_person}
                      onChange={(e) =>
                        setFieldValue(
                          "subscription_owner.contact_person",
                          e.target.value
                        )
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.subscription_owner?.contact_person && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subscription_owner.contact_person}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Position Title"
                      value={values.subscription_owner.position_title}
                      onChange={(e) =>
                        setFieldValue(
                          "subscription_owner.position_title",
                          e.target.value
                        )
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.subscription_owner?.position_title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subscription_owner.position_title}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Email"
                      value={values.subscription_owner.email}
                      onChange={(e) =>
                        setFieldValue(
                          "subscription_owner.email",
                          e.target.value
                        )
                      }
                      className={{ Wrapper: "bg-gray-100" }}
                    />
                    {errors.subscription_owner?.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subscription_owner.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid 3: Level 1, Level 2, Building */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <InputField
                      name={"level_config.level_1.name"}
                      label={"Level 1"}
                      placeholder={"Enter your region"}
                      available={values?.level_config?.level_1?.availability}
                      setAvailable={(check) =>
                        setFieldValue(
                          "level_config.level_1.availability",
                          check
                        )
                      }
                      value={values?.level_config?.level_1?.name}
                      onChange={(e) =>
                        setFieldValue(
                          "level_config.level_1.name",
                          e.target.value
                        )
                      }
                      isSwitch
                    />
                    {errors.level1_ids?.[0] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.level1_ids[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label={"Level 2"}
                      placeholder={"Enter your city"}
                      value={values?.level_config?.level_2?.name}
                      name={"level_config.level_2.name"}
                      onChange={(e) =>
                        setFieldValue(
                          "level_config.level_2.name",
                          e.target.value
                        )
                      }
                      available={values?.level_config?.level_2?.availability}
                      setAvailable={(check) =>
                        setFieldValue(
                          "level_config.level_2.availability",
                          check
                        )
                      }
                      isSwitch
                    />
                    {errors.level2_ids?.[0] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.level2_ids[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Building ID"
                      value={"Buildings"}
                      className={{ Wrapper: "bg-gray-100" }}
                      disabled={true}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ===== STEP 2+ LEVEL DETAILS ===== */}
            {step !== STEPS.SUBSCRIPTION && (
              <LevelDetails
                levelConfig={values.level_config}
                setValues={setFieldValue}
                values={values}
                active={activeLevel}
                setActive={setActiveLevel}
                onBoarding
              />
            )}

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex items-center justify-between gap-3 mt-5">
              <Button
                type="button"
                onClick={() =>
                  step === STEPS.SUBSCRIPTION
                    ? handleBack()
                    : setStep((s) => s - 1)
                }
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <LoaderCircle />
                ) : step === 3 ? (
                  "Finish"
                ) : (
                  "Save & Next"
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SubscriptionForm;
