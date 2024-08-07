import { HttpClientModule } from '@angular/common/http'
import { ApplicationConfig, ModuleWithProviders, importProvidersFrom } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import {
    provideRouter, withDebugTracing, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withRouterConfig, withViewTransitions,
} from '@angular/router'
import { LoggerModule, NgxLoggerLevel, TOKEN_LOGGER_SERVER_SERVICE } from 'ngx-logger'
import { environment } from '../environments/environment'
import { LandingModule } from './views/pages/landing/landing.module'
import { ServerCustomisedService } from './utility/ServerCustomisedService'
import { DropdownModule, SidebarModule } from '@coreui/angular'
import { IconSetService } from '@coreui/icons-angular'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withRouterConfig({
            onSameUrlNavigation: 'reload',
        }), withInMemoryScrolling({
            scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled',
        }), withEnabledBlockingInitialNavigation(),
        withViewTransitions(),
        withDebugTracing()),
        importProvidersFrom(SidebarModule, DropdownModule),
        IconSetService,
        provideAnimations(),
        importProvidersFrom(LoggerModule.forRoot({
            serverLoggingUrl: environment.server+environment.logging,
            level: NgxLoggerLevel.INFO,
            serverLogLevel: NgxLoggerLevel.ERROR,
            disableConsoleLogging: false,
            withCredentials: true,
        }, {
            serverProvider: {
                provide: TOKEN_LOGGER_SERVER_SERVICE,
                useClass: ServerCustomisedService,
            },
        })),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(LandingModule)
    ]
}
