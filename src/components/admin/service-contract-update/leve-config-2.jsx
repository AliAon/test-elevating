import { Button } from "@/components/ui/button";
import { CirclePlus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { ChildLevelManagement } from "./level-config-management";
import {
  useGetLvl1BySubscriptionIdQuery,
  useGetLvl2BySubscriptionIdQuery,
  useGetSubscriptionByIdQuery,
} from "@/redux/services/subscription";
import SelectorWithObjects from "@/components/ui/objects-selector";
import MultiSelectorWithCheckbox from "@/components/common/multi-selector-with-checkbox";
import { useGetAllGroupsQuery } from "@/redux/services/groups";

export default function LevelConfig2({ values, setValues }) {
  const { data: lvl1, isLoading: isLvl1Loading } =
    useGetLvl1BySubscriptionIdQuery(
      { subscriptionId: values?.es_subscription_id },
      {
        skip: !values?.es_subscription_id,
      },
    );

  const { data: lvl2, isLoading: isLvl2Loading } =
    useGetLvl2BySubscriptionIdQuery(
      {
        parentId:
          typeof values?.level1_ids === "string"
            ? values?.level1_ids
            : values?.level1_ids?.[0],
      },
      {
        skip:
          typeof values?.level1_ids === "string"
            ? !values?.level1_ids
            : !values?.level1_ids?.[0],
      },
    );

  const { data: subs } = useGetSubscriptionByIdQuery(
    values?.es_subscription_id,
    {
      skip: !values?.es_subscription_id,
    },
  );
  const { data: groupsData } = useGetAllGroupsQuery({ limit: 200 });
  const groups = groupsData?.data?.groups || [];
  let filteredGroups = [];
  if (groups && groups.length && values?.building_ids) {
    groups.forEach((element) => {
      if (element.building_id == values?.building_ids?.[0]) {
        filteredGroups.push(element);
      }
    });
  }

  console.log("values?.building_ids", values?.building_ids);

  console.log("groupsData", groupsData);

  const lvl3Options = filteredGroups?.map((group) => ({
    value: group?.id,
    label: group?.groupname,
  }));

  const subscriptions = subs?.data || {};
  const lvl1s = lvl1?.data || [];
  const lvl2s = lvl2?.data || [];

  const lvl1Options = lvl1s?.map((level1) => ({
    value: level1?.id,
    label: level1?.name,
  }));

  const lvl2Options = lvl2s?.map((level2) => ({
    value: level2?.id,
    label: level2?.name,
  }));

  useEffect(() => {
    if (
      subscriptions?.level_config?.level_3?.availability &&
      (!values.building_ids || values.building_ids.length === 0)
    ) {
      setValues("building_ids", [""]);
    }
  }, [
    subscriptions?.level_config?.level_3?.availability,
    values.building_ids,
    setValues,
  ]);

  const handleAddBuilding = () => {
    const updatedBuildings = [...values.building_ids, ""];
    setValues("building_ids", updatedBuildings);
  };

  const handleRemoveBuilding = (index) => {
    if (values.building_ids.length <= 1) return;

    const updatedBuildings = values.building_ids.filter((_, i) => i !== index);
    setValues("building_ids", updatedBuildings);
  };

  const handleBuildingChange = (index, value) => {
    const updatedBuildings = values.building_ids.map((building, i) =>
      i === index ? value : building,
    );
    setValues("building_ids", updatedBuildings);
  };

  const displayBuildingIds = subscriptions?.level_config?.level_3?.availability
    ? values.building_ids?.length > 0
      ? values.building_ids
      : [""]
    : [];

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl text-black font-semibold">
          Level Configurations
        </p>
      </div>
      <div className="space-y-3 mt-6">
        {subscriptions?.level_config?.level_1?.availability && (
          <SelectorWithObjects
            label={subscriptions?.level_config?.level_1?.name}
            value={
              typeof values.level1_ids === "string"
                ? values.level1_ids
                : values.level1_ids?.[0]
            }
            onChange={(val) => setValues("level1_ids", val)}
            options={lvl1Options}
            disabled={isLvl1Loading || !values.es_subscription_id}
            placeholder={`Select ${subscriptions?.level_config?.level_1?.name}`}
          />
        )}

        {subscriptions?.level_config?.level_2?.availability && (
          <SelectorWithObjects
            label={subscriptions?.level_config?.level_2?.name}
            value={
              typeof values.level2_ids === "string"
                ? values.level2_ids
                : values.level2_ids?.[0]
            }
            onChange={(val) => setValues("level2_ids", val)}
            options={lvl2Options}
            disabled={isLvl2Loading || !values.level1_ids[0]}
            placeholder={`Select ${subscriptions?.level_config?.level_2?.name}`}
          />
        )}

        {subscriptions?.level_config?.level_3?.availability &&
          displayBuildingIds.map((buildingId, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <ChildLevelManagement
                  buildingId={buildingId}
                  level2_id={
                    typeof values.level2_ids === "string"
                      ? values.level2_ids
                      : values.level2_ids[0]
                  }
                  onChange={(value) => handleBuildingChange(index, value)}
                  subscriptions={subscriptions}
                />
              </div>

              {displayBuildingIds.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveBuilding(index)}
                  className="mt-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        <MultiSelectorWithCheckbox
          label="Groups"
          options={lvl3Options}
          value={values?.group_ids || []}
          onChange={(val) => setValues("group_ids", val)}
        />
      </div>

      {subscriptions?.level_config?.level_3?.availability && (
        <Button
          onClick={handleAddBuilding}
          className="flex items-center gap-2 text-sm font-semibold text-text_primary bg-[#eaecef] rounded-full px-4 py-2 mt-6"
        >
          <CirclePlus size={18} /> Add Building
        </Button>
      )}
    </div>
  );
}
