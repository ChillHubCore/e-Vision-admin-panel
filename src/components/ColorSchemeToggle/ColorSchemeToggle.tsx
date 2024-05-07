import { rem, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export default function ColorSchemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  return colorScheme === 'light' ? (
    <UnstyledButton
      onClick={() => {
        setColorScheme('dark');
      }}
    >
      <IconSun style={{ width: rem(14), height: rem(14) }} />
    </UnstyledButton>
  ) : (
    <UnstyledButton
      onClick={() => {
        setColorScheme('light');
      }}
    >
      <IconMoon style={{ width: rem(14), height: rem(14) }} />
    </UnstyledButton>
  );
}
