import { useState, useContext, lazy, Suspense } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";

import CompaniesPage from "./pages/CompaniesPage";
import CoursesPage from "./pages/CoursesPage";
import RoomsPage from "./pages/RoomsPage";
import HomePage from "./pages/HomePage";
import Components from "./pages/Components";
import InstructorsPage from "./pages/InstructorsPage";
import RoundsPage from "./pages/RoundsPage";
import StudentsPage from "./pages/StudentsPage";

// lazy loaded pages
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const StudentAttendance = lazy(() =>
  import("./components/attendance/student/StudentAttendance")
);
const InstructorAttendace = lazy(() =>
  import("./components/attendance/instructor/InstructorAttendace")
);

const Memebership = lazy(() => import("./pages/Memebership"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminsPage = lazy(() => import("./pages/AdminsPage"));
const ReceiptsPage = lazy(() => import("./pages/ReceiptsPage"));

// Accounting
const AccountingPage = lazy(() => import("./pages/AccountingPage"));
const ClientPaymentsPage = lazy(() =>
  import("./components/Accounting/Client-payments/ClientPayments")
);
const AccountPaymentsPage = lazy(() =>
  import("./components/Accounting/Account-payments/AccountPaymentsPage")
);

// Settings
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CouponsPage = lazy(() =>
  import("./components/settings/coupons/CouponsPage")
);
const PaymentMethodsPage = lazy(() =>
  import("./components/settings/PaymentMethods/PaymentMethods")
);
const ExpensesTypesPage = lazy(() =>
  import("./components/settings/ExpensesTypes/ExpensesPage")
);

// Financial Reports
const FinancialReportsPage = lazy(() => import("./pages/FinancialReportsPage"));
const AccountMovementsPage = lazy(() =>
  import("./components/financialReports/account-movements/AccountMovementsPage")
);
const ClientBalance = lazy(() =>
  import("./components/financialReports/client-balance/ClientBalance")
);
const Expenses = lazy(() =>
  import("./components/financialReports/expenses/Expenses")
);
const Revenue = lazy(() =>
  import("./components/financialReports/Revenue/Revenue")
);
const Refund = lazy(() =>
  import("./components/financialReports/refund/Refund")
);
const DailyMovements = lazy(() =>
  import("./components/financialReports/daily-movements/DailyMovements")
);

// Profiles page

const Profiles = lazy(() => import("./pages/Profiles"));

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

          <Route
            path="/profile"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <ProfilePage></ProfilePage>
              </Suspense>
            }
          ></Route>

          <Route
            path="/admins"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <AdminsPage></AdminsPage>
              </Suspense>
            }
          ></Route>

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

          {/* ------------------ profiles page ------------ */}
          <Route
            path="/profiles"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <Profiles></Profiles>
              </Suspense>
            }
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

          {/* --------------------- Accounting ---------------------- */}
          <Route
            path="/accounting"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <AccountingPage></AccountingPage>
              </Suspense>
            }
          >
            <Route
              path="/accounting/client-payments"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <ClientPaymentsPage></ClientPaymentsPage>
                </Suspense>
              }
            ></Route>

            <Route
              path="/accounting/account-payments"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <AccountPaymentsPage></AccountPaymentsPage>
                </Suspense>
              }
            ></Route>
          </Route>

          <Route
            path="/receipts"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <ReceiptsPage></ReceiptsPage>
              </Suspense>
            }
          ></Route>

          {/* ---------------- settings ------------------------  */}
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <SettingsPage></SettingsPage>
              </Suspense>
            }
          >
            <Route
              path="/settings/coupons"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <CouponsPage></CouponsPage>
                </Suspense>
              }
            ></Route>

            <Route
              path="/settings/payment-methods"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <PaymentMethodsPage></PaymentMethodsPage>
                </Suspense>
              }
            ></Route>

            <Route
              path="/settings/expenses-types"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <ExpensesTypesPage></ExpensesTypesPage>
                </Suspense>
              }
            ></Route>
          </Route>

          {/* ---------------- Financial Reports ------------------------  */}
          <Route
            path="/financial-reports"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <FinancialReportsPage></FinancialReportsPage>
              </Suspense>
            }
          >
            <Route
              path="/financial-reports/account-movements"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <AccountMovementsPage></AccountMovementsPage>
                </Suspense>
              }
            ></Route>

            <Route
              path="/financial-reports/client-balance"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <ClientBalance></ClientBalance>
                </Suspense>
              }
            ></Route>

            <Route
              path="/financial-reports/expenses"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <Expenses></Expenses>
                </Suspense>
              }
            ></Route>

            <Route
              path="/financial-reports/revenue"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <Revenue></Revenue>
                </Suspense>
              }
            ></Route>

            <Route
              path="/financial-reports/daily-movements"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <DailyMovements></DailyMovements>
                </Suspense>
              }
            ></Route>

            <Route
              path="/financial-reports/refund"
              element={
                <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                  <Refund></Refund>
                </Suspense>
              }
            ></Route>
          </Route>

          <Route
            path="/receipts"
            element={
              <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
                <ReceiptsPage></ReceiptsPage>
              </Suspense>
            }
          ></Route>
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
