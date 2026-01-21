import { Routes } from '@angular/router';
import {loadRemoteModule} from '@angular-architects/module-federation';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./transactions.module').then(m => m.TransactionsModule)
  },
];

export default routes;
