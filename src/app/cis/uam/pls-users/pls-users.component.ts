import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-pls-users',
  templateUrl: './pls-users.component.html',
  styleUrls: ['./pls-users.component.scss']
})
export class PlsUsersComponent implements OnInit {

  plsForm: FormGroup;
  selectedPlsUser: any;
  limits = [10, 25, 50, 100];
  itemCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  userResponse: any;
  userCode: any;
  userName: any;
  plsusers = [];
  fullplsusers = [];
  hasError: boolean;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
    this.plsForm = this.formBuilder.group({
      'plscode': ['', Validators.required],
      'surname': '',
      'initials': '',
      'plsusertype': ['', Validators.required],
      'postaladdress2': '',
      'postaladdress3': '',
      'postaladdress4': '',
      'postalcode': '',
      'telephoneno': '',
      'cellphoneno': ['', Validators.required],
      'faxno': '',
      'courierservice': '',
      'restictedind': '',
      'sectionalplanind': ['', Validators.required],
      'generalnotes': '',
      'provcode': '',
      'email': ['', Validators.required],
      'createduser': '',
      'createddate': '',
      'modifieduser': '',
      'modifieddate': '',
      'description': '',
      'surveyorid': null,
      'sgofficeid': null,
      'isActive': ['', Validators.required],
      'isValid': ['', Validators.required]
    });

