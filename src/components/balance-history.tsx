import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type BalanceHistoryItem = {
  id: string;
  date: Date;
  amount: number;
  balance: number;
  description: string;
};

type BalanceHistoryProps = {
  history: BalanceHistoryItem[];
};

export default function BalanceHistoryList({ history }: BalanceHistoryProps) {
  return (
    <div className='h-full flex flex-col'>
      <div className='p-4 border-b bg-white'>
        <h2 className='font-semibold text-lg'>Histórico de Consumo</h2>
        <p className='text-sm text-slate-500'>Seus créditos e consumo recente</p>
      </div>

      <ScrollArea className='flex-1'>
        <div className='divide-y'>
          {history.map((item) => (
            <div key={item.id} className='p-4 hover:bg-slate-50 transition-colors'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='font-medium'>{item.description}</p>
                  <p className='text-sm text-slate-500'>
                    {format(item.date, 'dd MMM yyyy, HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div className='text-right'>
                  <p
                    className={cn(
                      'font-semibold',
                      item.amount > 0 ? 'text-green-600' : 'text-slate-900'
                    )}>
                    {item.amount > 0 ? '+' : ''}
                    {Math.abs(item.amount).toFixed(2)}
                  </p>
                  <p className='text-sm text-slate-500'>Saldo: R$ {item.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
