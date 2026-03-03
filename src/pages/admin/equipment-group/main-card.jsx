import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, CirclePlus, Trash2 } from "lucide-react";
import ChildCard from "./child-card";
import { useNavigate } from "react-router-dom";
import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  useGetAllServiceContractsQuery,
  useGetServiceContractByIdQuery,
} from "@/redux/services/service-contracts";
import { useGetSubscriptionsQuery } from "@/redux/services/subscription";
import { useGetAllBrandQuery } from "@/redux/services/brand-api";

const MainCard = ({
  group,
  onToggle,
  onRemove,
  onAddEquipment,
  onRemoveEquipment,
  values,
  setFieldValue,
  handleChange,
  groupIndex,
  errors,
  touched,
  handleBlur,
  disabled = false,
  equipmentsLoading,
  onBoarding = false,
}) => {
  const navigate = useNavigate();

  const { data: brands } = useGetAllBrandQuery({});

  const brandOptions =
    brands?.data?.brands?.map((b) => ({
      value: b.id,
      label: b.brand_name,
    })) || [];

  const { data: subscriptions, isLoading: isSubscriptionsLoading } =
    useGetSubscriptionsQuery({});

  const subscriptionsList = subscriptions?.data?.map((s) => ({
    value: s.subscription_id,
    label: s.es_subscription_name,
  }));

  // Fetch service contracts filtered by selected ES Subscription
  const selectedSubscriptionId =
    values?.groups?.[groupIndex]?.es_subscription_id;
  const { data: serviceContracts, isLoading: isServiceContractsLoading } =
    useGetAllServiceContractsQuery(
      {
        es_subscription_id: selectedSubscriptionId,
        limit: 100,
      },
      { skip: !selectedSubscriptionId },
    );

  const serviceContractsList = Array.isArray(serviceContracts?.data?.contracts)
    ? serviceContracts?.data?.contracts?.map((s) => ({
        value: s.contract_id,
        label: s.contract_name,
      }))
    : [];

  const { data: serviceContract } = useGetServiceContractByIdQuery(
    values.groups[groupIndex].service_contract_id,
    { skip: !values.groups[groupIndex].service_contract_id },
  );

  return (
    <div className="bg-bg_primary rounded-xl overflow-hidden border border-[#EAECEF]">
      {/* === Group Header Section === */}
      <div className="border-b border-[#EAECEF] p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <ChevronRight
            size={24}
            color="#5B617F"
            className={`cursor-pointer transform transition-transform duration-300 ${
              group.isOpen ? "rotate-90" : ""
            }`}
            onClick={onToggle}
          />

          <div
            className={`flex-1 grid gap-3 ${
              !onBoarding ? "grid-cols-4" : "grid-cols-2"
            }`}
          >
            <InputField
              label="Group Name"
              placeholder="Service Lift"
              name={`groups[${groupIndex}].groupname`}
              value={values.groups[groupIndex].groupname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.groups?.[groupIndex]?.groupname}
              disabled={disabled}
              required
            />
              <SelectorWithObjects
                label="Brand"
                placeholder="Select Brand"
                options={brandOptions}
                value={values?.groups?.[groupIndex]?.brand_id || ""}
                onChange={(val) => {
                  setFieldValue(`groups[${groupIndex}].brand_id`, val);
                  values.groups[groupIndex].equipments.forEach((_, i) => {
                    setFieldValue(
                      `groups[${groupIndex}].equipments[${i}].brand_id`,
                      val,
                    );
                  });
                }}
                onBlur={handleBlur}
                disabled={disabled}
              />
            {!onBoarding && (
                <SelectorWithObjects
                  label="ES Subscription"
                  placeholder="Select ES Subscription"
                  options={subscriptionsList}
                  value={values?.groups?.[groupIndex]?.es_subscription_id || ""}
                  onChange={(val) => {
                    setFieldValue(
                      `groups[${groupIndex}].es_subscription_id`,
                      val,
                    );
                    // Reset service contract when subscription changes
                    setFieldValue(
                      `groups[${groupIndex}].service_contract_id`,
                      "",
                    );
                  }}
                  onBlur={handleBlur}
                  error={errors.groups?.[groupIndex]?.es_subscription_id}
                  disabled={isSubscriptionsLoading}
                />
            )}
            {!onBoarding && (
                <SelectorWithObjects
                  label="Service Contract"
                  placeholder="Select Service Contract"
                  options={serviceContractsList}
                  value={
                    values?.groups?.[groupIndex]?.service_contract_id || ""
                  }
                  onChange={(val) =>
                    setFieldValue(
                      `groups[${groupIndex}].service_contract_id`,
                      val,
                    )
                  }
                  onBlur={handleBlur}
                  error={errors.groups?.[groupIndex]?.service_contract_id}
                  disabled={
                    isServiceContractsLoading || !selectedSubscriptionId
                  }
                />
            )}
          </div>
          {!disabled && (
            <Trash2
              size={24}
              color="#C2285A"
              className="cursor-pointer"
              onClick={onRemove}
            />
          )}
        </div>
      </div>

      {/* === Equipments Section === */}
      <AnimatePresence initial={false}>
        {group.isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden p-6"
          >
            <div className="flex flex-col gap-5">
              {equipmentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <EquipmentRowSkeleton key={index} />
                  ))}
                </div>
              ) : (
                group?.equipments?.map((equip, equipIndex) => (
                  <ChildCard
                    key={equip?.id ?? `group-${groupIndex}-equip-${equipIndex}`}
                    onRemove={() => onRemoveEquipment(equip?.id)}
                    equipmentIndex={equipIndex}
                    values={values}
                    setFieldValue={setFieldValue}
                    handleChange={handleChange}
                    groupIndex={groupIndex}
                    specification={equip}
                    errors={errors}
                    handleBlur={handleBlur}
                    disabled={disabled}
                    serviceContract={serviceContract?.data}
                    onBoarding={onBoarding}
                  />
                ))
              )}
            </div>

            {!disabled && (
              <Button
                onClick={onAddEquipment}
                className="w-[225px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary mt-5"
              >
                <CirclePlus size={18} />
                Add Another Equipment
              </Button>
            )}

            {disabled && (
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    navigate(`/equipment-group?group_id=${group.id}`)
                  }
                  className="w-[98px] h-12 rounded-full font-semibold disabled:opacity-50 mt-5"
                >
                  Edit
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainCard;

function EquipmentRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3  p-4 animate-pulse bg-white rounded-2xl border border-[#EAECEF] overflow-hidden">
      <div className="w-6 h-6 bg-gray-200 rounded-full" />
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-20 bg-gray-200 rounded-2xl" />

        <div className="w-[307px] h-20 bg-gray-200 rounded-2xl" />
      </div>

      <div className="w-6 h-6 bg-gray-200 rounded-full" />
    </div>
  );
}
