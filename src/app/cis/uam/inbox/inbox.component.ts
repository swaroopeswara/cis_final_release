import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  personalForm: FormGroup;
  selectedAssistant: any;
  limits = [10, 25, 50, 100];
  itemCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;
  userResponse: any;
  userCode: any;
  userName: any;
  assistants = [];
  fullassistants = [];
  communcationTypes: any;
  sectors: any;
  organizationTypes: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.hasError = false;

  }
  ngOnInit() {
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    // this.getMyTasks();
  }

  getExternalUserInfo(email) {
    this.spinner.show();
    this.serviceCall.getUserInfoByEmail(email).subscribe(data => {
      this.userResponse = data.json();
      this.personalForm.controls['firstname'].setValue(this.userResponse.firstName);
      this.personalForm.controls['lastname'].setValue(this.userResponse.surname);
      this.personalForm.controls['salutation'].setValue(this.userResponse.title);
      this.personalForm.controls['mobile'].setValue(this.userResponse.mobileNo);
      this.personalForm.controls['orgtype'].setValue(this.userResponse.externaluser.organizationtypecode + '=' + this.userResponse.externaluser.organizationtypename);
      this.personalForm.controls['email'].setValue(this.userResponse.email);
      this.personalForm.controls['telephone'].setValue(this.userResponse.telephoneNo);
      this.personalForm.controls['addressline1'].setValue(this.userResponse.externaluser.postaladdressline1);
      this.personalForm.controls['addressline2'].setValue(this.userResponse.externaluser.postaladdressline2);
      this.personalForm.controls['addressline3'].setValue(this.userResponse.externaluser.postaladdressline4);
      this.personalForm.controls['zipcode'].setValue(this.userResponse.externaluser.postalcode);
      this.personalForm.controls['sector'].setValue(this.userResponse.externaluser.sectorcode + '=' + this.userResponse.externaluser.sectorname);
      this.personalForm.controls['communication'].setValue(this.userResponse.externaluser.communicationmodetypecode + '=' + this.userResponse.externaluser.communicationmodetypename);
      this.personalForm.controls['news'].setValue(this.userResponse.externaluser.subscribenews == 'Y' ? true : false);
      this.personalForm.controls['events'].setValue(this.userResponse.externaluser.subscribeevents == 'Y' ? true : false);
      this.personalForm.controls['information'].setValue(this.userResponse.externaluser.subscribenotifications == 'Y' ? true : false);
      this.spinner.hide();
    },
      error => {
        console.log('error:', error.status);
        this.spinner.hide();
      });
  }

  detachAssistant() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const detachAssistantInput = {
        surveyorusercode: this.userCode,
        surveyorusername: this.userName,
        assistantusercode: this.selectedAssistant.userCode,
        assistantusername: this.selectedAssistant.userName,
    };
    this.serviceCall.deleteAssistant(detachAssistantInput).subscribe((data: any) => {
      this.toastrService[this.types[0]]('Assistant Detached Successfully', 'Done', opt);
      document.getElementById('btnDetachAssistantPopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while detaching User. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.assistants = quotData);
  }

  updateFilter(event) {
    this.assistants = this.fullassistants;
    const val = event.target.value.toLowerCase();
    const temp = this.assistants.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.assistants = temp;
  }

  getMyAssistants() {
    this.spinner.show();
    this.serviceCall.getMyAssistants(this.userCode).subscribe((data: any) => {
      this.assistants = data.json();
      this.fullassistants = this.assistants;
      this.itemResource = new DataTableResource(this.assistants);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.assistants = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  selectAssistant(assistant) {
    this.selectedAssistant = assistant;
  }

  getCommuncationTypes() {
    this.spinner.show();
    this.serviceCall.getCommunicationsTypes().subscribe(data => {
      this.communcationTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getSectors() {

    this.spinner.show();
    this.serviceCall.getSectors().subscribe(data => {
      this.sectors = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getOrganizationTypes() {
    this.spinner.show();
    this.serviceCall.getOrganizationTypes().subscribe(data => {
      this.organizationTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
}
