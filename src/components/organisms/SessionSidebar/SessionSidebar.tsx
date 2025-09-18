  const handleClearConversationHistory = async (conversationId: string) => {
    try {
      await clearConversationHistoryMutation.mutateAsync(conversationId);
      notifications.show({
        title: "Conversation cleared",
        message: "Chat messages have been cleared.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to clear conversation history.",
        color: "red",
      });
    }
  };
import { Stack, Group, Button, ScrollArea, Text, Paper, ActionIcon, Divider, Box } from "@mantine/core";
import { activeSessionAtom, sidebarCollapsedAtom } from "../../../store/chatStore";
import { useClearConversationHistory, useConversations, BackendConversation, useCreateConversation } from "../../../hooks/useConversationManagement";
import { useClearConversation } from "../../../hooks/useConversationHistory";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconMenu2, IconContainer } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { SessionItem } from "../../molecules/SessionItem/SessionItem";

interface SessionSidebarProps {
  onCreateSession: (conversationId?: string) => void;
  onSelectBackendConversation: (conversation: BackendConversation) => void;
  mobile?: boolean;
}

export function SessionSidebar({
  onCreateSession,
  onSelectBackendConversation,
  mobile = false,
}: SessionSidebarProps) {
  const [activeSession] = useAtom(activeSessionAtom);
  const [sidebarCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

  const clearConversationHistoryMutation = useClearConversationHistory();
  const clearConversationMutation = useClearConversation();
  const createConversationMutation = useCreateConversation();

  // Fetch backend conversations
  const {
    data: backendConversations = [],
    isLoading: isLoadingBackend,
    refetch: refetchConversations,
  } = useConversations();

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCreateNewChat = async () => {
    try {
      // Create a new conversation on the backend
      const result = await createConversationMutation.mutateAsync({
        title: "New Chat",
        // userId: "", // Leave userId blank as requested
      });

      // Refresh the conversations list to include the new one
      refetchConversations();

      // Call the parent onCreateSession with the new conversationId
      onCreateSession(result.conversationId);

      notifications.show({
        title: "New chat created",
        message: "Ready to start chatting!",
        color: "green",
      });
    } catch (error) {
      console.error("Failed to create conversation:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create new chat. Using local session instead.",
        color: "red",
      });

      // Fallback: create local session without backend conversation
      onCreateSession();
    }
  };



  const handleDeleteBackendConversation = async (conversationId: string) => {
    try {
      await clearConversationMutation.mutateAsync(conversationId);
      refetchConversations(); // Refresh the list after deletion
      notifications.show({
        title: "Conversation deleted",
        message: "Backend conversation has been deleted.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete backend conversation.",
        color: "red",
      });
    }
  };

  // Get current conversation ID from the active session (if available)
  const currentConversationId =
    typeof activeSession === 'object' && activeSession !== null && 'conversationId' in activeSession
      ? (activeSession as { conversationId?: string }).conversationId ?? null
      : null;

  if (sidebarCollapsed) {
    return (
      <Paper
        withBorder
        radius="md"
        style={{
          width: "60px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Group p="md" justify="center" style={{ flexShrink: 0 }}>
          <ActionIcon variant="subtle" onClick={handleToggleSidebar} size="sm">
            <IconMenu2 size={16} />
          </ActionIcon>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper
      withBorder
      radius="md"
      style={{
        width: mobile ? "100%" : "280px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Group p="md" justify="space-between" style={{ flexShrink: 0 }}>
        <Text fw={600} size="sm">
          Chat Sessions
        </Text>
        {/* <ActionIcon variant="subtle" onClick={handleToggleSidebar} size="sm">
          <IconX size={16} />
        </ActionIcon> */}
      </Group>

      <Group px="md" pb="md" style={{ flexShrink: 0 }}>
        <Button
          leftSection={<IconPlus size={16} />}
          variant="light"
          color="green"
          fullWidth
          onClick={handleCreateNewChat}
          loading={createConversationMutation.isPending}
          size="sm"
        >
          New Chat
        </Button>
      </Group>

      <Divider />


      <ScrollArea style={{ flex: 1 }} scrollbarSize={4}>
        <Box p="sm">
          <Stack gap={0}>
            {isLoadingBackend ? (
              <Text size="sm" c="dimmed" ta="center" p="md">
                Loading conversations...
              </Text>
            ) : backendConversations.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" p="md">
                No backend conversations found.
              </Text>
            ) : (
              (backendConversations as BackendConversation[]).map((conversation) => (
                <SessionItem
                  key={conversation.id}
                  session={{
                    id: conversation.id,
                    title: conversation.title || "Untitled Conversation",
                    messages: conversation.messages.map((msg: BackendConversation["messages"][number]) => ({
                      id: msg.id,
                      content: msg.content,
                      sender: msg.role === "user" ? "user" : "ai",
                      timestamp: new Date(msg.createdAt),
                      type: "text",
                    })),
                    createdAt: new Date(conversation.createdAt),
                    updatedAt: new Date(conversation.updatedAt),
                  }}
                  active={currentConversationId === conversation.id}
                  onClick={() => onSelectBackendConversation(conversation)}
                  onEdit={() => {}}
                  onDelete={() =>
                    handleDeleteBackendConversation(conversation.id)
                  }
                  menuItems={[
                    {
                      label: "Clear Messages",
                      icon: <IconContainer size={14} />,
                      onClick: () => handleClearConversationHistory(conversation.id),
                      color: "orange",
                    },
                  ]}
                />
              ))
            )}
          </Stack>
        </Box>
      </ScrollArea>
    </Paper>
  );
}
