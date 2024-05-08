import React, { Suspense } from 'react';
import { IconArticle, IconMail, IconPaperclip, IconUser } from '@tabler/icons-react';
import { Flex, Loader } from '@mantine/core';
import { SideNavigationPanel } from '@/components/Dashboard';
import UserIntegrity from './UserIntegrity';

interface TeamLayoutProps {
  children: React.ReactNode;
}

const TeamLayout: React.FC<TeamLayoutProps> = ({ children }) => {
  const TeamRoutes = [
    {
      route: '/team/dashboard',
      title: 'My Profile',
      icon: <IconUser />,
    },
    {
      route: '/team/dashboard/myresume',
      title: 'My Resume',
      icon: <IconPaperclip />,
    },
    { route: '/team/dashboard/blogs', title: 'Blogs', icon: <IconArticle /> },
    { route: '/team/dashboard/myemails', title: 'Emails', icon: <IconMail /> },
  ];
  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
      <Suspense fallback={<Loader />}>
        <SideNavigationPanel RoutesList={TeamRoutes} />
      </Suspense>
      <UserIntegrity>{children}</UserIntegrity>
    </Flex>
  );
};

export default TeamLayout;
