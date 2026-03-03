import AdminClientCard from "@/components/admin/dashboard/client-card";
import UserDetails from "@/components/admin/es-client-detail/userDetail";
import { Card } from "@/components/admin/es-pluse-contracts";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetAllClientsQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/redux/services/admin-client";
import { useUpdateProfileMutation } from "@/redux/services/auth-api";
import {
  useGetLvl3ListQuery,
  useGetSubscriptionsQuery,
} from "@/redux/services/subscription";
import {
  ChevronRight,
  ChevronsUpDown,
  Loader,
  Phone,
  Trash,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const tabs = [
  {
    key: "client",
    title: "Client",
  },
  {
    key: "es-plus-sub",
    title: "Es Plus Sub",
  },

  {
    key: "building",
    title: "Building",
  },
];

export default function EsClientDetails() {
  const { id } = useParams();
  const [UpdateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [active, setActive] = useState(tabs[0].key);
  const handleActive = (key) => {
    setActive(key);
  };
  const { data, isLoading } = useGetUserByIdQuery(id, { skip: !id });
  const clientId = data?.data?.accesses?.[0]?.client_id;
  const esPulseSubscriptionId =
    data?.data?.accesses?.[0]?.es_pulse_subscription_id;
  const buildingIds = data?.data?.accesses?.[0]?.building_ids;

  const { data: clientsData } = useGetAllClientsQuery({
    filters: {
      limit: 30,
    },
  });
  const clients = clientsData?.data;
  const filteredData = clients?.filter(
    (client) => client?.client_id == clientId,
  );

  const { data: esPulseData } = useGetSubscriptionsQuery({
    limit: 30,
  });
  const subscriptions = esPulseData?.data;

  const filteredEsPulseData = subscriptions?.filter(
    (sub) => sub?.subscription_id == esPulseSubscriptionId,
  );

  const { data: level3List } = useGetLvl3ListQuery({
    limit: 20,
    clientId: clientId,
  });
  const buildings = level3List?.data;

  // filter matching buildings
  const clientBuildings = buildings?.filter((building) =>
    buildingIds?.includes(building?.id),
  );
  const breadlist = [
    {
      item: `ES ${data?.data?.report_download_access ? "Admins" : "Clients"} `,
      link: `${data?.data?.report_download_access ? "/admin/es-admin" : "/admin/es-clients"} `,
    },

    {
      item: `ES ${data?.data?.report_download_access ? "Admins" : "Clients"} Details`,
      link: "#",
    },
  ];
  const handleUpdateUser = () => {
    UpdateUser({
      id,
      body: {
        email: "dummy@email.com",
        phone_number: "123456789",
        country_code: "+1",
      },
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message || "Profile updated successfully");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Something went wrong");
      });
  };

  return (
    <div>
      <Breadcrumbs list={breadlist} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-3xl text-text_primary font-semibold">
              {data?.data?.fullname}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <img src="/assets/svg/mail.svg" alt="" width={16} height={16} />

              <p className="text-sm text-text_secondary font-medium">
                {data?.data?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <div className="flex items-center gap-1 mt-1">
              <img src="/assets/svg/call.svg" alt="" width={16} height={16} />
              <p className="text-xs text-text_secondary font-medium">
                {data?.data?.country_code + data?.data?.phone_number}
              </p>
            </div>
          </div>
          <div className="w-[1px] h-12 bg-[#EAECEF]" />

          <Button
            onClick={handleUpdateUser}
            className="w-[150px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
          >
            {isUpdating ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <Trash size={18} />
                Delete Contact
              </>
            )}
          </Button>
          <a href="tel:+61386968888">
            <Button className="w-[140px] h-11 rounded-full text-sm font-semibold">
              Call Person <ChevronRight />
            </Button>
          </a>
        </div>
      </div>

      <UserDetails data={data} isFetching={isLoading} />

      <div className="bg-bg_primary rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Linked Assets
          </p>
          <div className="flex items-center gap-4">
            <div className="relative w-[260px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
              <img
                src="/assets/svg/search.svg"
                alt=""
                width={24}
                height={24}
                className="absolute top-1/2 -translate-y-1/2 left-5"
              />
              <Input
                placeholder="Search for the user name"
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>
          </div>
        </div>

        <div className="w-fit h-13 flex items-center rounded-2xl bg-white p-1 mt-5">
          {tabs?.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleActive(tab.key)}
              className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
                active === tab.key
                  ? "bg-bg_primary text-text_primary"
                  : "text-text_secondary"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          {active === "client" &&
            filteredData?.map((client) => <AdminClientCard client={client} />)}
          {active === "es-plus-sub" &&
            filteredEsPulseData?.map((contract, idx) => (
              <Card
                key={contract.subscription_id}
                contract={contract}
                idx={idx}
              />
            ))}
        </div>
        {active === "building" && (
          <div className="grid grid-cols-1 gap-4 ">
            <div className="overflow-x-auto w-full ">
              <TableHeader />
              <div className="mt-2 min-w-[700px] space-y-2">
                {clientBuildings?.map((building, index) => (
                  <TableRow key={index} building={building} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="min-w-[700px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Name
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Building Owner
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Address
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Contact Person
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Floors
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-12"></div>
    </div>
  );
}

function TableRow({ building }) {
  const fullAddress = [
    building?.address,
    building?.city,
    building?.state,
    building?.country,
    building?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">{building?.name}</p>
      </div>

      <div className="w-[180px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold truncate">
          {building?.building_owner?.name || "N/A"}
        </p>
        {building?.building_owner?.phone_number && (
          <p className="text-xs text-gray-600 truncate">
            {building?.building_owner?.phone_number}
          </p>
        )}
      </div>

      <div className="w-[250px] p-4 space-y-1">
        <p className="text-sm text-gray-600 font-medium line-clamp-2">
          {fullAddress || "Address not available"}
        </p>
      </div>

      <div className="w-[220px] p-4 space-y-1">
        <div className="space-y-1.5">
          <p className="text-sm text-gray-900 font-semibold">
            {building?.contact_person_name || "N/A"}
          </p>
          {building?.phone_number && (
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Phone size={12} className="text-gray-500" />
              {building?.phone_number}
            </p>
          )}
          {building?.email && (
            <p className="text-xs text-gray-600 flex items-center gap-1.5 truncate">
              <img
                src="/assets/svg/gmail.svg"
                alt=""
                width={12}
                height={12}
                className="opacity-60"
              />
              {building?.email}
            </p>
          )}
        </div>
      </div>

      <div className="w-[120px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {building?.total_floors || "0"}
        </p>
      </div>

      <div className="w-12 flex items-center justify-center p-4">
        <Link to={`/admin/add-buildings?uuid=${building?.id}`}>
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}
