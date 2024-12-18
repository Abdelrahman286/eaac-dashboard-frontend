import React, { useEffect, useState, useContext } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext";

import "../../../styles/accounting.css";

import Header from "./Header";
import DataTable from "./DataTable";

const AccountPaymentsPage = () => {
  const { hasPermission } = useContext(UserContext);
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
      {hasPermission("View Account Movements") && (
        <>
          <Header onFilterChange={handleFilterChange} excelData={data}></Header>
          <DataTable
            onDataChange={handleDataChange}
            filterData={filterData || []}
          ></DataTable>
        </>
      )}
    </div>
  );
};

export default AccountPaymentsPage;
