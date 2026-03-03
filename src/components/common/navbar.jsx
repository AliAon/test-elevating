import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "@/redux/services/auth-api";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { setSubscriptionId } from "@/redux/slices/subscription_id";
import { useUser } from "@/hooks/useUserType";

export default function Navbar() {
  const [selected, setSelected] = useState("");
  const navigator = useNavigate();
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const userData = useUser();

  const { data: profileData } = useGetUserByIdQuery(userData?.user_id, {
    skip: !user?.user_id,
  });
  const profile = profileData?.data;
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  const { data, isLoading } = useGetUserByIdQuery(user?.user_id, {
    skip: !user?.user_id,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedSubscriptionId");
    navigator("/");
  };

  useEffect(() => {
    if (user?.es_subscriptions && user?.es_subscriptions?.length > 0) {
      const storedId = localStorage.getItem("selectedSubscriptionId");
      const hasStored = user.es_subscriptions.some(
        (s) => s.subscription_id === storedId,
      );

      const initialId = hasStored
        ? storedId
        : user.es_subscriptions[0].subscription_id;

      setSelected(initialId);
      dispatch(setSubscriptionId(initialId));

      if (hasStored) return;
      localStorage.setItem("selectedSubscriptionId", initialId);
    }
  }, [user]);

  const showSeletor =
    user?.user_type_name === "client" || user?.user_type_name === "manager";

  return (
    <div className="sticky top-0 z-50 flex items-center justify-end gap-5 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm px-5">
      {showSeletor && (
        <Select
          value={selected}
          onValueChange={(e) => {
            setSelected(e);
            dispatch(setSubscriptionId(e));
            localStorage.setItem("selectedSubscriptionId", e);
          }}
        >
          <SelectTrigger className="w-[200px] min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black">
            <SelectValue placeholder="Select ES Subscription" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {user?.es_subscriptions?.map((item, index) => (
              <SelectItem
                key={index}
                value={item.subscription_id}
                className="truncate"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {isLoading ? (
        <UserInfoSkeleton />
      ) : (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-base text-[#060606] text-end">
              {data?.data?.fullname}
            </p>
            {user?.user_type_name !== "client" && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user?.user_type_name === "superadmin"
                      ? "bg-[#1F98B2] shadow-[0_0_8px_rgba(31,152,178,0.6)]"
                      : "bg-[#248EA5] shadow-[0_0_8px_rgba(140,170,0,0.6)]"
                  }`}
                />
                <p className="font-medium text-xs text-[#5B617F]">
                  {user?.user_type_name === "superadmin" && "Super Admin"}
                  {user?.user_type_name === "admin" && "Admin"}
                  {user?.user_type_name === "manager" && "Manager"}
                </p>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="border border-[#FFCBB6] rounded-full p-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-[#F06B3C]/20 hover:border-[#F06B3C]">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FFE3D6] rounded-full text-base font-semibold uppercase text-primary transition-transform duration-200 hover:scale-105">
                <img
                  src={
                    profile?.profile_image_url ?? "/assets/png/profile_icon.png"
                  }
                  alt=""
                  width={150}
                  height={200}
                  className="rounded-full w-12 h-12 object-cover"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3">
              {user?.user_type_name !== "superadmin" && "Super Admin" && (
                <DropdownMenuItem
                  className={"cursor-pointer"}
                  onClick={() => navigator("/profile")}
                >
                  My Account
                </DropdownMenuItem>
              )}
              {user?.user_type_name === "superadmin" && "Super Admin" && (
                <DropdownMenuItem
                  className={"cursor-pointer"}
                  onClick={() => navigator("/admin/profile")}
                >
                  My Account
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="w-13 h-13 rounded-full">
        <Skeleton className="w-13 h-13 rounded-full" />
      </div>
    </div>
  );
}
