import { useState, useContext, lazy, Suspense } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import Settings from "./pages/Settings";

import CompaniesPage from "./pages/CompaniesPage";
import CoursesPage from "./pages/CoursesPage";
import RoomsPage from "./pages/RoomsPage";
import HomePage from "./pages/HomePage";
import Components from "./pages/Components";
import InstructorsPage from "./pages/InstructorsPage";
import RoundsPage from "./pages/RoundsPage";
import StudentsPage from "./pages/StudentsPage";
import Memebership from "./pages/Memebership";

// lazy loaded pages
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const StudentAttendance = lazy(() =>
  import("./components/attendance/student/StudentAttendance")
);
const InstructorAttendace = lazy(() =>
  import("./components/attendance/instructor/InstructorAttendace")
);

// context
import { AppContext } from "./contexts/AppContext";
import { UserContext } from "./contexts/UserContext";

// loader
import LoadingSpinner from "./components/LoadingSpinner";
function App() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* // ----- protected Routes ------ */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navbar></Navbar>
            ) : (
              <Navigate replace to={"/login"}></Navigate>
            )
          }
        >
          <Route path="/" element={<HomePage></HomePage>}></Route>

          <Route path="/courses" element={<CoursesPage></CoursesPage>}></Route>

          <Route
            path="/companies"
            element={<CompaniesPage></CompaniesPage>}
          ></Route>
          <Route path="/rooms" element={<RoomsPage></RoomsPage>}></Route>

          <Route
            path="/instructors"
            element={<InstructorsPage></InstructorsPage>}
          ></Route>

          <Route path="/rounds" element={<RoundsPage></RoundsPage>}></Route>

          <Route
            path="/students"
            element={<StudentsPage></StudentsPage>}
          ></Route>

          {/* //------------------- attendance-------------------------------------- */}
          <Route
            path="/attendance"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <AttendancePage></AttendancePage>
              </Suspense>
            }
          >
            <Route
              path="/attendance/students"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <StudentAttendance></StudentAttendance>
                </Suspense>
              }
            ></Route>
            <Route
              path="/attendance/students/:studentId"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <StudentAttendance></StudentAttendance>
                </Suspense>
              }
            ></Route>

            <Route
              path="/attendance/instructors"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <InstructorAttendace></InstructorAttendace>
                </Suspense>
              }
            ></Route>
            <Route
              path="/attendance/instructors/:instructorId"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <InstructorAttendace></InstructorAttendace>
                </Suspense>
              }
            ></Route>
          </Route>

          <Route
            path="/membership"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <Memebership></Memebership>
              </Suspense>
            }
          ></Route>

          <Route path="/settings" element={<Settings></Settings>}></Route>
        </Route>

        <Route
          path="/login"
          element={isLoggedIn ? <Navigate replace to="/" /> : <LoginPage />}
        />

        {/* <Route path="/login" element={<LoginPage></LoginPage>}></Route> */}
        <Route path="/test" element={<Components></Components>}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
