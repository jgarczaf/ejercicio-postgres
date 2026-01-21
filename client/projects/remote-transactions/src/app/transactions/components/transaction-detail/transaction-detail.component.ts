import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, UpdateTransactionRequest, TransactionStatus } from '../../models/transaction.models';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit, OnDestroy {
  transaction: Transaction | null = null;
  isLoading = false;
  isEditing = false;
  editFormData: UpdateTransactionRequest = {};

  transactionStatuses = Object.values(TransactionStatus);

  private destroy$ = new Subject<void>();

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadTransaction(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar los datos de una transacción
   */
  loadTransaction(id: string): void {
    this.isLoading = true;
    this.transactionService
      .getTransaction(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transaction: Transaction) => {
          this.transaction = transaction;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading transaction:', error);
          this.isLoading = false;
          this.router.navigate(['/transactions']);
        },
      });
  }

  /**
   * Activar modo edición
   */
  enableEdit(): void {
    this.isEditing = true;
    if (this.transaction) {
      this.editFormData = {
        name: this.transaction.name,
        type: this.transaction.type,
        amount: this.transaction.amount,
        status: this.transaction.status,
      };
    }
  }

  /**
   * Cancelar edición
   */
  cancelEdit(): void {
    this.isEditing = false;
    this.editFormData = {};
  }

  /**
   * Guardar cambios de la transacción
   */
  saveChanges(): void {
    if (!this.transaction) return;

    const id = this.transaction._id || this.transaction.id;
    if (!id) return;

    this.isLoading = true;
    this.transactionService
      .updateTransaction(id, this.editFormData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTransaction: Transaction) => {
          this.transaction = updatedTransaction;
          this.isEditing = false;
          this.isLoading = false;
          console.log('Transaction updated successfully');
        },
        error: (error: any) => {
          console.error('Error updating transaction:', error);
          this.isLoading = false;
        },
      });
  }

  /**
   * Eliminar la transacción
   */
  deleteTransaction(): void {
    if (!this.transaction) return;

    const id = this.transaction._id || this.transaction.id;
    if (!id) return;

    if (confirm('Are you sure you want to delete this transaction?')) {
      this.isLoading = true;
      this.transactionService
        .deleteTransaction(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Transaction deleted successfully');
            this.router.navigate(['/transactions']);
          },
          error: (error: any) => {
            console.error('Error deleting transaction:', error);
            this.isLoading = false;
          },
        });
    }
  }

  /**
   * Volver a la lista de transacciones
   */
  goBack(): void {
    this.router.navigate(['/transactions']);
  }
}