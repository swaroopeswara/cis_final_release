import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({ 
  selector: 'az-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  limits = [10, 25, 50, 100];
  itemCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;
  userResponse: any;
  userCode: any;
  userName: any;
  notifications = [];
  allnotifications = [];
  selectedNotification: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.hasError = false;

  }
  ngOnInit() {
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    this.getNotifications();
  }

  
  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.notifications = quotData);
  }

  updateFilter(event) {
    this.notifications = this.allnotifications;
    const val = event.target.value.toLowerCase();
    const temp = this.notifications.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.notifications = temp;
  }

  getNotifications() {
    this.spinner.show();
    this.serviceCall.getNotifications().subscribe((data: any) => { 
      this.notifications = data.json();
      this.allnotifications = this.notifications;
      this.itemResource = new DataTableResource(this.notifications);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.notifications = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  selectNotification(notification) {
    this.selectedNotification = notification;
  }
}
