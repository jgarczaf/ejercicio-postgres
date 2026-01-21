/**
 * Enumeraciones para tipos de transacción
 */
export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  DIRECT_DEBIT = 'direct_debit',
  INVESTMENT = 'investment',
}

/**
 * Enumeraciones para estados de transacción
 */
export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

/**
 * Interfaz para una transacción
 */
export interface Transaction {
  _id?: string;
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interfaz para respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interfaz para crear transacción
 */
export interface CreateTransactionRequest {
  name: string;
  type: TransactionType;
  amount: number;
  userId: string;
}

/**
 * Interfaz para actualizar transacción
 */
export interface UpdateTransactionRequest {
  name?: string;
  type?: TransactionType;
  amount?: number;
  status?: TransactionStatus;
}
