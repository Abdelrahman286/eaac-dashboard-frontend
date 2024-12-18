import React, { useEffect, useState } from "react";

import "../../../styles/accounting.css";

import Header from "./Header";
import DataTable from "./DataTable";

const ClientBalance = () => {
  const [filterData, setFilterData] = useState({});
  const handleFilterChange = (_filterData) => {
    setFilterData(_filterData);
  };

  return (
    <div>
      <Header onFilterChange={handleFilterChange}></Header>
      <DataTable filterData={filterData || []}></DataTable>
    </div>
  );
};

export default ClientBalance;
