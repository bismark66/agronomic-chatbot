import { Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FileWithPath } from '@mantine/dropzone';
import { ChatLayout } from '../components/templates/ChatLayout/ChatLayout';
import { SessionSidebar } from '../components/organisms/SessionSidebar/SessionSidebar';
import { ChatWindow } from '../components/organisms/ChatWindow/ChatWindow';
import { PromptInput } from '../components/molecules/PromptInput/PromptInput';
import { useChatHistory } from '../hooks/useChatHistory';
import { useLLMResponse } from '../hooks/useLLMResponse';
import { Message } from '../types';
import { notifications } from '@mantine/notifications';

export function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
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
  } = useChatHistory();

  const llmMutation = useLLMResponse();

  const handleCreateSession = () => {
    createSession();
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId);
  };

  const handleEditSession = (sessionId: string, newTitle: string) => {
    updateSessionTitle(sessionId, newTitle);
    notifications.show({
      title: 'Session renamed',
      message: 'Your chat session has been renamed successfully.',
      color: 'green',
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    notifications.show({
      title: 'Session deleted',
      message: 'Your chat session has been deleted.',
      color: 'red',
    });
  };

  const handleSendMessage = async (message: string, files?: FileWithPath[]) => {
    if (!currentSession) {
      // Create a new session if none exists
      createSession();
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: files && files.length > 0 ? 'image' : 'text',
      metadata: files && files.length > 0 ? {
        imageUrl: URL.createObjectURL(files[0])
      } : undefined,
    };

    addMessage(currentSession.id, userMessage);

    try {
      // Get AI response
      const images = files ? await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      ) : undefined;

      const agroResponse = await llmMutation.mutateAsync({
        message,
        sessionId: currentSession.id,
        images,
      });

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: agroResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          tableData: agroResponse.tables?.[0],
          alertLevel: agroResponse.alerts?.[0]?.level,
        },
      };

      addMessage(currentSession.id, aiMessage);

      // Update session title if it's the first exchange
      if (currentSession.messages.length === 0) {
        const title = message.length > 30 
          ? message.substring(0, 30) + '...' 
          : message;
        updateSessionTitle(currentSession.id, title);
      }

    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to get response from AI advisor. Please try again.',
        color: 'red',
      });

      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          alertLevel: 'error',
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
      mobile={isMobile}
    />
  );

  return (
    <ChatLayout sidebar={sidebar}>
      <Stack style={{ flex: 1, height: '100%' }} gap="md">
        <ChatWindow
          messages={currentSession?.messages || []}
          loading={llmMutation.isPending}
        />
        <PromptInput
          onSubmit={handleSendMessage}
          loading={llmMutation.isPending || isCreatingSession}
        />
      </Stack>
    </ChatLayout>
  );
}