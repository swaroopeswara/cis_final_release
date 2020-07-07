import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrModule } from 'ngx-toastr';
import { TrackingComponent } from './tracking.component';

export const routes = [
  { path: '', component: TrackingComponent, pathMatch: 'full' }
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
  declarations: [TrackingComponent],
  providers:[ 
    RestcallService
  ]
})

export class TrackingModule { }
