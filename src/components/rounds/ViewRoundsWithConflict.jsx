import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// utils
import {
  convertTo12HourFormat,
  getConflictString,
} from "../../utils/functions";
const ViewRoundsWithConflict = ({ data, mainFormData }) => {
  // Add index for array objects
  const arrayWithIndex = data.map((item, index) => ({
    ...item,
    rowIndex: index + 1, // Add the index to each object
  }));

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
                <span>{ele?.room?.Name_en}</span>
                <span>{ele?.instructor?.Name}</span>
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
