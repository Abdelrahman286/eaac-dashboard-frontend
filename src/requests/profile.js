import { URL, makeRequest } from "./main";

export const getProfileData = (reqBody, token, config) => {
  return makeRequest(`${URL}/user/getUser`, reqBody, token, config);
};

export const editProfileFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/user/updateUser`, reqBody, token, config);
};

// countries
export const getCountriesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/country/getCountry`, reqBody, token, config);

// branches
export const getCompanyBranchesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
};
