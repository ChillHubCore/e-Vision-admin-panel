import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

interface CreatorProtectedProps {
  children: React.ReactNode;
}

const CreatorProtected: React.FC<CreatorProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  React.useEffect(() => {
    if (!userInfo?.token) {
      toast.error('You need to login to access this page');
      navigate('/login');
    } else if (!userInfo?.isCreator) {
      toast.error('You need to be a creator to access this page');
      navigate('/');
    }
  }, [userInfo]);

  return <>{children}</>;
};

export default CreatorProtected;
