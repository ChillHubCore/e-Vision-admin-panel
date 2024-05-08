import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/User/UserSlice';
import { useFetch } from '../hooks';

interface UserIntegrityProps {
  children: React.ReactNode;
}

const UserIntegrity: React.FC<UserIntegrityProps> = ({ children }) => {
  const dispatch = useDispatch();
  const UserIntegrityData = useFetch({ requestQuery: '/user/check/integrity' });

  useEffect(() => {
    if (
      UserIntegrityData.error?.response?.status === 401 ||
      UserIntegrityData.error?.response?.status === 403
    ) {
      dispatch(signOut());
    }
  });
  return <>{children}</>;
};

export default UserIntegrity;
