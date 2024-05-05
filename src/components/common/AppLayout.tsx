import { useDisclosure } from '@mantine/hooks';
import {
  AppShell,
  Burger,
  Divider,
  Group,
  Indicator,
  Popover,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconShoppingBag } from '@tabler/icons-react';
import classes from '@/lib/styles/MobileNavbar.module.scss';
import { selectUserInfo, signOut } from '@/lib/redux/User/UserSlice';
import { ColorSchemeToggle } from '@/components';
import { selectShoppingCart } from '@/lib/redux/ShoppingCart/ShoppingCart';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const userInfo = useSelector(selectUserInfo);
  const shoppingCart = useSelector(selectShoppingCart);
  const dispatch = useDispatch();
  const renderLoginLogoutButton = userInfo?.token ? (
    <>
      <UnstyledButton
        onClick={() => {
          dispatch(signOut());
          toggle();
        }}
        className={classes.control}
      >
        Sign Out
      </UnstyledButton>
    </>
  ) : (
    <>
      <UnstyledButton onClick={toggle} component={Link} to="/login" className={classes.control}>
        Login
      </UnstyledButton>
      <UnstyledButton onClick={toggle} component={Link} to="/signup" className={classes.control}>
        Signup
      </UnstyledButton>
    </>
  );

  const renderShoppingCartDropdown = (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Indicator color={shoppingCart.shoppingCart.cartItems.length > 0 ? 'cyan' : 'gray'}>
          <UnstyledButton>
            <IconShoppingBag />
          </UnstyledButton>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        {shoppingCart.shoppingCart.cartItems.length > 0 ? (
          <Group align="middle" px="sm" py="md">
            <Text size="sm">{shoppingCart.shoppingCart.cartItems.length} items in your cart</Text>
            <Link to="/admin/dashboard/orders/create">View Cart</Link>
          </Group>
        ) : (
          <Group align="middle" px="sm" py="md">
            <Text size="sm">Your cart is empty</Text>
            <Link to="/admin/dashboard/products">Start Shopping</Link>
          </Group>
        )}
      </Popover.Dropdown>
    </Popover>
  );

  const renderCreatorDashboardDropdown =
    userInfo?.token && userInfo.isCreator ? (
      <UnstyledButton
        onClick={toggle}
        component={Link}
        to="/creator/dashboard"
        className={classes.control}
      >
        Creator Dashboard
      </UnstyledButton>
    ) : (
      <></>
    );

  const renderAdminDashboardDropdown =
    userInfo?.token && userInfo.isAdmin ? (
      <>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to="/admin/dashboard"
          className={classes.control}
        >
          Admin Dashboard
        </UnstyledButton>
      </>
    ) : (
      <></>
    );

  const renderTeamMemberDashboardDropdown =
    userInfo?.token && userInfo.role.label === 'TeamMember' ? (
      <>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to="/team/dashboard"
          className={classes.control}
        >
          Team Member Dashboard
        </UnstyledButton>
      </>
    ) : (
      <></>
    );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link to="/">e-Vision Dashboard</Link>
            <Group ml="xl" gap={0} visibleFrom="sm">
              {renderTeamMemberDashboardDropdown}
              <Divider orientation="vertical" />
              {renderCreatorDashboardDropdown}
              <Divider orientation="vertical" />
              {renderAdminDashboardDropdown}
              <Divider orientation="vertical" />
              <ColorSchemeToggle />
              <Divider orientation="vertical" />
              <UnstyledButton className={classes.control}>Documentation</UnstyledButton>
              <Divider orientation="vertical" />
              {renderLoginLogoutButton}
              {renderShoppingCartDropdown}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Group m="sm">{renderShoppingCartDropdown}</Group>
        {renderAdminDashboardDropdown}
        {renderCreatorDashboardDropdown}
        {renderTeamMemberDashboardDropdown}
        {renderLoginLogoutButton}
        <Divider />
        <ColorSchemeToggle />
        <UnstyledButton className={classes.control}>Documentation</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
