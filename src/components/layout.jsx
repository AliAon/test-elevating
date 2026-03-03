import React from "react";
import Sidebar from "./common/sidebar";
import Navbar from "./common/navbar";
import { Outlet } from "react-router-dom";
import withAuth from "./hoc/auth-guard";
import clientAccess from "./hoc/client-access";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="relative flex-1 pl-56 xl:pl-64 w-full">
        <Navbar />

        <main className="overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default clientAccess(withAuth(Layout));
