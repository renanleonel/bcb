import { MessagePriority, MessageStatus, SentByType } from '../enums';

export interface Client {
  id: string;
  name: string;
  documentId: string;
  documentType: string;
  planType: string;
  balance: number;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  type: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sentBy: {
    id: string;
    type: SentByType;
  };
  timestamp: Date;
  priority: MessagePriority;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: Date;
  unreadCount: number;
}
