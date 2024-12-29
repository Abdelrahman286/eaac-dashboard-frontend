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

import DeleteConfirmation from "../DeleteConfirmation";
import Modal from "../Modal";

// requests
import { getNotifications } from "../../requests/home";

// utils
import { getDataForTableRows } from "../../utils/tables";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const confirmDelete = () => {
    queryClient.setQueryData(["notifications"], []);
    setShowDeleteModal(false);
  };
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
      {showDeleteModal && (
        <Modal title={""} onClose={() => setShowDeleteModal(false)}>
          <DeleteConfirmation
            closeFn={() => setShowDeleteModal(false)}
            deleteFn={confirmDelete}
            deleteMessage={"Are you sure you want to delete Notifications ?"}

            // isLoading={deleteLoading}
          ></DeleteConfirmation>
        </Modal>
      )}
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
        <AccordionDetails
          sx={{
            height: "40vh",
            overflowY: "auto",
            overflowX: "hidden",

            "&::-webkit-scrollbar": {
              width: "6px", // Width of the scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.4)", // Color of the scrollbar thumb
              borderRadius: "3px", // Rounded corners
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker on hover
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // Track color
            },
          }}
        >
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
                  <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
                    {/* Buttons for Attendance */}
                    <Button
                      sx={{
                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                        },
                      }}
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
                      Students Attendance
                    </Button>
                    <Button
                      sx={{
                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                        },
                      }}
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
                      Instructor Attendance
                    </Button>
                  </Box>

                  {/* Time */}
                  <Typography variant="caption" color="text.secondary">
                    {note?.created_at}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Clear History */}
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
                alignItems: "center",
              }}
              onClick={() => {
                setShowDeleteModal(true);
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
            </Box> */}
          </Card>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Notifications;
