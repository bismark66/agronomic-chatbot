import { NavLink, Group, ActionIcon, Text, Menu } from '@mantine/core';
import { IconMessage, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { ChatSession } from '../../../types';

interface SessionItemProps {
  session: ChatSession;
  active?: boolean;
  onClick: () => void;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export function SessionItem({ session, active, onClick, onEdit, onDelete }: SessionItemProps) {
  const handleEdit = () => {
    const newTitle = prompt('Enter new session title:', session.title);
    if (newTitle && newTitle.trim()) {
      onEdit(session.id, newTitle.trim());
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this session?')) {
      onDelete(session.id);
    }
  };

  return (
    <NavLink
      active={active}
      onClick={onClick}
      label={
        <Group justify="space-between" style={{ width: '100%' }}>
          <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
            <IconMessage size={16} />
            <Text size="sm" truncate style={{ flex: 1 }}>
              {session.title}
            </Text>
          </Group>
          
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDots size={14} />
              </ActionIcon>
            </Menu.Target>
            
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
              >
                Rename
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      }
      py="sm"
      px="md"
    />
  );
}