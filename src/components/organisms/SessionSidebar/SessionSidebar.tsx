import { Stack, Group, Button, ScrollArea, Text, Paper, ActionIcon, Divider } from '@mantine/core';
import { IconPlus, IconMenu2, IconX } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { SessionItem } from '../../molecules/SessionItem/SessionItem';
import { ChatSession } from '../../../types';
import { activeSessionAtom, sidebarCollapsedAtom } from '../../../store/chatStore';

interface SessionSidebarProps {
  sessions: ChatSession[];
  onCreateSession: () => void;
  onSelectSession: (sessionId: string) => void;
  onEditSession: (sessionId: string, newTitle: string) => void;
  onDeleteSession: (sessionId: string) => void;
  mobile?: boolean;
}

export function SessionSidebar({ 
  sessions, 
  onCreateSession, 
  onSelectSession, 
  onEditSession, 
  onDeleteSession,
  mobile = false 
}: SessionSidebarProps) {
  const [activeSessionId] = useAtom(activeSessionAtom);
  const [sidebarCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Paper
      withBorder
      radius="md"
      style={{
        width: mobile ? '100%' : sidebarCollapsed ? '60px' : '280px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms ease',
        overflow: 'hidden',
      }}
    >
      <Group p="md" justify="space-between" style={{ flexShrink: 0 }}>
        {!sidebarCollapsed && (
          <Text fw={600} size="sm">
            Chat Sessions
          </Text>
        )}
        <ActionIcon
          variant="subtle"
          onClick={handleToggleSidebar}
          size="sm"
        >
          {sidebarCollapsed ? <IconMenu2 size={16} /> : <IconX size={16} />}
        </ActionIcon>
      </Group>

      {!sidebarCollapsed && (
        <>
          <Group px="md" pb="md" style={{ flexShrink: 0 }}>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="light"
              color="green"
              fullWidth
              onClick={onCreateSession}
              size="sm"
            >
              New Chat
            </Button>
          </Group>

          <Divider />
        </>
      )}

      {!sidebarCollapsed && (
        <ScrollArea style={{ flex: 1 }} scrollbarSize={4}>
          <Stack gap={0} p="sm">
            {sessions.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" p="md">
                No sessions yet. Create your first chat!
              </Text>
            ) : (
              sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  active={session.id === activeSessionId}
                  onClick={() => onSelectSession(session.id)}
                  onEdit={onEditSession}
                  onDelete={onDeleteSession}
                />
              ))
            )}
          </Stack>
        </ScrollArea>
      )}
    </Paper>
  );
}