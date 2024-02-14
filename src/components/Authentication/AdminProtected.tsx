import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingOverlay } from '@mantine/core';
import { useFetch } from '@/lib/hooks';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, error } = useFetch({ requestQuery: '/user/check/admin' });

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

export default AdminProtected;
