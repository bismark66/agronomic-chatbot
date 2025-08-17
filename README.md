# Agronomic Advisory Chat App

A production-ready React application for agricultural consultation using AI-powered chat interface with RAG (Retrieval-Augmented Generation) capabilities.

## 🌱 Features

### Core Functionality
- **Session-based Chat Management**: Create, rename, and delete chat sessions
- **Rich Message Rendering**: Support for text, tables, alerts, and images
- **File Upload System**: Drag-and-drop crop image analysis
- **Real-time Chat Interface**: Smooth scrolling and loading states
- **Responsive Design**: Mobile-first with collapsible sidebar

### Agronomic Enhancements
- **Agricultural Data Visualization**: Tables for fertilizer recommendations
- **Alert System**: Color-coded alerts for urgent recommendations
- **Image Analysis**: Upload crop photos for AI analysis
- **Structured Responses**: Formatted advice with tables and alerts

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript (strict mode)
- **UI Framework**: Mantine UI v7+ with custom agricultural theme
- **State Management**: Jotai (global) + React Query (server state)
- **API Layer**: Axios with interceptors
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite

### Atomic Design Structure
```
src/
├── components/
│   ├── atoms/           # Button, Input, Icon, Typography
│   ├── molecules/       # MessageBubble, SessionItem, UploadButton
│   ├── organisms/       # ChatWindow, SessionSidebar, PromptInput
│   └── templates/       # ChatLayout (sidebar + main view)
├── pages/               # Home (chat interface)
├── hooks/               # useChatHistory, useLLMResponse
├── lib/                 # API clients, utilities
├── types/               # TypeScript interfaces
├── themes/              # Mantine custom theme
└── store/               # Jotai atoms
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🎨 Design System

### Color Palette
- **Primary**: Green (#16a34a) - Agricultural theme
- **Secondary**: Lime (#84cc16) - Accent color
- **Alerts**: Blue (info), Yellow (warning), Red (error), Green (success)

### Typography
- **Font Family**: Inter (system fallbacks)
- **Sizes**: Responsive scale with proper line heights
- **Weights**: Regular (400), Medium (500), Semibold (600)

### Components
- **Buttons**: Rounded, hover states, loading indicators
- **Papers**: Elevated surfaces with shadows
- **Inputs**: Consistent border radius and focus states
- **Tables**: Striped rows with hover effects

## 🧪 Testing

### Unit Tests
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Test Coverage
- Components (atoms, molecules, organisms)
- Custom hooks (useChatHistory, useLLMResponse)
- Utility functions
- API integration layers

## 📝 API Integration

### Mock Responses (Demo)
The app includes mock AI responses for demonstration. To integrate with a real RAG backend:

1. Update `src/hooks/useLLMResponse.ts`
2. Configure API endpoints in `src/lib/api.ts`
3. Add authentication tokens as needed

### Expected API Format
```typescript
// POST /api/chat
{
  message: string;
  sessionId: string;
  images?: string[];
}

// Response
{
  text: string;
  tables?: TableData[];
  alerts?: AlertData[];
  images?: ImageData[];
}
```

## 🔧 Customization

### Theming
Modify `src/themes/agroTheme.ts` to customize:
- Colors and gradients
- Typography scales
- Component defaults
- Spacing system

### Components
Each component is built with:
- TypeScript interfaces for props
- Mantine theming integration
- Responsive design patterns
- Accessibility features

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (collapsible sidebar)
- **Tablet**: 768px - 1024px (adaptive layout)
- **Desktop**: > 1024px (full sidebar)

### Mobile Features
- Hamburger menu for sidebar toggle
- Touch-friendly interactions
- Optimized message bubbles
- Drag-and-drop file uploads

## 🌟 Production Considerations

### Performance
- Code splitting with React.lazy
- Optimized bundle size
- Image lazy loading
- Efficient re-renders with React Query

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Color contrast compliance

### Security
- Input sanitization
- File upload validation
- API request authentication
- XSS protection

## 📚 Documentation

### Component Library
Each component includes:
- TypeScript interfaces
- Props documentation
- Usage examples
- Test coverage

### API Documentation
- Request/response schemas
- Error handling patterns
- Authentication flows
- Rate limiting guidelines

## 🤝 Contributing

1. Follow atomic design principles
2. Maintain TypeScript strict mode
3. Write tests for new components
4. Use Mantine components where possible
5. Follow the established theming system

## 📄 License

MIT License - see LICENSE file for details.