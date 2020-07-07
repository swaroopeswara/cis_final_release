import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { RegexResponse } from 'src/app/services/Apis/RegexResponse';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userInfo: any;
  organizationTypes: any;
  personalForm: FormGroup;
  personalInForm: FormGroup;
  passwordForm: FormGroup;
  rolesFormProvincial: FormGroup;
  rolesForm: FormGroup;
  externalRoleForm: FormGroup;
  allRoles: NewRole[] = [];
  orgName: any;
  public types = ['success', 'error', 'info', 'warning'];
  submitted: boolean;
  securityForm: FormGroup;
  securityQuestions: any;
  question1: string;
  question2: string;
  question3: string;
  hasQuestionError: boolean;
  hasError: boolean;
  userId: any;
  internalUserRoles: any;
  newRole: NewRole;
  alltyperoles: any;
  sections: any;
  provinces: any;
  communcationTypes: any;
  sectors: any;
  userCode: any;
  userName: any;
  userType: any;
  userResponse: any;
  response: any;
  roleCode: any;
  allExternalroles: any;
  allInternalRoles: any;
  showUpload: boolean;
  roleTypeSelected: boolean;
  roleTypeName: any;
  roles: any;
  sameSection: boolean;
  signedAccessUploaded: boolean;
  file: any;
  internalUser = new InternalUser();
  internalRole = new InternalUserRole();
  permissionExternalroles: Permissions;
  permissions: any;
  uamRights = new UamAccessRights();
  sameRole: boolean;
  sameProvince: boolean;
  addNewRole: boolean;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
    this.personalForm = this.formBuilder.group({
      'salutation': ['', Validators.required],
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'orgtype': ['', Validators.required],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'ppnno': '',
      'practicename': '',
      'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      'telephone': ['', Validators.compose([Validators.pattern('^[0-9]+$')])],
      'addressline1': ['', Validators.required],
      'addressline2': ['', Validators.required],
      'addressline3': '',
      'zipcode': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      'sector': ['', Validators.required],
      'communication': ['', Validators.required],
      'news': ['', Validators.required],
      'events': ['', Validators.required],
      'information': ['', Validators.required]
    });

    this.personalInForm = this.formBuilder.group({
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'telephone': ''
    });

    this.externalRoleForm = this.formBuilder.group({
      'province': ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      'oldPassword': ['', Validators.required],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8),
      Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')])],
      'confirmPassword': ['', Validators.required]
    });

    this.securityForm = this.formBuilder.group({
      'secq1': ['', Validators.compose([Validators.required])],
      'ans1': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'secq2': ['', Validators.compose([Validators.required])],
      'ans2': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'secq3': ['', Validators.compose([Validators.required])],
      'ans3': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    });

    this.rolesForm = this.formBuilder.group({
      'roleName': ['', Validators.required],
      'sectionName': ['', Validators.required],
      'provinceName': ['', Validators.required],
      'roleType': ['', Validators.required],
    });

    this.rolesFormProvincial = this.formBuilder.group({
      'roleName': ['', Validators.required],
      'provinceName': ['', Validators.required],
      'roleType': ['', Validators.required],
    });

    this.submitted = false;
    this.hasError = false;
    this.sameSection = false;
    this.showUpload = false;
    this.hasQuestionError = false;
    this.signedAccessUploaded = true;
    this.sameRole = false;
    this.sameProvince = false;
    this.addNewRole = true;
  }

  updatePassword() {
    this.submitted = true;
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    if (this.passwordForm.valid) {
      this.spinner.show();
      const updatePasswordInput = {
        type: 'change',
        usercode: this.userCode,
        username: this.userName,
        oldpassword: this.passwordForm.get('oldPassword').value,
        newpassword: this.passwordForm.get('password').value,
        firstlogin: 'N'
      }

      this.serviceCall.updatePassword(updatePasswordInput).subscribe(data => {
        const res = data.json();
        if (res.message.includes('do not match')) {
          this.toastrService[this.types[1]]('Invalid Old Password', 'Error', opt);
          this.passwordForm.reset();
          this.submitted = false;
          this.spinner.hide();
        }
        else {
          this.toastrService[this.types[0]]('Password Updated Successfully', 'Success', opt);
          this.passwordForm.reset();
          this.submitted = false;
          this.spinner.hide();
        }
      }, error => {
        this.internalUserRoles = null;
        this.toastrService[this.types[1]]('Error while updating data. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
  }

  getSecurityQuestions() {
    this.spinner.show();
    this.serviceCall.getSecurityQuestions().subscribe(data => {
      this.securityQuestions = data.json();
      this.securityForm.controls['secq1'].setValue(this.userResponse.externaluser.securityquestiontypecode1 + '=' + this.userResponse.externaluser.securityquestion1);
      this.securityForm.controls['secq2'].setValue(this.userResponse.externaluser.securityquestiontypecode2 + '=' + this.userResponse.externaluser.securityquestion2);
      this.securityForm.controls['secq3'].setValue(this.userResponse.externaluser.securityquestiontypecode3 + '=' + this.userResponse.externaluser.securityquestion3);
      this.securityForm.controls['ans1'].setValue(this.userResponse.externaluser.securityanswer1);
      this.securityForm.controls['ans2'].setValue(this.userResponse.externaluser.securityanswer2);
      this.securityForm.controls['ans3'].setValue(this.userResponse.externaluser.securityanswer3);
      console.log(this.securityQuestions);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
  selectQuestion() {
    this.hasQuestionError = false;
    this.question1 = this.securityForm.get('secq1').value;
    this.question2 = this.securityForm.get('secq2').value;
    this.question3 = this.securityForm.get('secq3').value;
    if ((typeof this.question1 != 'undefined' && this.question1 != "")) {
      this.hasQuestionError = this.question1 == this.question2 ? true : this.question1 == this.question3 ? true : false;
    }
    if ((typeof this.question2 != 'undefined' && this.question2 != "") && this.hasQuestionError == false) {
      this.hasQuestionError = this.question2 == this.question1 ? true : this.question2 == this.question3 ? true : false;
    }
    if ((typeof this.question3 != 'undefined' && this.question3 != "") && this.hasQuestionError == false) {
      this.hasQuestionError = this.question3 == this.question1 ? true : this.question3 == this.question2 ? true : false;
    }
  }

  onItemChange(value) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.rolesForm.controls['roleType'].setValue(value);
    this.roleTypeSelected = true;
    this.roleTypeName = value;
    this.roles = [];
    this.getSections();
    this.rolesForm.controls['roleName'].setValue('');
    if (value == 'Provincial') {
      this.spinner.show();
      this.serviceCall.getRolesBySectionsAndProvince('', this.rolesForm.get('provinceName').value.split('=')[0]).subscribe(data => {
        this.roles = data.json();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
  }

  clearSection() {
    this.rolesFormProvincial.reset();
    this.rolesForm.reset();
    this.sameSection = false;
    this.showUpload = false;
    this.hasError = false;
    this.roleTypeSelected = false;
    this.roleTypeName = '';
  }

  createNewSection() {
    this.hasError = true;
    this.sameSection = false;
    this.newRole = new NewRole();

    if (this.rolesForm.valid) {
      this.spinner.show();
      this.newRole.roleName = this.rolesForm.get('roleName').value.split('=').pop().trim();
      this.newRole.sectionName = this.rolesForm.get('sectionName').value.split('=').pop().trim();
      this.newRole.provinceName = this.rolesForm.get('provinceName').value.split('=').pop().trim();
      this.newRole.roleId = this.rolesForm.get('roleName').value.split('=')[0];
      this.newRole.sectionId = this.rolesForm.get('sectionName').value.split('=')[0];
      this.newRole.provinceId = this.rolesForm.get('provinceName').value.split('=')[0];
      for (var i = 0; i < this.allRoles.length; i++) {

        if (this.allRoles[i].sectionName == this.rolesForm.get('sectionName').value.split('=').pop().trim()) {
          this.sameSection = true;
          this.spinner.hide();
          break;
        }
      }
      if (!this.sameSection) {
        this.internalRole = new InternalUserRole();
        this.internalRole.userCode = this.userCode;
        this.internalRole.userName = this.userName;
        this.internalRole.roleCode = this.newRole.roleId;
        this.internalRole.roleName = this.newRole.roleName;
        this.internalRole.sectionCode = this.newRole.sectionId;
        this.internalRole.sectionName = this.newRole.sectionName;
        this.internalRole.provinceCode = this.newRole.provinceId;
        this.internalRole.provinceName = this.newRole.provinceName;
        this.internalRole.isActive = 'N';
        this.serviceCall.registerInternalUserRole(this.internalRole).subscribe(data => {
          const response = data.json();
          this.internalRole.internalRoleCode = response.internalRoleCode;
          this.getInternalUserRolesByEmail();
          this.showUpload = true;
          this.spinner.hide();
        }, error => {
          const options = this.toastrService.toastrConfig;
          const opt = JSON.parse(JSON.stringify(options));
          this.toastrService[this.types[1]]('Unknown Error while saving role details', 'Error', opt);
          this.spinner.hide();
        });
        this.allRoles.push(this.newRole);
      }
    }
  }

  getInternalUserRolesByEmail() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.allRoles = [];
    this.addNewRole = true;

    this.spinner.show();
    this.serviceCall.getInternalUserRolesByEmail(this.userName, 'all').subscribe(data => {
      this.allInternalRoles = data.json();
      this.allInternalRoles.forEach((internalRole) => {
        this.newRole = new NewRole();
        this.newRole.roleName = internalRole.roleName;
        this.newRole.sectionName = internalRole.sectionName;
        this.newRole.provinceName = internalRole.provinceName;
        this.newRole.roleId = internalRole.roleCode;
        this.newRole.sectionId = internalRole.sectionCode;
        this.newRole.provinceId = internalRole.provinceCode;
        if (this.addNewRole) {
          this.addNewRole = internalRole.isActive === 'Y' ? true : false; 
        }
        this.allRoles.push(this.newRole);
      });
      this.spinner.hide();
    }, error => {
      this.internalUserRoles = null;
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  createNewRole() {
    this.hasError = true;
    this.sameRole = false;

    this.rolesFormProvincial.controls['roleName'].setValue(this.rolesForm.get('roleName').value);
    this.rolesFormProvincial.controls['provinceName'].setValue(this.rolesForm.get('provinceName').value);
    this.rolesFormProvincial.controls['roleType'].setValue(this.rolesForm.get('roleType').value);

    for (var i = 0; i < this.allInternalRoles.length; i++) {
      if (this.allInternalRoles[i].roleName == this.rolesForm.get('roleName').value.split('=')[1] &&
        this.allInternalRoles[i].provinceName == this.rolesForm.get('provinceName').value.split('=')[1]) {
          console.log('samerole');
        this.sameRole = true;
        this.spinner.hide();
        break;
      }
    }

    this.newRole = new NewRole();
    if (!this.sameRole) {
      if (this.rolesFormProvincial.valid) {
        this.internalRole = new InternalUserRole();
        this.internalRole.userCode = this.userCode;
        this.internalRole.userName = this.userName;
        this.internalRole.roleCode = this.rolesForm.get('roleName').value.split('=')[0];
        this.internalRole.roleName = this.rolesForm.get('roleName').value.split('=')[1];
        this.internalRole.sectionCode = '';
        this.internalRole.sectionName = '';
        this.internalRole.provinceCode = this.rolesForm.get('provinceName').value.split('=')[0];
        this.internalRole.provinceName = this.rolesForm.get('provinceName').value.split('=')[1];
        this.internalRole.isActive = 'N';
        this.serviceCall.registerInternalUserRole(this.internalRole).subscribe(data => {
          const response = data.json();
          this.internalRole.internalRoleCode = response.internalRoleCode;
          this.getInternalUserRolesByEmail();
          this.showUpload = true;
          this.spinner.hide();
        }, error => {
          const options = this.toastrService.toastrConfig;
          const opt = JSON.parse(JSON.stringify(options));
          this.toastrService[this.types[1]]('Unknown Error while saving role details', 'Error', opt);
          this.spinner.hide();
        });
        this.allRoles.push(this.newRole);
      }
      else {
        this.spinner.hide();
      }
    }
    else {
      this.spinner.hide();
    }
  }

  fileupload(input) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();

    this.signedAccessUploaded = false;
    this.file = input.files[0].name;
    const filesplit = input.files[0].name.split('.');
    if (filesplit[filesplit.length - 1] == 'pdf') {

      const formData = new FormData();
      formData.append('file', input.files[0]);
      formData.append('userCode', this.internalRole.userCode);
      formData.append('userName', this.internalRole.userName);
      formData.append('provinceCode', this.internalRole.provinceCode);
      formData.append('provinceName', this.internalRole.provinceName);
      formData.append('sectionCode', this.internalRole.sectionCode);
      formData.append('sectionName', this.internalRole.sectionName);
      formData.append('roleCode', this.internalRole.roleCode);
      formData.append('roleName', this.internalRole.roleName);
      formData.append('internalRoleCode', this.internalRole.internalRoleCode);
      formData.append('isActive', 'Y');
      this.serviceCall.uploadSignedUserAccess(formData).subscribe(data => {
        document.getElementById('btnAddRolePopupClose').click();
        this.toastrService.success('Signed Access Doc Uploaded', 'Done');
        this.getInternalUserRolesByEmail();
        this.file = '';
        this.rolesForm.reset();
        this.showUpload = false;
        this.createTask(this.internalRole.userName);
        // localStorage.clear();
        // this.router.navigate(['/login']);
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while uploading document. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.file = '';
      this.spinner.hide();
      this.toastrService[this.types[1]]('', 'Allowed: PDF files', opt);
    }
  }

  createTask(userName) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const createTaskInput =
    {
      taskType: 'INTERNAL_USER_PENDING_APPROVAL',
      taskReferenceCode: userName,
      taskReferenceType: 'USER',
      taskOpenDesc: 'internal user registration',
      taskAllProvinceCode: this.internalRole.provinceCode,
      taskAllOCSectionCode: this.internalRole.sectionCode,
      taskAllOCRoleCode: this.internalRole.roleCode,
      taskStatus: 'OPEN'
    };
    this.serviceCall.createTask(createTaskInput).subscribe(data => {
      const response = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getRolesBySectionsAndProvince(section) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    this.serviceCall.getRolesBySectionsAndProvince(section.split('=')[0], this.rolesForm.get('provinceName').value.split('=')[0]).subscribe(data => {
      this.roles = data.json();
      this.rolesForm.controls['roleName'].setValue('');
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  updateSecurityQuestions() {

    this.hasError = true;
    console.log('this.securityForm', this.securityForm);
    if (this.securityForm.valid && this.hasQuestionError == false) {
      const options = this.toastrService.toastrConfig;
      const opt = JSON.parse(JSON.stringify(options));

      this.spinner.show();
      const questionUpdateInput = {

        "username": this.userName,
        "usercode": this.userCode,
        "question": [{
          "code": this.securityForm.get('secq1').value.split('=')[0],
          "que": this.securityForm.get('secq1').value.split('=')[1],
          "ans": this.securityForm.get('ans1').value
        },
        {
          "code": this.securityForm.get('secq2').value.split('=')[0],
          "que": this.securityForm.get('secq2').value.split('=')[1],
          "ans": this.securityForm.get('ans2').value
        },
        {
          "code": this.securityForm.get('secq3').value.split('=')[0],
          "que": this.securityForm.get('secq3').value.split('=')[1],
          "ans": this.securityForm.get('ans3').value
        }]
      };

      this.serviceCall.updateSecurityQuestions(questionUpdateInput).subscribe(data => {
        this.toastrService[this.types[0]]('Security Questions Updated Successfully', 'Done', opt);
        this.spinner.hide();
      },
        error => {
          this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
          this.spinner.hide();
        });
    }
  }

  getExternalUserInfo(email) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getUserInfoByEmail(email).subscribe(data => {
      this.userResponse = data.json();
      localStorage.setItem('cis_userinfo', JSON.stringify(this.userResponse));
      localStorage.setItem('cis_usercode', this.userResponse.userCode);
      this.userCode = this.userResponse.userCode;
      this.userName = this.userResponse.userName;
      this.userType = this.userResponse.userTypeName;
      this.roleCode = this.userResponse.externalUserRoles[0].userRoleCode;
      localStorage.setItem('cis_username', this.userResponse.userName);
      localStorage.setItem('cis_email', this.userResponse.userName);
      localStorage.setItem('cis_userid', this.userResponse.userId);
      localStorage.setItem('cis_usertype', this.userResponse.userTypeName);

      this.personalForm.controls['firstname'].setValue(this.userResponse.firstName);
      this.personalForm.controls['lastname'].setValue(this.userResponse.surname);
      this.personalForm.controls['salutation'].setValue(this.userResponse.title);
      this.personalForm.controls['mobile'].setValue(this.userResponse.mobileNo);
      this.personalForm.controls['orgtype'].setValue(this.userResponse.externaluser.organizationtypecode + '=' + this.userResponse.externaluser.organizationtypename);
      this.personalForm.controls['email'].setValue(this.userResponse.email);
      this.personalForm.controls['telephone'].setValue(this.userResponse.telephoneNo);
      this.personalForm.controls['addressline1'].setValue(this.userResponse.externaluser.postaladdressline1);
      this.personalForm.controls['addressline2'].setValue(this.userResponse.externaluser.postaladdressline2);
      this.personalForm.controls['addressline3'].setValue(this.userResponse.externaluser.postaladdressline3);
      this.personalForm.controls['zipcode'].setValue(this.userResponse.externaluser.postalcode);
      this.personalForm.controls['sector'].setValue(this.userResponse.externaluser.sectorcode + '=' + this.userResponse.externaluser.sectorname);
      this.personalForm.controls['communication'].setValue(this.userResponse.externaluser.communicationmodetypecode + '=' + this.userResponse.externaluser.communicationmodetypename);
      this.personalForm.controls['news'].setValue(this.userResponse.externaluser.subscribenews == 'Y' ? true : false);
      this.personalForm.controls['events'].setValue(this.userResponse.externaluser.subscribeevents == 'Y' ? true : false);
      this.personalForm.controls['information'].setValue(this.userResponse.externaluser.subscribenotifications == 'Y' ? true : false);
      this.personalForm.controls['ppnno'].setValue(this.userResponse.externaluser.ppno);
      this.personalForm.controls['practicename'].setValue(this.userResponse.externaluser.practicename);
      this.allExternalroles = this.userResponse.externalUserRoles;
      this.getSecurityQuestions();

      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
        this.spinner.hide();
      });
  }

  getInternalUserInfo(email) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getUserInfoByEmail(email).subscribe(data => {
      this.userResponse = data.json();
      console.log('this.userResponse', this.userResponse);
      localStorage.setItem('cis_userinfo', JSON.stringify(this.userResponse));
      localStorage.setItem('cis_usercode', this.userResponse.userCode);
      this.userCode = this.userResponse.userCode;
      this.userName = this.userResponse.userName;
      this.userType = this.userResponse.userTypeName;
      this.roleCode = this.userResponse.internalUserRoles[0].roleCode;
      localStorage.setItem('cis_username', this.userResponse.userName);
      localStorage.setItem('cis_email', this.userResponse.userName);
      localStorage.setItem('cis_userid', this.userResponse.userId);
      localStorage.setItem('cis_usertype', this.userResponse.userTypeName);

      this.personalInForm.controls['firstname'].setValue(this.userResponse.firstName);
      this.personalInForm.controls['lastname'].setValue(this.userResponse.surname);
      this.personalInForm.controls['mobile'].setValue(this.userResponse.mobileNo);
      this.personalInForm.controls['telephone'].setValue(this.userResponse.telephoneNo);
      this.getInternalUserRolesByEmail();
      // this.allInternalRoles = this.userResponse.internalUserRoles;
      // this.allInternalRoles.forEach((internalRole) => {
      //   this.newRole = new NewRole();
      //   this.newRole.roleName = internalRole.roleName;
      //   this.newRole.sectionName = internalRole.sectionName;
      //   this.newRole.provinceName = internalRole.provinceName;
      //   this.newRole.roleId = internalRole.roleCode;
      //   this.newRole.sectionId = internalRole.sectionCode;
      //   this.newRole.provinceId = internalRole.provinceCode;
      //   this.allRoles.push(this.newRole);
      // });
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
        this.spinner.hide();
      });
  }


  getExternalUserRoles(email) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getUserInfoByEmail(email).subscribe(data => {
      this.userResponse = data.json();
      this.allExternalroles = this.userResponse.externalUserRoles;
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
        this.spinner.hide();
      });
  }

  getProvinces() {
    this.spinner.show();
    this.serviceCall.getProvinces().subscribe(data => {
      this.provinces = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getSections() {
    this.spinner.show();
    this.serviceCall.getSections().subscribe(data => {
      this.sections = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  ngOnInit() {

    if (localStorage.getItem('cis_usertype') == 'EXTERNAL') {
      this.getSectors();
      this.getProvinces();
      this.getOrganizationTypes();
      this.getExternalUserInfo(localStorage.getItem('cis_email'));
      this.getCommuncationTypes();
      this.getRolePermissions();
    }
    else if (localStorage.getItem('cis_usertype') == 'INTERNAL') {
      this.getProvinces();
      this.getSections();
      this.getInternalUserInfo(localStorage.getItem('cis_email'));
    }
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

  updateInternalUser() {
    this.submitted = true;
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    if (this.personalInForm.valid) {
      this.spinner.show();
      const updateInternalUserInput = {
        userTypeName: 'INTERNAL',
        userCode: this.userCode,
        firstName: this.personalInForm.get('firstname').value,
        surname: this.personalInForm.get('lastname').value,
        mobileNo: this.personalInForm.get('mobile').value,
        telephoneNo: this.personalInForm.get('telephone').value,
      }

      this.serviceCall.updateInternalUser(updateInternalUserInput).subscribe(data => {
        this.toastrService[this.types[0]]('Updated Successfully', 'Success', opt);
        this.passwordForm.reset();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.internalUserRoles = null;
        this.toastrService[this.types[1]]('Error while updating data. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.spinner.hide();
    }
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

  saveProfile() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    console.log('this.personalForm', this.personalForm);
    if (this.personalForm.valid) {

      const updateExternalUserInput = {
        userCode: this.userCode,
        firstName: this.personalForm.get('firstname').value,
        userTypeCode: 'UST002',
        userTypeName: 'EXTERNAL',
        title: this.personalForm.get('salutation').value,
        userName: this.userName,
        surname: this.personalForm.get('lastname').value,
        mobileNo: this.personalForm.get('mobile').value,
        telephoneNo: this.personalForm.get('telephone').value,
        externaluser: {
          organizationtypecode: this.personalForm.get('orgtype').value.split('=')[0],
          organizationtypename: this.personalForm.get('orgtype').value.split('=')[1],
          sectorCode: this.personalForm.get('sector').value.split('=')[0],
          sectorName: this.personalForm.get('sector').value.split('=')[1],
          postaladdressline1: this.personalForm.get('addressline1').value,
          postaladdressline2: this.personalForm.get('addressline2').value,
          postaladdressline3: this.personalForm.get('addressline3').value,
          postalcode: this.personalForm.get('zipcode').value,
          communicationmodetypecode: this.personalForm.get('communication').value.split('=')[0],
          communicationmodetypename: this.personalForm.get('communication').value.split('=')[1],
          subscribenotifications: this.personalForm.get('information').value == true ? 'Y' : 'N',
          subscribeevents: this.personalForm.get('events').value == true ? 'Y' : 'N',
          subscribenews: this.personalForm.get('news').value == true ? 'Y' : 'N',
        }
      };

      this.serviceCall.updateExternalUser(updateExternalUserInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Updated', 'Done', opt);
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while updating data. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  addExternalRole() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.sameProvince = false;

    for (var i = 0; i < this.allExternalroles.length; i++) {
      if (this.allExternalroles[i].userProvinceCode == this.externalRoleForm.get('province').value.split('=')[0]) {
        this.sameProvince = true;
        this.spinner.hide();
        break;
      }
    }


    if (this.externalRoleForm.valid && !this.sameProvince) {
      const newExternalRoleInput = {
        usercode: this.userCode,
        username: this.userName,
        rolecode: localStorage.getItem('cis_selected_rolecode'),
        rolename: localStorage.getItem('cis_selected_rolename'),
        provincecode: this.externalRoleForm.get('province').value.split('=')[0],
        provincename: this.externalRoleForm.get('province').value.split('=')[1]
      };

      this.serviceCall.registerNewExternalRole(newExternalRoleInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Added', 'Done', opt);
        document.getElementById('btnAddExternalRolePopup').click();
        this.getExternalUserRoles(this.userName);
        this.externalRoleForm.reset();
        this.hasError = false;
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while adding new province. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  // getRolePermissions() {
  //   const options = this.toastrService.toastrConfig;
  //   const opt = JSON.parse(JSON.stringify(options));
  //   this.spinner.show();

  //   this.serviceCall.getExternalRolesByRoleCode(localStorage.getItem('cis_selected_rolecode')).subscribe((data: any) => {
  //     this.permissions = data.json();
  //     this.permissionExternalroles = new Permissions();

  //     this.permissionExternalroles.register = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.register;
  //     this.permissionExternalroles.updatePassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.updatepassword;
  //     this.permissionExternalroles.resetPassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.resetpassword;
  //     this.permissionExternalroles.verifyProfessionalRegistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
  //     this.permissionExternalroles.reports = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports;
  //     this.spinner.hide();
  //     // console.log('this.permissionExternalroles', this.permissionExternalroles);
  //   },
  //     error => {
  //       this.toastrService[this.types[1]]('Error while extracting data. Try again', 'Error', opt);
  //       this.spinner.hide();
  //     });
  // }

  getRolePermissions() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    this.serviceCall.getExternalRolesByRoleCode(localStorage.getItem('cis_selected_rolecode')).subscribe((data: any) => {
      this.permissions = data.json();
      this.uamRights.register = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.register;
      this.uamRights.updatepassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.updatepassword;
      this.uamRights.resetpassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.resetpassword;
      this.uamRights.verifyprofregistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
      this.uamRights.userproductivityreport = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports.userproductivityreport;
      this.uamRights.userreport = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports.userreport;
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Error while extracting access rights data. Try again', 'Error', opt);
        this.spinner.hide();
      });
  }
}

export class NewRole {
  roleId: number;
  sectionId: number;
  provinceId: number;
  roleName: string;
  sectionName: string;
  provinceName: string;
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

export class Permissions {
  register: any;
  updatePassword: any;
  resetPassword: any;
  verifyProfessionalRegistration: any;
  reports: any;
}

export class UamAccessRights {
  register: any;
  updatepassword: any;
  resetpassword: any;
  verifyprofregistration: any;
  userproductivityreport: any;
  userreport: any;
}