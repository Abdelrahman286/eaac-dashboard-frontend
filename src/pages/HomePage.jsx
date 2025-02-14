import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// contexts
import { AppContext } from "../contexts/AppContext";
import { UserContext } from "../contexts/UserContext";

// components
import Shortcuts from "../components/Home/Shortcuts";
import FinancialStats from "../components/Home/stats/Financial";
import BalanceStats from "../components/Home/stats/BalanceStats";
import GeneralStats from "../components/Home/stats/GeneralStats";
import Notifications from "../components/Home/Notifications";
// requests
import { getGeneralStats, getFinancialStats } from "../requests/home";

// utils
import { getDataForTableRows } from "../utils/tables";
const HomePage = () => {
  const { token, hasPermission } = useContext(UserContext);
  // general stats
  const { data: generalStatsList, isLoading: generalStatsLoading } = useQuery({
    queryFn: () => {
      return getGeneralStats({}, token);
    },

    queryKey: ["generalStats"],
  });
  const generalStats = getDataForTableRows(
    generalStatsList?.success?.response?.data
  )[0];

  // financial stats
  const { data: financialStatsList, isLoading: financialStatsLoading } =
    useQuery({
      queryFn: () => {
        return getFinancialStats({}, token);
      },

      queryKey: ["financialStats"],
    });
  const financialStats = getDataForTableRows(
    financialStatsList?.success?.response?.data
  )[0];
  return (
    <div className="home-page">
      {hasPermission("Notifications (Today)") && (
        <Notifications></Notifications>
      )}

      <Shortcuts></Shortcuts>

      {hasPermission("Stats") && (
        <>
          {" "}
          <FinancialStats data={financialStats}></FinancialStats>
          <BalanceStats data={financialStats}></BalanceStats>
          <GeneralStats data={generalStats}></GeneralStats>
        </>
      )}
    </div>
  );
};

export default HomePage;
