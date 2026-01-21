export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  DIRECT_DEBIT = 'direct_debit',
  INVESTMENT = 'investment',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export interface Transaction {
  _id?: string;
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  userId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CreateTransactionRequest {
  name: string;
  type: TransactionType;
  amount: number;
  userId: string;
}

export interface UpdateTransactionRequest {
  name?: string;
  type?: TransactionType;
  amount?: number;
  status?: TransactionStatus;
}

export interface UserLite {
  id: string; // UUID
  name: string;
  email?: string;
}
