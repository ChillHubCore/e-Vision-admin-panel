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

  if (!userInfo?.token || !userInfo.isCreator) {
    toast.error('You are not authorized!');

    navigate('/');
  }

  return <>{children}</>;
};

export default CreatorProtected;
