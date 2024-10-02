import { URL, makeRequest } from "./main";

export const loginFn = (reqBody) => makeRequest(`${URL}/auth/login`, reqBody);
export const forgotPasswordFn = (reqBody) =>
  makeRequest(`${URL}/auth/forgetPassword`, reqBody);

export const resetPasswordFn = (reqBody) =>
  makeRequest(`${URL}/auth/resetPassword`, reqBody);
