import React, { useState, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// contexts
import { AppContext } from "../contexts/AppContext";
import { UserContext } from "../contexts/UserContext";
// requests
import { getRoundsFn } from "../requests/students";

// utils
import { getDataForTableRows } from "../utils/tables";
import SearchableDropdown from "../components/SearchableDropdown";

const EnrollTab = () => {
  const handleRoundSelect = (selectedRound) => {
    console.log("Selected round:", selectedRound);
  };

  const testValue = {
    id: 14,
    Name_ar: "Test Course 4",
    Name_en: "Test Round 1",
    RoundCode: "Test Round 001",
    NumberOfSessions: 27,
    StartDate: "2024-10-10 13:34:28",
    EndDate: "2025-10-11 13:34:28",
    AttendancePercentage: null,
    CourseID: {
      id: 32,
      Name_en: "test course 70",
      Description_en: "111",
      CourseCode: "857435",
      MemberPrice: 11,
      NonMemberPrice: 11,
      CourseCategoryID: {
        id: 2,
        Name_en: "IT",
        Description_en: "IT..",
        ParentID: null,
        created_at: "2024-09-14 04:20:42",
      },
      SubCategoryID: {
        id: 1,
        Name_en: "Management",
        Description_en: "ادارة",
        ParentID: 2,
        created_at: "2024-09-14 04:18:44",
      },
      created_at: "2024-09-19 13:55:32",
    },
    StatusID: {
      id: 1,
      Name_en: "Active",
      created_at: "2024-08-28 02:07:41",
    },
    RoomID: {
      id: 1,
      Name_en: "1floorRoom1",
      Description_en: "الدور الاول الغرفة يمين السلم المبني الرئيسي",
      RoomCode: "Room0001",
      Capacity: 30,
      created_at: "2024-09-12 15:42:03",
    },
    InstructorID: {
      id: 10,
      Name: "Test Instructor",
      Email: "instructor2@test.com",
      PhoneNumber: "01122334455",
      created_at: "2024-10-13 15:48:24",
    },
    BranchID: {
      id: 1,
      Name_en: "All",
      Description_en: "",
      BranchCode: "All",
      created_at: "2024-09-10 22:44:04",
    },
    created_at: "2024-10-21 16:34:28",
    updated_at: "2024-10-28 23:54:42",
  };

  return (
    <Box sx={{ padding: 2 }}>
      test search
      <SearchableDropdown
        defaultValue={testValue}
        isFromData={false}
        // requestParams={{ studentId: 1 }}
        label="Round"
        fetchData={getRoundsFn}
        queryKey="rounds"
        getOptionLabel={(option) => `${option.Name_en}`}
        getOptionId={(option) => option.id} // Custom ID field
        onSelect={handleRoundSelect}
        initialValue={testValue} // New initial value prop
      ></SearchableDropdown>
    </Box>
  );
};

export default EnrollTab;
