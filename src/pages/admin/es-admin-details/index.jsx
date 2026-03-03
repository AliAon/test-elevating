import UserDetails from "@/components/admin/es-admin-detail/userDetail";
import EsLinkedContract from "@/components/admin/es-linked-contract";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/redux/services/admin-client";
import { Trash } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EsAdminDetails() {
  const [UpdateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { id } = useParams();

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-3xl text-text_primary font-semibold">
              JW Marriott
            </p>
            <div className="mt-1 flex items-center gap-1">
              <div className="w-3 h-3 bg-[#8DA51D] rounded-full" />
              <p className="text-sm text-text_secondary font-medium">Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
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
        </div>
      </div>

      <UserDetails />

      <EsLinkedContract />
    </div>
  );
}
