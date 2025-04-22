import { MessageStatus } from '@/domain/enums';
import { Message } from '@/domain/types/chat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type MessageComponent = {
  message: Message;
  isMine: boolean;
};

const renderMessageStatus = (status: MessageStatus) => {
  if (status === MessageStatus.READ) {
    return <span className='ml-1 text-sky-100'>✓✓</span>;
  }

  if (status === MessageStatus.DELIVERED) {
    return <span className='ml-1 text-sky-100'>✓</span>;
  }

  return null;
};

export const CommonMessage = (props: MessageComponent) => {
  const { message, isMine } = props;

  return (
    <div
      className={cn(
        'max-w-[70%] rounded-lg p-3',
        isMine ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-900'
      )}>
      <p className='text-sm'>{message.content}</p>
      <div
        className={cn(
          'text-xs mt-1 flex items-center justify-end',
          isMine ? 'text-sky-100' : 'text-slate-500'
        )}>
        {format(message.timestamp, 'HH:mm', { locale: ptBR })}
        {isMine && renderMessageStatus(message.status)}
      </div>
    </div>
  );
};

export const HighPriorityMessage = (props: MessageComponent) => {
  const { message, isMine } = props;
  return (
    <div
      className={cn(
        'max-w-[70%] rounded-lg p-3 animate-pulse',
        isMine ? 'bg-red-500 text-white' : 'bg-red-100 text-slate-900 border border-red-300'
      )}>
      <div className='text-xs mb-1 font-semibold'>
        {isMine ? '⚠️ Mensagem Urgente' : '⚠️ Urgente'}
      </div>
      <p className='text-sm'>{message.content}</p>
      <div
        className={cn(
          'text-xs mt-1 flex items-center justify-end',
          isMine ? 'text-red-100' : 'text-slate-500'
        )}>
        {format(message.timestamp, 'HH:mm', { locale: ptBR })}
        {isMine && renderMessageStatus(message.status)}
      </div>
    </div>
  );
};
