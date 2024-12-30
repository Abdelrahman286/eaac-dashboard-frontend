export const getReportHeader = (attendanceData) => {
  let userData = attendanceData[0]?.userData;

  // Return early if userData is not an array or is empty
  if (!Array.isArray(userData) || userData.length == 0) {
    return null; // or any default value you prefer
  }

  // Find the first user record with a non-empty Attendance array
  const header = userData.find(
    (ele) => Array.isArray(ele?.Attendance) && ele.Attendance.length > 0
  )?.Attendance;

  return header || null;
};
