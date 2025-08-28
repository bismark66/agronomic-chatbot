export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'data';
  metadata?: {
    imageUrl?: string;
    tableData?: TableData;
    alertLevel?: 'info' | 'warning' | 'error' | 'success';
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  conversationId?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface FileUpload {
  id: string;
  file: File;
  url: string;
  status: 'uploading' | 'success' | 'error';
  preview?: string;
}

export interface AgroResponse {
  text: string;
  tables?: TableData[];
  alerts?: {
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
  }[];
  images?: {
    url: string;
    caption: string;
  }[];
}