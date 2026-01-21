import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedUtilsLibraryComponent } from './shared-utils-library.component';
import { UserService } from './services/user/user.service';
import { UserEventsService } from './services/user/user-events.service';

@NgModule({
  declarations: [
    SharedUtilsLibraryComponent
  ],
  imports: [
  ],
  exports: [
    SharedUtilsLibraryComponent
  ]
})
export class SharedUtilsLibraryModule {
  /**
   * Implementación del patrón `forRoot` para la configuración del módulo.
   * 
   * Este patrón se utiliza para:
   * 1. Garantizar que los servicios (UserService, UserEventsService) sean Singletons cuando se importan en el AppModule.
   * 2. Permitir pasar configuración global a la librería si fuera necesario en el futuro.
   * 3. Evitar la duplicación de instancias de servicios si este módulo fuera importado en módulos lazy-loaded (aunque providedIn: 'root' ya maneja esto, es una buena práctica explícita en librerías compartidas).
   */
  static forRoot(): ModuleWithProviders<SharedUtilsLibraryModule> {
    return {
      ngModule: SharedUtilsLibraryModule,
      providers: [
        UserService,
        UserEventsService
      ]
    };
  }
}

