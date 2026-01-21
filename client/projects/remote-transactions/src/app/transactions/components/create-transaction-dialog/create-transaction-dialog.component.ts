import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateTransactionRequest, TransactionType } from '../../models/transaction.models';

export interface CreateTransactionDialogData {
  defaultUserId: string;
}

@Component({
  selector: 'app-create-transaction-dialog',
  templateUrl: './create-transaction-dialog.component.html',
  styleUrls: ['./create-transaction-dialog.component.scss'],
})
export class CreateTransactionDialogComponent {
  transactionTypes = Object.values(TransactionType);

  form: CreateTransactionRequest = {
    name: '',
    type: TransactionType.TRANSFER,
    amount: 0,
    userId: this.data.defaultUserId,
  };

  isSubmitting = false;

  constructor(
    private dialogRef: MatDialogRef<CreateTransactionDialogComponent, CreateTransactionRequest | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTransactionDialogData,
  ) {}

  save(): void {
    if (!this.form.name || !this.form.type || this.form.amount <= 0) {
      return;
    }
    this.isSubmitting = true;
    // Return the form to parent; parent will call API
    this.dialogRef.close(this.form);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
