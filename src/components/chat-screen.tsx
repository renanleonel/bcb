import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { createAutoReply, mockConversations, mockMessages } from '@/data/mock';
import { MessagePriority, MessageStatus, SentByType } from '@/domain/enums';
import { Message } from '@/domain/types/chat';
import { cn } from '@/lib/utils';
import { ArrowLeft, Search, Send, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CommonMessage, HighPriorityMessage, MessageComponent } from './message';

interface ChatScreenProps {
  conversationId: string;
  onBack: () => void;
  onSend: (message: Message) => boolean;
}

const SCROLL_ELEMENT_CLASSNAME = '[data-radix-scroll-area-viewport]';

export default function ChatScreen({ conversationId, onBack, onSend }: ChatScreenProps) {
  const { client } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(mockMessages[conversationId] || []);

    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (conversation) {
      setRecipientName(conversation.recipientName);
    }
  }, [conversationId]);

  const filteredMessages = searchTerm.trim()
    ? messages.filter((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : messages;

  const scrollAfterSendingMessage = () => {
    if (!scrollAreaRef.current) return;

    const scrollContainer = scrollAreaRef.current.querySelector(SCROLL_ELEMENT_CLASSNAME);

    if (!scrollContainer) return;

    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  };

  // const handleSend = async (isPriority: boolean = false) => {
  //   if (!newMessage.trim() || !client) return;

  //   setSending(true);
  //   const message: Message = {
  //     id: Date.now().toString(),
  //     conversationId,
  //     content: newMessage,
  //     sentBy: {
  //       id: client.id,
  //       type: SentByType.CLIENT,
  //     },
  //     timestamp: new Date(),
  //     priority: isPriority ? MessagePriority.HIGH : MessagePriority.NORMAL,
  //     status: MessageStatus.SENT,
  //   };

  //   // Call onSend callback which handles business logic
  //   const sendSuccessful = onSend(message);

  //   if (!sendSuccessful) {
  //     setSending(false);
  //     return;
  //   }

  //   // Update local state and mock data
  //   setMessages((prev) => [...prev, message]);
  //   mockMessages[conversationId] = [...(mockMessages[conversationId] || []), message];

  //   // Simulate message delivery after 1 second
  //   setTimeout(() => {
  //     const updatedMessage = { ...message, status: MessageStatus.DELIVERED };
  //     setMessages((prev) => prev.map((m) => (m.id === message.id ? updatedMessage : m)));
  //     mockMessages[conversationId] = mockMessages[conversationId].map((m) =>
  //       m.id === message.id ? updatedMessage : m
  //     );
  //   }, 1000);

  //   // Simulate typing indicator
  //   setIsTyping(true);

  //   // Add auto-reply after 2.5 seconds
  //   setTimeout(() => {
  //     setIsTyping(false);

  //     setTimeout(() => {
  //       const autoReply = createAutoReply(conversationId);
  //       setMessages((prev) => [...prev, autoReply]);
  //       mockMessages[conversationId] = [...mockMessages[conversationId], autoReply];

  //       // Mark sent message as read after receiving a reply
  //       const readMessage = { ...message, status: MessageStatus.READ };
  //       setMessages((prev) => prev.map((m) => (m.id === message.id ? readMessage : m)));
  //       mockMessages[conversationId] = mockMessages[conversationId].map((m) =>
  //         m.id === message.id ? readMessage : m
  //       );
  //     }, 500);
  //   }, 2000);

  //   setNewMessage('');
  //   setSending(false);
  // };

  const handleSend = async (isPriority: boolean = false) => {
    if (!newMessage.trim() || !client) return;

    setSending(true);

    try {
      const message = createNewMessage(newMessage, client.id, conversationId, isPriority);

      if (!onSend(message)) return;

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      mockMessages[conversationId] = updatedMessages;

      setNewMessage('');

      await updateMessageStatus(message, updatedMessages);
      await handleAutoReply(message, updatedMessages);
    } finally {
      setSending(false);
    }
  };

  const createNewMessage = (
    content: string,
    clientId: string,
    conversationId: string,
    isPriority: boolean
  ): Message => ({
    id: Date.now().toString(),
    conversationId,
    content,
    sentBy: {
      id: clientId,
      type: SentByType.CLIENT,
    },
    timestamp: new Date(),
    priority: isPriority ? MessagePriority.HIGH : MessagePriority.NORMAL,
    status: MessageStatus.SENT,
  });

  const updateMessageStatus = async (
    message: Message,
    currentMessages: Message[]
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deliveredMessage = { ...message, status: MessageStatus.DELIVERED };
    const updatedMessages = currentMessages.map((m) =>
      m.id === message.id ? deliveredMessage : m
    );

    setMessages(updatedMessages);
    mockMessages[conversationId] = updatedMessages;
  };

  const handleAutoReply = async (
    originalMessage: Message,
    currentMessages: Message[]
  ): Promise<void> => {
    setIsTyping(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const autoReply = createAutoReply(conversationId);
      const messagesWithReply = [...currentMessages, autoReply];

      const readMessage = { ...originalMessage, status: MessageStatus.READ };
      const finalMessages = messagesWithReply.map((m) =>
        m.id === originalMessage.id ? readMessage : m
      );

      setMessages(finalMessages);
      mockMessages[conversationId] = finalMessages;
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isMine = message.sentBy.type === SentByType.CLIENT;

    const props: MessageComponent = {
      message,
      isMine,
    };

    return (
      <div
        key={message.id}
        className={cn('flex mb-4 animate-fade-in', isMine ? 'justify-end' : 'justify-start')}>
        {message.priority === MessagePriority.HIGH ? (
          <HighPriorityMessage {...props} />
        ) : (
          <CommonMessage {...props} />
        )}
      </div>
    );
  };

  useEffect(() => scrollAfterSendingMessage(), [messages, filteredMessages]);

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      <div className='p-4 border-b flex items-center justify-between bg-white shrink-0'>
        <div className='flex items-center space-x-3'>
          <Button variant='ghost' size='icon' onClick={onBack} className='md:hidden'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h2 className='font-semibold'>{recipientName}</h2>
            <p className='text-sm text-slate-500'>Online</p>
          </div>
        </div>

        {showSearch ? (
          <div className='flex items-center space-x-2'>
            <Input
              autoFocus
              className='w-60'
              value={searchTerm}
              placeholder='Buscar nas mensagens...'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                setShowSearch(false);
                setSearchTerm('');
              }}>
              <ArrowLeft className='h-5 w-5 text-slate-500' />
            </Button>
          </div>
        ) : (
          <Button variant='ghost' size='icon' onClick={() => setShowSearch(true)}>
            <Search className='h-5 w-5 text-slate-500' />
          </Button>
        )}
      </div>

      <ScrollArea className='flex-1 p-4 overflow-auto' ref={scrollAreaRef}>
        <div className='space-y-4 pb-4'>
          {filteredMessages.map(renderMessage)}

          {isTyping && (
            <div className='flex justify-start mb-4 animate-fade-in'>
              <div className='bg-slate-100 text-slate-900 max-w-[70%] rounded-lg p-3'>
                <div className='flex space-x-1'>
                  <div className='h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]'></div>
                  <div className='h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]'></div>
                  <div className='h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]'></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className='p-4 border-t bg-white shrink-0'>
        <div className='flex space-x-2'>
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Digite sua mensagem...'
            className='flex-1 min-h-[40px] max-h-[120px]'
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !sending && handleSend()}
            disabled={sending}
          />
          <div className='flex space-y-2 flex-col'>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600'
              disabled={sending}
              onClick={() => handleSend(true)}
              title='Enviar como mensagem urgente'>
              <Zap className='h-5 w-5' />
            </Button>

            <Button
              onClick={() => handleSend()}
              className='h-10 w-10 shrink-0 p-0'
              disabled={sending}>
              <Send className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