    this.hasError = false;
  }

  ngOnInit() {
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    this.getAllPlsUsers();
  }

  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.plsusers = quotData);
  }

  updateFilter(event) {
    this.plsusers = this.fullplsusers;
    const val = event.target.value.toLowerCase();
    const temp = this.plsusers.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.plsusers = temp;
  }

  getAllPlsUsers() {
    this.spinner.show();
    this.serviceCall.getAllPlsUsers().subscribe((data: any) => {
      this.plsusers = data.json();
      this.fullplsusers = this.plsusers;
      this.itemResource = new DataTableResource(this.plsusers);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.plsusers = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  addPlsUser() {
    this.plsForm.controls['plscode'].setValue('');
    this.plsForm.controls['surname'].setValue('');
    this.plsForm.controls['initials'].setValue('');
    this.plsForm.controls['plsusertype'].setValue('');
    this.plsForm.controls['postaladdress2'].setValue('');
    this.plsForm.controls['postaladdress3'].setValue('');
    this.plsForm.controls['postaladdress4'].setValue('');
    this.plsForm.controls['postalcode'].setValue('');
    this.plsForm.controls['telephoneno'].setValue('');
    this.plsForm.controls['cellphoneno'].setValue('');
    this.plsForm.controls['faxno'].setValue('');
    this.plsForm.controls['courierservice'].setValue('');
    this.plsForm.controls['restictedind'].setValue('');
    this.plsForm.controls['sectionalplanind'].setValue('false');
    this.plsForm.controls['generalnotes'].setValue('');
    this.plsForm.controls['provcode'].setValue('');
    this.plsForm.controls['email'].setValue('');
    this.plsForm.controls['createduser'].setValue('');
    this.plsForm.controls['modifieduser'].setValue('');
    this.plsForm.controls['description'].setValue('');
    this.plsForm.controls['surveyorid'].setValue('');
    this.plsForm.controls['sgofficeid'].setValue('');
    this.plsForm.controls['isActive'].setValue('N');
    this.plsForm.controls['isValid'].setValue('N');
  }

  savePlsUser() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.hasError = true;
    this.spinner.show();

    const addPlsUserInput = {
      'plscode': this.plsForm.get('plscode').value,
      'surname': this.plsForm.get('surname').value,
      'initials': this.plsForm.get('initials').value,
      'postaladdress1': this.plsForm.get('plsusertype').value,
      'postaladdress2': this.plsForm.get('postaladdress2').value,
      'postaladdress3': this.plsForm.get('postaladdress3').value,
      'postaladdress4': this.plsForm.get('postaladdress4').value,
      'postalcode': this.plsForm.get('postalcode').value,
      'telephoneno': this.plsForm.get('telephoneno').value,
      'cellphoneno': this.plsForm.get('cellphoneno').value,
      'faxno': this.plsForm.get('faxno').value,
      'courierservice': this.plsForm.get('courierservice').value,
      'restictedind': this.plsForm.get('restictedind').value,
      'sectionalplanind': this.plsForm.get('sectionalplanind').value,
      'generalnotes': this.plsForm.get('generalnotes').value,
      'provcode': this.plsForm.get('provcode').value,
      'email': this.plsForm.get('email').value,
      'createduser': this.plsForm.get('createduser').value,
      'modifieduser': this.plsForm.get('modifieduser').value,
      'description': this.plsForm.get('description').value,
      'surveyorid': this.plsForm.get('surveyorid').value,
      'sgofficeid': this.plsForm.get('sgofficeid').value,
      'isActive': this.plsForm.get('isActive').value,
      'isValid': this.plsForm.get('isValid').value,
    };

    console.log('this.plsForm.valid', this.plsForm);
    if (this.plsForm.valid) {
      this.serviceCall.registerPlsUser(addPlsUserInput).subscribe(data => {
        // console.log('data', data);
        // const response = data.json();
        this.getAllPlsUsers();
        this.hasError = false;
        document.getElementById('btnSavePlsUserPopup').click();
        this.toastrService[this.types[0]]('Succesfully added Pls user', 'Success', opt);
        this.spinner.hide();

      }, error => {
        this.toastrService[this.types[1]]('Unknown Error while updating pls user details', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.spinner.hide();
    }
  }

  updatePlsUser() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.hasError = true;
    this.spinner.show();

    const addPlsUserInput = {
      'plscode': this.plsForm.get('plscode').value,
      'surname': this.plsForm.get('surname').value,
      'initials': this.plsForm.get('initials').value,
      'postaladdress1': this.plsForm.get('plsusertype').value,
      'postaladdress2': this.plsForm.get('postaladdress2').value,
      'postaladdress3': this.plsForm.get('postaladdress3').value,
      'postaladdress4': this.plsForm.get('postaladdress4').value,
      'postalcode': this.plsForm.get('postalcode').value,
      'telephoneno': this.plsForm.get('telephoneno').value,
      'cellphoneno': this.plsForm.get('cellphoneno').value,
      'faxno': this.plsForm.get('faxno').value,
      'courierservice': this.plsForm.get('courierservice').value,
      'restictedind': this.plsForm.get('restictedind').value,
      'sectionalplanind': this.plsForm.get('sectionalplanind').value,
      'generalnotes': this.plsForm.get('generalnotes').value,
      'provcode': this.plsForm.get('provcode').value,
      'email': this.plsForm.get('email').value,
      'createduser': this.plsForm.get('createduser').value,
      'modifieduser': this.plsForm.get('modifieduser').value,
      'description': this.plsForm.get('description').value,
      'surveyorid': this.plsForm.get('surveyorid').value,
      'sgofficeid': this.plsForm.get('sgofficeid').value,
      'isActive': this.plsForm.get('isActive').value,
      'isValid': this.plsForm.get('isValid').value,
    };

    if (this.plsForm.valid) {
      this.serviceCall.updatePlsUser(addPlsUserInput).subscribe(data => {
        this.getAllPlsUsers();
        this.hasError = false;
        document.getElementById('btnUpdatePlsUserPopup').click();
        this.toastrService[this.types[0]]('Succesfully updated Pls user', 'Success', opt);
        this.spinner.hide();

      }, error => {
        this.toastrService[this.types[1]]('Unknown Error while updating pls user details', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.spinner.hide();
    }
  }

  selectPlsUser(plsuser) {
    this.selectedPlsUser = plsuser;
    this.plsForm.controls['plscode'].setValue(plsuser.plscode);
    this.plsForm.controls['surname'].setValue(plsuser.surname);
    this.plsForm.controls['initials'].setValue(plsuser.initials);
    this.plsForm.controls['plsusertype'].setValue(plsuser.postaladdress1);
    this.plsForm.controls['postaladdress2'].setValue(plsuser.postaladdress2);
    this.plsForm.controls['postaladdress3'].setValue(plsuser.postaladdress3);
    this.plsForm.controls['postaladdress4'].setValue(plsuser.postaladdress4);
    this.plsForm.controls['postalcode'].setValue(plsuser.postalcode);
    this.plsForm.controls['telephoneno'].setValue(plsuser.telephoneno);
    this.plsForm.controls['cellphoneno'].setValue(plsuser.cellphoneno);
    this.plsForm.controls['faxno'].setValue(plsuser.faxno);
    this.plsForm.controls['courierservice'].setValue(plsuser.courierservice);
    this.plsForm.controls['restictedind'].setValue(plsuser.restictedind);
    this.plsForm.controls['sectionalplanind'].setValue(plsuser.sectionalplanind);
    this.plsForm.controls['generalnotes'].setValue(plsuser.generalnotes);
    this.plsForm.controls['provcode'].setValue(plsuser.provcode);
    this.plsForm.controls['email'].setValue(plsuser.email);
    this.plsForm.controls['createduser'].setValue(plsuser.createduser);
    this.plsForm.controls['modifieduser'].setValue(plsuser.modifieduser);
    this.plsForm.controls['description'].setValue(plsuser.description);
    this.plsForm.controls['surveyorid'].setValue(plsuser.surveyorid);
    this.plsForm.controls['sgofficeid'].setValue(plsuser.sgofficeid);
    this.plsForm.controls['isActive'].setValue(plsuser.isActive);
    this.plsForm.controls['isValid'].setValue(plsuser.isValid);
  }
}
