import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/lib/hooks';

interface AuthProtectedProps {
  children: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data } = useFetch({ requestQuery: '/user/check/auth' });

  useEffect(() => {
    if (data && data === true) {
      // Render children if data is true
    } else {
      // Navigate to / if data is not true
      navigate('/');
    }
  }, [data, navigate]);

  return <>{children}</>;
};

export default AuthProtected;
