import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// utils
import { convertTo12HourFormat } from "../../utils/functions";
const ViewRoundsWithConflict = ({ data, mainFormData }) => {
  // Add index for array objects
  const arrayWithIndex = data.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

  const getConflictString = (conflictsArray) => {
    if (!Array.isArray(conflictsArray) || conflictsArray.length === 0) {
      return ""; // Return empty string if input is not an array or is empty
    }

    let combinedConflictString = "";

    conflictsArray.forEach((ele) => {
      const sessionDate = ele?.SessionDate.split(" ")[0];
      const startTime = convertTo12HourFormat(ele?.StartTime.split(" ")[1]);
      const endTime = convertTo12HourFormat(ele?.EndTime.split(" ")[1]);

      const roomConflict = ele?.Conflicts?.Room?.Name_en
        ? `Room: (${ele.Conflicts.Room.Name_en} - ${ele.Conflicts.Room.RoomCode})`
        : "";
      const instructorConflict = ele?.Conflicts?.Instructor?.Name
        ? `Instructor: ${ele.Conflicts.Instructor.Name}`
        : "";

      // Combine room and instructor conflicts with "&" if both exist
      const conflictString =
        roomConflict && instructorConflict
          ? `${roomConflict} & ${instructorConflict}`
          : `${roomConflict}${instructorConflict}`;

      combinedConflictString += `At (${sessionDate}) from (${startTime}) to (${endTime}) at ${conflictString}\n\n`;
    });

    return combinedConflictString;
  };

  return (
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
          const startTime = ele?.start?.split(" ")[1];
          const endTime = ele?.end?.split(" ")[1];

          const startDate = ele?.start?.split(" ")[0];
          const endDate = ele?.end?.split(" ")[0];
          return (
            <div className="session-row" key={ele?.rowIndex}>
              <div className="data-row">
                <span>{ele?.rowIndex}</span>
                <span>{ele?.sessionName || "-"}</span>
                <span>{startDate}</span>
                <span>{startTime}</span>
                <span>{endTime}</span>
                <span>{"-"}</span>
                <span>{"-"}</span>
                <span>{"-"}</span>
              </div>
              <div className="conflict-msg">
                {Array.isArray(ele?.conflicts) && ele.conflicts.length > 0 ? (
                  <div style={{ whiteSpace: "pre-line" }}>
                    There are conflicts : {getConflictString(ele.conflicts)}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewRoundsWithConflict;
