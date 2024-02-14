import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import { toast } from 'react-toastify';
import { useFetch } from '@/lib/hooks';

interface AuthProtectedProps {
  children: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, error } = useFetch({ requestQuery: '/user/check/auth' });

  useEffect(() => {
    if (error) {
      toast.error('You are not authorized!');
      console.error(error);
      navigate('/');
    }
  }, [error, navigate]);

  if (isLoading) return <LoadingOverlay />;

  return <>{children}</>;
};

export default AuthProtected;
