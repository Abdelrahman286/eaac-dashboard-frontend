import React, { useState, lazy, Suspense } from "react";

import LoadingSpinner from "../../../components/LoadingSpinner";
const Header = lazy(() => import("./Header"));
const DataTable = lazy(() => import("./DataTable"));
const PaymentMethods = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (_data) => {
    setData(_data);
  };

  return (
    <div className="rooms-page">
      <Suspense fallback={<LoadingSpinner />}>
        <Header data={data}></Header>
        <DataTable onDataChange={handleDataChange}></DataTable>
      </Suspense>
    </div>
  );
};

export default PaymentMethods;
