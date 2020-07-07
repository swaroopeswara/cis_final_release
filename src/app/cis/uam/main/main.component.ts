import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MainService }  from './main.service';
import { AppState } from "../../../app.state";
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'az-main',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [ MainService ] 
})
export class MainComponent { 
    public config:any;
    public configFn:any; 
    public bgColor:any;
    public date = new Date(); 
    public weatherData:any;

    constructor(private _appConfig: AppConfig, private _dashboardService: MainService){
        this.config = this._appConfig.config;
        this.configFn = this._appConfig;
        this.weatherData = _dashboardService.getWeatherData();       
    } 
}
