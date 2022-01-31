import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  CLEAR_ERRORS,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  REGISTER_REQUEST,
} from './../constants/userConstants';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(
      '/api/v1/login',
      { email, password },
      config
    );
    // console.log(data);
    dispatch({ type: LOGIN_SUCCESS, paylaod: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_ERROR, payload: error.response.data.message });
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const { data } = await axios.post('/api/v1/register', userData, config);
    console.log(data);
    dispatch({ type: REGISTER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: REGISTER_ERROR, payload: error.response.data.message });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
