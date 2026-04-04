import API from "../api/axios";

export const loginUser = async (email, password) => {
  const { data } = await API.post("/auth/login", {
    email,
    password,
  });
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
