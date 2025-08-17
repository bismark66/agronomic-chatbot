import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MessageBubble } from './MessageBubble';
import { Message } from '../../../types';

const mockUserMessage: Message = {
  id: '1',
  content: 'What fertilizer should I use for corn?',
  sender: 'user',
  timestamp: new Date('2024-01-01T10:00:00Z'),
  type: 'text',
};

const mockAIMessage: Message = {
  id: '2',
  content: 'For corn production, I recommend a balanced NPK fertilizer...',
  sender: 'ai',
  timestamp: new Date('2024-01-01T10:01:00Z'),
  type: 'text',
  metadata: {
    tableData: {
      headers: ['Nutrient', 'Amount', 'Timing'],
      rows: [['Nitrogen', '120kg/ha', 'Pre-plant']],
    },
    alertLevel: 'info' as const,
  },
};

const renderWithMantine = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    renderWithMantine(<MessageBubble message={mockUserMessage} />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('What fertilizer should I use for corn?')).toBeInTheDocument();
  });

  it('renders AI message correctly', () => {
    renderWithMantine(<MessageBubble message={mockAIMessage} />);
    
    expect(screen.getByText('AI Advisor')).toBeInTheDocument();
    expect(screen.getByText(/For corn production, I recommend/)).toBeInTheDocument();
  });

  it('renders table data when present', () => {
    renderWithMantine(<MessageBubble message={mockAIMessage} />);
    
    expect(screen.getByText('Agricultural Data:')).toBeInTheDocument();
    expect(screen.getByText('Nutrient')).toBeInTheDocument();
    expect(screen.getByText('Nitrogen')).toBeInTheDocument();
  });

  it('renders alert when alert level is present', () => {
    renderWithMantine(<MessageBubble message={mockAIMessage} />);
    
    expect(screen.getByText(/This recommendation requires/)).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    renderWithMantine(<MessageBubble message={mockUserMessage} />);
    
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });
});