import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({ 
  selector: 'az-my-queries',
  templateUrl: './my-queries.component.html',
  styleUrls: ['./my-queries.component.scss']
})
export class MyQueriesComponent implements OnInit {

  limits = [10, 25, 50, 100];
  itemCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;
  userResponse: any;
  userCode: any;
  userName: any;
  queries = [];
  allqueries = [];
  selectedQuery: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.hasError = false;

  }
  ngOnInit() {
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    this.getMyQueries();
  }

  
  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.queries = quotData);
  }

  updateFilter(event) {
    this.queries = this.allqueries;
    const val = event.target.value.toLowerCase();
    const temp = this.queries.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.queries = temp;
  }

  getMyQueries() {
    this.spinner.show();
    this.serviceCall.getMyIssues(this.userName).subscribe((data: any) => { 
      this.queries = data.json();
      this.allqueries = this.queries;
      this.itemResource = new DataTableResource(this.queries);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.queries = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  approveRejectUser(user, result) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const approveRejectInput =
    {
      usercode: user.userCode,
      username: user.userName,
      isapproved: result,
      rejectionreason: '',
      apprrejusercode: this.userCode,
      apprrejusername: this.userName,
    };
    this.serviceCall.approveRejectUser(approveRejectInput).subscribe(data => {
      this.toastrService[this.types[0]]('Done', 'Success', opt);
      this.getMyQueries();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error performing task', 'Error', opt);
      this.spinner.hide();
    });
  }

  openQuery(query) {
    console.log('selectedQuery', query);
    this.selectedQuery = query;
  }

  selectAssistant(assistant) {
    this.selectedQuery = assistant;
  }
}
