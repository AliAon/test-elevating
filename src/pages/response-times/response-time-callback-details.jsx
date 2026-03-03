import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useGetCallbackByIdQuery } from "@/redux/services/call-backs-api";
import dayjs from "dayjs";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const getResponseTime = (start, end) => {
  if (!start || !end) return "-";

  const startTime = dayjs(start);
  const endTime = dayjs(end);

  if (!startTime.isValid() || !endTime.isValid()) return "-";

  let diffInMinutes = endTime.diff(startTime, "minute");

  if (diffInMinutes < 0) return "-";

  const days = Math.floor(diffInMinutes / (60 * 24));
  diffInMinutes -= days * 60 * 24;

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes - hours * 60;

  const parts = [];

  if (days) parts.push(`${days} Day${days !== 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} Hour${hours !== 1 ? "s" : ""}`);

  if (minutes || parts.length === 0) {
    parts.push(`${minutes} Minute${minutes !== 1 ? "s" : ""}`);
  }

  return parts.join(", ");
};

export default function ResponseTimesCallbacksDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetCallbackByIdQuery(id, { skip: !id });

  const callBack = data?.data || {};
  const list = [
    {
      item: "Response Times",
      link: "/response-times",
    },
    {
      item: "Response Time Callback Details",
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={list} />
      <div className="lg:flex items-start justify-between">
        <div>
          <p className="text-3xl text-text_primary font-semibold">
            Callbacks Details
          </p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-lg text-text_secondary font-semibold">
              {callBack?.group_name || "N/A"}
            </p>
            &gt;
            <p className="text-lg text-text_secondary font-semibold">
              {callBack?.equipment_name}{" "}
              <small className="p-1 bg-gray-100 uppercase">
                [{callBack?.service_provider_brand} {callBack?.equipment_number}
                ]
              </small>
            </p>
          </div>
          <p className="text-sm text-text_secondary">
            {callBack?.property_name}
          </p>
        </div>

        <div className="flex justify-end mt-5 lg:mt-0">
          <Link
            to={`/planned-callbacks?id=${callBack?.id}&equipment_id=${callBack?.equipment_id}`}
          >
            <Button className="w-[180px] h-11 rounded-full text-sm font-semibold text-[#F06B3C] border-2 border-[#F06B3C] mr-4 bg-transparent hover:text-primary">
              Callbacks History
              <ChevronRight />
            </Button>
          </Link>

          <Link to={`/planned-equipment-details/${callBack?.equipment_id}`}>
            <Button className="w-[180px] h-11 rounded-full text-sm font-semibold">
              Equipment Details
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-2 mt-6">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-2 mt-6">
          {/* Each card below now uses modernized style */}
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">Building Name</p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.property_name}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Building Address
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.address}
            </p>
          </div>
          <div className="col-span-6 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">Issue</p>
            <p className="font-medium text-[#060606] text-sm mt-1 line-clamp-1">
              {callBack?.description}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">Caller Name</p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.caller_name}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Equipment Status
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.equipment_status}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Trapped Passenger
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.is_person_trapped ? "Yes" : "No"}
            </p>
          </div>

          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Call logged Date/Time
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {dayjs(callBack?.stopped_date).format("DD.MM.YYYY | HH:mm:ss") ||
                "-"}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Technician Attended site on
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {dayjs(callBack?.arrival_date).format("DD.MM.YYYY | HH:mm:ss") ||
                "-"}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">Response Time</p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {getResponseTime(callBack?.stopped_date, callBack?.arrival_date)}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Equipment Returned to Service on
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {dayjs(callBack?.solve_date).format("DD.MM.YYYY | HH:mm:ss")}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">Root Caused</p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.root_cause}
            </p>
          </div>
          <div className="col-span-12 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">
              Fault Description
            </p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.description}
            </p>
          </div>

          <div className="col-span-12 bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
            <p className="font-medium text-[#5B617F] text-sm">Resolution</p>
            <p className="font-medium text-[#060606] text-sm mt-1">
              {callBack?.resolution}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 space-y-2">
        <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};
