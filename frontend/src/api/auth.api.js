import { login as fakeLogin, logout as fakeLogout, getCurrentUser } from '../services/authService';

export const login = async (email, password) => {
  const user = await fakeLogin(email, password);
  return { user };
};

export const logout = () => {
  fakeLogout();
};
