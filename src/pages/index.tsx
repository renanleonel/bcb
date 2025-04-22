import BalanceHistoryList from '@/components/balance-history';
import ChatScreen from '@/components/chat-screen';
import ConversationsList from '@/components/conversations-list';
import LoginScreen from '@/components/login-screen';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { mockConversations } from '@/data/mock';
import { ClientPlanType, MessagePriority, ViewType } from '@/domain/enums';
import { BalanceHistory } from '@/domain/types';
import { Message } from '@/domain/types/chat';
import { cn } from '@/lib/utils';
import { ClockIcon, LogOut, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const MESSAGE_COSTS = {
  NORMAL: 0.25,
  HIGH: 0.5,
};

export default function Index() {
  const { client, logout } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [view, setView] = useState<ViewType>(ViewType.CHAT);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([
    {
      id: '1',
      date: new Date('2025-04-01'),
      amount: 500.0,
      description: 'Crédito inicial',
      balance: 476.25,
    },
  ]);

  const handleSelectConversation = (id: string) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    );

    setConversations(updatedConversations);
    mockConversations.splice(0, mockConversations.length, ...updatedConversations);

    setSelectedConversation(id);
    setView(ViewType.CHAT);
  };

  const handleMessageSend = (message: Message) => {
    const messageCost =
      message.priority === MessagePriority.HIGH ? MESSAGE_COSTS.HIGH : MESSAGE_COSTS.NORMAL;
    let newBalance = balance;

    if (client?.planType === ClientPlanType.PREPAID) {
      if (balance < messageCost) {
        toast.error('Saldo insuficiente para enviar a mensagem');
        return false;
      }

      newBalance = balance - messageCost;
      setBalance(newBalance);
    } else {
      newBalance = balance - messageCost;
      setBalance(newBalance);
    }

    const conversation = conversations.find((c) => c.id === message.conversationId);
    const recipientName = conversation ? conversation.recipientName : 'Desconhecido';

    const historyEntry = {
      id: Date.now().toString(),
      date: new Date(),
      amount: -messageCost,
      description: `Mensagem ${
        message.priority === MessagePriority.HIGH ? 'urgente' : 'normal'
      } para ${recipientName}`,
      balance: newBalance,
    };

    setBalanceHistory((prev) => [historyEntry, ...prev]);

    const updatedConversations = conversations.map((conv) =>
      conv.id === message.conversationId
        ? {
            ...conv,
            lastMessageContent: message.content,
            lastMessageTime: message.timestamp,
          }
        : conv
    );

    setConversations(updatedConversations);
    mockConversations.splice(0, mockConversations.length, ...updatedConversations);

    return true;
  };

  useEffect(() => {
    if (client) setBalance(client.balance);
  }, [client]);

  if (!client) return <LoginScreen />;

  return (
    <div className='h-screen bg-slate-50 flex flex-col overflow-hidden'>
      <header className='bg-white  p-4 shrink-0'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <h1 className='text-xl font-bold text-slate-900 animate-fade-in'>Big Chat Brasil</h1>

          <div className='flex items-center gap-2'>
            <Button
              variant={view === ViewType.CHAT ? 'default' : 'outline'}
              size='sm'
              className='animate-fade-in'
              onClick={() => setView(ViewType.CHAT)}>
              <MessageSquare className='h-4 w-4 mr-2' />
              Conversas
            </Button>

            <Button
              variant={view === 'history' ? 'default' : 'outline'}
              size='sm'
              className='animate-fade-in'
              onClick={() => setView(ViewType.HISTORY)}>
              <ClockIcon className='h-4 w-4 mr-2' />
              Histórico
            </Button>

            <div className='text-right ml-4 animate-fade-in'>
              <p className='text-sm text-slate-600'>{client.name}</p>
              <p className='text-sm font-medium text-sky-600'>Saldo: R$ {balance.toFixed(2)}</p>
            </div>

            <Button
              variant='ghost'
              size='sm'
              className='ml-2 animate-fade-in text-red-500 hover:text-red-700 hover:bg-red-50'
              onClick={logout}>
              <LogOut className='h-4 w-4 mr-2' />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {view === ViewType.CHAT ? (
        <main className='flex-1 max-w-7xl mx-auto w-full flex overflow-hidden'>
          <div
            className={cn(
              'bg-white border-r w-full md:w-80 overflow-hidden flex flex-col',
              selectedConversation ? 'hidden md:block' : 'block'
            )}>
            <ConversationsList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          <div
            className={cn(
              'flex-1 bg-slate-50 overflow-hidden flex flex-col',
              selectedConversation ? 'block' : 'hidden md:block'
            )}>
            {selectedConversation ? (
              <ChatScreen
                conversationId={selectedConversation}
                onBack={() => setSelectedConversation(null)}
                onSend={handleMessageSend}
              />
            ) : (
              <div className='h-full flex items-center justify-center'>
                <p className='text-slate-500 animate-scale-in'>
                  Selecione uma conversa para começar
                </p>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className='flex-1 max-w-7xl mx-auto w-full overflow-auto'>
          <BalanceHistoryList history={balanceHistory} />
        </main>
      )}
    </div>
  );
}
