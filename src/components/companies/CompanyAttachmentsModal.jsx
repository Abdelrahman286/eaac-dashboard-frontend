import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";

import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
import { getDataForTableRows } from "../../utils/tables";

// Request functions
import {
  getCompanyAttachmentsFn,
  addAttachmentFn,
  deleteAttachmentFn,
} from "../../requests/companies";

const CompanyAttachmentsModal = ({ rowData }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  // State to store the selected file
  const [file, setFile] = useState(null);

  // Fetch company attachments
  const {
    data: attachmentsObj,
    isLoading: getLoading,
    isError: getError,
  } = useQuery({
    queryFn: () => {
      return getCompanyAttachmentsFn(
        {
          numOfElements: "2000",
          companyId: rowData?.id,
        },
        token,
        {
          isFormData: true,
        }
      );
    },
    enabled: !!rowData?.id,
    retry: 2,
    queryKey: ["companyAttachments", rowData?.id],
  });

  // Transform data to return arrays
  const attachments = getDataForTableRows(
    attachmentsObj?.success?.response?.data
  );

  // Add attachment mutation
  const { mutate: addAttachment, isLoading: addLoading } = useMutation({
    onError: () => {
      showSnackbar("Failed to Add Attachment", "error");
    },
    mutationFn: addAttachmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyAttachments"]);
      setFile(null); // Clear file after successful upload
      showSnackbar("Attachment Added Successfully", "success");
    },
  });

  // Delete attachment mutation
  const { mutate: deleteAttachment } = useMutation({
    onError: () => {
      showSnackbar("Failed to Delete Attachment", "error");
    },
    mutationFn: deleteAttachmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyAttachments"]);
      showSnackbar("Attachment Deleted Successfully", "success");
    },
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAdd = () => {
    if (file) {
      addAttachment({
        reqBody: {
          attach: [file],
          companyId: rowData.id,
        },
        token,
        config: {
          isFormData: true,
        },
      });
    } else {
      showSnackbar("Please select a file to upload", "error");
    }
  };

  const handleDelete = (attachmentId) => {
    deleteAttachment({
      reqBody: {
        id: [attachmentId],
        statusId: 4,
      },
      token,
    });
  };

  return (
    <div style={{ minWidth: "450px" }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
          <Button
            color="success"
            variant="contained"
            startIcon={<UploadIcon />}
            component="label"
          >
            Upload
            <input type="file" accept="*" hidden onChange={handleFileChange} />
          </Button>
        </Box>

        {file && (
          <Typography variant="body2" sx={{ my: 1, textAlign: "center" }}>
            Selected File: {file.name}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
          {file && (
            <Button
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ ml: 2 }}
            >
              Add
            </Button>
          )}
        </Box>

        {getLoading && <LoadingSpinner height="100px" />}

        {getError && (
          <Typography variant="body2" sx={{ textAlign: "center", my: 2 }}>
            No Attachments Found
          </Typography>
        )}

        {attachments?.length !== 0 && (
          <List>
            {attachments.map((attachment) => (
              <ListItem
                key={attachment.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <a
                      href={attachment.Attach}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        maxWidth: "600px", // Set a maximum width for the link
                        whiteSpace: "nowrap", // Prevent the text from wrapping
                        overflow: "hidden", // Hide overflowing text
                        textOverflow: "ellipsis", // Add ellipsis for overflow
                      }}
                    >
                      {attachment.Attach || "Attachment"}
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
};

export default CompanyAttachmentsModal;
