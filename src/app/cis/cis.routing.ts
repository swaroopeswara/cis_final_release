import { CisComponent } from './cis.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
    {
        path: '', 
        component: CisComponent,
        children:[
            { path:'', redirectTo:'uam', pathMatch:'full' },
            { path: 'uam', loadChildren: './uam/uam.module#UamModule', data: { breadcrumb: 'Uam' }  },
            { path: 'im', loadChildren: './im/im.module#ImModule', data: { breadcrumb: 'Im' }  }
            // { path: 'form-elements', loadChildren: 'app/pages/form-elements/form-elements.module#FormElementsModule', data: { breadcrumb: 'Form Elements' } },
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);