import { MessagePriority, MessageStatus, SentByType } from '@/domain/enums';
import { Client, Conversation, Message, User } from '@/domain/types/chat';

export const mockClient: Client = {
  id: '1',
  name: 'Empresa ABC',
  documentId: '12345678901234',
  documentType: 'CNPJ',
  planType: 'prepaid',
  balance: 500,
  active: true,
};

export const mockUsers: User[] = [
  { id: '101', name: 'Maria Oliveira', type: 'user' },
  { id: '102', name: 'Carlos Pereira', type: 'user' },
  { id: '103', name: 'Ana Costa', type: 'user' },
  { id: '104', name: 'João Silva', type: 'user' },
  { id: '105', name: 'Lucia Santos', type: 'user' },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    recipientId: '101',
    recipientName: 'Maria Oliveira',
    lastMessageContent: 'Olá, como vai?',
    lastMessageTime: new Date('2025-04-17T09:30:00'),
    unreadCount: 0,
  },
  {
    id: '2',
    recipientId: '102',
    recipientName: 'Carlos Pereira',
    lastMessageContent: 'Poderia me ajudar com...',
    lastMessageTime: new Date('2025-04-16T15:45:00'),
    unreadCount: 2,
  },
  {
    id: '3',
    recipientId: '103',
    recipientName: 'Ana Costa',
    lastMessageContent: 'Boa tarde, gostaria de...',
    lastMessageTime: new Date('2025-04-14T14:20:00'),
    unreadCount: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      conversationId: '1',
      content: 'Olá, como vai?',
      sentBy: { id: '101', type: SentByType.USER },
      timestamp: new Date('2025-04-17T09:30:00'),
      priority: MessagePriority.NORMAL,
      status: MessageStatus.READ,
    },
    {
      id: '2',
      conversationId: '1',
      content: 'Tudo bem!',
      sentBy: { id: '1', type: SentByType.CLIENT },
      timestamp: new Date('2025-04-17T09:32:00'),
      priority: MessagePriority.NORMAL,
      status: MessageStatus.DELIVERED,
    },
  ],
  '2': [
    {
      id: '4',
      conversationId: '2',
      content: 'Poderia me ajudar com uma dúvida?',
      sentBy: { id: '102', type: SentByType.USER },
      timestamp: new Date('2025-04-16T15:45:00'),
      priority: MessagePriority.NORMAL,
      status: MessageStatus.READ,
    },
  ],
  '3': [
    {
      id: '7',
      conversationId: '3',
      content: 'Boa tarde, gostaria de saber sobre os preços',
      sentBy: { id: '103', type: SentByType.USER },
      timestamp: new Date('2025-04-14T14:20:00'),
      priority: MessagePriority.NORMAL,
      status: MessageStatus.READ,
    },
  ],
};

export const createAutoReply = (conversationId: string): Message => {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  return {
    id: Date.now().toString(),
    conversationId,
    content: `Resposta automática: ${randomNumber}`,
    sentBy: { id: conversationId, type: SentByType.USER },
    timestamp: new Date(),
    priority: MessagePriority.NORMAL,
    status: MessageStatus.SENT,
  };
};
