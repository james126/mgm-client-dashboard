import { Routes } from '@angular/router'
import { LandingComponent } from './views/pages/landing/landing.component'

export const routes: Routes = [
    {
        path: 'landing', component: LandingComponent,
    },
    {
        path: 'register',
        loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layout/default-layout/default-layout.component').then((m) => m.DefaultLayoutComponent),
    },
    {
        path: '404',
        loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
        data: {
            title: 'Page 404',
        },
    },
    {
        path: '500',
        loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
        data: {
            title: 'Page 500',
        },
    },
    {
        path: 'login',
        loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
        data: {
            title: 'Login Page',
        },
    },
    { path: '**', redirectTo: 'landing' },
]
