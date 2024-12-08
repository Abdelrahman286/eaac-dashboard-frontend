import { URL, makeRequest } from "./main";

//------------------ Coupons ---------------------------------------

export const getPromoCodesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/discount/getDiscount`, reqBody, token, config);
};
export const createPromoCodeFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/discount/createDiscountVoucher`,
    reqBody,
    token,
    config
  );
};

export const updatePromoCodeFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/discount/updateDiscountVoucher`,
    reqBody,
    token,
    config
  );
};

//------------------- Payment Methods ------------------------------

export const getPyamentMethodsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentMethod`, reqBody, token, config);
};
export const createPaymentMethodFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/payment/createPaymentMethod`,
    reqBody,
    token,
    config
  );
};

export const updatePaymentMethodFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/payment/updatePaymentMethod`,
    reqBody,
    token,
    config
  );
};
//----------------- Expenses Types --------------------------------

export const getExpensesTypesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/expense/getExpenseType`, reqBody, token, config);
};
export const createExpensesTypeFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/expense/createExpenseType`,
    reqBody,
    token,
    config
  );
};

export const updateExpensesTypeFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/expense/updateExpenseType`,
    reqBody,
    token,
    config
  );
};

// get branches
export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
