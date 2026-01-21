import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, filter } from 'rxjs';
import { User, UserEventsService, UserService } from 'shared-utils-library';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private userEventsService: UserEventsService,
    private http: HttpClient
  ) { }

  userFromService: User | null = null;
  userFromEvents: User | null = null;
  private destroy$ = new Subject<void>();
  private removeUserEventsListener?: () => void;

  ngOnInit(): void {
    this.http.get('http://localhost:3000/health').subscribe({
      next: (data) => {
        console.log('Health check data:', data);
      },
      error: (error) => {
        console.error('Error fetching health data:', error);
      }
    });
    // React to the RxJS-based service once the async mock resolves
    this.userService.user$
      .pipe(
        filter((user): user is User => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        this.userFromService = user;
        console.log('User service rxjs', user);
      });

    // Listen to the custom-event-based service and log when it fires
    this.removeUserEventsListener = this.userEventsService.onUserChange(user => {
      this.userFromEvents = user;
      console.log('User event service', user);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.removeUserEventsListener) {
      this.removeUserEventsListener();
    }
  }
}
