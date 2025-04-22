export enum SentByType {
  CLIENT = 'client',
  USER = 'user',
}

export enum MessageStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}
export enum MessagePriority {
  NORMAL = 'normal',
  HIGH = 'high',
}

export enum ViewType {
  CHAT = 'chat',
  HISTORY = 'history',
}

export enum ClientPlanType {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
}
