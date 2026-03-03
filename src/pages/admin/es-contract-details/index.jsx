import ContractPerson from "@/components/admin/es-contract-details/contract-person";
import ContractsDetails from "@/components/admin/es-contract-details/contracts-details";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useGetClientByIdQuery } from "@/redux/services/admin-client";
import { useGetSubscriptionByIdQuery } from "@/redux/services/subscription";
import { Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEsContractsDetails() {
  const { id } = useParams();

  const { data, isLoading } = useGetSubscriptionByIdQuery(id);
  const subscription = data?.data;

  const { data: clientData } = useGetClientByIdQuery(subscription?.client_id, {
    skip: !subscription?.client_id,
  });

  const client = clientData?.data;

  const navigate = useNavigate();
  const list = [
    {
      item: "ES Pulse Subscriptions",
      link: "/admin/es-pulse-subscriptions",
    },
    {
      item: `Es Contracts Details`,
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={list} />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 py-2">
            <img
              src={client?.logo_url}
              className="w-12 shadow rounded-md object-cover"
            />
            <div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                {client?.registered_ABN}
              </span>
              <h2 className="text-xl text-text_primary font-semibold">
                {client?.client_name}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() =>
              navigate(
                `/admin/es-contracts-add?subscriptionId=${subscription?.subscription_id}`,
              )
            }
            className="w-[118px] bg-[#EAECEF] text-text_primary h-11 rounded-full font-semibold"
          >
            Edit Details
          </Button>
        </div>
      </div>

      <hr className="opacity-10 my-4" />

      <div>
        <p className="text-3xl text-text_primary font-semibold">
          {subscription?.es_subscription_name}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-text_secondary font-medium">
            Subscription #{subscription?.es_subscription_number}
          </p>
        </div>
      </div>

      <ContractsDetails isLoading={isLoading} subscription={subscription} />
      <ContractPerson id={id} />
    </div>
  );
}
