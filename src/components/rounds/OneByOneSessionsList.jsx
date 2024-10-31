import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../utils/functions";

import { convertTo12HourFormat } from "../../utils/functions";
const OneByOneSessionsList = ({ data, handleDeleteRow, conflictArray }) => {
  //   console.log(conflictArray);
  // Add index for array objects
  let arrayWithIndex = data.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

  const getConflictMessage = (date, startTime, endTime) => {
    // 2024-10-10 13:46 22:46
    const conflictRecord = conflictArray.find((ele) => {
      return (
        ele.start.split(" ")[0] == date &&
        ele.start.split(" ")[1].slice(0, -3) == startTime &&
        ele.end.split(" ")[1].slice(0, -3) == endTime
      );
    });

    let combinedConflictString = "";

    // Check if conflict exists
    if (
      Array.isArray(conflictRecord?.conflicts) &&
      conflictRecord.conflicts.length > 0
    ) {
      conflictRecord.conflicts.forEach((ele) => {
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

        combinedConflictString += `At (${sessionDate}) from (${startTime}) to (${endTime}) at ${conflictString} \n\n`;
      });
    }

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
        <span>Controls</span>
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
                <span>{ele?.sessionName}</span>
                <span>{formatDate(ele?.sessionDate)}</span>
                <span>
                  {convertTo12HourFormat(`${ele?.sessionStartTime}:00`)}
                </span>
                <span>
                  {convertTo12HourFormat(`${ele?.sessionEndTime}:00`)}
                </span>
                <span>{ele?.sessionDescription}</span>
                <span>{`${ele?.sessionRoomId?.Name_en} (${ele?.sessionRoomId?.RoomCode})`}</span>
                <span>{ele?.instructorId?.Name}</span>
                <span>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    disableRipple
                    color="error"
                    onClick={() => handleDeleteRow(ele?.rowIndex - 1)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </div>
              <div className="conflict-msg">
                <p
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "pre-line",
                  }}
                  className="invalid-message"
                >
                  {getConflictMessage(
                    ele?.sessionDate,
                    ele?.sessionStartTime,
                    ele?.sessionEndTime
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OneByOneSessionsList;
