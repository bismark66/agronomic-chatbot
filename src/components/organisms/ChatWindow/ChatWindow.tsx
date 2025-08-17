import { Stack, ScrollArea, Box, Center, Text, Loader } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { MessageBubble } from '../../molecules/MessageBubble/MessageBubble';
import { Message } from '../../../types';

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

export function ChatWindow({ messages, loading }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0 && !loading) {
    return (
      <Center style={{ flex: 1 }}>
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed" ta="center">
            Welcome to your Agronomic AI Advisor
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            Ask questions about crop management, soil health, pest control, 
            fertilization, or upload images of your crops for analysis.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <ScrollArea
      ref={scrollAreaRef}
      style={{ flex: 1 }}
      scrollbarSize={6}
      scrollHideDelay={1000}
      type="auto"
    >
      <Box p="md">
        <Stack gap="md">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {loading && (
            <Center py="md">
              <Stack align="center" gap="sm">
                <Loader color="green" />
                <Text size="sm" c="dimmed">
                  AI Advisor is thinking...
                </Text>
              </Stack>
            </Center>
          )}
          
          <div ref={bottomRef} />
        </Stack>
      </Box>
    </ScrollArea>
  );
}