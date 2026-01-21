import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
})
export class GlobalErrorComponent implements OnInit {
  currentPath: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentPath = this.router.url;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
