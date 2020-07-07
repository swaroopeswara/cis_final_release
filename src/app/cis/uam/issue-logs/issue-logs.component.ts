import { DataTableResource } from 'angular5-data-table';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';

@Component({
  selector: 'az-issue-logs',
  templateUrl: './issue-logs.component.html',
  styleUrls: ['./issue-logs.component.scss']
})
export class IssueLogsComponent implements OnInit {

  issuelogs: any;
  selectedIssueLog: any = '';
  hasError: boolean;
  public types = ['success', 'error', 'info', 'warning'];
  status: any;
  limits = [10, 25, 50, 100];
  itemCount = 0;
  itemResource = new DataTableResource([]);
  selectedItem = [];
  fullissuelogs: any;
  issueForm: FormGroup;
  provinces: any;
  provinceName: any;

  removeFile(): void {
  }
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

      this.issueForm = formBuilder.group({
        'comments': ['', Validators.compose([Validators.required])]
    });

    this.hasError = false;
  }

  ngOnInit() {
    this.getAllIssueLogs();
    this.getProvinces();
  }

  getProvinceNameByCode(code) {
    console.log('code', code);
    this.provinceName = this.provinces.filter(paramProv => paramProv.code === code)[0].name;
    console.log('provinceName', this.provinceName);
  }

  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.issuelogs = quotData);
  }

  selectIssueLog(issueLog) {
    this.selectedIssueLog = issueLog;
    this.getProvinceNameByCode(issueLog.province);
  }

  issueLogUpdateStatus(issue, status) {

    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    let statusInput = {
      issueStatus: status,
      comments: this.issueForm.get('comments').value
    };
    this.spinner.show();
    this.serviceCall.issueLogUpdateStatus(issue.issueId, statusInput).subscribe(data => {
      this.getAllIssueLogs();
      this.toastrService[this.types[0]]('Updated Status Successfully', 'Issue', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Technical error while logging status', 'Error', opt);
      this.spinner.hide();
    });
  }

  closeIssueLogUpdateStatus(status) {

    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    if (this.issueForm.valid) {
      let statusInput = {
        issueStatus: status,
        resolvedComments: this.issueForm.get('comments').value
      };
      this.spinner.show();
      this.serviceCall.issueLogUpdateStatus(this.selectedIssueLog.issueId, statusInput).subscribe(data => {
        this.getAllIssueLogs();
        document.getElementById('btnCloseIssuePopup').click();
        this.toastrService[this.types[0]]('Updated Status Successfully', 'Issue', opt);
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Technical error while logging status', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  getIssueInfo(issue) {
    console.log('selectedIssueLog', issue);
    this.selectedIssueLog = issue;

    if (issue.province !== null) {
      this.getProvinceNameByCode(issue.province);
    }
  }

  getProvinces() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getProvinces().subscribe(data => {
      this.provinces = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  saveIssueLog(id) {

    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    let saveInput = {
      issueStatus: 'RESOLVED'
    };
    this.spinner.show();
    this.serviceCall.saveIssueLog(saveInput).subscribe(data => {
      this.getAllIssueLogs();
      this.toastrService[this.types[0]]('Updated Status Successfully', 'Issue', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Technical error while saving issue', 'Error', opt);
      this.spinner.hide();
    });
  }

  getAllIssueLogs() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllIssueLogs().subscribe(data => {
      this.issuelogs = data.json();
      this.fullissuelogs = this.issuelogs;
      this.itemResource = new DataTableResource(this.issuelogs);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.issuelogs = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Technical error while getting issues list', 'Error', opt);
      this.spinner.hide();
    });
  }

  getIssueLogStatus() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllIssueLogs().subscribe(data => {
      this.issuelogs = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Technical error while getting issue status', 'Error', opt);
      this.spinner.hide();
    });
  }

  // updateStatus() {
  //   this.hasError = true;
  //   const options = this.toastrService.toastrConfig;
  //   const opt = JSON.parse(JSON.stringify(options));
  //   this.spinner.show();
  //   if (this.status.length == 0) {
  //     this.spinner.hide();
  //     return;

  //   }

  //   const payload = {
  //     'issueLogId': 0,
  //     'status': this.status
  //   }

    // this.serviceCall.updateStatus(payload).subscribe(data => {
    //   this.toastrService[this.types[0]]('Updated Successfully', 'Done', opt);
    //   document.getElementById('btnUpdateStatus').click();
    //   this.spinner.hide();
    // },
    //   error => {
    //     console.error('Error response: ' + JSON.stringify(error));
    //     this.spinner.hide();
    //   });
  // }

  // refreshIssueLogsRequests() {
  //   this.getAllIssueLogsRequests();
  // }

  // onlyDate(date): string {
  //   return date.getFullYear()
  //     + '/' + this.leftpad(date.getMonth() + 1, 2)
  //     + '/' + this.leftpad(date.getDate(), 2)
  // }

  // leftpad(val, resultLength = 2, leftpadChar = '0'): string {
  //   return (String(leftpadChar).repeat(resultLength)
  //     + String(val)).slice(String(val).length);
  // }

}

