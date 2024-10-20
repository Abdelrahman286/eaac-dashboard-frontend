import { URL, makeRequest } from "./main";

export const getRoundsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/round/getRound`, reqBody, token, config);
};
export const deleteRoundsFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/round/deleteRound`, reqBody, token, config);
};

export const createRoundFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/round/createRound`, reqBody, token, config);
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
