import React, { useState } from "react";
import HeaderActions from "./HeaderActions";
import CategoriesTable from "./CategoriesTable";

import "../../styles/categories.css";
const CategoriesList = () => {
  // for excel export
  const [data, setData] = useState([]);
  const handleDataChange = (coursesData) => {
    setData(coursesData);
  };
  return (
    <div className="categories-page">
      <HeaderActions data={data}></HeaderActions>
      <CategoriesTable onDataChange={handleDataChange}></CategoriesTable>
    </div>
  );
};

export default CategoriesList;
