import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import {loadRemoteModule} from '@angular-architects/module-federation'
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Inicio' }
  },
  {
    path: 'transactions',
    loadChildren: () => loadRemoteModule({
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './RemoteModule',
      type: 'module',
    })
      .then(m => {
        console.log('Remote module loaded', m);
        return m.TransactionsModule;
      })
      .catch((err) => {
        console.error('Failed to load remote module', err);
        return import('./components/global-error/global-error.module')
          .then(m => m.GlobalErrorModule);
      })
  },
  // Ruta de error - DEBE ser la última para actuar como catch-all
  {
    path: '**',
    component: GlobalErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
