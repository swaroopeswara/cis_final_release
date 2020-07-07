import { BackTopComponent } from './theme/components/back-top/back-top.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { Globals } from './services/Apis/globals';
import { ToastrModule } from 'ngx-toastr';
import { ErrorComponent } from './public/error/error.component';
import { AuthGuardService } from './services/Apis/AuthGaurdService';
import 'pace';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AppComponent } from './app.component';
import { RestcallService } from './services/Apis/restcall.service';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateComComponent } from './public/datecom/datecom.component';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    DateComComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    HttpModule,
    BrowserAnimationsModule,
    NgxPasswordToggleModule, 
    RecaptchaModule.forRoot(),
    // ToastrModule.forRoot(),   
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    }),
    routing   
  ],
  providers: [AppConfig, RestcallService, AuthGuardService, Globals, DateComComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }