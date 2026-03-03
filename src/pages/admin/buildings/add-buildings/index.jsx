import AddBuilding from "@/components/admin/add-buildings/add-building";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import {
  useCreateLevel3Mutation,
  useGetLevel3Query,
  useGetLvl2BySubscriptionIdQuery,
  useUpdateLevel3Mutation,
} from "@/redux/services/subscription";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const validationSchema = Yup.object({
  client_id: Yup.string().required("Client name is required"),
  name: Yup.string().required("Building name is required"),
  total_floors: Yup.string().required("Total floors is required"),
});

export default function AddBuildings({
  handleNext,
  handleBack,
  Onboarding = false,
}) {
  const [params, searchParams] = useSearchParams();
  const buildingId = params.get("uuid");
  const clientId = params.get("clientId");

  const navigate = useNavigate();
  const [createBuildings, { isLoading }] = useCreateLevel3Mutation();
  const [updateBuildings, { isLoading: isUpdating }] =
    useUpdateLevel3Mutation();
  const { data: building, isLoading: isLvl3Loading } = useGetLevel3Query(
    buildingId,
    {
      skip: !buildingId,
    },
  );

  const { data: lvl2Data } = useGetLvl2BySubscriptionIdQuery(
    {
      subscriptionId: building?.data?.es_subscription_id,
      parentId: undefined,
    },
    { skip: !building?.data?.es_subscription_id },
  );

  const formik = useFormik({
    initialValues: getInitialValues(building?.data, Onboarding, clientId),
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const { values, handleChange, setFieldValue, errors, touched } = formik;

  useEffect(() => {
    if (!buildingId) return;
    if (!lvl2Data?.data?.length || !building?.data?.parent_level_id) return;

    const foundLvl2 = lvl2Data.data.find(
      (lvl) => lvl.id === building.data.parent_level_id,
    );

    if (foundLvl2?.parent_level_id) {
      setFieldValue("level_1", foundLvl2.parent_level_id);
      setFieldValue("client_id", building?.data?.client_id);
    }
  }, [
    buildingId,
    lvl2Data?.data,
    building?.data?.parent_level_id,
    setFieldValue,
  ]);

  function handleSubmit(values) {
    const payload = JSON.parse(JSON.stringify(values));

    if (payload.email === "") {
      delete payload.email;
    }
    if (payload.state === "") {
      delete payload.state;
    }
    if (payload.parent_level_id === "") {
      delete payload.parent_level_id;
    }

    if (payload.building_category === "") {
      delete payload.building_category;
    }
    if (payload.es_subscription_id === "") {
      delete payload.es_subscription_id;
    }

    delete payload.level_1;

    if (payload.building_owner?.email === "") {
      delete payload.building_owner.email;
    }
    if (buildingId) {
      updateBuildings({ id: buildingId, body: payload })
        .unwrap()
        .then((res) => {
          toast.success(res?.message || "Building Updated successfully");
          if (Onboarding) {
            const newparams = new URLSearchParams(params);
            newparams.set("uuid", res?.data?.id);
            searchParams(newparams);
            handleNext();
          } else {
            window.location.href =
              "/equipment-group?update=true&building_id=" +
              res?.data?.id +
              "&from_buildings=true";
          }
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Something went wrong");
        });
    } else {
      createBuildings(payload)
        .unwrap()
        .then((res) => {
          toast.success(res?.message || "Buildings created successfully");
          if (Onboarding) {
            const newparams = new URLSearchParams(params);
            newparams.set("uuid", res?.data?.id);
            searchParams(newparams);
            handleNext();
          } else {
            navigate(
              "/equipment-group?building_id=" +
                res?.data?.id +
                "&from_buildings=true",
            );
          }
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Something went wrong");
        });
    }
  }
  const list = [
    {
      item: "Buildings",
      link: "/admin/buildings",
    },
    {
      item: `${buildingId ? "Update" : "Add"} Building Details`,
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={list} />

      <p className="text-3xl text-text_primary font-semibold">
        {buildingId ? "Update" : "Add"} Building Details
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Please add your building details
      </p>

      <div>
        <AddBuilding
          values={values}
          setValues={setFieldValue}
          handleChange={handleChange}
          Onboarding={Onboarding}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={() => {
            if (Onboarding) {
              handleBack();
              return;
            }
            navigate("/admin/buildings");
          }}
        >
          Back
        </Button>

        <Button
          className="w-[150px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={formik.handleSubmit}
        >
          {isLoading || isUpdating ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            `${buildingId ? "Update" : "Add"} Building`
          )}
        </Button>
      </div>
    </div>
  );
}

function getInitialValues(data, Onboarding = false, clientId) {
  const initialValues = {
    client_id: Onboarding ? clientId : data?.client_id,
    parent_level_id: data?.parent_level_id || "",
    level_1: "",
    es_subscription_id: data?.es_subscription_id || "",
    name: data?.name || "",
    address: data?.address || "",
    contact_person_name: data?.contact_person_name || "",
    contact_person_job_title: data?.contact_person_job_title || "",
    contact_person_organization: data?.contact_person_organization || "",
    phone_number: data?.phone_number || "",
    country_code: data?.country_code || "+61",
    email: data?.email || "",
    building_owner: {
      name: data?.building_owner?.name || "",
      phone_number: data?.building_owner?.phone_number || "",
      country_code: data?.building_owner?.country_code || "+61",
      email: data?.building_owner?.email || "",
    },
    building_category: data?.building_category || "",
    total_floors: data?.total_floors || "",
    number_of_equipments: data?.number_of_equipments || 0,
    city: data?.city || "",
    postal_code: data?.postal_code || "",
    country: data?.country || "",
    state: data?.state || "",
  };

  Onboarding && delete initialValues.parent_level_id;
  Onboarding && delete initialValues.level_1;
  Onboarding && delete initialValues.es_subscription_id;

  return initialValues;
}
