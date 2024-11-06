import { URL, makeRequest } from "./main";

//---------------- Student Attendance
export const getStudentsAttendanceFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/attend/getAttendance`, reqBody, token, config);
};

export const getInstructorsAttendanceFn = (reqBody, token, config) => {
  return makeRequest(
    `${URL}/attend/getInstructorAttendance`,
    reqBody,
    token,
    config
  );
};

export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};
export const getRoundsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/round/getRound`, reqBody, token, config);
};
export const getSessionsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/session/getSession`, reqBody, token, config);
};
export const getInstructorsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/instructor/getInstructor`, reqBody, token, config);
};
//---------------- Instructor Attendance
export const postStudentAttendanceFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/attend/clientAttendance`, reqBody, token, config);
};
export const postInstructorAttendanceFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/attend/instructorAttendance`,
    reqBody,
    token,
    config
  );
};
