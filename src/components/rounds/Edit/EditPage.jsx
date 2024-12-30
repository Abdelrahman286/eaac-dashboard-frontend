import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";

// components
import EditRoundForm from "./EditRoundForm";
import EditSessionsForm from "./EditSessionsForm";

const EditPage = ({ onClose, data }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="edit-page">
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Round Data" />
        <Tab label="Sessions" />
      </Tabs>

      {selectedTab == 0 && (
        <div style={{ padding: "20px 10px" }}>
          <EditRoundForm data={data} onClose={onClose}></EditRoundForm>
        </div>
      )}

      {selectedTab == 1 && (
        <div style={{ padding: "20px 10px" }}>
          <EditSessionsForm data={data} onClose={onClose}></EditSessionsForm>
        </div>
      )}
    </div>
  );
};

export default EditPage;
