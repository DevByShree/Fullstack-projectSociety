import API from "./api";

// LOGIN
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// SIGNUP
export const signupUser = (data) => {
  return API.post("/auth/register", data);
};
