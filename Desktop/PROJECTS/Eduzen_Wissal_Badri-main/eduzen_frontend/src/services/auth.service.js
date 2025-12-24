import axios from "axios";

const API_URL = "http://localhost:8096/api/auth/";

const login = (username, password) => {
  const token = btoa(username + ":" + password);
  return axios
    .get(API_URL + "me", {
      headers: {
        Authorization: "Basic " + token
      }
    })
    .then((response) => {
      if (response.data.username) {
        // Ensure role is handled if it's an object or string
        const roleData = response.data.role;
        // Optional: Flatten role if you want consistency in local storage, 
        // but since Dashboard now handles both, we can just save as is.
        // However, let's be robust.

        const user = {
          ...response.data,
          authdata: token
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data;
    });
};

const register = (username, email, password, role) => {
  // Registration is not fully implemented in backend yet, but we can call an endpoint if we add it
  // For now, let's keep it as is or focus on the Admin creation of users
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    role,
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default AuthService;
