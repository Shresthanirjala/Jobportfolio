// src/redux/reducers/authReducer.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "../actions/authActions";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null, // This will hold user data like { _id, name, email, role: 'Job Seeker' }
  error: null,
  authLoading: true, // Equivalent to your initial authLoading state in Context
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
        authLoading: false, // Authentication status checked
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        authLoading: false, // Authentication status checked
      };
    case LOGOUT:
      return {
        ...initialState, // Reset to initial state
        authLoading: false, // Auth check is done
      };
    default:
      return state;
  }
};

export default authReducer;
