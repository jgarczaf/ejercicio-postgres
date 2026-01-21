import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, shareReplay } from 'rxjs/operators';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Mock initial user data
  private readonly MOCK_USER: User = {
    id: '2',
    name: 'Operator User',
    email: 'operator@company.com',
    role: 'Operador',
    permissions: ['Ver transacciones', 'Crear transacciones'], 
    lastLogin: new Date()
  };

  // State management using BehaviorSubject
  private userSubject = new BehaviorSubject<User | null>(null);
  
  // Public observable for components to consume
  user$ = this.userSubject.asObservable();

  constructor() {
    // Preload the mock user as soon as the service is created
    this.loadUserProfile().subscribe();
  }

  /**
   * Simulates an API call to fetch the current user profile.
   * Updates the centralized state upon success.
   */
  loadUserProfile(): Observable<User> {
    // Return existing user if already loaded (optional caching strategy)
    if (this.userSubject.value) {
      return of(this.userSubject.value);
    }

    // Simulate HTTP request with latency
    return of(this.MOCK_USER).pipe(
      delay(800), // Simulate network delay
      tap(user => {
        this.userSubject.next(user);
      }),
      shareReplay(1)
    );
  }

  /**
   * Returns the current value of the user synchronously
   */
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Simulates a logout action
   */
  logout(): void {
    this.userSubject.next(null);
  }

  /**
   * Simulates an update to user preferences or data
   */
  updateUser(updates: Partial<User>): Observable<User> {
    const currentUser = this.userSubject.value;
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...updates };

    return of(updatedUser).pipe(
      delay(500),
      tap(user => this.userSubject.next(user))
    );
  }
}
