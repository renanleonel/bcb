import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockConversations, mockMessages, mockUsers } from '@/data/mock';
import { Conversation } from '@/domain/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquarePlus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NewConversationDialog } from './new-conversation-dialog';

interface ConversationsListProps {
  conversations: typeof mockConversations;
  onSelectConversation: (conversationId: string) => void;
}

export default function ConversationsList(props: ConversationsListProps) {
  const { conversations, onSelectConversation } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  const filteredConversations = useMemo(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) return conversations;

    return conversations.filter((conv) => {
      if (conv.recipientName.toLowerCase().includes(trimmedSearchTerm)) {
        return true;
      }

      const messages = mockMessages[conv.id] || [];
      return messages.some((msg) => msg.content.toLowerCase().includes(trimmedSearchTerm));
    });
  }, [searchTerm, conversations]);

  const handleNewConversation = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) return;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      recipientId: user.id,
      recipientName: user.name,
      lastMessageContent: 'Nova conversa iniciada',
      lastMessageTime: new Date(),
      unreadCount: 0,
    };

    mockConversations.push(newConversation);
    mockMessages[newConversation.id] = [];

    onSelectConversation(newConversation.id);
  };

  const hasConversations = filteredConversations.length > 0;

  return (
    <div className='h-full flex flex-col'>
      <div className='p-4 border-b'>
        <div className='relative'>
          <Input
            placeholder='Buscar conversas...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='space-y-1'>
          {hasConversations ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className='w-full p-4 hover:bg-slate-50 transition-colors text-left flex items-start space-x-3'>
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-baseline'>
                    <h3 className='font-semibold text-slate-900 truncate'>
                      {conversation.recipientName}
                    </h3>
                    <span className='text-sm text-slate-500'>
                      {formatDistanceToNow(conversation.lastMessageTime, {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className='text-sm text-slate-600 truncate'>
                    {conversation.lastMessageContent}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className='bg-sky-500 text-white text-xs px-2 py-1 rounded-full'>
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className='p-4 text-center text-slate-500'>Nenhuma conversa encontrada</div>
          )}
        </div>
      </ScrollArea>

      <div className='p-4 border-t'>
        <Button className='w-full' variant='outline' onClick={() => setIsNewConversationOpen(true)}>
          <MessageSquarePlus className='h-4 w-4 mr-2' />
          Nova Conversa
        </Button>
      </div>

      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        onSelectUser={handleNewConversation}
      />
    </div>
  );
}
