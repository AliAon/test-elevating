import React from "react";
import Navbar from "./common/navbar";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./common/admin-side-bar";
import withAuth from "./hoc/auth-guard";
import adminAccess from "./hoc/admin-access";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSideBar />

      <div className="relative flex-1 pl-56 xl:pl-[272px] w-full">
        <Navbar />

        <main className="overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default adminAccess(withAuth(AdminLayout));
