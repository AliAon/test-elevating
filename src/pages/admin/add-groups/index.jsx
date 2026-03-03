import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { LoaderCircle } from "lucide-react";
import {
  useCreateGroupWithEquipmentsBulkMutation,
  useGetAllGroupsQuery,
  useGetGroupByIdQuery,
  useLazyGetEquipmentByIdQuery,
  useUpdateGroupWithEquipmentsBulkMutation,
} from "@/redux/services/groups";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import MainCard from "../equipment-group/main-card";

const toNumberOrZero = (v) =>
  v !== undefined && v !== null && v !== "" ? Number(v) : 0;

const equipmentSchema = Yup.object({
  equipment_name: Yup.string().required("Equipment name is required"),
  equipment_type: Yup.string().required("Equipment type is required"),
  brand_id: Yup.string().required("Brand is required"),
  model_number: Yup.string().required("Model number is required"),
  es_pulse_equipment_number: Yup.string().required(
    "ES Pulse equipment number is required",
  ),
  oem_service_equipment_number: Yup.string().required(
    "OEM service equipment number is required",
  ),
  client_equipment_number: Yup.string().required(
    "Client equipment number is required",
  ),
  design_code: Yup.string().required("Design code is required"),
  year_of_installation: Yup.string().required(
    "Year of installation is required",
  ),

  equipment_life: Yup.string().required("Equipment life is required"),
  plant_registration_date: Yup.string().required(
    "Plant registration date is required",
  ),
  next_modernization_date: Yup.string().required(
    "Next modernization date is required",
  ),
});

const groupSchema = Yup.object({
  groupname: Yup.string().required("Group name is required"),
  building_id: Yup.string().required("Building is required"),
  description: Yup.string().nullable(),
  equipments: Yup.array().of(equipmentSchema),
});

export const validationSchema = Yup.object({
  groups: Yup.array().of(groupSchema),
});

