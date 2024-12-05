import React, { useContext, useEffect, useState } from "react";
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

//requests
import { getProfileData } from "../requests/profile";

// styles
import "../styles/side-nav.css";

// components
import Tooltip from "@mui/material/Tooltip";

// images
import barndLogo from "../assets/eaac-logo-240.png";
import fallbackImageUrl from "../assets/profileImg.webp";
const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useContext(UserContext);
  const [closed, setClosed] = useState("");
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
    { paths: ["/"], icon: <HomeIcon></HomeIcon>, label: "Home" },
    {
      paths: ["/profile"],
      icon: <AccountCircleIcon></AccountCircleIcon>,
      label: "Profile",
    },
    {
      paths: ["/admins"],
      icon: <AssignmentIndIcon></AssignmentIndIcon>,
      label: "Admins",
    },
    {
      paths: ["/rounds"],
      icon: <EventRepeatIcon></EventRepeatIcon>,
      label: "Rounds",
    },

    {
      paths: ["/students"],
      icon: <PeopleAltIcon></PeopleAltIcon>,
      label: "Students",
    },

    {
      paths: ["/instructors"],
      icon: <Groups2Icon></Groups2Icon>,
      label: "Instructors",
    },
    {
      paths: ["/rooms"],
      icon: <MeetingRoomIcon></MeetingRoomIcon>,
      label: "Rooms",
    },
    {
      paths: ["/courses"],
      icon: <LocalLibraryIcon></LocalLibraryIcon>,
      label: "Courses",
    },
    {
      paths: ["/companies"],
      icon: <ApartmentIcon></ApartmentIcon>,
      label: "Companies",
    },
    {
      paths: ["/attendance", "/attendance/students", "/attendance/instructors"],
      icon: <AssignmentIcon></AssignmentIcon>,
      label: "Attendance",
    },

    {
      paths: ["/membership"],
      icon: <AddCardIcon></AddCardIcon>,
      label: "Membership",
    },
    {
      paths: ["/client-payments"],
      icon: <PaidIcon></PaidIcon>,
      label: "Client Payments",
    },

    {
      paths: ["/receipts"],
      icon: <ReceiptLongIcon></ReceiptLongIcon>,
      label: "Receipts",
    },

    {
      paths: ["/settings"],
      icon: <SettingsIcon></SettingsIcon>,
      label: "Settings",
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
    checkScreenWidth();
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
