import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

interface AuthProtectedProps {
  children: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  React.useEffect(() => {
    if (userInfo?.token) {
      navigate('/');
    }
    toast.error('You Have Already Logged In!');
  }, [userInfo]);

  return <>{children}</>;
};

export default AuthProtected;
