import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, reset } from '../features/auth/authSlice';
import { ROUTES } from '../constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (result.type === 'auth/login/fulfilled') {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(reset());
    navigate(ROUTES.LOGIN);
  };

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isLoading,
    isError,
    isSuccess,
    message,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
