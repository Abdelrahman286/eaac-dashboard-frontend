import { URL, makeRequest } from "./main";

export const getCategoryFn = (reqBody, token, config) => {
  return makeRequest(
    `${URL}/courseCategory/getCourseCategory`,
    reqBody,
    token,
    config
  );
};
export const deleteCategoryFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/courseCategory/deleteCourseCategory`,
    reqBody,
    token,
    config
  );
};

// Add
export const createCategoryFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/courseCategory/createCourseCategory`,
    reqBody,
    token,
    config
  );
};

//  Edit
export const editCategoryFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/courseCategory/updateCourseCategory`,
    reqBody,
    token,
    config
  );
};

// search
export const searchCategoryFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/courseCategory/getCourseCategory`,
    reqBody,
    token,
    config
  );
};

// restore deleted
export const restoreCategoryFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/courseCategory/updateCourseCategory`,
    reqBody,
    token,
    config
  );
};

// get branches

export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
