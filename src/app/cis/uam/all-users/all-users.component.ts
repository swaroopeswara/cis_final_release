import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  internalUsers = [];
  fullInternalUsers = [];
  personalForm: FormGroup;
  rolesFormProvincial: FormGroup;
  rolesForm: FormGroup
  internalUserRoles: any;
  externalRoleForm: FormGroup;
  externalUsers = [];
  fullExternalUsers = [];
  selectUser: any;
  limits = [10, 25, 50, 100];
  itemCountIn = 0;
  itemCountEx = 0;
  selectedItem = [];
  itemResourceIn = new DataTableResource([]);
  itemResourceEx = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  searchText: any;
  communcationTypes: any;
  allRoles: NewRole[] = [];
  sectors: any;
  organizationTypes: any;
  hasError: boolean;
  userResponse: any;
  provinces: any;
  inRoles: any;
  exRoles: any;
  inProvinceCode: any;
  inRoleCode: any;
  exProvinceCode: any;
  exRoleCode: any;
  showUpload: boolean;
  roleTypeSelected: boolean;
  roleTypeName: any;
  roles: any;
  sameSection: boolean;
  signedAccessUploaded: boolean;
  file: any;
  internalUser = new InternalUser();
  internalRole = new InternalUserRole();
  userCode: any;
  userName: any;
  userType: any;
  roleCode: any;
  allInternalRoles: any;
  allInternalUserRoles: any;
  newRole: NewRole;
  sections: any;
  allExternalroles: any;
  selectedProvince: any;
  assistants: any;
  userProvinceCode: any = '';
  selectRole: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.personalForm = this.formBuilder.group({
      'salutation': ['', Validators.required],
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'orgtype': ['', Validators.required],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
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

    this.externalRoleForm = this.formBuilder.group({
      'province': ['', Validators.required]
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

    this.hasError = false;

  }
  ngOnInit() {
    if (localStorage.getItem('cis_selected_provincecode') == 'null') {
      this.inProvinceCode = "all";
      this.exProvinceCode = "all";
      this.inRoleCode = "all";
      this.exRoleCode = "all";
      this.userProvinceCode = localStorage.getItem('cis_selected_provincecode');
      this.getAllInternalUsers();
      this.getAllExternalUsers();
    }
    else {
      this.inProvinceCode = localStorage.getItem('cis_selected_provincecode');
      this.exProvinceCode = localStorage.getItem('cis_selected_provincecode');
      this.userProvinceCode = localStorage.getItem('cis_selected_provincecode');
      this.getInternalUsersOfProvince();
      this.getExternalUsersOfProvince();
    }

    this.getSectors();
    this.getProvinces();
    this.getInRoles();
    this.getExRoles();
    this.getSections();
    this.getOrganizationTypes();
    this.getCommuncationTypes();
  }

  getProvinces() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getProvinces().subscribe(data => {
      this.provinces = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting provinces. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  addExternalRole() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    console.log('this.selectUser', this.selectUser);

    if (this.externalRoleForm.valid) {
      const newExternalRoleInput = {
        usercode: this.selectUser.userCode,
        username: this.selectUser.userName,
        rolecode: this.selectUser.externalUserRoles[0].userRoleCode,
        rolename: this.selectUser.externalUserRoles[0].userRoleName,
        provincecode: this.externalRoleForm.get('province').value.split('=')[0],
        provincename: this.externalRoleForm.get('province').value.split('=')[1]
      };

      this.serviceCall.registerNewExternalRole(newExternalRoleInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Added', 'Done', opt);
        document.getElementById('btnAddExternalRolePopup').click();
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

  getInternalUsersOfProvince() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllInternalUsersByProvinceCode(this.inProvinceCode, this.inRoleCode).subscribe((data: any) => {
      this.internalUsers = data.json();
      this.fullInternalUsers = this.internalUsers;
      this.itemResourceIn = new DataTableResource(this.internalUsers);
      this.itemResourceIn.query({ offset: 0, limit: 10 }).then(quotData => this.internalUsers = quotData);
      this.itemResourceIn.count().then(count => this.itemCountIn = count);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting users list', 'Error', opt);
      this.spinner.hide();
    });
  }

  getInRoles() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getInternalRoles().subscribe(data => {
      this.inRoles = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getExRoles() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getExternalRoles().subscribe(data => {
      this.exRoles = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
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
        // this.getInternalUserRolesByEmail();
        // this.getAllInternalUserRolesByEmail(this.selectUser.userName);
        this.file = '';
        this.rolesForm.reset();
        this.showUpload = false;
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

  createNewRole() {
    this.hasError = true;
    this.sameSection = false;

    this.rolesFormProvincial.controls['roleName'].setValue(this.rolesForm.get('roleName').value);
    this.rolesFormProvincial.controls['provinceName'].setValue(this.rolesForm.get('provinceName').value);
    this.rolesFormProvincial.controls['roleType'].setValue(this.rolesForm.get('roleType').value);

    this.newRole = new NewRole();
    if (this.rolesFormProvincial.valid) {
      this.internalRole = new InternalUserRole();
      this.internalRole.userCode = this.selectUser.userCode;
      this.internalRole.userName = this.selectUser.userName;
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
        this.getInternalUserInfo(this.selectUser.userName);
        this.createTask(this.selectUser.userName);
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

  resetPassword(user) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();

    console.log('user', user);
    const payload = {
      type: 'adminreset',
      usercode: user.userCode,
      username: user.userName,
      oldpassword: '',
      newpassword: '',
      firstlogin: 'Y'
    }

    this.serviceCall.updatePassword(payload).subscribe((data: any) => {
      this.toastrService[this.types[0]]('Successfully reset password', 'Success', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while resetting password. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getExternalUsersOfProvince() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllExternalUsersByProvinceCode(this.exProvinceCode, this.exRoleCode).subscribe((data: any) => {
      this.externalUsers = data.json();
      this.fullExternalUsers = this.externalUsers;
      this.itemResourceEx = new DataTableResource(this.externalUsers);
      this.itemResourceEx.query({ offset: 0, limit: 10 }).then(quotData => this.externalUsers = quotData);
      this.itemResourceEx.count().then(count => this.itemCountEx = count);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting all users. Try again', 'Error', opt);
      this.spinner.hide();
    });
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

  saveProfile() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    console.log('personalForm', this.personalForm);
    if (this.personalForm.valid) {
      const updateExternalUserInput = {
        userCode: this.selectUser.userCode,
        firstName: this.personalForm.get('firstname').value,
        userTypeCode: 'UST002',
        userTypeName: 'EXTERNAL',
        title: this.personalForm.get('salutation').value,
        userName: this.selectUser.userName,
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
          subscribenews: this.personalForm.get('news').value == true ? 'Y' : 'N'
        }
      };
      this.serviceCall.updateExternalUser(updateExternalUserInput).subscribe(data => {
        document.getElementById('saveProfilePopup').click();
        this.toastrService[this.types[0]]('Successfully Updated', 'Done', opt);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  getExternalUserInfo(user) {
    this.spinner.show();
    this.selectedExternalUser(user);
    this.serviceCall.getUserInfoByEmail(user.userName).subscribe(data => {
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
      this.personalForm.controls['addressline3'].setValue(this.userResponse.externaluser.postaladdressline3);
      this.personalForm.controls['zipcode'].setValue(this.userResponse.externaluser.postalcode);
      this.personalForm.controls['sector'].setValue(this.userResponse.externaluser.sectorcode + '=' + this.userResponse.externaluser.sectorname);
      this.personalForm.controls['communication'].setValue(this.userResponse.externaluser.communicationmodetypecode + '=' + this.userResponse.externaluser.communicationmodetypename);
      this.personalForm.controls['news'].setValue(this.userResponse.externaluser.subscribenews == 'Y' ? true : false);
      this.personalForm.controls['events'].setValue(this.userResponse.externaluser.subscribeevents == 'Y' ? true : false);
      this.personalForm.controls['information'].setValue(this.userResponse.externaluser.subscribenotifications == 'Y' ? true : false);
      this.allExternalroles = this.userResponse.externalUserRoles;
      this.spinner.hide();
    },
      error => {
        console.log('error:', error.status);
        this.spinner.hide();
      });
  }

  getMyAssistants(user) {
    this.spinner.show();
    this.serviceCall.getMyAssistants(user.userCode).subscribe((data: any) => {
      this.assistants = data.json();
      this.spinner.hide();
    }, error => {
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
      // localStorage.setItem('cis_userinfo', JSON.stringify(this.userResponse));
      // localStorage.setItem('cis_usercode', this.userResponse.userCode);
      this.userCode = this.userResponse.userCode;
      this.userName = this.userResponse.userName;
      this.userType = this.userResponse.userTypeName;
      this.roleCode = this.userResponse.internalUserRoles[0].roleCode;
      // localStorage.setItem('cis_username', this.userResponse.userName);
      // localStorage.setItem('cis_email', this.userResponse.userName);
      // localStorage.setItem('cis_userid', this.userResponse.userId);
      // localStorage.setItem('cis_usertype', this.userResponse.userTypeName);

      this.allInternalRoles = this.userResponse.internalUserRoles;
      this.allInternalRoles.forEach((internalRole) => {
        this.newRole = new NewRole();
        this.newRole.roleName = internalRole.roleName;
        this.newRole.sectionName = internalRole.sectionName;
        this.newRole.provinceName = internalRole.provinceName;
        this.newRole.roleId = internalRole.roleCode;
        this.newRole.sectionId = internalRole.sectionCode;
        this.newRole.provinceId = internalRole.provinceCode;
        this.allRoles.push(this.newRole);
      });
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
        this.spinner.hide();
      });
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

  getSections() {
    this.spinner.show();
    this.serviceCall.getSections().subscribe(data => {
      this.sections = data.json();
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
        console.log('allroles', this.allRoles);
        console.log('this.rolesForm', this.rolesForm);
        if (this.allRoles[i].sectionName == this.rolesForm.get('sectionName').value.split('=').pop().trim()
          && this.allRoles[i].provinceName == this.rolesForm.get('provinceName').value.split('=').pop().trim()) {
          this.sameSection = true;
          this.spinner.hide();
          break;
        }
      }
      if (!this.sameSection) {
        this.internalRole = new InternalUserRole();
        this.internalRole.userCode = this.selectUser.userCode;
        this.internalRole.userName = this.selectUser.userName;
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
          this.getInternalUserInfo(this.selectUser.userName);
          this.getAllInternalUserRolesByEmail(this.selectUser.userName);
          this.createTask(this.selectUser.userName);
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

  getInternalUserRolesByEmail() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getInternalUserRolesByEmail(this.userName, 'Y').subscribe(data => {
      this.internalUserRoles = data.json();
      this.allInternalUserRoles = data.json();
      this.spinner.hide();
    }, error => {
      this.internalUserRoles = null;
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getAllInternalUserRolesByEmail(email) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getInternalUserRolesByEmail(email, 'all').subscribe(data => {
      this.allInternalUserRoles = data.json();
      this.allRoles = [];
      this.allInternalUserRoles.forEach((internalRole) => {
        this.newRole = new NewRole();
        this.newRole.roleName = internalRole.roleName;
        this.newRole.sectionName = internalRole.sectionName;
        this.newRole.provinceName = internalRole.provinceName;
        this.newRole.roleId = internalRole.roleCode;
        this.newRole.sectionId = internalRole.sectionCode;
        this.newRole.provinceId = internalRole.provinceCode;
        this.allRoles.push(this.newRole);
      });
      this.spinner.hide();
    }, error => {
      this.internalUserRoles = null;
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  deleteUser(code, userType) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deleteExternalUserInput = {
      usercode: code,
    };
    this.serviceCall.deleteExternalUser(deleteExternalUserInput).subscribe((data: any) => {
      userType === 'INTERNAL' ? this.getAllInternalUsers() : this.getAllExternalUsers();
      document.getElementById('btnDeleteUserPopup').click();
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
    this.itemResourceIn.query(limitsData).then(quotData => this.internalUsers = quotData);
  }

  reloadItemsEx(limitsData) {
    this.itemResourceEx.query(limitsData).then(quotData => this.externalUsers = quotData);
  }

  updateFilter(event) {
    this.internalUsers = this.fullInternalUsers;
    const val = event.target.value.toLowerCase();
    const temp = this.internalUsers.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.internalUsers = temp;
  }

  updateExternalUserFilter(event) {
    this.externalUsers = this.fullExternalUsers;
    const val = event.target.value.toLowerCase();
    const temp = this.externalUsers.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.externalUsers = temp;
  }

  deactivateUser(userType) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deactivateInput = {
      usercode: this.selectUser.userCode,
      username: this.selectUser.userName,
      isactive: 'N'
    };
    this.serviceCall.deactivateUser(deactivateInput).subscribe((data: any) => {
      if (userType == 'INTERNAL') {
        this.getAllInternalUsers();
      }
      else if (userType == 'EXTERNAL') {
        this.getAllExternalUsers();
      }
      document.getElementById('btnDeactivatePopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  activateUser(userType) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const activateInput = {
      usercode: this.selectUser.userCode,
      username: this.selectUser.userName,
      isactive: 'Y'
    };
    this.serviceCall.deactivateUser(activateInput).subscribe((data: any) => {
      if (userType == 'INTERNAL') {
        this.getAllInternalUsers();
      }
      else if (userType == 'EXTERNAL') {
        this.getAllExternalUsers();
      }
      document.getElementById('btnActivatePopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getAllInternalUsers() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllInternalUsers().subscribe((data: any) => {
      this.internalUsers = data.json();
      this.fullInternalUsers = this.internalUsers;
      this.itemResourceIn = new DataTableResource(this.internalUsers);
      this.itemResourceIn.query({ offset: 0, limit: 10 }).then(quotData => this.internalUsers = quotData);
      this.itemResourceIn.count().then(count => this.itemCountIn = count);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting users list', 'Error', opt);
      this.spinner.hide();
    });
  }

  getAllExternalUsers() {
    this.spinner.show();
    this.serviceCall.getAllExternalUsers().subscribe((data: any) => {
      this.externalUsers = data.json();
      this.fullExternalUsers = this.externalUsers;
      this.itemResourceEx = new DataTableResource(this.externalUsers);
      this.itemResourceEx.query({ offset: 0, limit: 10 }).then(quotData => this.externalUsers = quotData);
      this.itemResourceEx.count().then(count => this.itemCountEx = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  deactivateInternalRole(role) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deactivateInput = {
      userCode: role.userCode,
      userName: role.userName,
      internalRoleCode: role.internalRoleCode,
      isActive: 'N'
    };
    this.serviceCall.deactivateUserRole(deactivateInput).subscribe((data: any) => {
      this.getAllInternalUserRolesByEmail(role.userName);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  removeInternalUserRole(role) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deleteInput = {
      userCode: role.userCode,
      userName: role.userName,
      internalRoleCode: role.internalRoleCode,
    };
    this.serviceCall.deleteInternalUserRole(deleteInput).subscribe((data: any) => {
      this.getAllInternalUserRolesByEmail(role.userName);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  activateInternalRole(role) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deactivateInput = {
      userCode: role.userCode,
      userName: role.userName,
      internalRoleCode: role.internalRoleCode,
      isActive: 'Y'
    };
    this.serviceCall.deactivateUserRole(deactivateInput).subscribe((data: any) => {
      this.getAllInternalUserRolesByEmail(role.userName);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  selectedUser(user) {
    console.log('user', user);
    this.selectUser = user;
    if (user.userTypeName == 'INTERNAL') {
      // this.getInternalUserInfo(user.email);
      this.getAllInternalUserRolesByEmail(user.email);
    }
  }

  selectedRole(role) {
    this.selectRole = role;
  }


  selectedExternalUser(user) {
    console.log('user', user);
    this.selectUser = user;
  }

  removeItem(val) {
    // this.roles.forEach((item, index) => {
    //   if (val == item) this.roles.splice(index, 1);
    // });
  }

  updateRoles() {

  }
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
export class NewRole {
  roleId: number;
  sectionId: number;
  provinceId: number;
  roleName: string;
  sectionName: string;
  provinceName: string;
}