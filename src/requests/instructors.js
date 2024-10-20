import { URL, makeRequest } from "./main";

export const getInstructorsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/instructor/getInstructor`, reqBody, token, config);
};
export const deleteInstructorsFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/instructor/deleteInstructor`,
    reqBody,
    token,
    config
  );
};

export const createInstrctorFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/instructor/createInstructor`,
    reqBody,
    token,
    config
  );
};
``;

export const editInstructorFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/instructor/updateInstructor`,
    reqBody,
    token,
    config
  );
};

export const searchInstructorFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/instructor/getInstructor`, reqBody, token, config);
};

export const restoreInstructorFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/instructor/updateInstructor`,
    reqBody,
    token,
    config
  );
};

// get branches

export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);

// get courses
export const getCoursesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/course/getCourse`, reqBody, token, config);
