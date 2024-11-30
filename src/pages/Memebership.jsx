import React, { useEffect, useState } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/membership.css";

import Header from "../components/membership/Header";
import MemebershipTable from "../components/membership/MemebershipTable";

const Memebership = () => {
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
    <div className="membership-page">
      <Header onFilterChange={handleFilterChange} excelData={data}></Header>
      <MemebershipTable
        onDataChange={handleDataChange}
        filterData={filterData || []}
      ></MemebershipTable>
    </div>
  );
};

export default Memebership;
