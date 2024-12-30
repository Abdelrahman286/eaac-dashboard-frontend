import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/settings.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabData = [
    { label: "Coupons", path: "/settings/coupons" },
    { label: "Payment Methods", path: "/settings/payment-methods" },
    { label: "Expenses Types", path: "/settings/expenses-types" },
  ];

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTabIndex(newValue);
    navigate(tabData[newValue].path); // Navigate to the new tab path
  };

  useEffect(() => {
    const activeTabIndex = tabData.findIndex(
      (tab) => location.pathname.includes(tab.path.split("/")[2]) // Match based on the sub-path
    );
    if (activeTabIndex !== -1) {
      setCurrentTabIndex(activeTabIndex);
    } else if (location.pathname == "/settings") {
      navigate(tabData[0].path); // Default to the first tab (Students)
    }
  }, [location.pathname, navigate, tabData]);

  return (
    <div className="settings-page">
      {/* MUI Tabs for navigation */}
      <Tabs value={currentTabIndex} onChange={handleTabChange}>
        {tabData.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Outlet for rendering nested routes */}
      <div className="outlet-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
