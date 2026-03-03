import SelectorWithObjects from "@/components/ui/objects-selector";
import { useGetLvl3BySubscriptionIdQuery } from "@/redux/services/subscription";

export function ChildLevelManagement({
  buildingId,
  onChange,
  subscriptions,
  level2_id,
}) {
  const { data: lvl3, isLoading: isLvl3Loading } =
    useGetLvl3BySubscriptionIdQuery(
      { parentId: level2_id },
      {
        skip: !level2_id,
      },
    );

  const lvl3s = lvl3?.data || [];

  const lvl3Options = lvl3s?.map((level3) => ({
    value: level3?.id,
    label: level3?.name,
  }));

  return (
    <div>
      <SelectorWithObjects
        label={"Building"}
        value={buildingId}
        onChange={onChange}
        options={lvl3Options}
        placeholder={`Select Building`}
        disabled={isLvl3Loading || !level2_id}
      />
    </div>
  );
}
