import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  if (!userInfo || !userInfo.isAdmin) {
    toast.error('You are not authorized!');

    navigate('/');
  }

  return <>{children}</>;
};

export default AdminProtected;
