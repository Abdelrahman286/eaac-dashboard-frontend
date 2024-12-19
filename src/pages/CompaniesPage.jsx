import React, { useState, lazy, Suspense, useContext, useEffect } from "react";
import "../styles/companies.css";

import { UserContext } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
const HeaderActions = lazy(() =>
  import("../components/companies/HeaderActions")
);
const CompaniesTable = lazy(() =>
  import("../components/companies/CompaniesTable")
);

const CompaniesPage = () => {
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const handleDataChange = (companiesData) => {
    setData(companiesData);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Companies List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);

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
