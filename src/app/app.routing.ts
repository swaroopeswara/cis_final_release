import { AuthGuardService } from './services/Apis/AuthGaurdService';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { ErrorComponent } from './public/error/error.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'uam', loadChildren: './cis/uam/uam.module#UamModule', canActivate:[AuthGuardService] },
  // { path: 'im', loadChildren: './cis/im/im.module#ImModule', canActivate:[AuthGuardService] },
  { path: 'cis', loadChildren: './cis/cis.module#CisModule', canActivate:[AuthGuardService] },
  { path: 'login', loadChildren: './public/login/login.module#LoginModule' },
  { path: 'forgot-password', loadChildren: './public/forgot-password/forgot-password.module#ForgotPasswordModule' },
  { path: 'reset-password', loadChildren: './public/reset-password/reset-password.module#ResetPasswordModule' },
  { path: 'external-register', loadChildren: './public/external-register/external-register.module#ExternalRegisterModule' },
  { path: 'internal-register', loadChildren: './public/internal-register/internal-register.module#InternalRegisterModule' },
  { path: 'tracking', loadChildren: './public/tracking/tracking.module#TrackingModule' },
  { path: 'log-query', loadChildren: './public/log-query/log-query.module#LogQueryModule' },
  { path: '**', component: ErrorComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
   useHash: true
});