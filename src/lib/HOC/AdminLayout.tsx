import React, { Suspense } from 'react';
import {
  IconArticle,
  IconBrandCampaignmonitor,
  IconDashboard,
  IconManualGearbox,
  IconMenuOrder,
  IconMoneybag,
  IconReportSearch,
  IconSettings,
  IconSettings2,
  IconShoppingBag,
  IconSlashes,
  IconTicket,
  IconUser,
} from '@tabler/icons-react';
import { Flex, Loader } from '@mantine/core';
import { SideNavigationPanel } from '@/components/Dashboard';
import UserIntegrity from './UserIntegrity';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const AdminRoutes = [
    { route: '/admin/dashboard', title: 'Dashboard', icon: <IconDashboard /> },
    { route: '/admin/dashboard/users', title: 'Users', icon: <IconUser /> },
    { route: '/admin/dashboard/products', title: 'Products', icon: <IconShoppingBag /> },
    { route: '/admin/dashboard/orders', title: 'Orders', icon: <IconMenuOrder /> },
    { route: '/admin/dashboard/transactions', title: 'Transactions', icon: <IconMoneybag /> },
    { route: '/admin/dashboard/blogs', title: 'Blogs', icon: <IconArticle /> },
    { route: '/admin/dashboard/promotions', title: 'Promotions', icon: <IconSlashes /> },
    { route: '/admin/dashboard/tickets', title: 'Tickets', icon: <IconTicket /> },
    {
      route: '/admin/dashboard/campaign-manager',
      title: 'Campaign Manager',
      icon: <IconBrandCampaignmonitor />,
    },
    {
      route: '/admin/dashboard/sellers-manager',
      title: 'Sellers Manager',
      icon: <IconManualGearbox />,
    },
    {
      route: '/admin/dashboard/personal-settings',
      title: 'Personal Settings',
      icon: <IconSettings2 />,
    },
    { route: '/admin/dashboard/shop-settings', title: 'Shop Settings', icon: <IconSettings /> },
    { route: '/admin/dashboard/reports', title: 'Reports', icon: <IconReportSearch /> },
  ];
  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
      <Suspense fallback={<Loader />}>
        <SideNavigationPanel RoutesList={AdminRoutes} />
      </Suspense>
      <UserIntegrity>{children}</UserIntegrity>
    </Flex>
  );
};

export default AdminLayout;
