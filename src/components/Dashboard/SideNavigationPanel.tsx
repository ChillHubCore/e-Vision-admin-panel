import { Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from '@/lib/styles/Dashboard.module.scss';

export default function SideNavigationPanel({
  RoutesList,
}: {
  RoutesList: { route: string; title: string; icon: JSX.Element }[];
}) {
  return (
    <Flex direction="column" gap="1rem" className={classes.navContainer}>
      {RoutesList.map((route) => (
        <Link key={route.route} to={route.route} className={classes.navItem}>
          {route.icon}
          {route.title}
        </Link>
      ))}
    </Flex>
  );
}
