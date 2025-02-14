import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import "../../../styles/accounting.css";
// MUI
import { Box, TextField, Autocomplete, Button } from "@mui/material";

// icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// contexts
import { UserContext } from "../../../contexts/UserContext";

// utils
import {
  getCompanyBranchesFn,
  getPaymentMethodsFn,
} from "../../../requests/financialReports";

// utils
import { getDataForTableRows } from "../../../utils/tables";

// components
import Report from "./ReportModal";
import Modal from "../../Modal";

const Header = ({ onFilterChange }) => {
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [filterDataView, setFilterDataView] = useState({});

  const [showReport, setShowReport] = useState(false);

  const handleFilters = () => {
    onFilterChange(formData);
  };

  // payment methods (Method_en)
  const { data: paymentMethodsList, isLoading: paymentMethodLoading } =
    useQuery({
      queryFn: () => {
        return getPaymentMethodsFn(
          {
            numOfElements: "2000",
          },
          token,
          { isFormData: false }
        );
      },

      queryKey: ["paymentMethods"],
    });
  const paymentMethods = getDataForTableRows(
    paymentMethodsList?.success?.response?.data
  );

  // Branches
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getCompanyBranchesFn(
        {
          numOfElements: "2000",
          companyId: 1,
        },
        token,
        { isFormData: true }
      );
    },

    queryKey: ["companyBranches"],
  });
  const branches = getDataForTableRows(branchesList?.success?.response?.data);

  return (
    <div className="header-wrapper">
      {showReport && (
        <Modal onClose={() => setShowReport(false)}>
          <Report
            filterData={formData}
            filterDataView={filterDataView}
            onClose={() => setShowReport(false)}
          ></Report>
        </Modal>
      )}

      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            gap: 1,
          }}
        >
          {/* Branches dropdown */}

          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              loading={branchesLoading}
              value={
                branches.find((item) => item.id == formData?.branchId) || null
              }
              onChange={(e, value) => {
                setFilterDataView({
                  ...filterDataView,
                  branchId: value?.Name_en,
                });
                setFormData({ ...formData, branchId: value?.id });
              }}
              options={branches}
              getOptionLabel={(option) => option?.Name_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  id="branches"
                  {...params}
                  label="Braches"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "200px" }}>
            <Autocomplete
              loading={paymentMethodLoading}
              value={
                paymentMethods.find(
                  (item) => item.id == formData?.paymentMethodId
                ) || null
              }
              onChange={(e, value) => {
                setFilterDataView({
                  ...filterDataView,
                  paymentMethodId: value?.Method_en,
                });
                setFormData({ ...formData, paymentMethodId: value?.id });
              }}
              options={paymentMethods}
              getOptionLabel={(option) => option.Method_en || ""}
              size="small"
              renderInput={(params) => (
                <TextField
                  id="paymentMethod"
                  {...params}
                  label="Payment Method"
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            value={formData?.startDate || ""}
            onChange={(e) => {
              setFormData({ ...formData, startDate: e.target.value || "" });
            }}
            size={"small"}
            label="Start Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            value={formData?.endDate || ""}
            onChange={(e) => {
              setFormData({ ...formData, endDate: e.target.value || "" });
            }}
            size={"small"}
            label="End Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            onClick={handleFilters}
            variant="contained"
            color="primary"
            sx={{
              height: "40px",
              padding: 0,
              margin: 0,
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Row 3 - Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 2,
            justifyContent: { sm: "flex-end" },
            marginLeft: "auto",

            width: {
              xs: "100%",
              sm: "100%",
              md: "70%",
              lg: "50%",
            },
          }}
        >
          <Button
            onClick={() => setShowReport(true)}
            size="small"
            variant="contained"
            color="success"
            startIcon={<PictureAsPdfIcon />}
            sx={{
              minWidth: "180px",
              paddingY: 0.1,
              height: "40px",
              padding: "16px 4px",
              borderRadius: "20px",
            }}
          >
            Show PDF Report
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Header;
