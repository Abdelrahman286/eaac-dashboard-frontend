import { URL, makeRequest } from "./main";

export const getExpensesFn = (reqBody, token, config) => {
  return makeRequest(
    `${URL}/payment/getMainAccountPayments`,
    reqBody,
    token,
    config
  );
};
export const addExpensesFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/payment/payExpense`, reqBody, token, config);
};

// get payment methods
export const getPaymentMethodsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentMethod`, reqBody, token, config);
};

// reconcile
export const reconcile = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/payment/reconcile`, reqBody, token, config);
};

// get expenses types

export const getExpensesTypesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/expense/getExpenseType`, reqBody, token, config);
};

// get vendors
export const getVendorsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/company/getCompany`, reqBody, token, config);
};
