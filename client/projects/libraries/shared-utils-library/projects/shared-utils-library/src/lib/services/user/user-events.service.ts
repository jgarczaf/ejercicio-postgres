import { Injectable, NgZone } from '@angular/core';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserEventsService {
  private readonly EVENT_USER_CHANGED = 'santander:user:changed';

  // Mock initial user data (same as UserService for consistency)
  private readonly MOCK_USER: User = {
    id: '2',
    name: 'Operator User',
    email: 'operator@company.com',
    role: 'Operador',
    permissions: ['Ver transacciones', 'Crear transacciones'],
    lastLogin: new Date(),
  };

  private currentUser: User | null = null;

  constructor(private ngZone: NgZone) {
    // Preload and broadcast the mock user immediately
    this.loadUserProfile();
  }

  /**
   * Simulates loading the user profile and dispatches a Custom Event.
   * This allows any framework (Angular, React, Vue, Vanilla) to react.
   */
  loadUserProfile(): void {
    // Simulate async delay
    setTimeout(() => {
      this.dispatchEvent(this.MOCK_USER);
    }, 800);
  }

  /**
   * Dispatches the Custom Event to the window object.
   */
  private dispatchEvent(user: User | null): void {
    const event = new CustomEvent(this.EVENT_USER_CHANGED, {
      detail: user,
      bubbles: true,
      composed: true, // Allows event to pass through Shadow DOM boundaries
    });

    this.currentUser = user;
    window.dispatchEvent(event);
  }

  /**
   * Returns the last dispatched user (synchronous accessor).
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Logout triggers a null payload event
   */
  logout(): void {
    this.dispatchEvent(null);
  }

  /**
   * Updates user and dispatches event
   */
  updateUser(updates: Partial<User>): void {
    // In a real scenario, this would merge with current state.
    // Here we just merge with Mock for demo purposes since we don't hold state in this service version
    // (Custom Events are often stateless fire-and-forget).
    const updatedUser = { ...this.MOCK_USER, ...updates };

    setTimeout(() => {
      this.dispatchEvent(updatedUser);
    }, 500);
  }

  /**
   * Subscribes to the global user custom event.
   * Returns a cleanup function.
   * Uses NgZone to ensure callbacks run inside Angular zone for Change Detection.
   */
  onUserChange(callback: (user: User | null) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      // Re-enter Angular zone so UI updates automatically
      this.ngZone.run(() => {
        callback(customEvent.detail);
      });
    };

    window.addEventListener(this.EVENT_USER_CHANGED, handler);

    // Return unsubscribe function
    return () => {
      window.removeEventListener(this.EVENT_USER_CHANGED, handler);
    };
  }
}
