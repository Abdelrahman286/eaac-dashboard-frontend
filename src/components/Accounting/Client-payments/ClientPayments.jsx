import React, { useEffect, useState } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../../../styles/accounting.css";

import Header from "./Header";
import DataTable from "./DataTable";

const ClientPaymentsPage = () => {
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (filterData) => {
    setFilterData(filterData);
  };

  //   // handle excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };
  return (
    <div className="client-payments-page">
      <Header onFilterChange={handleFilterChange} excelData={data}></Header>
      <DataTable
        onDataChange={handleDataChange}
        filterData={filterData || []}
      ></DataTable>
    </div>
  );
};

export default ClientPaymentsPage;
