import { Menu, UnstyledButton, rem, useMantineColorScheme } from '@mantine/core';
import { IconAutomaticGearbox, IconMoon, IconSun } from '@tabler/icons-react';
import classes from '@/lib/styles/MobileNavbar.module.scss';

export default function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton className={classes.control}>Theme Toggle</UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Choose Your Preferred Theme</Menu.Label>
        <Menu.Item
          onClick={() => setColorScheme('light')}
          rightSection={<IconSun style={{ width: rem(14), height: rem(14) }} />}
        >
          Light
        </Menu.Item>
        <Menu.Item
          onClick={() => setColorScheme('dark')}
          rightSection={<IconMoon style={{ width: rem(14), height: rem(14) }} />}
        >
          Dark
        </Menu.Item>
        <Menu.Item
          rightSection={<IconAutomaticGearbox style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('auto')}
        >
          Auto
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
