import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/lib/hooks';

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data } = useFetch({ requestQuery: '/user/check/admin' });

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

export default AdminProtected;
