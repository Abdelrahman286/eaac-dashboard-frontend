import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define your routes with labels and paths
  const routes = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  // Find the index of the current tab based on the current path
  const currentTab = routes.findIndex(
    (route) => route.path === location.pathname
  );
  const [selectedTab, setSelectedTab] = useState(
    currentTab !== -1 ? currentTab : 0
  );

  useEffect(() => {
    setSelectedTab(currentTab !== -1 ? currentTab : 0);
  }, [location.pathname, currentTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // navigate(routes[newValue].path);
  };

  return (
    <Tabs value={selectedTab} onChange={handleTabChange}>
      {routes.map((route, index) => (
        <Tab key={index} label={route.label} />
      ))}
    </Tabs>
  );
};

export default TabNavigation;
