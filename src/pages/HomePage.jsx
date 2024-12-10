import React from "react";

// import "../styles/home.css";
import Shortcuts from "../components/Home/Shortcuts";
import FinancialStats from "../components/Home/stats/Financial";
import BalanceStats from "../components/Home/stats/BalanceStats";
import GeneralStats from "../components/Home/stats/GeneralStats";
const HomePage = () => {
  return (
    <div className="home-page">
      <Shortcuts></Shortcuts>

      <FinancialStats></FinancialStats>
      <BalanceStats></BalanceStats>
      <GeneralStats></GeneralStats>
    </div>
  );
};

export default HomePage;
