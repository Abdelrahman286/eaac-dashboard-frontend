import React, { useEffect, useState, useContext } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/receipts.css";

import { UserContext } from "../contexts/UserContext";

import Header from "../components/Receipt/Header";
import ReceiptsTable from "../components/Receipt/ReceiptsTable";

const ReceiptsPage = () => {
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (filterData) => {
    setFilterData(filterData);
  };

  // handle excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Receipts List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);
  return (
    <div className="receipt-page">
      <Header onFilterChange={handleFilterChange} excelData={data}></Header>
      <ReceiptsTable
        onDataChange={handleDataChange}
        filterData={filterData || []}
      ></ReceiptsTable>
    </div>
  );
};

export default ReceiptsPage;
