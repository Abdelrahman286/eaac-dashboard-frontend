import { URL, makeRequest } from "./main";

export const getRoomsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/room/getRoom`, reqBody, token, config);
};
export const deleteRoomFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/room/deleteRoom`, reqBody, token, config);
};

// Add new Course
export const createRoomFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/room/createRoom`, reqBody, token, config);
};

//  Edit Course
export const editRoomFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/room/updateRoom`, reqBody, token, config);
};

// search companies
export const searchRoomsFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/room/getRoom`, reqBody, token, config);
};

// restore deleted company
export const restoreRoomFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/room/updateRoom`, reqBody, token, config);
};

// get branches

export const getBranchesFn = (reqBody, token, config) =>
  makeRequest(`${URL}/branch/getBranch`, reqBody, token, config);
