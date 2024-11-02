import { URL, makeRequest } from "./main";

export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/s/getInstructor`, reqBody, token, config);
};
export const deleteStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/s/deleteInstructor`, reqBody, token, config);
};

export const createStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/s/createInstructor`, reqBody, token, config);
};

export const editStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/s/updateInstructor`, reqBody, token, config);
};

export const searchStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/s/getInstructor`, reqBody, token, config);
};

export const restoreStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/s/updateInstructor`, reqBody, token, config);
};

// get branches

export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);

// get courses
export const getCoursesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/course/getCourse`, reqBody, token, config);

// get rounds

export const getRoundsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/round/getRound`, reqBody, token, config);
};
