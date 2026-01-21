import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlobalErrorComponent } from './global-error.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalErrorComponent
  }
];

@NgModule({
  declarations: [GlobalErrorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [GlobalErrorComponent]
})
export class GlobalErrorModule {}
