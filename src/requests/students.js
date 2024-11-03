import { URL, makeRequest } from "./main";

// get student data (JSON)
export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};

// delete student data (Form Data)
export const deleteStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/user/deleteUser`, reqBody, token, config);
};

// From Data
export const createStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/user/createUser`, reqBody, token, config);
};
// Form Data
export const editStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/user/updateUser`, reqBody, token, config);
};

// JSON
export const searchStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};

// restore deleted student (Form Data)
export const restoreStudentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/user/updateUser`, reqBody, token, config);
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

// get payment methods

export const getPaymentMethodsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentMethod`, reqBody, token, config);
};

// get promo codes

export const getPromoCodes = (reqBody, token, config) => {
  return makeRequest(`${URL}/discount/getDiscount`, reqBody, token, config);
};
