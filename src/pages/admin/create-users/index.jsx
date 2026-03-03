import { Button } from "@/components/ui/button";
import {
  useCreateClientMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/redux/services/auth-api";
import { create_users_tabs } from "@/static/es-client";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AccessManagement from "./access-management";
import UserInfo from "./user-info";
import { useDispatch } from "react-redux";
import {
  subscriptionApi,
  useLazyGetLvl1BySubscriptionIdQuery,
  useLazyGetLvl2BySubscriptionIdQuery,
  useLazyGetLvl3ListQuery,
  useLazyGetSubscriptionByClientIdQuery,
} from "@/redux/services/subscription";
import { adminClientApi } from "@/redux/services/admin-client";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import GiveAccess from "../admin-create-update-user/give-access";

export default function CreateUsers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const userType = searchParams.get("type");

  const { data } = useGetUserByIdQuery(id, {
    skip: !id,
  });

  const [getSubscriptionByClientId] = useLazyGetSubscriptionByClientIdQuery();
  const [getLvl1BySubscriptionId] = useLazyGetLvl1BySubscriptionIdQuery();
  const [getLvl2BySubscriptionId] = useLazyGetLvl2BySubscriptionIdQuery();
  const [getLvl3List] = useLazyGetLvl3ListQuery();

  const [createUser, { isLoading }] = useCreateClientMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(id && data ? data?.data : {}),
    onSubmit: handleSubmit,
  });

  const dispatch = useDispatch();

  async function handleSubmit(values) {
    const body = {
      ...values,
      country_code: `+${values.country_code}`,
    };

    if (userType == "es-client") {
      const clientId = body?.accesses[0]?.client_id;
      const subscriptions = await getSubscriptionByClientId(clientId).unwrap();
      const allLvl1 = await getLvl1BySubscriptionId({
        client_id: clientId,
      }).unwrap();
      const allLvl2 = await getLvl2BySubscriptionId({
        client_id: clientId,
      }).unwrap();
      const subscriptionsIds = subscriptions?.data?.map(
        (sub) => sub?.subscription_id,
      );
      const allLvl3 = await getLvl3List({
        clientId: clientId,
      }).unwrap();

      const allLvl1Ids = allLvl1?.data?.map((lvl1) => ({
        lvl1_id: lvl1?.id,
        es_subscription_id: lvl1?.es_subscription_id,
      }));
      const allLvl2Ids = allLvl2?.data?.map((lvl2) => ({
        lvl2_id: lvl2?.id,
        level_1: lvl2?.parent_level_id,
      }));

      const allLvl3Ids = allLvl3?.data?.map((lvl3) => ({
        lvl3_id: lvl3?.id,
        level_2: lvl3?.parent_level_id,
      }));
      //Payload when accesses is all

      if (
        body.accesses[0]?.es_pulse_subscription_id == "all" &&
        body.accesses[0]?.level_1_id == "all" &&
        body.accesses[0]?.level_2_id == "all"
      ) {
        const stucturedPayload = subscriptionsIds?.flatMap((subId) => {
          const relatedLevl1 = allLvl1Ids?.filter(
            (lvl1) => lvl1.es_subscription_id == subId,
          );

          return relatedLevl1?.flatMap((relatedLevl1) => {
            const relatedLevl2 = allLvl2Ids?.filter(
              (lvl2) => lvl2.level_1 == relatedLevl1.lvl1_id,
            );

            return relatedLevl2?.flatMap((relatedLevl2) => {
              const relatedLevl3 = allLvl3Ids?.filter(
                (lvl2) => lvl2.level_2 == relatedLevl2.lvl2_id,
              );
              const buildingIds = relatedLevl3?.map(
                (relatedLevl3) => relatedLevl3.lvl3_id,
              );

              return {
                client_id: clientId,
                es_pulse_subscription_id: subId,
                level_1_id: relatedLevl1.lvl1_id,
                level_2_id: relatedLevl2.lvl2_id,
                building_ids: buildingIds,
              };
            });
          });
        });

        if (id) {
          updateUser({ id: id, body: { ...body, accesses: stucturedPayload } })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User Updated successfully");
              navigate("/admin/es-clients");
              dispatch(subscriptionApi.util.invalidateTags(["Level"]));
              dispatch(adminClientApi.util.invalidateTags(["Client"]));
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        } else {
          createUser({ ...body, accesses: stucturedPayload })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User created successfully");
              navigate("/admin/es-clients");
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        }
        return;
      }

      //Payload when accesses is not all but levels is all
      if (
        body.accesses[0]?.es_pulse_subscription_id !== "all" &&
        body.accesses[0]?.level_1_id == "all" &&
        body.accesses[0]?.level_2_id == "all"
      ) {
        const relatedLevl1 = allLvl1Ids?.filter(
          (lvl1) =>
            lvl1.es_subscription_id ==
            body.accesses[0].es_pulse_subscription_id,
        );

        const stucturedPayload = relatedLevl1?.flatMap((relatedLevl1) => {
          const relatedLevl2 = allLvl2Ids?.filter(
            (lvl2) => lvl2.level_1 == relatedLevl1.lvl1_id,
          );

          return relatedLevl2?.flatMap((relatedLevl2) => {
            const relatedLevl3 = allLvl3Ids?.filter(
              (lvl2) => lvl2.level_2 == relatedLevl2.lvl2_id,
            );
            const buildingIds = relatedLevl3?.map(
              (relatedLevl3) => relatedLevl3.lvl3_id,
            );

            return {
              client_id: clientId,
              es_pulse_subscription_id:
                body.accesses[0].es_pulse_subscription_id,
              level_1_id: relatedLevl1.lvl1_id,
              level_2_id: relatedLevl2.lvl2_id,
              building_ids: buildingIds,
            };
          });
        });

        if (id) {
          updateUser({ id: id, body: { ...body, accesses: stucturedPayload } })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User Updated successfully");
              navigate("/admin/es-clients");
              dispatch(subscriptionApi.util.invalidateTags(["Level"]));
              dispatch(adminClientApi.util.invalidateTags(["Client"]));
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        } else {
          createUser({ ...body, accesses: stucturedPayload })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User created successfully");
              navigate("/admin/es-clients");
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        }
        return;
      }

      //Payload when accesses  and level1 is not all but levels2 is all
      if (
        body.accesses[0]?.es_pulse_subscription_id !== "all" &&
        body.accesses[0]?.level_1_id !== "all" &&
        body.accesses[0]?.level_2_id == "all"
      ) {
        const relatedLevl2 = allLvl2Ids?.filter(
          (lvl2) => lvl2.level_1 == body.accesses[0].level_1_id,
        );

        const stucturedPayload = relatedLevl2?.flatMap((relatedLevl2) => {
          const relatedLevl3 = allLvl3Ids?.filter(
            (lvl2) => lvl2.level_2 == relatedLevl2.lvl2_id,
          );
          const buildingIds = relatedLevl3?.map(
            (relatedLevl3) => relatedLevl3.lvl3_id,
          );

          return {
            client_id: clientId,
            es_pulse_subscription_id: body.accesses[0].es_pulse_subscription_id,
            level_1_id: body.accesses[0].level_1_id,
            level_2_id: relatedLevl2.lvl2_id,
            building_ids: buildingIds,
          };
        });

        if (id) {
          updateUser({ id: id, body: { ...body, accesses: stucturedPayload } })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User Updated successfully");
              navigate("/admin/es-clients");
              dispatch(subscriptionApi.util.invalidateTags(["Level"]));
              dispatch(adminClientApi.util.invalidateTags(["Client"]));
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        } else {
          createUser({ ...body, accesses: stucturedPayload })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User created successfully");
              navigate("/admin/es-clients");
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        }
        return;
      }
      //Payload when accesses  and level1 is not all but levels2 is all
      if (
        body.accesses[0]?.es_pulse_subscription_id == "all" &&
        body.accesses[0]?.level_1_id !== "all" &&
        body.accesses[0]?.level_2_id == "all"
      ) {
        const stucturedPayload = subscriptionsIds?.flatMap((subId) => {
          const relatedLevl2 = allLvl2Ids?.filter(
            (lvl2) => lvl2.level_1 == body.accesses[0].level_1_id,
          );
          return relatedLevl2?.flatMap((relatedLevl2) => {
            const relatedLevl3 = allLvl3Ids?.filter(
              (lvl2) => lvl2.level_2 == relatedLevl2.lvl2_id,
            );
            const buildingIds = relatedLevl3?.map(
              (relatedLevl3) => relatedLevl3.lvl3_id,
            );

            return {
              client_id: clientId,
              es_pulse_subscription_id: subId,
              level_1_id: body.accesses[0].level_1_id,
              level_2_id: relatedLevl2.lvl2_id,
              building_ids: buildingIds,
            };
          });
        });

        if (id) {
          updateUser({ id: id, body: { ...body, accesses: stucturedPayload } })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User Updated successfully");
              navigate("/admin/es-clients");
              dispatch(subscriptionApi.util.invalidateTags(["Level"]));
              dispatch(adminClientApi.util.invalidateTags(["Client"]));
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        } else {
          createUser({ ...body, accesses: stucturedPayload })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User created successfully");
              navigate("/admin/es-clients");
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        }
        return;
      }

      //Payload when accesses is not all level1 is all and level2 is not all
      if (
        body.accesses[0]?.es_pulse_subscription_id !== "all" &&
        body.accesses[0]?.level_1_id == "all" &&
        body.accesses[0]?.level_2_id !== "all"
      ) {
        const relatedLevl1 = allLvl1Ids?.filter(
          (lvl1) =>
            lvl1.es_subscription_id ==
            body.accesses[0].es_pulse_subscription_id,
        );

        const stucturedPayload = relatedLevl1?.flatMap((relatedLevl1) => {
          const relatedLevl3 = allLvl3Ids?.filter(
            (lvl2) => lvl2.level_2 == body.accesses[0].level_2_id,
          );
          const buildingIds = relatedLevl3?.map(
            (relatedLevl3) => relatedLevl3.lvl3_id,
          );

          return {
            client_id: clientId,
            es_pulse_subscription_id: body.accesses[0].es_pulse_subscription_id,
            level_1_id: relatedLevl1.lvl1_id,
            level_2_id: body.accesses[0].level_2_id,
            building_ids: buildingIds,
          };
        });

        if (id) {
          updateUser({ id: id, body: { ...body, accesses: stucturedPayload } })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User Updated successfully");
              navigate("/admin/es-clients");
              dispatch(subscriptionApi.util.invalidateTags(["Level"]));
              dispatch(adminClientApi.util.invalidateTags(["Client"]));
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        } else {
          createUser({ ...body, accesses: stucturedPayload })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User created successfully");
              navigate("/admin/es-clients");
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        }
        return;
      }

      //Payload when accesses is all but levels not all
      if (
        body.accesses[0]?.es_pulse_subscription_id == "all" &&
        body.accesses[0]?.level_1_id !== "all" &&
        body.accesses[0]?.level_2_id !== "all"
      ) {
        const stucturedPayload = subscriptionsIds?.flatMap((subId) => {
          const relatedLevl3 = allLvl3Ids?.filter(
            (lvl2) => lvl2.level_2 == body.accesses[0].level_2_id,
          );
          const buildingIds = relatedLevl3?.map(
            (relatedLevl3) => relatedLevl3.lvl3_id,
          );

          return {
            client_id: clientId,
            es_pulse_subscription_id: subId,
            level_1_id: body.accesses[0].level_1_id,
            level_2_id: body.accesses[0].level_2_id,
            building_ids: buildingIds,
          };
        });

        if (id) {
          updateUser({ id: id, body: { ...body, accesses: stucturedPayload } })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User Updated successfully");
              navigate("/admin/es-clients");
              dispatch(subscriptionApi.util.invalidateTags(["Level"]));
              dispatch(adminClientApi.util.invalidateTags(["Client"]));
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        } else {
          createUser({ ...body, accesses: stucturedPayload })
            .unwrap()
            .then((res) => {
              toast.success(res?.message || "User created successfully");
              navigate("/admin/es-clients");
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Something went wrong");
            });
        }
        return;
      }
    }
    //Payload when accesses is not all

    if (id) {
      updateUser({ id: id, body: body })
        .unwrap()
        .then((res) => {
          toast.success(res?.message || "User Updated successfully");
          navigate("/admin/es-clients");
          dispatch(subscriptionApi.util.invalidateTags(["Level"]));
          dispatch(adminClientApi.util.invalidateTags(["Client"]));
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Something went wrong");
        });
    } else {
      createUser(body)
        .unwrap()
        .then((res) => {
          toast.success(res?.message || "User created successfully");
          navigate("/admin/es-clients");
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Something went wrong");
        });
    }
  }

  const [activeIndex, setActiveIndex] = useState(0);

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const active = create_users_tabs[activeIndex].key;
  const breadlist = [
    {
      item: "ES Clients",
      link: `${userType == "es-admin" ? "/admin/es-admin" : "/admin/es-clients"}`,
    },

    {
      item: `${id ? `Update ES ${userType == "es-admin" ? "Admins" : "Client"} ` : `Add ES  ${userType == "es-admin" ? "Admins" : "Client"}`}`,
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={breadlist} />

      <p className="text-3xl text-text_primary font-semibold">
        {id ? "Update ES Client" : "Add ES Client"}
      </p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Enter Your Equipment Details below {id ? "to update" : "to create"}
      </p>

      {userType != "es-admin" && (
        <div className="w-fit h-13 flex items-center rounded-2xl bg-bg_primary p-1 mt-5">
          {create_users_tabs.map((tab, index) => {
            return (
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
            );
          })}
        </div>
      )}

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
        {active === "access-management" && (
          <AccessManagement
            values={formik.values}
            setValues={formik.setFieldValue}
            handleChange={formik.handleChange}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={handleBack}
          disabled={activeIndex === 0}
        >
          {activeIndex === 0 ? "Close" : "Back"}
        </Button>

        <Button
          className="w-[98px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={() => {
            if (userType != "es-admin") {
              if (activeIndex === create_users_tabs.length - 1) {
                formik.handleSubmit();
              } else {
                setActiveIndex((prev) => prev + 1);
              }
            }
            if (userType == "es-admin") {
              formik.handleSubmit();
            }
          }}
        >
          {isLoading || isUpdating ? (
            <LoaderCircle className="animate-spin" />
          ) : userType == "es-admin" ? (
            "Save"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}

function getInitialValues(data) {
  return {
    user_type_id: data?.user_type_id || "",
    fullname: data?.fullname || "",
    email: data?.email || "",
    phone_number: data?.phone_number || "",
    country_code: data?.country_code || "+61",
    password: "",
    company: data?.company || "",
    is_active: data?.is_active || false,
    position: data?.position || "",
    accesses: data?.accesses || [],
    report_download_access: false,
    service_contract_download_access: false,
  };
}
