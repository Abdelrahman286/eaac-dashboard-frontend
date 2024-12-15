import { URL, makeRequest } from "./main";

export const getGeneralStats = (reqBody, token, config) => {
  return makeRequest(`${URL}/dashboard/generalStats`, reqBody, token, config);
};

export const getFinancialStats = (reqBody, token, config) => {
  return makeRequest(`${URL}/dashboard/financialStats`, reqBody, token, config);
};

export const getNotifications = (reqBody, token, config) => {
  return makeRequest(`${URL}/dashboard/notification`, reqBody, token, config);
};
