import { URL, makeRequest } from "./main";

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

export const postStudentAttendanceFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/attend/clientAttendance`, reqBody, token, config);
};

export const postInstructorAttendanceFn = ({reqBody, token, config}) => {
  return makeRequest(
    `${URL}/attend/instructorAttendance`,
    reqBody,
    token,
    config
  );
};
