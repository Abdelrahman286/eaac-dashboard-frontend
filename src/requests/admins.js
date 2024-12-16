import { URL, makeRequest } from "./main";

export const getAdminFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/admin/getAdmin`, reqBody, token, config);
};

export const createAdminFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/admin/createAdmin`, reqBody, token, config);
};

export const editAdminFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/admin/updateAdmin`, reqBody, token, config);
};

// get permissions list (Form Data)
export const getPermissionsList = (reqBody, token, config) => {
  return makeRequest(`${URL}/permission/getPermission`, reqBody, token, config);
};
// get user permissions (form data)
export const getAdminPermissions = (reqBody, token, config) => {
  return makeRequest(
    `${URL}/permission/getUserPermission`,
    reqBody,
    token,
    config
  );
};
// edit user permisssions  (json)
export const editUserPermissions = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/permission/addUserPermission`,
    reqBody,
    token,
    config
  );
};

// get branches
export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
