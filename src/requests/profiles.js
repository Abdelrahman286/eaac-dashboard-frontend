import { URL, makeRequest } from "./main";

export const getProfilesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/user/getUser`, reqBody, token, config);
};

export const editProfileFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/user/updateUser`, reqBody, token, config);
};

// get branches
export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
