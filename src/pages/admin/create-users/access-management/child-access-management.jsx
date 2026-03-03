import MultiSelectorWithCheckbox from "@/components/common/multi-selector-with-checkbox";
import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import {
  useGetLvl1BySubscriptionIdQuery,
  useGetLvl2BySubscriptionIdQuery,
  useGetLvl3BySubscriptionIdQuery,
  useGetSubscriptionByClientIdQuery,
} from "@/redux/services/subscription";
import { Trash } from "lucide-react";

export function ChildAccessManagement({
  data,
  onChange,
  onDuplicate,
  setValues,
  accesses,
  onRemove,
  index,
}) {
  const { data: clients } = useGetAllClientsQuery({});
  const { data: lvl2, isLoading: isLvl2Loading } =
    useGetLvl2BySubscriptionIdQuery(
      {
        subscriptionId: data?.es_pulse_subscription_id,
        client_id: data?.client_id,
        parentId: data?.level_1_id,
      },
      {
        skip: !data?.es_pulse_subscription_id,
      },
    );
  const lvl2s = lvl2?.data || [];
  const lvl2Options = [
    ...(lvl2s?.map((level2) => ({
      value: level2?.id,
      label: level2?.name,
    })) || []),
  ];

  lvl2Options?.length > 1 &&
    lvl2Options?.unshift({ value: "all", label: "All" });
  const { data: lvl1, isLoading: isLvl1Loading } =
    useGetLvl1BySubscriptionIdQuery(
      {
        subscriptionId: data?.es_pulse_subscription_id,
        client_id: data?.client_id,
      },
      {
        skip: !data?.es_pulse_subscription_id,
      },
    );
  const { data: lv3 } = useGetLvl3BySubscriptionIdQuery(
    {
      parentId:
        data?.level_2_id == "all"
          ? lvl2Options?.map((o) => o.value).join(",")
          : data?.level_2_id,
      subscriptionId: data?.es_pulse_subscription_id,
      clientId: data?.client_id,
    },
    {
      skip: !data?.level_2_id,
    },
  );
  const { data: subscriptionsData, isLoading: isSubLoading } =
    useGetSubscriptionByClientIdQuery(data?.client_id, {
      skip: !data?.client_id,
    });

  const subscriptions = subscriptionsData?.data || [];
  const lvl1s = lvl1?.data || [];
  const lvl3s = lv3?.data || [];

  const options = clients?.data?.map((client) => ({
    value: client.client_id,
    label: client.client_name,
  }));

  const contractOptions = subscriptions?.map((sub) => ({
    value: sub?.subscription_id,
    label: sub?.es_subscription_name,
  }));

  contractOptions?.length > 1 &&
    contractOptions?.unshift({ value: "all", label: "All" });

  const lvl1Options = [
    ...(lvl1s?.map((level1) => ({
      value: level1?.id,
      label: level1?.name,
    })) || []),
  ];
  lvl1Options?.length > 1 &&
    lvl1Options?.unshift({ value: "all", label: "All" });

  const lvl3Options = lvl3s?.map((level3) => ({
    value: level3?.id,
    label: level3?.name,
  }));

  lvl3Options?.length > 1 &&
    lvl3Options?.unshift({ value: "all", label: "All" });

  const selectedSubscription = subscriptions?.find(
    (sub) => sub?.subscription_id === data?.es_pulse_subscription_id,
  );

  return (
    <div className="bg-bg_primary p-6 rounded-xl mt-5">
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-center">
          <p className="text-2xl text-black font-semibold">Access {index + 1}</p>
        </div>
        <div>
          <button onClick={() => onRemove()}>
            <Trash size={20} color="#f07346" />
          </button>
        </div>
      </div>
      <div className="space-y-3 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectorWithObjects
            label="Select Clients"
            value={data.client_id}
            onChange={(val) => onChange("client_id", val)}
            options={options}
            placeholder="Select client name"
          />
          <SelectorWithObjects
            label="ES Subscription"
            value={data.es_pulse_subscription_id}
            disabled={isSubLoading || !data.client_id}
            onChange={(val) => {
              onChange("es_pulse_subscription_id", val);
            }}
            options={contractOptions}
            placeholder="Select ES contracts"
          />
        </div>
        {selectedSubscription?.level_config?.level_1?.availability && (
          <SelectorWithObjects
            label={selectedSubscription?.level_config?.level_1?.name}
            value={data.level_1_id}
            onChange={(val) => {
              onChange("level_1_id", val);
            }}
            options={lvl1Options}
            disabled={isLvl1Loading || !data.es_pulse_subscription_id}
            placeholder={`Select ${selectedSubscription?.level_config?.level_1?.name}`}
          />
        )}
        {data?.es_pulse_subscription_id == "all" && (
          <SelectorWithObjects
            label={selectedSubscription?.level_config?.level_1?.name}
            value={data.level_1_id}
            onChange={(val) => {
              onChange("level_1_id", val);
            }}
            options={lvl1Options}
            disabled={isLvl1Loading || !data.es_pulse_subscription_id}
            placeholder={`Select ${selectedSubscription?.level_config?.level_1?.name}`}
          />
        )}
        {selectedSubscription?.level_config?.level_2?.availability && (
          <SelectorWithObjects
            label={selectedSubscription?.level_config?.level_2?.name}
            value={data.level_2_id}
            onChange={(val) => {
              onChange("level_2_id", val);
            }}
            options={lvl2Options}
            disabled={isLvl2Loading || !data.es_pulse_subscription_id}
            placeholder={`Select ${selectedSubscription?.level_config?.level_2?.name}`}
          />
        )}
        {data?.es_pulse_subscription_id == "all" && (
          <SelectorWithObjects
            label={selectedSubscription?.level_config?.level_2?.name}
            value={data.level_2_id}
            onChange={(val) => {
              onChange("level_2_id", val);
            }}
            options={lvl2Options}
            disabled={isLvl2Loading || !data.es_pulse_subscription_id}
            placeholder={`Select ${selectedSubscription?.level_config?.level_2?.name}`}
          />
        )}

        <MultiSelectorWithCheckbox
          label="Building"
          options={lvl3Options}
          value={data?.building_ids || []}
          onChange={(val) => onChange("building_ids", val)}
        />
      </div>
    </div>
  );
}
