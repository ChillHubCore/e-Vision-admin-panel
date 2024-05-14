import { useDisclosure } from '@mantine/hooks';
import {
  AppShell,
  Burger,
  Button,
  Group,
  Indicator,
  Menu,
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

  // const renderCreatorDashboardDropdown =
  //   userInfo?.token && userInfo.isCreator ? (
  //     <UnstyledButton
  //       onClick={toggle}
  //       component={Link}
  //       to="/creator/dashboard"
  //       className={classes.control}
  //     >
  //       Creators
  //     </UnstyledButton>
  //   ) : (
  //     <></>
  //   );

  const renderAdminDashboardDropdown =
    userInfo?.token && userInfo.isAdmin ? (
      <>
        <UnstyledButton
          onClick={toggle}
          component={Link}
          to="/admin/dashboard"
          className={classes.control}
        >
          Admins
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
          Team Members
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
            <Group ml="xl" gap={0} style={{ gap: 20 }} align="center" justify="center">
              <Menu shadow="md">
                <Menu.Target>
                  <Button visibleFrom="sm" color="gray">
                    Menu
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  {userInfo ? (
                    <>
                      <Menu.Label>Dashboards</Menu.Label>
                      <Menu.Item>{renderTeamMemberDashboardDropdown}</Menu.Item>
                      {/* <Menu.Item>{renderCreatorDashboardDropdown}</Menu.Item> */}
                      <Menu.Item>{renderAdminDashboardDropdown}</Menu.Item>
                      <Menu.Divider />
                    </>
                  ) : null}

                  <Menu.Label>Actions</Menu.Label>
                  {renderLoginLogoutButton}
                </Menu.Dropdown>
              </Menu>
              <ColorSchemeToggle />
              {renderShoppingCartDropdown}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {renderAdminDashboardDropdown}
        {/* {renderCreatorDashboardDropdown} */}
        {renderTeamMemberDashboardDropdown}
        {renderLoginLogoutButton}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
