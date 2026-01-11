import { login as loginAPI, logout as logoutAPI } from '../../api/auth.api.js';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const logoutAction = () => ({
  type: LOGOUT,
});

export const login = (email, password) => async (dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await loginAPI(email, password);
    dispatch(loginSuccess(data.user));
  } catch (error) {
    throw error; // or dispatch error action
  }
};

export const logout = () => async (dispatch) => {
  logoutAPI();
  dispatch(logoutAction());
};