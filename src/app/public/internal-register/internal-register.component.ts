import { ValidationService } from '../../services/Apis/wizard-validation.service';
import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService } from 'ngx-toastr';
import { all } from 'q';

@Component({
    selector: 'az-internal-register',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './internal-register.component.html',
    styleUrls: ['./internal-register.component.scss'],
    providers: [ValidationService]
})
export class InternalRegisterComponent implements OnInit, AfterContentInit {
    public steps: any[];
    public userInfoForm: FormGroup;
    public rolesForm: FormGroup;
    rolesFormProvincial: FormGroup;
    public paymentForm: FormGroup;
    public details: any = {};
    public showConfirm: boolean;
    noUser: boolean;
    sections: any;
    provinces: any;
    roles: any;
    usersResponse: any;
    allRoles: NewRole[] = [];
    newRole: NewRole;
    signedAccessUploaded: boolean;
    public types = ['success', 'error', 'info', 'warning'];
    file: any;
    sameSection: boolean;
    hasError: boolean;
    foundUser: boolean;
    userCode: any;
    userName: any;
    internalUserRoles = [];
    showUpload: boolean;
    internalUser = new InternalUser();
    internalRole = new InternalUserRole();
    invalidLogin: boolean;
    roleTypeSelected: boolean;
    roleTypeName: any;
    designations: any;
    fileInput: any = '';
    permissions: any;
    uamInternalRights = new UamInternalAccessRights();

