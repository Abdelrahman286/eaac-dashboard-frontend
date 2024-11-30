import { URL, makeRequest } from "./main";

export const getUsersMemeberships = (reqBody, token, config) => {
  return makeRequest(
    `${URL}/membership/manageMembership`,
    reqBody,
    token,
    config
  );
};

// delete membership
export const deleteMemebershipFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/membership/updateUserMembersip`,
    reqBody,
    token,
    config
  );
};

// edit membership
export const editMembershipFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/membership/updateUserMembersip`,
    reqBody,
    token,
    config
  );
};

// renew membership
export const renewMembershipFn = ({ reqBody, token, config }) => {
  return makeRequest(
    `${URL}/membership/renewMembership`,
    reqBody,
    token,
    config
  );
};
// create memebership
export const createMemebershipFn = ({ reqBody, token, config }) => {
  return makeRequest(`${URL}/membership/newMembership`, reqBody, token, config);
};

// get payment methods
export const getPaymentMethodsFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/payment/getPaymentMethod`, reqBody, token, config);
};

// get students
export const getStudentFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/client/getClient`, reqBody, token, config);
};

// membership prices (student, lifeTime)
export const getMemebershipPricesFn = (reqBody, token, config) => {
  return makeRequest(`${URL}/membership/getMembership`, reqBody, token, config);
};
