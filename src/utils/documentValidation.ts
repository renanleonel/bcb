import { DocumentType } from '@/domain/enums';

// Removes non-numeric characters and validates CPF format
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }

  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }

  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return cleanCPF.charAt(9) == digit1.toString() && cleanCPF.charAt(10) == digit2.toString();
};

// Removes non-numeric characters and validates CNPJ format
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  if (cleanCNPJ.length !== 14) return false;

  // Check if all digits are the same
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // First digit validation
  let sum = 0;
  let factor = 5;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }

  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  // Second digit validation
  sum = 0;
  factor = 6;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }

  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return cleanCNPJ.charAt(12) == digit1.toString() && cleanCNPJ.charAt(13) == digit2.toString();
};

export const formatDocument = (value: string, type: DocumentType): string => {
  const numbers = value.replace(/\D/g, '');

  if (type === DocumentType.CPF) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  }

  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18);
};
