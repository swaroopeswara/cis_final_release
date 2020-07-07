import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternalRegisterComponent } from './internal-register.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrModule } from 'ngx-toastr';

export const routes = [
  { path: '', component: InternalRegisterComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    RouterModule.forChild(routes),
  ],
  declarations: [InternalRegisterComponent],
  providers:[ 
    RestcallService
  ]
})

export class InternalRegisterModule { }
