import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../utils/functions";
const OneByOneSessionsList = ({ data, handleDeleteRow }) => {
  // Add index for array objects
  let arrayWithIndex = data.map((item, index) => ({
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
                <span>{ele?.sessionStartTime}</span>
                <span>{ele?.sessionEndTime}</span>
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
              <div className="conflict-msg"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OneByOneSessionsList;
