import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUserType";
import { useGetUserByIdQuery } from "@/redux/services/auth-api";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = useUser();
  const { data } = useGetUserByIdQuery(user?.user_id, {
    skip: !user?.user_id,
  });
  const profile = data?.data;

  return (
    <div>
      <p className="text-3xl text-text_primary font-semibold">My Profile</p>
      <p className="text-sm text-text_secondary font-medium mt-2">
        Manage your personal details and account settings here.
      </p>{" "}
      <div className="bg-bg_primary p-7 rounded-xl my-4">
        <div className="flex gap-10 items-start justify-start">
          <img
            src={
              profile?.profile_image_url
                ? profile?.profile_image_url
                : "/assets/png/profile_icon.png"
            }
            alt=""
            width={150}
            height={200}
            className="rounded-full w-[150px] h-[150px] object-cover"
          />
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Name{" "}
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {profile?.fullname}
              </h2>
            </div>
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Email{" "}
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {profile?.email}
              </h2>
            </div>
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Phone Number{" "}
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {profile?.phone_number}
              </h2>
            </div>
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Member Since{" "}
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {new Date(profile?.created_date).toLocaleDateString("en-US")}
              </h2>
            </div>
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Company{" "}
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {profile?.company}
              </h2>
            </div>
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Address
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {profile?.address}
              </h2>
            </div>
            <div>
              <p className="text-sm text-text_secondary font-medium mt-2">
                Position Title
              </p>{" "}
              <h2 className="text-md text-text_primary font-semibold">
                {profile?.position}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user?.user_type_name === "superadmin" && "Super Admin" && (
          <>
            <Link to="/admin/edit-profile">
              <Button className="w-[167px] h-12 rounded-full bg-bg_primary text-red-600 hover:text-red-700 font-semibold disabled:opacity-50">
                Edit Profile
              </Button>
            </Link>
            <Link to="/admin/change-password">
              <Button className="w-[167px] h-12 rounded-full bg-bg_primary text-text_primary hover:text-text_secondary font-semibold disabled:opacity-50">
                Change Password
              </Button>
            </Link>
          </>
        )}
        {user?.user_type_name !== "superadmin" && "Super Admin" && (
          <>
            <Link to="/edit-profile">
              <Button className="w-[167px] h-12 rounded-full bg-bg_primary text-red-600 hover:text-red-700 font-semibold disabled:opacity-50">
                Edit Profile
              </Button>
            </Link>
            <Link to="/change-password">
              <Button className="w-[167px] h-12 rounded-full bg-bg_primary text-text_primary hover:text-text_secondary font-semibold disabled:opacity-50">
                Change Password
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
