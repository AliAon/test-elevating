import React from "react";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ElevatorInput({
  values,
  setFieldValue,
  handleBlur,
  errors,
  touched,
}) {
  const handleAdd = () => {
    const existingKeys = Object.keys(values.ELEVATOR).map(Number);
    const maxKey = Math.max(...existingKeys);
    const newIndex = maxKey + 1;
    setFieldValue(`ELEVATOR.${newIndex}`, { low_price: "", high_price: "" });
  };

  const handleRemove = (index) => {
    const newElevators = { ...values.ELEVATOR };
    delete newElevators[index];
    
    // Clean up any undefined or null values
    const cleanedElevators = Object.fromEntries(
      Object.entries(newElevators).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    setFieldValue("ELEVATOR", cleanedElevators);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">Elevator</h3>
          <p className="text-sm text-gray-500 mt-1">Configure cost for different floor counts</p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(values.ELEVATOR)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([key, item]) => {
          const lowTouched = touched?.ELEVATOR?.[key]?.low_price;
          const highTouched = touched?.ELEVATOR?.[key]?.high_price;
          const lowError = errors?.ELEVATOR?.[key]?.low_price;
          const highError = errors?.ELEVATOR?.[key]?.high_price;

          return (
            <div
              key={key}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base text-gray-900">
                  {key} Floor Elevator
                </h4>
                {Object.keys(values.ELEVATOR).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(key)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="Remove floor"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-3">
                {/* Low Price */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-gray-600 text-sm mb-1">Min Cost</p>
                  <Input
                    type="number"
                    name={`ELEVATOR.${key}.low_price`}
                    placeholder="Enter min cost"
                    value={item.low_price}
                    onChange={(e) =>
                      setFieldValue(`ELEVATOR.${key}.low_price`, e.target.value)
                    }
                    onBlur={handleBlur}
                    className="font-semibold text-base text-gray-900 border border-gray-200 rounded px-2 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none focus:border-gray-300"
                  />
                  {lowTouched && lowError && (
                    <p className="text-red-500 text-xs mt-1">{lowError}</p>
                  )}
                </div>

                {/* High Price */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-gray-600 text-sm mb-1">Max Cost</p>
                  <Input
                    type="number"
                    name={`ELEVATOR.${key}.high_price`}
                    placeholder="Enter max cost"
                    value={item.high_price}
                    onChange={(e) =>
                      setFieldValue(`ELEVATOR.${key}.high_price`, e.target.value)
                    }
                    onBlur={handleBlur}
                    className="font-semibold text-base text-gray-900 border border-gray-200 rounded px-2 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none focus:border-gray-300"
                  />
                  {highTouched && highError && (
                    <p className="text-red-500 text-xs mt-1">{highError}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Button
        type="button"
        onClick={handleAdd}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 mt-4 h-11 border-dashed border-2 hover:border-primary hover:bg-primary/5"
      >
        <Plus size={18} /> Add Floor Configuration
      </Button>
    </div>
  );
}
