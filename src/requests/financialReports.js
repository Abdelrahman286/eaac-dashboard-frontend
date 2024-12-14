import { URL, makeRequest } from "./main";

// expenses report
export const getExpensesReport = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getExpenses`, reqBody, token, config);
};

// revenue report
export const getRevenueReport = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getTotalRevenue`, reqBody, token, config);
};

// Refund report
export const getRefundReport = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getTotalRefunds`, reqBody, token, config);
};
// dailt Movements report
export const getDailyMovementsReport = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getDailyPayments`, reqBody, token, config);
};

//---------------- Utils-------------------------------------------------------
// get payment methods
export const getPaymentMethodsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentMethod`, reqBody, token, config);
};
// get company branches
export const getCompanyBranchesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
};

// get students
export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};
