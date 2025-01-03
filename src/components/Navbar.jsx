import React, { useContext, useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

// contexts
import { AppContext } from "../contexts/AppContext";
import { UserContext } from "../contexts/UserContext";

// icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Groups2Icon from "@mui/icons-material/Groups2";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import SummarizeIcon from "@mui/icons-material/Summarize";

import PersonSearchIcon from "@mui/icons-material/PersonSearch";

//requests
import { getProfileData } from "../requests/profile";

// styles
import "../styles/side-nav.css";

// components
import Tooltip from "@mui/material/Tooltip";

// images
import barndLogo from "../assets/eaac-logo-240.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, logout, hasPermission, userPermissionsLoading } =
    useContext(UserContext);
  const [closed, setClosed] = useState("closed");
  const { pathname } = useLocation();

  // fetch user profile data
  const { data: userDataObj, isLoading: getUserLoading } = useQuery({
    queryFn: () => {
      return getProfileData(
        {
          id: user?.id,
        },
        token
      );
    },
    enabled: !!user?.id,

    queryKey: ["userProfileData"],
  });
  const userData = userDataObj?.success?.response?.data || {};

  const handleLogout = () => {
    logout();
  };

  const handleCollapse = () => {
    setClosed("closed");
  };

  const handleExpand = () => {
    setClosed("");
  };

  // each navlink can have multiple nested paths
  const routes = [
    {
      paths: ["/"],
      icon: <HomeIcon></HomeIcon>,
      label: "Home",
      permission: "pass",
    },
    {
      paths: ["/companies"],
      icon: <ApartmentIcon></ApartmentIcon>,
      label: "Companies",
      permission: "View Companies List",
    },
    {
      paths: ["/rooms"],
      icon: <MeetingRoomIcon></MeetingRoomIcon>,
      label: "Rooms",
      permission: "View Rooms List",
    },
    {
      paths: ["/courses"],
      icon: <LocalLibraryIcon></LocalLibraryIcon>,
      label: "Courses",
      permission: "View Courses List",
    },
    {
      paths: ["/students"],
      icon: <PeopleAltIcon></PeopleAltIcon>,
      label: "Students",
      permission: "View Clients List",
    },
    {
      paths: ["/instructors"],
      icon: <Groups2Icon></Groups2Icon>,
      label: "Instructors",
      permission: "View Instructors List",
    },
    {
      paths: ["/rounds"],
      icon: <EventRepeatIcon></EventRepeatIcon>,
      label: "Rounds",
      permission: "View Rounds List",
    },

    {
      paths: ["/attendance", "/attendance/students", "/attendance/instructors"],
      icon: <AssignmentIcon></AssignmentIcon>,
      label: "Attendance",
      permission: "pass",
    },

    {
      paths: ["/membership"],
      icon: <AddCardIcon></AddCardIcon>,
      label: "Membership",
      permission: "View Membership List",
    },
    // Accounting
    {
      paths: [
        "/accounting",
        "/accounting/client-payments",
        "/accounting/account-payments",
      ],
      icon: <PaidIcon></PaidIcon>,
      label: "Accounting",
      permission: "pass",
    },

    {
      paths: ["/receipts"],
      icon: <ReceiptLongIcon></ReceiptLongIcon>,
      label: "Receipts",
      permission: "View Receipts List",
    },

    // Financial Reports
    {
      paths: [
        "/financial-reports",
        "/financial-reports/account-movements",
        "/financial-reports/client-balance",
        "/financial-reports/expenses",
        "/financial-reports/revenue",
        "/financial-reports/refund",
        "/financial-reports/daily-movements",
      ],
      icon: <SummarizeIcon></SummarizeIcon>,
      label: "Financial Reports",
      permission: "pass",
    },

    {
      paths: ["/admins"],
      icon: <AssignmentIndIcon></AssignmentIndIcon>,
      label: "Admins",
      permission: "View Users",
    },

    {
      paths: ["/profiles"],
      icon: <PersonSearchIcon></PersonSearchIcon>,
      label: "Profiles",
      permission: "pass",
    },
    {
      paths: ["/profile"],
      icon: <AccountCircleIcon></AccountCircleIcon>,
      label: "My Profile",
      permission: "pass",
    },

    {
      paths: [
        "/settings",
        "/settings/coupons",
        "/settings/payment-methods",
        "/settings/expenses-types",
      ],
      icon: <SettingsIcon></SettingsIcon>,
      label: "Settings",
      permission: "pass",
    },
  ];

  // Navlinks on small screens
  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 1000) {
        setClosed("closed");
      } else {
        setClosed("");
      }
    };

    // checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className={`nav-page ${closed}`}>
      <div className={`side-menu`}>
        <div className="side-menu-bg"></div>
        <div className="top">
          <h3>EAAC Dashboard</h3>

          {closed == "" && (
            <ArrowBackIosIcon
              onClick={handleCollapse}
              className="nav-collapse-icon"
              sx={{ fontSize: "20px", cursor: "pointer" }}
            ></ArrowBackIosIcon>
          )}

          {closed !== "" && (
            <ArrowForwardIosIcon
              onClick={handleExpand}
              className="nav-collapse-icon"
              sx={{ fontSize: "20px", cursor: "pointer" }}
            ></ArrowForwardIosIcon>
          )}
        </div>
        <div className="links">
          {routes.map((route) => {
            if (
              (!userPermissionsLoading && hasPermission(route?.permission)) ||
              route?.permission == "pass"
            ) {
              return (
                <Link
                  key={route.paths[0]}
                  to={route.paths[0]}
                  className={`link ${
                    route.paths.includes(pathname.replace(/\/\d+$/, ""))
                      ? "active"
                      : ""
                  }`}
                >
                  {closed == "closed" ? (
                    <>
                      <Tooltip title={route.label} arrow placement="right">
                        {route.icon}
                      </Tooltip>
                    </>
                  ) : (
                    <>{route.icon}</>
                  )}
                  <span>{route.label}</span>
                </Link>
              );
            }
          })}
        </div>
      </div>
      <div className="nav-content">
        <div className="dashboard-header">
          <div className="brand-logo">
            <img src={barndLogo}></img>
          </div>
          <div className="current-page-title">
            <h2>
              {routes.find((ele) => ele.paths.includes(pathname))?.label ||
                "dashboard"}
            </h2>
          </div>
          <div className="profile-actions">
            <div>
              <Tooltip title="Logout" placement="bottom" arrow>
                <LogoutIcon onClick={handleLogout}></LogoutIcon>
              </Tooltip>
            </div>
            <div className="profile-data" onClick={() => navigate("/profile")}>
              <div className="profile-img-container">
                <img alt="img" src={userData?.Image || ""}></img>
              </div>
              <span className="profile-name">{userData?.Name || ""}</span>
            </div>
          </div>
        </div>

        <div className="nav-content-outlet">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
