import { useState, useContext } from "react";
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

// context
import { AppContext } from "./contexts/AppContext";
import { UserContext } from "./contexts/UserContext";
import AttendancePage from "./pages/AttendancePage";
import StudentAttendance from "./components/attendance/StudentAttendance";
import InstructorAttendace from "./components/attendance/InstructorAttendace";

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

          {/* //------------------- attendance-------------------------------------- */}
          <Route path="/attendance" element={<AttendancePage></AttendancePage>}>
            <Route
              path="/attendance/students"
              element={<StudentAttendance></StudentAttendance>}
            ></Route>
            <Route
              path="/attendance/students/:studentId"
              element={<StudentAttendance></StudentAttendance>}
            ></Route>

            <Route
              path="/attendance/instructors"
              element={<InstructorAttendace></InstructorAttendace>}
            ></Route>
            <Route
              path="/attendance/instructors/:instructorId"
              element={<InstructorAttendace></InstructorAttendace>}
            ></Route>
          </Route>

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
