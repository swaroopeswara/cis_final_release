import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { RegexResponse } from 'src/app/services/Apis/RegexResponse';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.scss']
})
export class GeneralConfigComponent implements OnInit {
  personalInForm: FormGroup;
  hasError: boolean;
  internalRole = new InternalUserRole();
  public types = ['success', 'error', 'info', 'warning'];
  nationalRole: any;
  designationForm: FormGroup;
  duplicateDesignationValue: boolean;
  // designations: string[]; 
  designations = ["s1","s2","s3","s4"] ;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.personalInForm = this.formBuilder.group({
      'rolecode': ['', Validators.required],
      'rolename': ['', Validators.required],
      'title': ['', Validators.required],
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator, Validators.pattern('^[a-zA-Z0-9](\.?[a-zA-Z0-9]){1,}@drdlr\.gov.za$')])],
      'telephone': ''
    });

    this.designationForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });
    this.hasError = false;
    this.duplicateDesignationValue = false;
  }

  ngOnInit() {
    this.getDesignations();
  }

  createDesignation() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateDesignationValue = false;

    this.spinner.show();
    this.designations.forEach((type) => {
      // if (type.designationName == this.designationForm.get('name').value.trim()) {
      //   this.duplicateDesignationValue = true;
      // }
    });

    if (this.designationForm.valid && this.duplicateDesignationValue == false) {
      const input = {
        'designationName': this.designationForm.get('name').value,
        'description': this.designationForm.get('description').value,
      };
      this.serviceCall.createUamDesignation(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Designation', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateDesignationClosePopup').click();
        this.getDesignations();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Designation', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  getDesignations() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getUamDesignations().subscribe(data => {
      this.designations = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  createUser(rolecode, rolename) {
    this.personalInForm.controls['rolecode'].setValue(rolecode);
    this.personalInForm.controls['rolename'].setValue(rolename);
    this.nationalRole = this.personalInForm.get('rolename').value;
  }

  public createNationalUser() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    console.log('this.personalInForm', this.personalInForm);
    if (this.personalInForm.valid) {
      this.spinner.show();
      let internalUser = new InternalUser();
      internalUser.email = this.personalInForm.get('email').value;
      internalUser.firstName = this.personalInForm.get('firstname').value;
      internalUser.isApproved = 'YES';
      internalUser.mobileNo = this.personalInForm.get('mobile').value;
      internalUser.surname = this.personalInForm.get('lastname').value;
      internalUser.title = this.personalInForm.get('title').value;
      internalUser.userName = this.personalInForm.get('email').value;
      internalUser.userTypeCode = 'UST001';
      internalUser.userTypeName = 'INTERNAL';
      internalUser.firstLogin = 'N';
      this.serviceCall.registerInternalUser(internalUser).subscribe(data => {
        const registerInternalUserResponse = data.json();
        this.registerInternalUserRole(registerInternalUserResponse.userCode, registerInternalUserResponse.userName);
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown Error while saving user details', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  registerInternalUserRole(userCode, userName) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.internalRole = new InternalUserRole();
    this.internalRole.userCode = userCode;
    this.internalRole.userName = userName;
    this.internalRole.roleCode = this.personalInForm.get('rolecode').value;
    this.internalRole.roleName = this.personalInForm.get('rolename').value;
    this.internalRole.sectionCode = '';
    this.internalRole.sectionName = '';
    this.internalRole.provinceCode = '';
    this.internalRole.provinceName = '';
    this.internalRole.isActive = 'Y';
    this.serviceCall.registerInternalUserRole(this.internalRole).subscribe(data => {
      document.getElementById('saveNationalPopup').click();
      this.toastrService[this.types[0]]('Successful', 'Done', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while saving role details', 'Error', opt);
      this.spinner.hide();
    });
  }
}

export class InternalUser {
  userId: any;
  userName: any;
  userTypeCode: any;
  userTypeName: any;
  title: any;
  firstName: any;
  surname: any;
  mobileNo: any;
  email: any;
  isApproved: any;
  firstLogin: any;
}

export class InternalUserRole {
  userCode: any;
  userName: any;
  provinceCode: any;
  provinceName: any;
  sectionCode: any;
  sectionName: any;
  roleCode: any;
  roleName: any;
  internalRoleCode: any;
  isActive: any;
}
