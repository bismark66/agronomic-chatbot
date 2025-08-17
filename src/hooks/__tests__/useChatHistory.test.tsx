import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { useChatHistory } from '../useChatHistory';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider>
        {children}
      </Provider>
    </QueryClientProvider>
  );
};

describe('useChatHistory', () => {
  it('should create a new session', async () => {
    const { result } = renderHook(() => useChatHistory(), {
      wrapper: createWrapper(),
    });

    expect(result.current.sessions).toHaveLength(0);

    await act(async () => {
      result.current.createSession();
    });

    // Wait for mutation to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].title).toBe('Chat 1');
    expect(result.current.activeSessionId).toBe(result.current.sessions[0].id);
  });

  it('should add message to session', async () => {
    const { result } = renderHook(() => useChatHistory(), {
      wrapper: createWrapper(),
    });

    // Create session first
    await act(async () => {
      result.current.createSession();
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const sessionId = result.current.sessions[0].id;
    const message = {
      id: 'msg1',
      content: 'Test message',
      sender: 'user' as const,
      timestamp: new Date(),
      type: 'text' as const,
    };

    act(() => {
      result.current.addMessage(sessionId, message);
    });

    expect(result.current.currentSession?.messages).toHaveLength(1);
    expect(result.current.currentSession?.messages[0].content).toBe('Test message');
  });

  it('should update session title', async () => {
    const { result } = renderHook(() => useChatHistory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.createSession();
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const sessionId = result.current.sessions[0].id;

    await act(async () => {
      result.current.updateSessionTitle(sessionId, 'New Title');
    });

    expect(result.current.sessions[0].title).toBe('New Title');
  });
});