import { URL, makeRequest } from "./main";

export const getCoursesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/course/getCourse`, reqBody, token, config);
};
export const deleteCourseFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/course/deleteCourse`, reqBody, token, config);
};

// Add new Course
export const createCourseFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/course/createCourse`, reqBody, token, config);
};

//  Edit Course
export const editCourseFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/course/updateCourse`, reqBody, token, config);
};

// search companies
export const searchCoursesFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/course/getCourse`, reqBody, token, config);
};

// restore deleted company
export const restoreCourseFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/course/updateCourse`, reqBody, token, config);
};

// get branches

export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);

// get  gategories
export const getCategoriesFn = (reqBody, token, config) =>
  makeRequest(
    `${URL}/courseCategory/getCourseCategory`,
    reqBody,
    token,
    config
  );
