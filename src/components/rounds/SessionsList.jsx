import React, { useContext, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// requests
import { getSessionsFn } from "../../requests/rounds";

// contextsp
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// utils
import { getDataForTableRows } from "../../utils/tables";

// loading
import LoadingSpinner from "../../components/LoadingSpinner";
import ViewRoundsWithConflict from "./ViewRoundsWithConflict";

const SessionsList = ({ onClose, roundId }) => {
  const { token } = useContext(UserContext);
  //----- Sessions
  const { data: sessionsList, isLoading: sessionsLoading } = useQuery({
    queryFn: () => {
      return getSessionsFn(
        {
          numOfElements: "3000",
          roundId: `${roundId}`,
        },
        token
      );
    },

    queryKey: ["roundSessions1", roundId],
  });
  const sessions = getDataForTableRows(sessionsList?.success?.response?.data);

  const arrayWithIndex = sessions.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

  return (
    <div className="view-sessions-modal">
      {sessionsLoading && <LoadingSpinner height={"100px"}></LoadingSpinner>}

      {!sessionsLoading && sessions?.length > 0 && (
        <div>
          {/* Display your sessions here */}

          <div className="one-by-one-sessionsList">
            <div className="header">
              <span>#</span>
              <span>Session Name</span>
              <span>Date</span>
              <span>Start Time</span>
              <span>End Time</span>
              <span>Description</span>
              <span>Room</span>
              <span>Instructor</span>
              {/* <span>Controls</span> */}
            </div>

            {arrayWithIndex?.length == 0 && (
              <p style={{ textAlign: "center" }}>No Rows</p>
            )}
            <div className="data-list">
              {arrayWithIndex.map((ele) => {
                return (
                  <div className="session-row" key={ele?.rowIndex}>
                    <div className="data-row">
                      <span>{ele?.rowIndex}</span>
                      <span>{ele?.Name_en || "-"}</span>
                      <span>{ele?.SessionDate?.split(" ")[0]}</span>
                      <span>{ele?.StartTime?.split(" ")[1]}</span>
                      <span>{ele?.EndTime?.split(" ")[1]}</span>
                      <span>{ele?.Description_en}</span>
                      <span>{ele?.RoomID?.Name_en}</span>
                      <span>{ele?.InstructorID?.Name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!sessionsLoading && sessions?.length == 0 && (
        <div className="">No Sessions Found !</div>
      )}
    </div>
  );
};

export default SessionsList;
