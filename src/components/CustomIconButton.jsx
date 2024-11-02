import React from "react";
import { IconButton, Tooltip } from "@mui/material";

// Import all icons
import addIcon from "../assets/icons/add-btn.png";
import attendanceIcon from "../assets/icons/attendance-btn.png";
import blockUserIcon from "../assets/icons/block-user-btn.png";
import deleteIcon from "../assets/icons/delete-btn.png";
import editIcon from "../assets/icons/edit-btn.png";
import membershipsIcon from "../assets/icons/memberships-btn.png";
import paymentsIcon from "../assets/icons/payments-btn.png";
import restoreIcon from "../assets/icons/restore-btn.png";
import roundsClassesIcon from "../assets/icons/rounds-classes-btn.png";
import viewIcon from "../assets/icons/view-btn.png";
import enroll from "../assets/icons/enroll.png";

import attended from "../assets/icons/attended.png";
import absent from "../assets/icons/absent.png";

// Create a mapping of icon names to their respective image paths
const iconMap = {
  add: addIcon,
  attendance: attendanceIcon,
  blockUser: blockUserIcon,
  delete: deleteIcon,
  edit: editIcon,
  memberships: membershipsIcon,
  payments: paymentsIcon,
  restore: restoreIcon,
  roundsClasses: roundsClassesIcon,
  view: viewIcon,
  enroll: enroll,
  attended: attended,
  absent: absent,
};

const CustomIconButton = ({ icon, title, onClick, ...props }) => {
  return (
    <Tooltip title={title || ""}>
      <IconButton onClick={onClick} {...props}>
        {icon && (
          <img
            src={iconMap[icon]}
            alt={`${icon} icon`}
            style={{ width: "24px", height: "24px" }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;
