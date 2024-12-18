import React, { useState, lazy, Suspense, useContext } from "react";

import { UserContext } from "../../../contexts/UserContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
const Header = lazy(() => import("./Header"));
const DataTable = lazy(() => import("./DataTable"));
const PaymentMethods = () => {
  const { hasPermission } = useContext(UserContext);
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  return (
    <div className="rooms-page">
      {hasPermission("View Payment Methods list") && (
        <Suspense fallback={<LoadingSpinner />}>
          <Header data={data}></Header>
          <DataTable onDataChange={handleDataChange}></DataTable>
        </Suspense>
      )}
    </div>
  );
};

export default PaymentMethods;
