import { URL, makeRequest } from "./main";

export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};
