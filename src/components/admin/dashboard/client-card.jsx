import { Button } from "@/components/ui/button";
import { getTypeColors } from "@/helpers/contract";
import { cn } from "@/lib/utils";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminClientCard({ client }) {
  const navigate = useNavigate();
  const typeColors = getTypeColors();
  return (
    <div className="flex flex-col justify-between bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
      <div className="p-5">
        <div className="flex flex-row gap-3 items-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-100">
            {client?.logo_url ? (
              <img
                src={client?.logo_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600 flex items-center justify-center h-full">
                {client?.client_name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div>
            {!!client?.registered_ABN && (
              <div
                className={cn(
                  "w-fit text-[10px] uppercase tracking-wide rounded-full px-2.5 py-1 urbanist font-semibold",
                )}
                style={{
                  backgroundColor: typeColors?.bg,
                  color: typeColors?.text,
                }}
              >
                {client?.registered_ABN}
              </div>
            )}
            <h3 className="text-lg text-gray-900 font-semibold leading-tight mt-1 mb-0">
              {client?.client_name}
            </h3>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-4" />

        <div className="space-y-2.5">
          {!!client?.contact_person && (
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 flex items-center justify-center opacity-60">
                <img
                  src="/assets/svg/user-icon.svg"
                  alt=""
                  width={14}
                  height={14}
                />
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {client?.contact_person}
              </p>
            </div>
          )}
          {!!client?.phone_number && (
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 flex items-center justify-center opacity-60">
                <img src="/assets/svg/call.svg" alt="" width={14} height={14} />
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {client?.phone_number}
              </p>
            </div>
          )}
          {!!client?.phone_number && (
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 flex items-center justify-center opacity-60">
                <img src="/assets/svg/mail.svg" alt="" width={14} height={14} />
              </div>
              <p className="text-xs text-gray-600 font-medium break-all">
                {client?.email}
              </p>
            </div>
          )}
          {!!client?.phone_number && (
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 flex items-center justify-center opacity-60">
                <img
                  src="/assets/svg/icon3.svg"
                  alt=""
                  width={14}
                  height={14}
                />
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1.5 leading-relaxed">
                {client?.HQ_address}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-100">
        <Button
          className="bg-white hover:bg-gray-50 px-4 py-3 w-full rounded-none rounded-b-lg border-0 text-primary hover:text-primary font-semibold text-sm transition-colors"
          variant={"ghost"}
          onClick={() =>
            navigate(`/admin/clients?clientId=${client?.client_id}`)
          }
        >
          Open Details
        </Button>
      </div>
    </div>
  );
}
