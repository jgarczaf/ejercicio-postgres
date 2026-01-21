import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import {
  Transaction,
  PaginatedResponse,
  CreateTransactionRequest,
  TransactionType,
} from '../../models/transaction.models';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionDialogComponent } from '../create-transaction-dialog/create-transaction-dialog.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})
export class TransactionsListComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalTransactions = 0;

  showCreateForm = false;
  createFormData: CreateTransactionRequest = {
    name: '',
    type: TransactionType.TRANSFER,
    amount: 0,
    userId: 'b8c3b2a0-4a6a-4a3a-9d8d-1c1b88d930b1', // Usuario por defecto
  };

  transactionTypes = Object.values(TransactionType);

  private destroy$ = new Subject<void>();

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  /**
   * Calcular rango de páginas para mostrar en paginación
   */
  get pageRange(): number[] {
    const maxVisible = 5;
    const halfWindow = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.currentPage - halfWindow);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar transacciones con paginación
   */
  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService
      .getTransactions(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Transaction>) => {
          this.transactions = response.data;
          this.totalPages = response.pagination.totalPages;
          this.totalTransactions = response.pagination.total;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading transactions:', error);
          this.isLoading = false;
        },
      });
  }

  /**
   * Abrir formulario de creación
   */
  openCreateForm(): void {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      width: '520px',
      data: { defaultUserId: this.createFormData.userId },
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: CreateTransactionRequest | undefined) => {
        if (result) {
          this.createTransactionFromDialog(result);
        }
      });
  }

  /**
   * Cerrar formulario de creación
   */
  closeCreateForm(): void {
    this.showCreateForm = false;
    this.resetFormData();
  }

  /**
   * Crear una nueva transacción
   */
  createTransaction(): void {
    // kept for backward compatibility (unused in new UI)
    if (!this.validateFormData()) return;
    this.createTransactionFromDialog(this.createFormData);
  }

  private createTransactionFromDialog(data: CreateTransactionRequest): void {
    this.isLoading = true;
    this.transactionService
      .createTransaction(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentPage = 1;
          this.loadTransactions();
        },
        error: (error: any) => {
          console.error('Error creating transaction:', error);
          this.isLoading = false;
        },
      });
  }

  /**
   * Validar datos del formulario
   */
  private validateFormData(): boolean {
    if (
      !this.createFormData.name ||
      !this.createFormData.type ||
      this.createFormData.amount <= 0
    ) {
      alert('Please fill in all required fields correctly');
      return false;
    }
    return true;
  }

  /**
   * Resetear datos del formulario
   */
  private resetFormData(): void {
    this.createFormData = {
      name: '',
      type: TransactionType.TRANSFER,
      amount: 0,
      userId: '2',
    };
  }

  /**
   * Ver detalle de una transacción
   */
  viewDetails(transaction: Transaction): void {
    const id = transaction._id || transaction.id;
    this.router.navigate(['/transactions', id]);
  }

  /**
   * Eliminar una transacción
   */
  deleteTransaction(transaction: Transaction): void {
    const id = transaction._id || transaction.id;
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.isLoading = true;
      this.transactionService
        .deleteTransaction(id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Transaction deleted successfully');
            this.loadTransactions();
          },
          error: (error: any) => {
            console.error('Error deleting transaction:', error);
            this.isLoading = false;
          },
        });
    }
  }

  /**
   * Cambiar de página
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadTransactions();
  }
}
