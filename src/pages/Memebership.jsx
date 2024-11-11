import React, { useEffect, useState } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/membership.css";

import Header from "../components/membership/Header";
import MemebershipTable from "../components/membership/MemebershipTable";

const Memebership = () => {
  return (
    <div className="membership-page">
      <Header></Header>
      <MemebershipTable></MemebershipTable>
    </div>
  );
};

export default Memebership;
