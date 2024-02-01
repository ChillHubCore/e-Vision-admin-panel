import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/lib/hooks';

interface CreatorProtectedProps {
  children: React.ReactNode;
}

const CreatorProtected: React.FC<CreatorProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data } = useFetch({ requestQuery: '/user/check/creator' });

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

export default CreatorProtected;
