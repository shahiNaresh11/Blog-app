import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, logout as logoutAction, restoreAuth } from '../store/authSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  const login = async (credentials) => {
    try {
      if (credentials.email =='naresh@gmail.com' && credentials.password =='Kathmandu123') {
        const user = {
          id: 1,
          email: 'naresh@gmail.com'
        }
         const token = 'mock-jwt-token-' + Date.now();
     

      dispatch(loginSuccess({ user, token }));
      toast.success('Login successful');
      navigate('/dashboard');
      return { success: true };
      }else{
        toast.error('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
     
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();

      const token = 'mock-jwt-token-' + Date.now();
      const user = {
        id: data.id,
        name: userData.name,
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
      };

      dispatch(loginSuccess({ user, token }));
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
