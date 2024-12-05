import React, { useEffect, useState } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/receipts.css";

import Header from "../components/Receipt/Header";
import ReceiptsTable from "../components/Receipt/ReceiptsTable";

const ReceiptsPage = () => {
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (filterData) => {
    setFilterData(filterData);
  };

  // handle excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };
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
