import { URL, makeRequest } from "./main";

export const getPaymentsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPayments`, reqBody, token, config);
};
export const addPayemntFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/payment/payPayment`, reqBody, token, config);
};

export const refundFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/payment/refundPayment`, reqBody, token, config);
};

// add correct movement
export const addCorrectMovements = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/payment/correctMovementNewValues`,
    reqBody,
    token,
    config
  );
};
// correct certain movement
export const correctCertainMovement = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/payment/correctMovement`, reqBody, token, config);
};

// get rounds
export const getRoundsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/round/getRound`, reqBody, token, config);
};

// get students
export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};

// get payment methods
export const getPaymentMethodsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentMethod`, reqBody, token, config);
};

// get course extras
export const getExtrasFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/extra/getExtra`, reqBody, token, config);
};
