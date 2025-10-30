// src/redux/actions/authActions.js
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/config"; // Ensure this path is correct

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const CHECK_AUTH_STATUS = "CHECK_AUTH_STATUS"; // New action to check auth on app load

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData, // User details, token, role (e.g., 'Job Seeker', 'Employer', 'Admin')
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logoutAction = () => ({
  type: LOGOUT,
});

// Async action using redux-thunk for login
export const loginUser = (credentials, navigate) => async (dispatch) => {
  dispatch(loginRequest()); // Dispatch request action to set loading state
  try {
    const response = await axios.post(
      `${BASE_URL}api/v1/user/login`,
      credentials
    );

    const user = response.data.user;

    if (response.data.token && !user.token) {
      user.token = response.data.token;
    }

    localStorage.setItem("user", JSON.stringify(user));
    if (user.token) {
      localStorage.setItem("authToken", user.token);
    }

    dispatch(loginSuccess(user)); // Dispatch success with user data
    toast.success("Login Successful!");

    // Redirect based on user role
    setTimeout(() => {
      if (user.role === "Job Seeker") {
        navigate("/");
      } else if (user.role === "Employer") {
        navigate(`/employer/dashboard/${user._id}`);
      } else if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }, 2000);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    dispatch(loginFailure(errorMessage)); // Dispatch failure with error message
    toast.error(errorMessage);
  }
};

// Async action to check authentication status on app load
export const checkAuthStatus = () => (dispatch) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("authToken");

  if (storedUser && storedToken) {
    if (!storedUser.token) {
      storedUser.token = storedToken;
    }
    dispatch(loginSuccess(storedUser)); // User is already logged in
  } else {
    dispatch(logoutAction()); // No valid session, ensure logged out state
  }
};

// Async action for logout
export const userLogout = (navigate) => (dispatch) => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  dispatch(logoutAction());
  toast.info("Logged out successfully!");
  navigate("/login");
};
