import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableHeader from "./table-header";
import TableRow from "./table-row";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetUsersQuery } from "@/redux/services/auth-api";
import { ContactListSkeleton } from "@/components/skeleton/contact-row-skeleton";
import { useUserType } from "@/hooks/useUserType";

export default function AdminUser() {
  const userType = useUserType();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const debounceQuery = useDebounce(search, 300);
  const user_type_id =
    userType === "superadmin"
      ? "90fc87e8-2321-4de5-9787-822f220da9f0|346058e7-f042-4709-b0e5-b94c353dab15"
      : "346058e7-f042-4709-b0e5-b94c353dab15";

  const { data, isFetching } = useGetUsersQuery({
    user_type_id,
    search: debounceQuery,
  });

  const users = data?.data || [];

  return (
    <div>
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            ES Admin Users
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
                placeholder="Search for the name"
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
              />
            </div>
            <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
              <SlidersHorizontal size={20} className="text-text_secondary" />
              <p className="text-sm text-text_secondary font-semibold">
                Filter
              </p>
            </div>

            {userType === "superadmin" && (
              <Button
                onClick={() =>
                  navigate("/admin/create-update-user?type=es-admin")
                }
                className="w-[150px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
              >
                <CirclePlus size={18} />
                Add User
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <TableHeader />
            {isFetching ? (
              <ContactListSkeleton count={5} />
            ) : (
              <div className="mt-2 space-y-2">
                {users?.map((row) => (
                  <TableRow key={row?.user_id} row={row} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
