import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExternalRegisterComponent } from './external-register.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaModule } from 'ng-recaptcha';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

export const routes = [
  { path: '', component: ExternalRegisterComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot(), // ToastrModule added
    FormsModule,
    NgxSpinnerModule,
    MultiselectDropdownModule,
    RecaptchaModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ExternalRegisterComponent],
  providers:[ 
    RestcallService
  ]
})

export class ExternalRegisterModule { }
