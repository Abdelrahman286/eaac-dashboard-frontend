import { URL, makeRequest } from "./main";

export const getReceiptsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getBills`, reqBody, token, config);
};

// edit membership
export const editReceiptNote = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/payment/updateBillNotes`, reqBody, token, config);
};

// get students
export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};

// get receipt types

export const getReceiptTypes = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentTypes`, reqBody, token, config);
};
