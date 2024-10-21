import React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// requests
import { getSessionsFn } from "../../requests/rounds";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";

// utils
import { getDataForTableRows } from "../../utils/tables";

// loading
import LoadingSpinner from "../../components/LoadingSpinner";

const SessionsList = ({ onClose, sessionsRoundId }) => {
  //----- Sessions
  const { data: sessionsList, isLoading: sessionsLoading } = useQuery({
    queryFn: () => {
      return getSessionsFn(
        {
          numOfElements: "9000",
          roundId: sessionsRoundId,
        },
        token
      );
    },
    retry: 1,

    queryKey: ["roundSessions"],
  });
  const sessions = getDataForTableRows(sessionsList?.success?.response?.data);

  return (
    <div>
      {sessionsLoading && <LoadingSpinner height={"100px"}></LoadingSpinner>}

      {!sessionsLoading && sessions?.length > 0 && (
        <div>
          {/* Display your sessions here */}
          display sessions
        </div>
      )}

      {!sessionsLoading && sessions?.length === 0 && (
        <div>No sessions found</div>
      )}
    </div>
  );
};

export default SessionsList;
