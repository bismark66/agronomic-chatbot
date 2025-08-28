import { Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FileWithPath } from "@mantine/dropzone";
import { ChatLayout } from "../components/templates/ChatLayout/ChatLayout";
import { SessionSidebar } from "../components/organisms/SessionSidebar/SessionSidebar";
import { ChatWindow } from "../components/organisms/ChatWindow/ChatWindow";
import { PromptInput } from "../components/molecules/PromptInput/PromptInput";
import { useChatHistory } from "../hooks/useChatHistory";
import { useLLMResponse, useLLMFollowUp } from "../hooks/useLLMResponse";
import { Message } from "../types";
import { notifications } from "@mantine/notifications";
import {
  BackendConversation,
  useClearConversationHistory,
  useDeleteConversation,
} from "../hooks/useConversationManagement";
import {
  useConversationHistory,
  ConversationHistoryResponse,
} from "../hooks/useConversationHistory";

export function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const conversationHistoryMutation = useConversationHistory();
  const {
    sessions,
    currentSession,
    activeSessionId,
    createSession,
    updateSessionTitle,
    deleteSession,
    addMessage,
    setActiveSession,
    isCreatingSession,
    clearSessionMessages, // You'll need to add this to your useChatHistory hook
    loadMessagesIntoSession,
    updateSessionConversationId,
  } = useChatHistory();

  // const [conversationId, setConversationId] = useState<string | null>(null);
  // const [selectedBackendConversation, setSelectedBackendConversation] =
  //   useState<BackendConversation | null>(null);
  const llmMutation = useLLMResponse();
  const llmFollowUpMutation = useLLMFollowUp();

  // New hooks for conversation management
  const deleteConversationMutation = useDeleteConversation();
  const clearConversationHistoryMutation = useClearConversationHistory();

  const handleCreateSession = (backendConversationId?: string) => {
    const newSessionId = createSession(backendConversationId); // Pass conversationId to createSession
    return newSessionId;
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId);
    // setConversationId(null);
  };

  const handleEditSession = (sessionId: string, newTitle: string) => {
    updateSessionTitle(sessionId, newTitle);
    notifications.show({
      title: "Session renamed",
      message: "Your chat session has been renamed successfully.",
      color: "green",
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    // If we have a conversation ID, delete it from the backend too
    if (currentSession?.conversationId && sessionId === activeSessionId) {
      try {
        await deleteConversationMutation.mutateAsync(
          currentSession.conversationId
        );
      } catch (error) {
        console.error("Failed to delete conversation from backend:", error);
        // Continue with local deletion even if backend fails
        notifications.show({
          title: "Warning",
          message: "Session deleted locally but failed to delete from server.",
          color: "yellow",
        });
      }
    }

    // Delete local session
    deleteSession(sessionId);

    if (sessionId === activeSessionId) {
      setConversationId(null);
    }

    notifications.show({
      title: "Session deleted",
      message: "Your chat session has been deleted.",
      color: "red",
    });
  };

  const handleClearConversation = async (sessionId: string) => {
    if (currentSession?.conversationId && sessionId === activeSessionId) {
      try {
        await clearConversationHistoryMutation.mutateAsync(
          currentSession.conversationId
        );
      } catch (error) {
        console.error(
          "Failed to clear conversation history from backend:",
          error
        );
        notifications.show({
          title: "Warning",
          message: "Messages cleared locally but failed to clear from server.",
          color: "yellow",
        });
      }
    }

    // Clear messages locally
    // You'll need to implement clearSessionMessages in your useChatHistory hook
    if (clearSessionMessages) {
      clearSessionMessages(sessionId);
    } else {
      // Fallback: create a new session to effectively clear messages
      createSession();
    }

    notifications.show({
      title: "Conversation cleared",
      message: "All messages have been cleared.",
      color: "green",
    });
  };

  const handleSelectBackendConversation = async (
    conversation: BackendConversation
  ) => {
    // setSelectedBackendConversation(conversation);

    // Create a new session with the backend conversationId
    const newSessionId = createSession(conversation.id);

    try {
      const history: ConversationHistoryResponse =
        await conversationHistoryMutation.mutateAsync(conversation.id);

      const convertedMessages: Message[] = history.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.type === "user" ? "user" : "ai",
        timestamp: new Date(msg.createdAt),
        type: "text",
        metadata: {
          processingTime: msg.metadata?.processingTime,
          retrievedDocsCount: msg.metadata?.retrievedDocsCount,
          messageType: msg.type,
        },
      }));

      // Load messages into the newly created session
      if (loadMessagesIntoSession) {
        loadMessagesIntoSession(
          newSessionId, // Use the new session ID
          convertedMessages,
          conversation.title || "Backend Conversation"
        );
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load conversation history",
        color: "red",
      });
    }
  };

  // Update your handleSendMessage function to use the conversationId:
  const handleSendMessage = async (message: string, files?: FileWithPath[]) => {
    if (!currentSession) {
      const newSessionId = createSession();
      setActiveSession(newSessionId);
      return;
    }

    // Use currentSession.conversationId instead of the global conversationId
    const currentConversationId = currentSession.conversationId;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      type: files && files.length > 0 ? "image" : "text",
      metadata:
        files && files.length > 0
          ? {
              imageUrl: URL.createObjectURL(files[0]),
            }
          : undefined,
    };

    addMessage(currentSession.id, userMessage);

    try {
      const images = files
        ? await Promise.all(
            files.map((file) => {
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
              });
            })
          )
        : undefined;

      let agroResponse;

      // FIX: Use currentConversationId instead of conversationId
      if (currentConversationId) {
        // Use the backend conversation ID for follow-up
        agroResponse = await llmFollowUpMutation.mutateAsync({
          question: message,
          conversationId: currentConversationId, // Use the current session's conversationId
          images,
        });
      } else {
        // Use regular mutation for new conversations
        agroResponse = await llmMutation.mutateAsync({
          question: message,
          sessionId: currentSession.id,
          images,
        });

        // Store conversation ID for follow-up questions if this is a new backend conversation
        if (agroResponse.conversationId) {
          // FIX: Update the current session with the new conversationId
          // You'll need to add an updateSessionConversationId function to your useChatHistory hook
          if (updateSessionConversationId) {
            updateSessionConversationId(
              currentSession.id,
              agroResponse.conversationId
            );
          } else {
            // Fallback: set global state (this is not ideal but will work)
            setConversationId(agroResponse.conversationId);
          }
        }
      }

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: agroResponse.text,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        metadata: {
          tableData: agroResponse.tables?.[0],
          alertLevel: agroResponse.alerts?.[0]?.level,
          conversationId: agroResponse.conversationId,
        },
      };

      addMessage(currentSession.id, aiMessage);

      // Update session title if it's the first exchange
      if (currentSession.messages.length === 0) {
        const title =
          message.length > 30 ? message.substring(0, 30) + "..." : message;
        updateSessionTitle(currentSession.id, title);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to get response from AI advisor. Please try again.",
        color: "red",
      });

      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        metadata: {
          alertLevel: "error",
        },
      };

      addMessage(currentSession.id, errorMessage);
    }
  };

  const sidebar = (
    <SessionSidebar
      sessions={sessions}
      onCreateSession={handleCreateSession}
      onSelectSession={handleSelectSession}
      onEditSession={handleEditSession}
      onDeleteSession={handleDeleteSession}
      onClearConversation={handleClearConversation}
      onSelectBackendConversation={handleSelectBackendConversation}
      // currentConversationId={conversationId}
      mobile={isMobile}
    />
  );

  // Combine loading states
  const isLoading =
    llmMutation.isPending ||
    llmFollowUpMutation.isPending ||
    isCreatingSession ||
    deleteConversationMutation.isPending ||
    clearConversationHistoryMutation.isPending;

  return (
    <ChatLayout sidebar={sidebar}>
      <Stack style={{ flex: 1, height: "100%" }} gap="md">
        <ChatWindow
          messages={currentSession?.messages || []}
          loading={isLoading}
        />
        <PromptInput onSubmit={handleSendMessage} loading={isLoading} />
      </Stack>
    </ChatLayout>
  );
}