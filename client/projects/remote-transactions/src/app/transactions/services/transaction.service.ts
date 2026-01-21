import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Transaction,
  PaginatedResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '../models/transaction.models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly API_URL = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(page = 1, limit = 10): Observable<PaginatedResponse<Transaction>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<Transaction>>(this.API_URL, { params });
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.API_URL}/${id}`);
  }

  createTransaction(body: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.API_URL, body);
  }

  updateTransaction(id: string, body: UpdateTransactionRequest): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.API_URL}/${id}`, body);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
