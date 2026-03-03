import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import React, { useEffect } from "react";
import { ChildAccessManagement } from "./access-management/child-access-management";

export default function AccessManager({ values, setValues }) {
  useEffect(() => {
    if (!values.accesses || values.accesses.length === 0) {
      const initialAccess = {
        id: Date.now(),
        client_id: "",
        es_pulse_subscription_id: "",
        level_1_id: "",
        level_2_id: "",
        building_ids: [],
      };
      setValues("accesses", [initialAccess]);
    }
  }, [values.accesses, setValues]);

  const handleAddAccess = () => {
    const newAccess = {
      id: Date.now(),
      client_id: "",
      es_pulse_subscription_id: "",
      level_1_id: "",
      level_2_id: "",
      building_ids: [],
    };
    const updated = [...(values.accesses || []), newAccess];
    setValues("accesses", updated);
  };

  const handleDuplicateAccess = (index) => {
    const existing = values.accesses[index];
    const copy = { ...existing, id: Date.now() };
    const updated = [...values.accesses, copy];
    setValues("accesses", updated);
  };

  const handleAccessChange = (index, field, value) => {
    const updated = values.accesses.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setValues("accesses", updated);
  };

  const handleRemoveAccess = (index) => {
    const updated = values.accesses.filter((_, i) => i !== index);
    setValues(
      "accesses",
      updated.length
        ? updated
        : [
            {
              id: Date.now(),
              client_id: "",
              es_pulse_subscription_id: "",
              level_1_id: "",
              level_2_id: "",
              building_ids: [],
            },
          ],
    );
  };

  return (
    <div className="space-y-6">
      {(values.accesses || []).map((access, index) => {
        return (
          <ChildAccessManagement
            key={access.id}
            data={access}
            onChange={(field, value) => handleAccessChange(index, field, value)}
            onDuplicate={() => handleDuplicateAccess(index)}
            onRemove={() => handleRemoveAccess(index)}
            setValues={setValues}
            accesses={values.accesses}
            index={index}
          />
        );
      })}

      <Button
        onClick={handleAddAccess}
        className="flex items-center gap-2 text-sm font-semibold text-text_primary bg-[#eaecef] rounded-full px-4 py-2"
      >
        <CirclePlus size={18} /> Add Another
      </Button>
    </div>
  );
}
