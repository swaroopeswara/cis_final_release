import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrModule } from 'ngx-toastr';

export const routes = [
  { path: '', component: ForgotPasswordComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),   
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ForgotPasswordComponent],
  providers:[ 
    RestcallService
  ]
})

export class ForgotPasswordModule { }
