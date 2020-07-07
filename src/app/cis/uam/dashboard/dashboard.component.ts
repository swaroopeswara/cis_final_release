import { Globals } from 'src/app/services/Apis/globals';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppConfig } from "../../../app.config";
import { DashboardService } from './dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';

@Component({
  selector: 'az-dashboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  public config: any;
  public configFn: any;
  public bgColor: any;
  public date = new Date();
  public weatherData: any;
  public counts: any;
  public countsJson: any = '';
  userType: any;
  internalRoleCode: any;
  dashboardJson: any;
  roleCode: any;
  provinceCode: any;
  monthPaidInfo: any;
  weekPaidInfo: any;

  constructor(private globals: Globals, private _appConfig: AppConfig, private _dashboardService: DashboardService, private spinner: NgxSpinnerService, private serviceCall: RestcallService) {
    // this.config = this._appConfig.config;
    // this.configFn = this._appConfig;
    // this.weatherData = _dashboardService.getWeatherData();
    this.globals.dashboardJson.subscribe(data => {
      this.dashboardJson = data;
    });    
  }

  ngOnInit() {
    this.userType = localStorage.getItem('cis_usertype');
    this.provinceCode = localStorage.getItem('cis_selected_provincecode') == 'null' ? 'all' : localStorage.getItem('cis_selected_provincecode');

    this.getUserRegisteredCounts();
    this.getRequestsPaidInfoByProvince();
    
    if (this.userType == 'INTERNAL') {
      this.roleCode = localStorage.getItem('cis_selected_rolecode');
      this.getDashboardRights(this.roleCode);
    }
  }

  getUserRegisteredCounts() {
    this.spinner.show();
    this.serviceCall.getUserRegisteredCounts().subscribe(data => {
      this.counts = data.json();
      this.countsJson = JSON.parse(this.counts.message);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getRequestsPaidInfoByProvince() {
    this.spinner.show();
    this.serviceCall.getRequestsPaidInfoByProvince(this.provinceCode, 'month').subscribe(data => {
      this.monthPaidInfo = data.text();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });

    this.serviceCall.getRequestsPaidInfoByProvince(this.provinceCode, 'week').subscribe(data => {
      this.weekPaidInfo = data.text();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getDashboardRights(rolecode) {
    this.spinner.show();
    this.serviceCall.getDashboardRights(rolecode).subscribe(data => {
      this.dashboardJson = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


}
