import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Inyectar el token Bearer en el header Authorization
    const token = this.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Añadir el header Content-Type si no existe
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.status === 401) {
          // Error de autenticación
          errorMessage = 'Unauthorized: Your token has expired or is invalid. Please login again.';
          this.handleUnauthorized();
        } else if (error.status === 403) {
          // Error de autorización
          errorMessage = 'Forbidden: You do not have permission to access this resource.';
          this.handleForbidden();
        } else if (error.error instanceof ErrorEvent) {
          // Error en el lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error en el lado del servidor
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  /**
   * Obtener el token del localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Manejar errores de autenticación (401)
   */
  private handleUnauthorized(): void {
    // Limpiar el token
    localStorage.removeItem('auth_token');

    // Redirigir al login o mostrar un modal
    console.warn('User session expired. Please login again.');
    // Aquí puedes redirigir a la página de login usando Router
  }

  /**
   * Manejar errores de autorización (403)
   */
  private handleForbidden(): void {
    console.warn('Access denied: Insufficient permissions.');
    // Aquí puedes mostrar un mensaje al usuario
  }
}
