import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Transaction,
  TransactionStatus,
  PaginatedResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from './transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly API_URL = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las transacciones con paginación
   */
  getTransactions(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Transaction>>(this.API_URL, { params });
  }

  /**
   * Obtener transacciones de un usuario específico
   */
  getTransactionsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Transaction>>(`${this.API_URL}/user/${userId}`, {
      params,
    });
  }

  /**
   * Obtener una transacción por ID
   */
  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear una nueva transacción
   */
  createTransaction(transaction: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.API_URL, transaction);
  }

  /**
   * Actualizar una transacción existente
   */
  updateTransaction(id: string, transaction: UpdateTransactionRequest): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.API_URL}/${id}`, transaction);
  }

  /**
   * Eliminar una transacción
   */
  deleteTransaction(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  /**
   * Cambiar el estado de una transacción a completada
   */
  completeTransaction(id: string): Observable<Transaction> {
    return this.updateTransaction(id, { status: TransactionStatus.COMPLETED });
  }

  /**
   * Cambiar el estado de una transacción a pendiente
   */
  pendingTransaction(id: string): Observable<Transaction> {
    return this.updateTransaction(id, { status: TransactionStatus.PENDING });
  }

  /**
   * Cambiar el estado de una transacción a fallida
   */
  failTransaction(id: string): Observable<Transaction> {
    return this.updateTransaction(id, { status: TransactionStatus.FAILED });
  }
}