export default function AddOnBoardGroup({ handleNext, handleBack }) {
  const [params] = useSearchParams();
  const building_id = params.get("uuid");
  const subscriptionId = params.get("subscriptionId");
  const clientId = params.get("clientId");
  const group_id = params.get("group_id");

  const navigate = useNavigate();
  const [updatingBulk, { isLoading: isUpdatingBulk }] =
    useUpdateGroupWithEquipmentsBulkMutation();

  const { data: groupData } = useGetGroupByIdQuery(group_id, {
    skip: !group_id,
  });
  const { data: allGroups } = useGetAllGroupsQuery(
    { building_id },
    {
      skip: !building_id,
    },
  );

  const [equipmentsLoading, setEquipmentsLoading] = useState(false);

  const [fetchEquipment] = useLazyGetEquipmentByIdQuery();
  const [fullData, setFullData] = useState({});
  const [createGroupWithEquipmentsBulk, { isLoading: isCreating }] =
    useCreateGroupWithEquipmentsBulkMutation();

  useEffect(() => {
    const fetchAllEquipments = async () => {
      if (group_id && groupData) {
        if (!groupData?.data?.equipment_ids?.length) {
          setFullData(groupData);
          return;
        }

        setEquipmentsLoading(true);
        try {
          const results = await Promise.all(
            groupData?.data?.equipment_ids.map((id) =>
              fetchEquipment(id)
                .unwrap()
                .then((res) => res.data),
            ),
          );
          setFullData({ ...groupData?.data, equipments: results });
        } catch (error) {
          console.error("Failed to fetch equipments:", error);
        } finally {
          setEquipmentsLoading(false);
        }
        return;
      }

      if (!group_id && allGroups?.data?.groups?.length) {
        setEquipmentsLoading(true);
        try {
          const allGroupsWithEquipments = await Promise.all(
            allGroups?.data?.groups.map(async (group) => {
              if (!group.equipment_ids?.length) return group;

              const results = await Promise.all(
                group.equipment_ids.map((id) =>
                  fetchEquipment(id)
                    .unwrap()
                    .then((res) => res.data),
                ),
              );
              return { ...group, equipments: results };
            }),
          );
          setFullData({ groups: allGroupsWithEquipments });
        } catch (error) {
          console.error("Failed to fetch all groups' equipments:", error);
        } finally {
          setEquipmentsLoading(false);
        }
      }
    };

    fetchAllEquipments();
  }, [group_id, groupData, allGroups, fetchEquipment]);

  const initialValues = useMemo(() => {
    if (group_id && fullData?.groupname) {
      return {
        groups: [{ id: fullData.id, ...getInitialValues(fullData) }],
      };
    }

    if (!group_id && fullData?.groups?.length) {
      return {
        groups: fullData.groups.map((g) => ({
          id: g.id,
          ...getInitialValues(g, building_id),
        })),
      };
    }

    return {
      groups: [{ id: 1, ...getInitialValues(null, building_id) }],
    };
  }, [fullData, building_id, group_id]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async () => {
      try {
        const esSubscriptionIds = Array.from(
          new Set(
            formik.values.groups
              .map((g) => g.es_subscription_id)
              .filter(Boolean),
          ),
        );

        const subscriptionDetails = {};
        await Promise.all(
          esSubscriptionIds.map(async (id) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/v1/subscriptions/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );
              const data = await res.json();
              subscriptionDetails[id] = data?.data?.client_id || null;
            } catch (e) {
              subscriptionDetails[id] = null;
            }
          }),
        );

        const groupsPayload = formik.values.groups.map((g) => {
          const equipments = g.equipments.map((eq) => {
            const base = {
              equipment_id: eq?.equipment_id || eq?.id,
              building_id: eq.building_id,
              brand_id: eq.brand_id,
              equipment_name: eq.equipment_name,
              equipment_type: eq.equipment_type?.toUpperCase(),
              oem_service_equipment_number: eq.oem_service_equipment_number,
              es_pulse_equipment_number: eq.es_pulse_equipment_number,
              client_equipment_number: eq.client_equipment_number,
              model_number: eq.model_number,
              design_code: eq.design_code,
              year_of_installation: Number(eq.year_of_installation),
              last_modernization_date: eq.last_modernization_date,
              last_modernization_parts: eq.last_modernization_parts,
              equipment_life: Number(eq.equipment_life),
              next_modernization_date: Number(eq.next_modernization_date),
              plant_registration_date: eq.plant_registration_date,
            };

            const type = eq.equipment_type?.toUpperCase();
            if (type === "ELEVATOR" || type === "DUMB WAITER") {
              return {
                ...base,
                specification: {
                  design_type: eq.specification?.design_type,
                  speed: toNumberOrZero(eq.specification?.speed),
                  height: toNumberOrZero(eq.specification?.height),
                  width: toNumberOrZero(eq.specification?.width),
                  floor_from: toNumberOrZero(eq.specification?.floor_from),
                  floor_to: toNumberOrZero(eq.specification?.floor_to),
                  controller_model: eq.specification?.controller_model,
                  drive_model: eq.specification?.drive_model,
                  function_type: eq.specification?.function_type,
                  max_load: toNumberOrZero(eq.specification?.max_load),
                  stops: toNumberOrZero(eq.specification?.stops),
                  length: toNumberOrZero(eq.specification?.length),
                  suspension_type: eq.specification?.suspension_type,
                  door_controller_brand:
                    eq.specification?.door_controller_brand,
                  door_controller_model:
                    eq.specification?.door_controller_model,
                  in_car_media_brand: eq.specification?.in_car_media_brand,
                  in_car_media_model: eq.specification?.in_car_media_model,
                  travel: toNumberOrZero(eq.specification?.travel),
                },
              };
            }

            if (["ESCALATOR", "MOVING WALK", "PLATFORM"].includes(type)) {
              return {
                ...base,
                specification: {
                  design_type: eq.specification?.design_type,
                  speed: toNumberOrZero(eq.specification?.speed),
                  height: toNumberOrZero(eq.specification?.height),
                  width: toNumberOrZero(eq.specification?.width),
                  floor_from: toNumberOrZero(eq.specification?.floor_from),
                  floor_to: toNumberOrZero(eq.specification?.floor_to),
                  controller_model: eq.specification?.controller_model,
                  drive_model: eq.specification?.drive_model,
                  inclination: eq.specification?.inclination,
                },
              };
            }

            return { ...base, specification: eq.specification };
          });

          // Use the fetched client_id for the selected es_subscription_id
          const client_id =
            subscriptionDetails[g.es_subscription_id] || g.client_id || "";

          return {
            id: g.id,
            group_number: g.group_number,
            groupname: g.groupname,
            description: g.description || "No description",
            client_id: client_id || clientId,
            building_id: g.building_id || building_id,
            brand_id: g.brand_id || "",
            equipments,
            ...(g.service_contract_id && {
              service_contract_id: g.service_contract_id,
            }),
            ...(g.es_subscription_id && {
              es_subscription_id: g.es_subscription_id,
            }),
          };
        });

        const groupsToUpdate = groupsPayload.filter(
          (g) => typeof g.id === "string" && g.id.trim() !== "",
        );
        const groupsToCreate = groupsPayload.filter(
          (g) => typeof g.id !== "string",
        );

        let hasApiErrors = false;

        if (groupsToUpdate.length > 0) {
          const res = await updatingBulk({ groups: groupsToUpdate }).unwrap();
          const { hasErrors, groupsErrors, errorMessages } = processApiResponse(
            res?.data,
            formik.values.groups,
          );
          if (hasErrors) {
            hasApiErrors = true;
            formik.setFieldValue(
              "groups",
              formik.values.groups.map((g, gi) =>
                groupsErrors[gi]?.equipments?.some(Boolean)
                  ? { ...g, isOpen: true }
                  : g,
              ),
            );
            setTimeout(() => formik.setErrors({ groups: groupsErrors }), 0);
            errorMessages.forEach((msg) => toast.error(msg));
          } else {
            let url;
            if (subscriptionId) {
              url = `/admin/onboarding-client?clientId=${clientId}&uuid=${building_id}&groupId=${res?.data[0]?.id}&subscriptionId=${subscriptionId}`;
            } else {
              url = `/admin/onboarding-client?clientId=${clientId}&uuid=${building_id}&groupId=${res?.data[0]?.id}`;
            }
            navigate(url, { replace: true });
            toast.success("Existing groups updated successfully!");
          }
        }

        if (groupsToCreate.length > 0) {
          const res = await createGroupWithEquipmentsBulk({
            groups: groupsToCreate,
          }).unwrap();
          const { hasErrors, groupsErrors, errorMessages } = processApiResponse(
            res?.data,
            formik.values.groups,
          );
          if (hasErrors) {
            hasApiErrors = true;
            formik.setFieldValue(
              "groups",
              formik.values.groups.map((g, gi) =>
                groupsErrors[gi]?.equipments?.some(Boolean)
                  ? { ...g, isOpen: true }
                  : g,
              ),
            );
            setTimeout(() => formik.setErrors({ groups: groupsErrors }), 0);
            errorMessages.forEach((msg) => toast.error(msg));
          } else {
            navigate(
              `/admin/onboarding-client?clientId=${clientId}&uuid=${building_id}&groupId=${res?.data[0]?.id}`,
              { replace: true },
            );
            toast.success("New groups created successfully!");
          }
        }

        if (!hasApiErrors) {
          if (groupsToUpdate.length === 0 && groupsToCreate.length === 0) {
            toast.info("No valid groups to process.");
          }
          handleNext();
        }
      } catch (error) {
        console.error("Error creating/updating groups & equipments:", error);
        toast.error("Something went wrong while saving data.");
      }
    },
  });

  const addGroup = () => {
    formik.setFieldValue("groups", [
      ...formik.values.groups,
      { id: Date.now(), ...getInitialValues(null, building_id) },
    ]);
  };

  const removeGroup = (id) => {
    formik.setFieldValue(
      "groups",
      formik.values.groups.filter((g) => g.id !== id),
    );
  };

  const toggleGroup = (id) =>
    formik.setFieldValue(
      "groups",
      formik.values.groups.map((g) =>
        g.id === id ? { ...g, isOpen: !g.isOpen } : g,
      ),
    );

  const addEquipment = (groupId) => {
    formik.setFieldValue(
      "groups",
      formik.values.groups.map((g) => {
        if (g.id !== groupId) return g;
        const lastEquip = g.equipments[g.equipments.length - 1];
        const newEquip = lastEquip
          ? {
              ...lastEquip,
              id: Date.now(),
              equipment_name: incrementTrailingNumber(
                lastEquip.equipment_name,
              ),
              model_number: incrementTrailingNumber(lastEquip.model_number),
              es_pulse_equipment_number: incrementTrailingNumber(
                lastEquip.es_pulse_equipment_number,
              ),
              oem_service_equipment_number: incrementTrailingNumber(
                lastEquip.oem_service_equipment_number,
              ),
              client_equipment_number: incrementTrailingNumber(
                lastEquip.client_equipment_number,
              ),
            }
          : {
              id: Date.now(),
              ...getInitialValues(null, g.building_id || building_id)
                .equipments[0],
              building_id: g.building_id || building_id,
            };
        return { ...g, equipments: [...g.equipments, newEquip] };
      }),
    );
  };

  const removeEquipment = (groupId, equipId) => {
    formik.setFieldValue(
      "groups",
      formik.values.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              equipments: g.equipments.filter((e) => e.id !== equipId),
            }
          : g,
      ),
    );
  };

  const formikMap = {
    values: formik.values,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    setFieldValue: formik.setFieldValue,
    errors: formik.errors,
    touched: formik.touched,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl text-text_primary font-semibold">
            Equipment Group
          </p>
          <p className="text-sm text-text_secondary font-medium mt-2">
            Enter your Equipment Details in a Group below to update
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {formik.values?.groups?.map((group, index) => (
          <MainCard
            key={group.id}
            group={group}
            onToggle={() => toggleGroup(group.id)}
            onRemove={() => removeGroup(group.id)}
            onAddEquipment={() => addEquipment(group.id)}
            groupIndex={index}
            onRemoveEquipment={(equipId) => removeEquipment(group.id, equipId)}
            {...formikMap}
            equipmentsLoading={equipmentsLoading}
            onBoarding
          />
        ))}
      </div>

      <div
        className={`flex items-center gap-3 mt-5 ${
          group_id ? "justify-end" : "justify-between"
        }`}
      >
        <Button
          className="w-[167px] h-12 rounded-full bg-bg_primary text-text_secondary font-semibold disabled:opacity-50"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
        <Button
          className="w-[150px] h-12 rounded-full font-semibold disabled:opacity-50"
          onClick={formik.handleSubmit}
        >
          {isCreating || isUpdatingBulk ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            `${group_id ? "Update" : "Add"} Group`
          )}
        </Button>
      </div>
    </div>
  );
}

