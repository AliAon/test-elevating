import AdminClientDetails from "@/components/admin/clients/client-details";
import LinkedESClient from "@/components/admin/clients/linked-es";
import QuickOverview from "@/components/admin/clients/quick-overview";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { useGetClientByIdQuery } from "@/redux/services/admin-client";
import { useSearchParams } from "react-router-dom";

export default function AdminClients() {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");

  const { data: client, isLoading } = useGetClientByIdQuery(clientId || "");
  const list = [
    {
      item: "Clients",
      link: "/admin/all-client",
    },
    {
      item: "Client Details",
      link: "#",
    },
  ];
  return (
    <div>
      <Breadcrumbs list={list} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 rounded shadow  w-12 flex items-center justify-center">
            {client?.logo_url ? (
              <img src={client?.data?.logo_url} alt="" width={58} height={48} />
            ) : (
              <span className="text-xl font-semibold text-gray-600 flex items-center justify-center h-full">
                {client?.data?.client_name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl text-text_primary font-bold">
              {client?.data?.client_name}
            </h1>
            <div className="mt-1">
              <p className="text-sm text-text_secondary font-medium">
                {client?.data?.HQ_address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            {!!client?.data?.contact_person && (
              <p className="text-sm text-text_primary font-semibold">
                {client?.data?.contact_person}
              </p>
            )}
            {!!client?.data?.phone_number && (
              <div className="flex items-center gap-1 mt-1">
                <img src="/assets/svg/call.svg" alt="" width={16} height={16} />
                <p className="text-xs text-text_secondary font-medium">
                  {client?.data?.phone_number}
                </p>
              </div>
            )}
          </div>
          {/*<div className="w-[1px] h-12 bg-[#EAECEF]" />*/}
          {/* <Button
            onClick={() => navigate(`/admin/clients-contracts?clientId=${clientId}`)}
            className="w-[172px] h-11 rounded-full text-sm font-semibold"
          >
            Check Contracts <ChevronRight />
          </Button> */}
        </div>
      </div>

      <AdminClientDetails client={client?.data} isLoading={isLoading} />
      <QuickOverview counts={client?.data?.counts} />
      <LinkedESClient />
    </div>
  );
}
