import React, { useEffect, useState } from "react";
import SideLogo from "../../assets/png/logo.png";
import SideLogo2 from "../../assets/png/sideLogo.png";
import Icon from "../../assets/svg/icon5.svg";
import Icon2 from "../../assets/svg/icon.svg";
import Icon3 from "../../assets/svg/icon2.svg";
import Icon4 from "../../assets/svg/icon3.svg";
import Icon5 from "../../assets/svg/icon4.svg";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useUser } from "@/hooks/useUserType";
import { useGetClientByIdQuery } from "@/redux/services/admin-client";
import Loader from "./loader";
import { useSelector } from "react-redux";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Icon, path: "/dashboard" },
  {
    id: "analytics",
    label: "KPIs & Analytics",
    icon: Icon2,
    path: "/analytics",
    children: [
      { label: "Callbacks", path: "/callbacks-overview" },
      { label: "Response Times", path: "/response-times" },
      { label: "Maintenance", path: "/maintenance-overview" },
      { label: "Capital Budget", path: "/capital-budget" },
      { label: "KPI Penalty", path: "/kpi-penalty" },
    ],
  },
  {
    id: "contracts",
    label: "Service Contracts",
    icon: Icon3,
    path: "/service-contracts",
  },
  { id: "equipments", label: "Equipments", icon: Icon4, path: "/equipments" },
  { id: "downloads", label: "Downloads", icon: Icon5, path: "/downloads" },
];

export default function Sidebar() {
  const location = useLocation();
  const [active, setActive] = useState();
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const userData = useUser();
  const selectedSubscriptionId = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const effectiveSubscriptionId =
    selectedSubscriptionId || localStorage.getItem("selectedSubscriptionId");

  const selectedSubscription = userData?.es_subscriptions?.find(
    (sub) => sub.subscription_id === effectiveSubscriptionId,
  ) || userData?.es_subscriptions?.[0];

  const clientId = selectedSubscription?.client_id;
  const { data, isLoading } = useGetClientByIdQuery(clientId, {
    skip: !clientId,
  });
  const clientLogo = data?.data?.logo_url;
  useEffect(() => {
    const currentPath = location.pathname;

    for (let item of menuItems) {
      if (item.children) {
        const childMatch = item.children.find((c) => c.path === currentPath);
        if (childMatch) {
          setActive(item.id);
          setOpenAccordion(item.id);
          setActiveChild(currentPath);
          return;
        }
      }
      if (
        item.path === currentPath ||
        (item.path === "/buildings" && currentPath.startsWith("/buildings")) ||
        (item.path === "/buildings" && currentPath.startsWith("/groups"))
      ) {
        setActive(item.id);
        setOpenAccordion(null);
        setActiveChild(null);
        return;
      }
    }
  }, [location.pathname]);

  const handleClick = (item) => {
    setActive(item.id);
    if (item.children) {
      setOpenAccordion(openAccordion === item.id ? null : item.id);
    } else {
      setOpenAccordion(null);
    }
  };

  return (
    <div className="w-56 xl:w-64 fixed border-r-[1px] border-[#EAECEF] bg-white/80 backdrop-blur-sm p-5 h-screen z-50">
      {isLoading ? (
        <Loader />
      ) : (
        <img
          src={clientLogo}
          alt="logo"
          className=" h-[60px] lg:h-[80px] mx-auto duration-300"
        />
      )}

      <div className="mt-5">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="animate-slideInRight"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`group transition-all duration-300 ${
                active === item.id
                  ? "p-[1px] rounded-full bg-gradient-to-r from-[#FFCBB6] to-[#EDB02B00]"
                  : ""
              } p-[1px]`}
            >
              {item.children ? (
                <button
                  className={`group transition-all duration-300 ${
                    active === item.id
                      ? "bg-gradient-to-r from-[#F3F3F3] to-[#EEEEEE] text-black shadow-md"
                      : "hover:bg-gray-100"
                  } font-semibold text-sm cursor-pointer w-full flex items-center gap-2 p-3 rounded-full`}
                  onClick={() => handleClick(item)}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`transition-all duration-300 ${
                      active === item.id
                        ? "[filter:brightness(0)_saturate(100%)_invert(50%)_sepia(95%)_saturate(1820%)_hue-rotate(338deg)_brightness(96%)_contrast(92%)]"
                        : ""
                    }`}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  <IoIosArrowForward
                    className={`transition-transform duration-300 ${
                      openAccordion === item.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link to={item.path}>
                  <button
                    className={`group transition-all duration-300 ${
                      active === item.id
                        ? "bg-gradient-to-r from-[#F3F3F3] to-[#EEEEEE] text-black shadow-md"
                        : "hover:bg-gray-100"
                    } font-semibold text-sm cursor-pointer w-full flex items-center gap-2 p-3 rounded-full`}
                    onClick={() => handleClick(item)}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={`transition-all duration-300 ${
                        active === item.id
                          ? "[filter:brightness(0)_saturate(100%)_invert(50%)_sepia(95%)_saturate(1820%)_hue-rotate(338deg)_brightness(96%)_contrast(92%)]"
                          : ""
                      }`}
                    />
                    {item.label}
                  </button>
                </Link>
              )}
            </div>

            {/* Render children if accordion is open */}
            {item.children && openAccordion === item.id && (
              <div className="ml-6 animate-fadeInUp">
                {item.children.map((child, idx) => (
                  <Link to={child.path} key={idx}>
                    <div
                      className={`mt-2 flex items-center gap-2 cursor-pointer group transition-all duration-200 p-2 rounded-lg ${
                        activeChild === child.path
                          ? "bg-[#FFF5F0] text-[#F06B3C]"
                          : "text-[#5B617F] hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveChild(child.path)}
                    >
                      <IoIosArrowForward
                        className={`text-sm transition-all duration-200 ${
                          activeChild === child.path
                            ? "text-[#F06B3C]"
                            : "text-[#898EA6] group-hover:text-[#F06B3C]"
                        }`}
                      />
                      <p
                        className={`font-semibold text-sm transition-all duration-200 ${
                          activeChild === child.path
                            ? "text-[#F06B3C]"
                            : "text-[#5B617F] group-hover:text-[#F06B3C]"
                        }`}
                      >
                        {child.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 left-5 right-5 bg-white">
        <img
          src={SideLogo}
          alt="side-logo"
          className="pb-3 w-[100px] mx-auto"
        />
        <div className="border-t-2 border-[#EAECEF] h-1"></div>
        <img
          src={SideLogo2}
          alt="side-logo-2"
          className="pt-3 w-[100px] mx-auto"
        />
        <div className="border-t-2 border-[#EAECEF] h-1 mt-2"></div>
        <h6 className="text-xs text-center font-semibold uppercase mt-2 text-orange-400">
          The system is currently in development
        </h6>
      </div>
    </div>
  );
}
