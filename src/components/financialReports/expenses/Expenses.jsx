import React, { useEffect, useState } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../../../styles/accounting.css";

import Header from "./Header";
import DataTable from "./DataTable";

const ExpensesReport = () => {
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (_filterData) => {
    setFilterData(_filterData);
  };

  return (
    <div className="client-payments-page">
      <Header onFilterChange={handleFilterChange}></Header>
      <DataTable filterData={filterData || []}></DataTable>
    </div>
  );
};

export default ExpensesReport;
