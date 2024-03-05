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

  React.useEffect(() => {
    if (!userInfo?.token) {
      toast.error('You need to login to access this page');
      navigate('/login');
    } else if (!userInfo?.isAdmin) {
      toast.error('You need to be an admin to access this page');
      navigate('/');
    }
  }, [userInfo]);

  return <>{children}</>;
};

export default AdminProtected;
