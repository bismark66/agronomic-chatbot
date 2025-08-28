// components/molecules/SessionItem/SessionItem.tsx
import { Group, Text, ActionIcon, Menu, rem } from "@mantine/core";
import { IconEdit, IconTrash, IconDotsVertical } from "@tabler/icons-react";

interface SessionItemProps {
  session: any;
  active: boolean;
  onClick: () => void;
  onEdit: (sessionId: string, newTitle: string) => void;
  onDelete: (sessionId: string) => void;
  menuItems?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string;
  }>;
}

export function SessionItem({
  session,
  active,
  onClick,
  onEdit,
  onDelete,
  menuItems = [],
}: SessionItemProps) {
  return (
    <Group
      justify="space-between"
      p="sm"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        backgroundColor: active
          ? "var(--mantine-color-blue-light)"
          : "transparent",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: active
            ? "var(--mantine-color-blue-light)"
            : "var(--mantine-color-gray-0)",
        },
      }}
      onClick={onClick}
    >
      <Text
        size="sm"
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {session.title || "New Chat"}
      </Text>

      <Menu withinPortal position="bottom-end" shadow="sm">
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={(e) => e.stopPropagation()}
          >
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconEdit style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={(e) => {
              e.stopPropagation();
              const newTitle = prompt(
                "Edit session title:",
                session.title || "New Chat"
              );
              if (newTitle) onEdit(session.id, newTitle);
            }}
          >
            Edit
          </Menu.Item>

          {menuItems.map((item, index) => (
            <Menu.Item
              key={index}
              leftSection={item.icon}
              color={item.color}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
              }}
            >
              {item.label}
            </Menu.Item>
          ))}

          <Menu.Divider />

          <Menu.Item
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this session?")) {
                onDelete(session.id);
              }
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
