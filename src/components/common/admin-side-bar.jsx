import {
  ChevronRight,
  ChevronDown,
  ClipboardList,
  CircleUserRound,
  DoorClosed,
  BadgeDollarSign,
  LayoutDashboard,
  Building,
} from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = React.useState(null);
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  // user?.user_type_name === "superadmin"

  const list = [
    {
      key: "/admin/dashboard",
      icon: "/assets/svg/dashboard-icon.svg",
      icon2: LayoutDashboard,
      title: "Dashboard",
      list: [],
    },

    {
      key: "/admin/all-client",
      icon: "/assets/svg/list.svg",
      icon2: CircleUserRound,
      title: "Clients",
      list: [],
    },
    {
      key: "/admin/buildings",
      icon: "/assets/svg/buildings-gray.svg",
      icon2: Building,
      title: "Buildings",
      list: [],
    },
    {
      key: "/admin/es-pulse-subscriptions",
      icon: "/assets/svg/list.svg",
      icon2: ClipboardList,
      title: "ES Pulse Subscriptions",
      list: [],
    },
    {
      key: "/admin/service-contracts",
      icon: "/assets/svg/list.svg",
      title: "Service Contracts",
      list: [],
    },

    {
      key: "/admin/groups",
      icon: "/assets/svg/equipment.svg",
      icon2: DoorClosed,
      title: "Equipments",
      list: [],
    },

    {
      key: "/admin/capital-budget",
      icon: "/assets/svg/equipment.svg",
      icon2: BadgeDollarSign,
      title: "Capital Budget",
      list: [
        { key: "/admin/capital-budget", title: "Equipments Budget" },
        { key: "/admin/cost-info", title: "Cost Info" },
      ],
    },
    {
      key: "/admin/brands",
      icon: "/assets/svg/icon11.svg",
      title: "Brands",
      list: [],
    },
    {
      key: "/admin/users",
      icon: "/assets/svg/user.svg",
      title: "Users",
      list: [
        { key: "/admin/es-clients", title: "ES Client" },
        { key: "/admin/es-admin", title: "ES Admin" },
      ],
    },
    {
      key: "/admin/logs",
      icon: "/assets/svg/inactive_logs.svg",
      title: "Logs",
      list: [],
    },
  ];

  const filteredList = list.map((item) => {
    if (item.title === "Users" && user?.user_type_name !== "superadmin") {
      return {
        ...item,
        list: item.list.filter((sub) => sub.title !== "ES Admin"),
      };
    }
    return item;
  });

  const handleClick = (item) => {
    if (item.list && item.list.length > 0) {
      setOpenMenu(openMenu === item.key ? null : item.key);
    } else {
      navigate(item.key);
    }
  };

  const handleSubClick = (subItem) => {
    navigate(subItem.key);
  };

  const isActive = (path) => {
    const currentPath = location.pathname + location.search;

    if (currentPath === path) return true;

    if (
      location.search.includes("client=true") &&
      path === "/admin/dashboard?client=true"
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="w-56 xl:w-[272px] fixed border-r border-[#EAECEF] p-5 h-screen z-50 bg-white">
      <div>
        <img
          src="/assets/png/logo.png"
          alt="Logo"
          width={146}
          height={49}
          className="mx-auto"
        />

        <div className="space-y-1 mt-14">
          {filteredList.map((item) => {
            const isMenuOpen = openMenu === item.key;
            const isItemActive =
              isActive(item.key) || item.list.some((sub) => isActive(sub.key));

            return (
              <div key={item.key}>
                <div
                  onClick={() => handleClick(item)}
                  className={`rounded-full h-12 p-[1px] cursor-pointer transition-all duration-200 ${
                    isItemActive
                      ? `${
                          item.title === "Contracts"
                            ? "bg-white"
                            : "bg-gradient-to-r from-[#FFCBB6] to-primary/0"
                        }`
                      : "bg-white"
                  }`}>
                  <li
                    className={`h-full flex items-center justify-between gap-2 px-5 rounded-full ${
                      isItemActive
                        ? `${
                            item.title === "Contracts"
                              ? "bg-white"
                              : "bg-bg_primary"
                          }`
                        : "bg-white"
                    }`}>
                    <div className="flex items-center gap-2">
                      {item.icon2 ? (
                        <item.icon2
                          size={20}
                          color={isItemActive ? "#F06B3C" : "#5B617F"}
                        />
                      ) : (
                        <img src={item.icon} alt="" width={20} height={20} />
                      )}
                      <p className="text-sm text-text_secondary font-semibold">
                        {item.title}
                      </p>
                    </div>
                    {item.list.length > 0 && (
                      <span>
                        {isMenuOpen ? (
                          <ChevronDown size={18} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-500" />
                        )}
                      </span>
                    )}
                  </li>
                </div>

                {/* SUB ITEMS */}
                {isMenuOpen && item.list.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.list.map((sub) => (
                      <div
                        key={sub.key}
                        onClick={() => handleSubClick(sub)}
                        className={`rounded-full h-10 p-[1px] cursor-pointer transition-all duration-200 ${
                          isActive(sub.key)
                            ? "bg-gradient-to-r from-[#FFCBB6] to-primary/0"
                            : "bg-white"
                        }`}>
                        <li
                          className={`h-full flex items-center gap-2 pl-10 px-5 rounded-full ${
                            isActive(sub.key) ? "bg-bg_primary" : "bg-white"
                          }`}>
                          <ChevronRight size={14} />
                          <p className="text-sm text-text_secondary font-medium">
                            {sub.title}
                          </p>
                        </li>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
