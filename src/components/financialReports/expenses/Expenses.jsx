import React, { useEffect, useState, useContext } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../../../styles/accounting.css";

import { UserContext } from "../../../contexts/UserContext";

import Header from "./Header";
import DataTable from "./DataTable";

const ExpensesReport = () => {
  const { hasPermission } = useContext(UserContext);
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (_filterData) => {
    setFilterData(_filterData);
  };

  return (
    <div className="client-payments-page">
      {hasPermission("Expenses Report") && (
        <>
          <Header onFilterChange={handleFilterChange}></Header>
          <DataTable filterData={filterData || []}></DataTable>
        </>
      )}
    </div>
  );
};

export default ExpensesReport;
