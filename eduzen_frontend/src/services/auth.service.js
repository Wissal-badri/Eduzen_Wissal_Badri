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

const register = (username, email, password, role, competences) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    role,
    competences
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const changePassword = (currentPassword, newPassword) => {
  const user = getCurrentUser();
  const headers = {
    Authorization: "Basic " + user.authdata
  };

  return axios.post(API_URL + "change-password", {
    currentPassword,
    newPassword
  }, { headers }).then(response => {
    // If successful, update the stored authdata with the new password
    const newToken = btoa(user.username + ":" + newPassword);
    const updatedUser = {
      ...user,
      authdata: newToken,
      lastPasswordChange: response.data.lastPasswordChange
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return response.data;
  });
};

const updatePreferences = (preferences) => {
  const user = getCurrentUser();
  const headers = {
    Authorization: "Basic " + user.authdata
  };

  return axios.put(API_URL + "preferences", preferences, { headers }).then(response => {
    const updatedUser = {
      ...user,
      emailAlerts: response.data.emailAlerts,
      newsletters: response.data.newsletters
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return response.data;
  });
};

// Admin functions for password management
const adminResetPassword = (userId, newPassword) => {
  const user = getCurrentUser();
  const headers = {
    Authorization: "Basic " + user.authdata
  };

  return axios.put(API_URL + `admin/reset-password/${userId}`, {
    newPassword
  }, { headers });
};

const adminGetAllUsers = () => {
  const user = getCurrentUser();
  const headers = {
    Authorization: "Basic " + user.authdata
  };

  return axios.get(API_URL + "admin/users", { headers });
};

const AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
  changePassword,
  updatePreferences,
  adminResetPassword,
  adminGetAllUsers,
};

export default AuthService;
