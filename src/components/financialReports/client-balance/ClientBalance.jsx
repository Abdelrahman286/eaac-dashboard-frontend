import React, { useEffect, useState, useContext } from "react";

import "../../../styles/accounting.css";

import Header from "./Header";
import DataTable from "./DataTable";

import { UserContext } from "../../../contexts/UserContext";

const ClientBalance = () => {
  const { hasPermission } = useContext(UserContext);
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (_filterData) => {
    setFilterData(_filterData);
  };

  return (
    <div>
      {hasPermission("Client Balance Sheet Report") && (
        <>
          <Header onFilterChange={handleFilterChange}></Header>
          <DataTable filterData={filterData || []}></DataTable>
        </>
      )}
    </div>
  );
};

export default ClientBalance;
