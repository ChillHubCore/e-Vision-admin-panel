import { Button, Drawer, Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/lib/styles/Dashboard.module.scss';

export default function SideNavigationPanel({
  RoutesList,
}: {
  RoutesList: { route: string; title: string; icon: JSX.Element }[];
}) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Flex direction="column" gap="1rem" className={classes.navContainer} visibleFrom="md">
        {RoutesList.map((route) => (
          <Link key={route.route} to={route.route} className={classes.navItem}>
            {route.icon}
            {route.title}
          </Link>
        ))}
      </Flex>
      <Button hiddenFrom="md" onClick={open}>
        Open Navigation Drawer
      </Button>
      <Drawer opened={opened} onClose={close} title="Navigation Drawer" hiddenFrom="md">
        <Flex direction="column" gap="1rem" className={classes.navContainer}>
          {RoutesList.map((route) => (
            <Link key={route.route} to={route.route} className={classes.navItem}>
              {route.icon}
              {route.title}
            </Link>
          ))}
        </Flex>
      </Drawer>
    </>
  );
}