    ngOnInit() {
        localStorage.clear();
        this.spinner.show();
        // this.getRoles();
        this.getProvinces();
        this.getSections();
        this.getDesignations();
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

        this.steps = [
            { name: 'User Information', icon: 'fa-user', active: true, valid: false, hasError: false },
            { name: 'Roles Information', icon: 'fa-dot-circle-o ', active: false, valid: false, hasError: false }
        ]

        this.userInfoForm = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required],
            'email': ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9](\.?[a-zA-Z0-9]){1,}@drdlr\.gov\.za$')])],
            'firstName': ['', Validators.required],
            'lastName': ['', Validators.required],
            'mobileno': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')])], 
            'telephone': ['', Validators.compose([Validators.pattern('^[0-9]+$')])],
            'title': ['', Validators.required],
            'designation': ['', Validators.required],
            'uid': ''
        });

        //, {validator: ValidationService.matchingPasswords('password', 'confirmPassword')});

        this.rolesForm = this.formBuilder.group({
            'roleName': ['', Validators.required],
            'sectionName': ['', Validators.required],
            'provinceName': ['', Validators.required],
            'roleType': ['', Validators.required],
            'news': '',
            'events': '',
            'information': '',
            'register': ['', Validators.compose([Validators.pattern('^(?:Y)$')])]
        });

        this.rolesFormProvincial = this.formBuilder.group({
            'roleName': ['', Validators.required],
            'provinceName': ['', Validators.required],
            'roleType': ['', Validators.required],
            'news': '',
            'events': '',
            'information': '',
            'register': ['', Validators.compose([Validators.pattern('^(?:Y)$')])]
        });

        this.noUser = false;
        this.signedAccessUploaded = true;
        this.sameSection = false;
        this.hasError = false;
        this.foundUser = false;
        this.showUpload = false;
        this.invalidLogin = false;
        this.roleTypeSelected = false;
    }

    changeInternalRole(target) {
        this.hasError = true;
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        this.rolesForm.controls['register'].setValue('N');

        if (this.rolesForm.get('roleName').value !== '') {
            this.serviceCall.getInternalRolesByRoleCode(this.rolesForm.get('roleName').value.split('=')[0]).subscribe((data: any) => {
                this.permissions = data.json();
                this.uamInternalRights.register = JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.register;
                if (this.roleTypeName == 'Provincial') {
                    this.rolesForm.controls['register'].setValue(JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.register);
                }
                else {
                    this.rolesForm.controls['register'].setValue(JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.register);
                }
                
                this.uamInternalRights.grantaccess = JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.grantaccess;
                this.uamInternalRights.addadditionalroles = JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.addadditionalroles;
                this.uamInternalRights.verifyprofregistration = JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.verifyprofregistration;
                this.uamInternalRights.userproductivityreport = JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.reports.userproductivityreport;
                this.uamInternalRights.userreport = JSON.parse(this.permissions[0].accessRightJson).rights.internalrole.uam.reports.userreport;
                this.spinner.hide();
            },
                error => {
                    this.toastrService[this.types[1]]('Error while extracting data. Try again', 'Error', opt);
                    this.spinner.hide();
                });
        }
        else {
            this.rolesForm.controls['register'].setValue('N');
            this.spinner.hide();
        }
    }

    getUserFromAD() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.invalidLogin = false;
        this.hasError = true;
        this.spinner.show();

        if (this.userInfoForm.get('username').value.length > 0 &&
            this.userInfoForm.get('password').value.length > 0) {

            const inLoginPayload = {
                'username': this.userInfoForm.get('username').value,
                'password': this.userInfoForm.get('password').value
            }
            this.serviceCall.checkADUserExists(inLoginPayload).subscribe(data => {
                this.usersResponse = data.json();
                if (this.usersResponse.exists == true) {
                    document.getElementById('drdlrusername').setAttribute("disabled", "disabled");
                    document.getElementById('drdlrpassword').setAttribute("disabled", "disabled");
                    this.userInfoForm.controls['firstName'].setValue(this.usersResponse.firstName);
                    this.userInfoForm.controls['lastName'].setValue(this.usersResponse.lastName);
                    this.userInfoForm.controls['email'].setValue(this.usersResponse.mail.toLowerCase());
                    this.userInfoForm.controls['mobileno'].setValue(this.usersResponse.mobile);
                    this.userInfoForm.controls['uid'].setValue(this.usersResponse.uid);
                    this.foundUser = true;
                    this.spinner.hide();
                }
                else {
                    this.toastrService[this.types[1]]('Invalid Login Credentials or User doesnt exist', 'Error', opt);
                    this.invalidLogin = true;
                    this.spinner.hide();
                }

            }, error => {
                this.toastrService[this.types[1]]('Unknown Error while getting user details', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.spinner.hide();
        }
    }

    getRoles() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getInternalRoles().subscribe(data => {
            this.roles = data.json();
            // this.deleteRole('IN012');
            // this.deleteRole('IN004');
            // this.deleteRole('IN006');
            // this.deleteRole('IN011');
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    deleteRole(rolecode) {
        this.roles.forEach((item, index) => {
            if (item.rolecode === rolecode) this.roles.splice(index, 1);
        });
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

    getSections() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getSections().subscribe(data => {
            this.sections = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    onItemChange(value) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.rolesForm.controls['roleType'].setValue(value);
        this.roleTypeSelected = true;
        this.roleTypeName = value;
        this.rolesForm.controls['roleName'].setValue('');
        this.getSections();
        this.roles = [];
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

    createNewSection() {
        this.hasError = true;
        this.sameSection = false;
        this.newRole = new NewRole();
        console.log('rolesform:', this.rolesForm);
        if (this.rolesForm.valid && this.fileInput !== '') {
            this.newRole.roleName = this.rolesForm.get('roleName').value.split('=').pop().trim();
            this.newRole.sectionName = this.rolesForm.get('sectionName').value.split('=').pop().trim();
            this.newRole.provinceName = this.rolesForm.get('provinceName').value.split('=').pop().trim();
            this.newRole.roleId = this.rolesForm.get('roleName').value.split('=')[0];
            this.newRole.sectionId = this.rolesForm.get('sectionName').value.split('=')[0];
            this.newRole.provinceId = this.rolesForm.get('provinceName').value.split('=')[0];
            for (var i = 0; i < this.allRoles.length; i++) {
                console.log(this.allRoles[i].sectionName + '=' + this.rolesForm.get('sectionName').value.split('-').pop().trim());
                if (this.allRoles[i].sectionName == this.rolesForm.get('sectionName').value.split('=').pop().trim()) {
                    this.sameSection = true;
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
                    this.fileupload();
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

    createNewRole() {
        this.hasError = true;
        this.sameSection = false;

        this.rolesFormProvincial.controls['roleName'].setValue(this.rolesForm.get('roleName').value);
        this.rolesFormProvincial.controls['provinceName'].setValue(this.rolesForm.get('provinceName').value);
        this.rolesFormProvincial.controls['roleType'].setValue(this.rolesForm.get('roleType').value);
        this.rolesFormProvincial.controls['register'].setValue(this.rolesForm.get('register').value);

        this.newRole = new NewRole();
        if (this.rolesFormProvincial.valid && this.fileInput !== '') {
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
                this.fileupload();
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

    getInternalUserRolesByEmail() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getInternalUserRolesByEmail(this.userName, 'all').subscribe(data => {
            this.internalUserRoles = data.json();
            this.spinner.hide();
        }, error => {
            this.internalUserRoles = null;
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    removeRole(role) {


        this.rolesForm.reset();
        this.showUpload = false;
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        let deleteInternalUserRole = new DeleteInternalUserRole();
        deleteInternalUserRole.userCode = role.userCode;
        deleteInternalUserRole.userName = role.userName;
        deleteInternalUserRole.internalRoleCode = role.internalRoleCode;
        this.serviceCall.deleteInternalUserRole(deleteInternalUserRole).subscribe(data => {
            this.allRoles.forEach((item, index) => {
                if (item.roleId == role.roleCode && item.sectionId == role.sectionCode
                    && item.provinceId == role.provinceCode) this.allRoles.splice(index, 1);
            });
            console.log('this.allRoles:', this.allRoles);
            this.getInternalUserRolesByEmail();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    clearRoleData() {
        this.fileInput = '';
        this.file = '';
        this.signedAccessUploaded = true;
    }

    filetempupload(input) {
        this.fileInput = input;
        this.file = this.fileInput.files[0].name;
        this.signedAccessUploaded = false;
    }

    fileupload() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();

        this.signedAccessUploaded = false;
        this.file = this.fileInput.files[0].name;
        const filesplit = this.fileInput.files[0].name.split('.');
        if (filesplit[filesplit.length - 1] == 'pdf') {

            const formData = new FormData();
            formData.append('file', this.fileInput.files[0]);
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
                this.toastrService.success('Role Created and Signed Access Doc Uploaded', 'Done');
                this.getInternalUserRolesByEmail();
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

    submitInternalUserForApproval() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        let submitInternalUserForApproval = new SubmitInternalUserForApproval();
        submitInternalUserForApproval.username = this.userName;
        submitInternalUserForApproval.usercode = this.userCode;
        submitInternalUserForApproval.isapproved = 'YES';
        this.serviceCall.submitInternalUserForApproval(submitInternalUserForApproval).subscribe(data => {
            this.createTask(this.userName);
            this.toastrService[this.types[0]]('Successfully Registered', 'Registration', opt);
            this.router.navigate(['/login']);
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
        });
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
                taskAllProvinceCode:  this.internalRole.provinceCode,
                taskAllOCSectionCode : this.internalRole.sectionCode,
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

    public registerInternalUser() {
        let internalUser = new InternalUser();
        internalUser.email = this.userInfoForm.get('email').value;
        internalUser.firstName = this.userInfoForm.get('firstName').value;
        internalUser.isApproved = 'YES';
        internalUser.mobileNo = this.userInfoForm.get('mobileno').value;
        internalUser.surname = this.userInfoForm.get('lastName').value;
        internalUser.title = this.userInfoForm.get('title').value;
        internalUser.userName = this.userInfoForm.get('email').value;
        internalUser.telephoneNo = this.userInfoForm.get('telephone').value;
        internalUser.userTypeCode = 'UST001';
        internalUser.userTypeName = 'INTERNAL';
        internalUser.firstLogin = 'N';
        internalUser.adUserName = this.userInfoForm.get('uid').value;
        this.serviceCall.registerInternalUser(internalUser).subscribe(data => {
            const registerInternalUserResponse = data.json();
            this.userCode = registerInternalUserResponse.userCode;
            this.userName = registerInternalUserResponse.userName;
            this.spinner.hide();
        }, error => {
            const options = this.toastrService.toastrConfig;
            const opt = JSON.parse(JSON.stringify(options));
            this.toastrService[this.types[1]]('Unknown Error while saving user details', 'Error', opt);
            this.spinner.hide();
        });
    }

    public next() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        let userInfoForm = this.userInfoForm;

        if (this.steps[this.steps.length - 1].active)
            return false;

        this.steps.some((step, index, steps) => {
            if (index < steps.length - 1) {
                if (step.active) {
                    if (step.name == 'User Information') {
                        if (userInfoForm.valid) {
                            this.internalUser.email = this.userInfoForm.get('email').value;
                            this.internalUser.firstName = this.userInfoForm.get('firstName').value;
                            this.internalUser.isApproved = 'YES';
                            this.internalUser.mobileNo = this.userInfoForm.get('mobileno').value;
                            this.internalUser.surname = this.userInfoForm.get('lastName').value;
                            this.internalUser.title = this.userInfoForm.get('title').value;
                            this.internalUser.userName = this.userInfoForm.get('email').value;
                            this.internalUser.telephoneNo = this.userInfoForm.get('telephone').value;
                            this.internalUser.userTypeCode = 'UST001';
                            this.internalUser.userTypeName = 'INTERNAL';
                            this.internalUser.firstLogin = 'N';
                            this.internalUser.adUserName = this.userInfoForm.get('uid').value;
                            this.serviceCall.checkUserExist(this.internalUser.email).subscribe(data => {
                                const result = data.json();
                                if (result.exists == 'false') {
                                    this.serviceCall.registerInternalUser(this.internalUser).subscribe(data => {
                                        const registerInternalUserResponse = data.json();
                                        this.internalUser.userId = registerInternalUserResponse.userId;
                                        this.userCode = registerInternalUserResponse.userCode;
                                        this.userName = registerInternalUserResponse.userName;
                                        step.active = false;
                                        step.valid = true;
                                        steps[index + 1].active = true;
                                        this.spinner.hide();
                                        return true;
                                    }, error => {
                                        this.toastrService[this.types[1]]('Unknown Error while saving user details', 'Error', opt);
                                        this.spinner.hide();
                                    });
                                }
                                else {
                                    this.toastrService[this.types[1]]('Account already exists with this email', 'Error', opt);
                                    this.spinner.hide();
                                }
                            }, error => {
                                const options = this.toastrService.toastrConfig;
                                const opt = JSON.parse(JSON.stringify(options));
                                this.toastrService[this.types[1]]('Unknown Error while saving user details', 'Error', opt);
                                this.spinner.hide();
                            });
                        }
                        else {
                            this.spinner.hide();
                            step.hasError = true;
                        }
                    }
                    if (step.name == 'Personal Information') {
                        this.spinner.hide();
                        // if (this.allRoles.length > 0 && this.signedAccessUploaded ) {
                        //     step.active = false;
                        //     step.valid = true;
                        //     steps[index + 1].active = true;
                        //     return true;
                        // }
                        // else {
                        //     step.hasError = true;
                        // }
                    }
                    if (step.name == 'More Details') {
                        // if (paymentForm.valid) {
                        step.active = false;
                        step.valid = true;
                        steps[index + 1].active = true;
                        this.spinner.hide();
                        return true;
                        // }
                        // else{
                        //     step.hasError = true;
                        // }                      
                    }
                }
            }
        });
    }

    public prev() {
        if (this.steps[0].active)
            return false;
        this.steps.some(function (step, index, steps) {
            if (index != 0) {
                if (step.active) {
                    step.active = false;
                    steps[index - 1].active = true;
                    return true;
                }
            }
        });
    }

    public confirm() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        if (this.allRoles.length > 0) {
            this.submitInternalUserForApproval();
        }
        // this.steps.forEach(step => step.valid = true);
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
    telephoneNo: any;
    userTypeCode: any;
    userTypeName: any;
    title: any;
    firstName: any;
    surname: any;
    mobileNo: any;
    email: any;
    isApproved: any;
    firstLogin: any;
    adUserName: any;
}

export class UamInternalAccessRights {
    register: any;
    grantaccess: any;
    addadditionalroles: any;
    verifyprofregistration: any;
    userproductivityreport: any;
    userreport: any;
  }

export class DeleteInternalUserRole {
    userCode: any;
    userName: any;
    internalRoleCode: any;
}

export class SubmitInternalUserForApproval {
    usercode: any;
    username: any;
    isapproved: any;
}


// is active Y/N
// isApproved YES/PENDING/WAITING/REJECTED