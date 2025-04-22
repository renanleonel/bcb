import { mockClient } from '@/data/mock';
import { DocumentType } from '@/domain/enums';
import { Client } from '@/domain/types/chat';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  client: Client | null;
  login: (documentId: string, documentType: DocumentType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const savedDocumentId = localStorage.getItem('documentId');
    const savedDocumentType = localStorage.getItem('documentType') as DocumentType;

    if (savedDocumentId && savedDocumentType) {
      login(savedDocumentId, savedDocumentType);
    }
  }, []);

  const login = (documentId: string, documentType: DocumentType) => {
    setClient(mockClient);

    localStorage.setItem('documentId', documentId);
    localStorage.setItem('documentType', documentType);
  };

  const logout = () => {
    setClient(null);

    localStorage.removeItem('documentId');
    localStorage.removeItem('documentType');

    navigate('/');
  };

  return <AuthContext.Provider value={{ client, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
