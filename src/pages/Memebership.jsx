import React, { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

import "../styles/membership.css";

import Header from "../components/membership/Header";
import MemebershipTable from "../components/membership/MemebershipTable";

const Memebership = () => {
  const navigate = useNavigate();
  const { hasPermission } = useContext(UserContext);
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
    if (!hasPermission("View Membership List")) {
      navigate("/");
    }
  }, []);

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
