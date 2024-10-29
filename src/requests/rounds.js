import { URL, makeRequest } from "./main";

export const getRoundsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/round/getRound`, reqBody, token, config);
};
export const deleteRoundsFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/round/deleteRound`, reqBody, token, config);
};

export const createRoundFn = ({ reqBody, token, config }) => {
  console.log(reqBody);
  return makeRequest(`${URL}/round/createRound1`, reqBody, token, config);
};

export const EditRoundFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/round/updateRound`, reqBody, token, config);
};

export const searchRoundsFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/round/getRound`, reqBody, token, config);
};

export const restoreRoundsFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/round/updateRound`, reqBody, token, config);
};

// get branches
export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);

// get courses
export const getCoursesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/course/getCourse`, reqBody, token, config);

// get rooms
export const getRoomsFn = (reqBody, token, config) =>
  makeRequest(`${URL}/room/getRoom`, reqBody, token, config);

// get instructors
export const getInstructorsFn = (reqBody, token, config) =>
  makeRequest(`${URL}/instructor/getInstructor`, reqBody, token, config);

// get sessions
export const getSessionsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/session/getSession`, reqBody, token, config);
};

// update session
export const updateSessionFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/session/updateSession`, reqBody, token, config);
};

// check session conflict

export const checkSessionConflictFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/round/getSessionDateTimesOneByOne`,
    reqBody,
    token,
    config
  );
};
