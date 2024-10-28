import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
const Modal = ({ onClose, children, title, actionBar = "", classNames }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fade-in-animation">
      <div onClick={onClose} className={`fixed-inset-gray-opacity`}>
        <div
          className={`fixed-inset-40-padded-flex  ${classNames} `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="close-modal">
              <Tooltip title="Close">
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>

            <div className="title">
              {/* <h2>{title}</h2> */}

              <Typography variant="h6" align="center" fontWeight={400}>
                {title}
              </Typography>
            </div>
          </div>

          <div className="modal-content">{children}</div>

          {/* <div className="actions flex justify-end">{actionBar}</div> */}
        </div>
      </div>
    </div>,
    document.getElementById("modal-container")
  );
};

export default Modal;
