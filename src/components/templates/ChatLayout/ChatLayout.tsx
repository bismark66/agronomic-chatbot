import { AppShell, Group, Title, ActionIcon } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconMenu2, IconLeaf } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function ChatLayout({ sidebar, children }: ChatLayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AppShell
      header={{ height: { base: 60, md: 70 } }}
      navbar={{
        width: { base: 280, md: 320 },
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            {isMobile && (
              <ActionIcon
                onClick={toggleMobile}
                variant="subtle"
                size="lg"
              >
                <IconMenu2 size={18} />
              </ActionIcon>
            )}
            
            <Group gap="xs">
              <IconLeaf size={24} color="var(--mantine-color-green-6)" />
              <Title order={3} c="green">
                AgroAdvisor
              </Title>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {sidebar}
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 70px)',
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}