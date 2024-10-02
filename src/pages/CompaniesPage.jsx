import React, { useState, lazy, Suspense } from "react";
import "../styles/companies.css";

// import HeaderActions from "../components/companies/HeaderActions";
// import CompaniesTable from "../components/companies/CompaniesTable";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/companies/HeaderActions")
);
const CompaniesTable = lazy(() =>
  import("../components/companies/CompaniesTable")
);

const CompaniesPage = () => {
  const [data, setData] = useState([]);
  const handleDataChange = (companiesData) => {
    setData(companiesData);
  };

  return (
    <div className="companies-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeaderActions data={data}></HeaderActions>
        {/* // data grid table */}
        <CompaniesTable onDataChange={handleDataChange}></CompaniesTable>
      </Suspense>
    </div>
  );
};

export default CompaniesPage;
