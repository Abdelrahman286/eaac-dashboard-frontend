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

// Add contact
export const addContactFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/contact/createContact`, reqBody, token, config);
};

// update Contact contact/updateContact
export const editContactFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/contact/updateContact`, reqBody, token, config);
};

// get company branches
export const getCompanyBranchesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
};

// Add branch
export const addBranchFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/branch/createBranch`, reqBody, token, config);
};

// Delete branch
export const deletBranchFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/branch/deleteBranch`, reqBody, token, config);
};

// update Contact contact/updateContact
export const editBranchFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/branch/updateBranch`, reqBody, token, config);
};

//-------------------------------------------------------------------

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

// get attachmetns
export const getCompanyAttachmentsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/company/getAttach`, reqBody, token, config);
};

// delete Attachements
export const deleteAttachmentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/updateAttach`, reqBody, token, config);
};

// add attachment
export const addAttachmentFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/company/createAttach`, reqBody, token, config);
};
