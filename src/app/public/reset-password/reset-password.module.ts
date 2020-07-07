import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

export const routes = [
  { path: '', component: ResetPasswordComponent, pathMatch: 'full' }
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
  declarations: [ResetPasswordComponent]
})

export class ResetPasswordModule { }
