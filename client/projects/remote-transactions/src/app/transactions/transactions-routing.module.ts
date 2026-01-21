import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsListComponent } from './components/transactions-list/transactions-list.component';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsListComponent,
    data: { title: 'Transacciones' }
  },
  {
    path: ':id',
    component: TransactionDetailComponent,
    data: { title: 'Detalle de Transacción' }
  },
  {
    path: '**',
    component: TransactionDetailComponent,
    data: { title: 'Error de Transacción' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
