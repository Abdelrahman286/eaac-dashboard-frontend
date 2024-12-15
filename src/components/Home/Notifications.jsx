import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// requests
import { getNotifications } from "../../requests/home";

// utils
import { getDataForTableRows } from "../../utils/tables";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
const Notifications = () => {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  // general stats
  const { data: notificationsList, isLoading: notificationsLoading } = useQuery(
    {
      queryFn: () => {
        return getNotifications({}, token);
      },

      queryKey: ["notifications"],
    }
  );
  const notifications = getDataForTableRows(
    notificationsList?.success?.response?.data
  );

  return (
    <Box
      sx={{
        padding: 2,
        background: "white",
        boxSizing: "border-box",
        width: "100%",
        borderRadius: "12px",
        marginBottom: "12px",
      }}
    >
      {/* Accordion for Notifications */}
      <Accordion sx={{ boxShadow: 2, borderRadius: "12px" }}>
        {/* Accordion Summary */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="notifications-content"
          id="notifications-header"
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Notifications
          </Typography>
        </AccordionSummary>

        {/* Accordion Details */}
        <AccordionDetails>
          <Card variant="outlined" sx={{ width: "100%" }}>
            {/* Notification List */}
            {notifications.map((note, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderBottom:
                    index !== notifications.length - 1
                      ? "1px solid #ddd"
                      : "none",
                }}
              >
                {/* Notification Details */}
                <Box>
                  <Typography variant="body2">
                    <strong>{note?.RoundID?.RoundCode || ""}</strong> |{" "}
                    {note?.RoundID?.Name_en || ""} | {note?.RoomID?.RoomCode} |{" "}
                    {note?.InstructorID?.Name} | {note?.numOfStudents} Student{" "}
                    <strong>Attendance</strong>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {/* Buttons for Attendance */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<CalendarMonthIcon />}
                      onClick={() =>
                        navigate(
                          `/attendance/students?paramsRound=${note?.RoundID?.id}1`
                        )
                      }
                    >
                      Submit Students Attendance
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<CalendarMonthIcon />}
                      onClick={() =>
                        navigate(
                          `/attendance/instructors?paramsRound=${note?.RoundID?.id}1`
                        )
                      }
                    >
                      Submit Instructor Attendance
                    </Button>
                  </Box>
                </Box>

                {/* Time */}
                <Typography variant="caption" color="text.secondary">
                  {note?.created_at}
                </Typography>
              </Box>
            ))}

            {/* Clear History */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Clear All History
              </Typography>
              <IconButton color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Notifications;
