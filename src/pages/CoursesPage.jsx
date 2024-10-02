import React, { useState, useEffect, lazy, Suspense } from "react";
import { Tabs, Tab, CircularProgress, Box } from "@mui/material";
// import CoursesList from "../components/courses/CoursesList";
// import CategoriesList from "../components/courseCategories/CategoriesList";

import LoadingSpinner from "../components/LoadingSpinner";
const CoursesList = lazy(() => import("../components/courses/CoursesList"));
const CategoriesList = lazy(() =>
  import("../components/courseCategories/CategoriesList")
);

const CoursesPage = () => {
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
              {selectedTab === 0 && <CoursesList />}
              {selectedTab === 1 && <CategoriesList />}
            </>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default CoursesPage;
