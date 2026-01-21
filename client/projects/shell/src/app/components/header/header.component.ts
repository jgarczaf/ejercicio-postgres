import { Component, OnInit } from '@angular/core';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  theme$: Observable<ThemeMode>;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