function incrementTrailingNumber(str) {
  if (!str) return str;
  const match = String(str).match(/^(.*?)(\d+)$/);
  if (!match) return str;
  const [, prefix, numStr] = match;
  const incremented = String(Number(numStr) + 1).padStart(numStr.length, "0");
  return prefix + incremented;
}

function toFieldLabel(field) {
  return field
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function processApiResponse(responseData, formikGroups) {
  if (!responseData) return { hasErrors: false, groupsErrors: [], errorMessages: [] };
  const groupsErrors = [];
  const errorMessages = [];
  let hasErrors = false;

  responseData.forEach((groupResult) => {
    const gi = formikGroups.findIndex((g) => g.id === groupResult.id);
    if (gi === -1) return;

    const failedEqs = (groupResult.equipments || []).filter(
      (eq) => eq.api_operation_status === "failed",
    );
    if (!failedEqs.length) return;

    hasErrors = true;
    const groupName = formikGroups[gi]?.groupname || `Group ${gi + 1}`;
    if (!groupsErrors[gi]) groupsErrors[gi] = {};
    failedEqs.forEach((eqResult) => {
      const ei = eqResult.index;
      const eqName =
        formikGroups[gi]?.equipments?.[ei]?.equipment_name ||
        `Equipment ${ei + 1}`;
      if (!groupsErrors[gi].equipments) groupsErrors[gi].equipments = [];
      if (!groupsErrors[gi].equipments[ei])
        groupsErrors[gi].equipments[ei] = {};
      const fieldMatch = eqResult.message?.match(/^(\w+)\s+is\s+a\s+required/i);
      const field = fieldMatch ? fieldMatch[1] : "_api_error";
      groupsErrors[gi].equipments[ei][field] = eqResult.message;
      if (field !== "_api_error") {
        errorMessages.push(
          `${groupName} › ${eqName}: ${toFieldLabel(field)} is required`,
        );
      } else {
        errorMessages.push(`${groupName} › ${eqName}: ${eqResult.message}`);
      }
    });
  });

  return { hasErrors, groupsErrors, errorMessages };
}

function getInitialValues(data, building_id, id) {
  return {
    isOpen: true,
    id: data?.id || id || Date.now(),
    building_id: data?.building_id || building_id || "",
    groupname: data?.groupname || "",
    description: data?.description || "",
    es_subscription_id: data?.es_subscription_id || "",
    service_contract_id: data?.service_contract_id || "",
    brand_id: data?.brand_id || "",
    equipments:
      Array.isArray(data?.equipments) && data.equipments.length
        ? data.equipments.map((eq) => ({
            id: eq?.id || eq?.equipment_id || Date.now(),
            building_id: eq?.building_id || "",
            group_id: eq?.group_id || "",
            brand_id: eq?.brand_id || "",
            equipment_name: eq?.equipment_name || "",
            equipment_type: eq?.equipment_type || "ELEVATOR",
            model_number: eq?.model_number || "",
            es_pulse_equipment_number: eq?.es_pulse_equipment_number || "",
            oem_service_equipment_number:
              eq?.oem_service_equipment_number || "",
            client_equipment_number: eq?.client_equipment_number || "",
            design_code: eq?.design_code || "",
            year_of_installation: eq?.year_of_installation || "",
            last_modernization_date: eq?.last_modernization_date || "",
            last_modernization_parts: eq?.last_modernization_parts || "",
            equipment_life: eq?.equipment_life || "",
            next_modernization_date: eq?.next_modernization_date || "",
            plant_registration_date: eq?.plant_registration_date || "",
            specification: {
              design_type: eq.specification?.design_type || "",
              speed: toNumberOrZero(eq.specification?.speed) || 0,
              height: toNumberOrZero(eq.specification?.height) || 0,
              width: toNumberOrZero(eq.specification?.width) || 0,
              floor_from: eq.specification?.floor_from || "",
              floor_to: eq.specification?.floor_to || "",
              controller_model: eq.specification?.controller_model || "",
              drive_model: eq.specification?.drive_model || "",
              function_type: eq.specification?.function_type || "",
              max_load: eq.specification?.max_load || "",
              stops: eq.specification?.stops || "",
              length: eq.specification?.length || "",
              suspension_type: eq.specification?.suspension_type || "",
              door_controller_brand:
                eq.specification?.door_controller_brand || "",
              door_controller_model:
                eq.specification?.door_controller_model || "",
              in_car_media_brand: eq.specification?.in_car_media_brand || "",
              in_car_media_model: eq.specification?.in_car_media_model || "",
              travel: eq.specification?.travel || "",
            },
          }))
        : [
            {
              building_id: building_id || "",
              group_id: "",
              brand_id: "",
              equipment_name: "",
              equipment_type: "ELEVATOR",
              model_number: "",
              es_pulse_equipment_number: "",
              oem_service_equipment_number: "",
              client_equipment_number: "",
              design_code: "",
              year_of_installation: "",
              last_modernization_date: "",
              last_modernization_parts: "",
              equipment_life: "",
              plant_registration_date: "",
              next_modernization_date: "",
              specification: {},
            },
          ],
  };
}
