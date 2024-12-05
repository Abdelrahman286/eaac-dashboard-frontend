import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/financialReports.css";

const AccountingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabData = [
    {
      label: "Account Movements",
      path: "/financial-reports/account-movements",
    },
    { label: "Client Balance", path: "/financial-reports/client-balance" },
    { label: "Expenses", path: "/financial-reports/expenses" },
    { label: "Revenue", path: "/financial-reports/revenue" },
    { label: "Refund", path: "/financial-reports/refund" },
    { label: "Daily Movements", path: "/financial-reports/daily-movements" },
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
    } else if (location.pathname === "/financial-reports") {
      navigate(tabData[0].path); // Default to the first tab (Students)
    }
  }, [location.pathname, navigate, tabData]);

  return (
    <div className="financialReports-page">
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

export default AccountingPage;
