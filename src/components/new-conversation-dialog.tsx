import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockConversations, mockUsers } from '@/data/mock';
import { useMemo } from 'react';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

export function NewConversationDialog(props: NewConversationDialogProps) {
  const { open, onOpenChange, onSelectUser } = props;

  const availableUsers = useMemo(() => {
    const existingRecipientIds = new Set(mockConversations.map((conv) => conv.recipientId));

    return mockUsers.filter((user) => !existingRecipientIds.has(user.id));
  }, []);

  const hasAvailableUsers = availableUsers.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>Selecione um usuário para iniciar uma conversa</DialogDescription>
        </DialogHeader>

        {hasAvailableUsers ? (
          <Select
            onValueChange={(value) => {
              onSelectUser(value);
              onOpenChange(false);
            }}>
            <SelectTrigger>
              <SelectValue placeholder='Selecione um usuário' />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className='text-sm text-slate-500'>
            Não há usuários disponíveis para novas conversas.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
