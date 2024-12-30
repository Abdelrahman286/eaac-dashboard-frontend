import React, { useState, useEffect, lazy, Suspense, useContext } from "react";
import { Tabs, Tab, CircularProgress, Box } from "@mui/material";

import LoadingSpinner from "../components/LoadingSpinner";
const CoursesList = lazy(() => import("../components/courses/CoursesList"));
const CategoriesList = lazy(() =>
  import("../components/courseCategories/CategoriesList")
);

import { UserContext } from "../contexts/UserContext";

import { useLocation, useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const { hasPermission, userPermissionsLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Simulate loading time when switching tabs
  const handleTabChange = (event, newValue) => {
    setLoading(true); // Start loading
    setSelectedTab(newValue);

    // Simulate a delay for loading, e.g., 500ms
    setTimeout(() => {
      setLoading(false); // Stop loading after a short delay
    }, 400);
  };

  // redirect if user does not have permission
  useEffect(() => {
    if (!hasPermission("View Courses List") && !userPermissionsLoading) {
      navigate("/");
    }
  }, []);

  return (
    <div className="courses-page">
      <Suspense fallback={<LoadingSpinner />}>
        {/* MUI Tabs to switch between components */}
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Courses" />
          <Tab label="Categories" />
        </Tabs>

        {/* Show loading spinner or content based on loading state */}
        <div>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {selectedTab == 0 && <CoursesList />}
              {selectedTab == 1 && <CategoriesList />}
            </>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default CoursesPage;
