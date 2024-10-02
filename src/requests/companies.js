import { URL, makeRequest } from "./main";

export const getCompaniesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/company/getCompany`, reqBody, token, config);
};

// Add new company
export const createCompanyFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/createCompany`, reqBody, token, config);
};

//  Edit company
export const editCompanyFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/updateCompany`, reqBody, token, config);
};
// delete company
export const deleteCompanyFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/deleteCompany`, reqBody, token, config);
};

// get company contacts list

export const getCompanyContactsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/contact/getContact`, reqBody, token, config);
};

// get company branches
export const getCompanyBranchesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
};

// search companies
export const searchCompaniesFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/getCompany`, reqBody, token, config);
};

// restore deleted company
export const restoreCompanyFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/updateCompany`, reqBody, token, config);
};

// countries
export const getCountriesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/country/getCountry`, reqBody, token, config);
// provence
export const getProvincesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/provence/getProvence`, reqBody, token, config);

// citites
export const getCitiesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/city/getCity`, reqBody, token, config);
