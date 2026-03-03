import React from "react";
import Green from "../../../assets/svg/green-icon.svg";
import Red from "../../../assets/svg/red-icon.svg";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useGetBrandByIdQuery } from "@/redux/services/brand-api";
import { Link, useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetBrandByIdQuery(id, { skip: !id });

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!data) {
    return <p className="text-center mt-10 text-gray-500">No data found</p>;
  }

  const productTypes = Object.keys(data).filter(
    (key) =>
      !["id", "brand_name", "logo_url"].includes(key) &&
      typeof data[key] === "object",
  );

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="border border-[#EAECEF] rounded-[16px] p-2">
            <img
              src={data.logo_url}
              alt={data.brand_name}
              width={60}
              className="rounded-md object-contain"
            />
          </div>
          <h1 className="font-semibold text-2xl text-[#060606]">
            {data.brand_name}
          </h1>
        </div>

        <Link to={`/admin/edit-product/${data?.id}`}>
          <Button className="w-[140px] h-11 rounded-full text-sm font-semibold flex cursor-pointer items-center gap-2">
            Edit Details <ChevronRight size={16} />
          </Button>
        </Link>
      </div>

      {/* Product Sections */}
      {productTypes.map((type) => {
        const product = data[type];

        // Handle ELEVATOR separately (since it can have multiple numbered keys)
        if (type === "ELEVATOR") {
          const elevatorKeys = Object.keys(product);
          return (
            <div key={type} className="bg-[#F6F6F8] rounded-[24px] p-5 mt-5">
              <p className="font-semibold text-2xl uppercase">Elevator</p>
              <div
                className={`mt-5 grid gap-5 ${
                  elevatorKeys.length > 1
                    ? "overflow-y-auto max-h-[400px] pr-2"
                    : ""
                }`}
              >
                {elevatorKeys.map((num) => {
                  const elevatorItem = product[num];
                  return (
                    <>
                      <p>{num}.</p>
                      <div key={num} className="grid grid-cols-2 gap-5">
                        <CostCard
                          label="Minimum Cost"
                          icon={Green}
                          price={elevatorItem.low_price}
                        />
                        <CostCard
                          label="Maximum Cost"
                          icon={Red}
                          price={elevatorItem.high_price}
                        />
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          );
        }

        // Render other product types
        return (
          <div key={type} className="bg-[#F6F6F8] rounded-[24px] p-5 mt-5">
            <p className="font-semibold text-2xl capitalize">
              {type.replaceAll("_", " ")}
            </p>
            <div className="grid grid-cols-2 gap-5 mt-5">
              <CostCard
                label="Minimum Cost"
                icon={Green}
                price={product.low_price}
              />
              <CostCard
                label="Maximum Cost"
                icon={Red}
                price={product.high_price}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

// ✅ Reusable CostCard
function CostCard({ label, icon, price }) {
  return (
    <div className="rounded-[24px] p-5 bg-white flex gap-3 items-center shadow-sm">
      <img src={icon} alt="" className="w-6 h-6" />
      <div>
        <p className="font-medium text-[#5B617F] text-xs">{label}</p>
        <p className="font-medium text-[#060606] text-sm">${price}</p>
      </div>
    </div>
  );
}

// ✅ Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-5 items-center">
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-[16px]" />
          <div className="h-6 w-40 bg-gray-200 rounded-md" />
        </div>
        <div className="h-11 w-[140px] bg-gray-200 rounded-full" />
      </div>

      {/* Product sections skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#F6F6F8] rounded-[24px] p-5 mt-5">
          <div className="h-6 w-40 bg-gray-200 rounded-md mb-5" />
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-[24px] p-5 bg-white flex gap-3 items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="w-24 h-3 bg-gray-200 rounded-md" />
                <div className="w-16 h-3 bg-gray-200 rounded-md" />
              </div>
            </div>
            <div className="rounded-[24px] p-5 bg-white flex gap-3 items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="w-24 h-3 bg-gray-200 rounded-md" />
                <div className="w-16 h-3 bg-gray-200 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
