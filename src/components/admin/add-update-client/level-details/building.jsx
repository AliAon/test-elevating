import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  useGetLvl2BySubscriptionIdQuery,
  useGetLvl3ListQuery,
  useGetSubscriptionByIdQuery,
} from "@/redux/services/subscription";
import { useCreatedSubscriptionId } from "@/redux/slices/subscriptionFlowSlice";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const Building = ({ onChange, data, index, total, onBoarding }) => {
  const { createdSubscriptionId } = useCreatedSubscriptionId();
  const [params] = useSearchParams();

  const clientId = params.get("clientId");
  const building_id = params.get("uuid");

  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const { data: level1 } = useGetLvl2BySubscriptionIdQuery(
    { subscriptionId: createdSubscriptionId },
    {
      skip: !createdSubscriptionId,
    }
  );

  const { data: subscriptionResponse } = useGetSubscriptionByIdQuery(
    createdSubscriptionId,
    {
      skip: !createdSubscriptionId,
    }
  );

  const subscription = subscriptionResponse?.data;

  const { data: buildings } = useGetLvl3ListQuery(
    {
      clientId: clientId,
    },
    {
      skip: !clientId,
    }
  );

  const level2Options = buildings?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  const level1Options = level1?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  useEffect(() => {
    if (building_id) {
      handleInputChange("building_id", building_id);
    }
  }, [building_id]);

  return (
    <div className="bg-bg_primary rounded-xl p-7">
      <div className="flex items-center justify-between">
        <p className="text-xl text-black font-semibold">
          {/* Building {total - index} */}
          Building
        </p>
      </div>

      <div className="space-y-3 mt-5">
        <SelectorWithObjects
          options={level2Options || []}
          label="Building"
          placeholder="Select Building"
          value={data?.building_id}
          onChange={(value) => handleInputChange("building_id", value)}
        />
        <SelectorWithObjects
          options={level1Options || []}
          label={'Select ' + subscription?.level_config?.level_2?.name || "City"}
          placeholder="Select Parent Level"
          value={data?.parent_level_id}
          onChange={(value) => handleInputChange("parent_level_id", value)}
        />
      </div>
    </div>
  );
};
