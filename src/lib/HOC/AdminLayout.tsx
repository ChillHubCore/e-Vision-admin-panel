import React, { Suspense } from 'react';
import {
  IconDashboard,
  IconMenuOrder,
  IconMessage,
  IconSettings,
  IconSettings2,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import { Flex, Loader } from '@mantine/core';
import { SideNavigationPanel } from '@/components/Dashboard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const AdminRoutes = [
    { route: '/admin/dashboard', title: 'Dashboard', icon: <IconDashboard /> },
    { route: '/admin/dashboard/users', title: 'Users', icon: <IconUser /> },
    { route: '/admin/dashboard/products', title: 'Products', icon: <IconShoppingBag /> },
    { route: '/admin/dashboard/orders', title: 'Orders', icon: <IconMenuOrder /> },
    { route: '/admin/dashboard/shop-settings', title: 'Shop Settings', icon: <IconSettings /> },
    {
      route: '/admin/dashboard/personal-settings',
      title: 'Personal Settings',
      icon: <IconSettings2 />,
    },
    { route: '/admin/dashboard/reviews', title: 'Reviews', icon: <IconMessage /> },
  ];
  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
      <Suspense fallback={<Loader />}>
        <SideNavigationPanel RoutesList={AdminRoutes} />
      </Suspense>
      {children}
    </Flex>
  );
};

export default AdminLayout;
