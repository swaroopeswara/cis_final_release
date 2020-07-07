import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-my-surveyors',
  templateUrl: './my-surveyors.component.html',
  styleUrls: ['./my-surveyors.component.scss']
})
export class MySurveyorsComponent implements OnInit {

  personalForm: FormGroup;
  selectedSurveyor: any;
  limits = [10, 25, 50, 100];
  itemCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;
  userResponse: any;
  userCode: any;
  userName: any;
  surveyors = [];
  fullsurveyors = [];
  communcationTypes: any;
  sectors: any;
  organizationTypes: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.hasError = false;

  }
  ngOnInit() {
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    this.getMySurveyors();
    this.getSectors();
    this.getOrganizationTypes();
    this.getCommuncationTypes();
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
        surveyorusercode: this.selectedSurveyor.userCode,
        surveyorusername: this.selectedSurveyor.userName,
        assistantusercode: this.userCode,
        assistantusername: this.userName,
    };
    this.serviceCall.deleteAssistant(detachAssistantInput).subscribe((data: any) => {
      this.toastrService[this.types[0]]('Assistant Detached Successfully', 'Done', opt);
      document.getElementById('btnDetachAssistantPopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while deleting User. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.surveyors = quotData);
  }

  updateFilter(event) {
    this.surveyors = this.fullsurveyors;
    const val = event.target.value.toLowerCase();
    const temp = this.surveyors.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.surveyors = temp;
  }

  getMySurveyors() {
    this.spinner.show();
    this.serviceCall.getMySurveyors(this.userCode).subscribe((data: any) => {
      this.surveyors = data.json();
      this.fullsurveyors = this.surveyors;
      this.itemResource = new DataTableResource(this.surveyors);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.surveyors = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  selectSurveyor(surveyor) {
    this.selectedSurveyor = surveyor;
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
