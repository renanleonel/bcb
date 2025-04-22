import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/auth-context';
import { DocumentType } from '@/domain/enums';
import { formatDocument, validateCNPJ, validateCPF } from '@/utils/documentValidation';
import { useState } from 'react';

export default function LoginScreen() {
  const { login } = useAuth();

  const [error, setError] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.CNPJ);

  const handleDocumentChange = (value: string) => {
    const formattedValue = formatDocument(value, documentType);

    setDocumentId(formattedValue);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDoc = documentId.replace(/\D/g, '');

    if (documentType === DocumentType.CPF && !validateCPF(cleanDoc)) {
      setError('CPF inválido');
      return;
    }

    if (documentType === DocumentType.CNPJ && !validateCNPJ(cleanDoc)) {
      setError('CNPJ inválido');
      return;
    }

    login(cleanDoc, documentType);
  };

  const handleChangeDocument = (value: DocumentType) => {
    setDocumentType(value);
    setDocumentId('');
    setError('');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-slate-900 mb-2'>Big Chat Brasil</h1>
          <p className='text-slate-600'>Entre com seus dados</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='documentId'>CPF/CNPJ</Label>
            <Input
              required
              type='text'
              id='documentId'
              value={documentId}
              onChange={(e) => handleDocumentChange(e.target.value)}
              placeholder='Digite seu CPF ou CNPJ'
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Tipo de Documento</Label>
            <RadioGroup
              value={documentType}
              onValueChange={handleChangeDocument}
              className='flex space-x-4'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value={DocumentType.CPF} id={DocumentType.CPF} />
                <Label htmlFor='cpf'>CPF</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value={DocumentType.CNPJ} id={DocumentType.CNPJ} />
                <Label htmlFor={DocumentType.CNPJ}>CNPJ</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type='submit' className='w-full'>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
