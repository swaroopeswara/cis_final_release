import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from "@angular/common";
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { DateComComponent } from '../datecom/datecom.component';

@Component({
    selector: 'az-login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit {
    public router: Router;
    public loginForm: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    userInfoResponse: String;
    options: any;
    opt: any;
    public types = ['success', 'error', 'info', 'warning'];
    hasError: boolean;
    invalidLogin: boolean;
    accountStatus: any;
    internalUserRoles: any;
    userResponse: any;
    executionGrps: any;
    phUsername: any;
    phPassword: any;

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));
        this.spinner.show();
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('forgetToken');
        this.accountStatus = '';
        this.phUsername = 'Username';
        this.phPassword = 'Password';

    }

    showHidePassword() {

        console.log('atrr:', document.getElementById('show_hide_password').getAttribute('type'));
        if (document.getElementById('show_hide_password').getAttribute('type') == 'text') {
            document.getElementById('show_hide_password').setAttribute('type', 'password')
            document.getElementById('iconk').classList.add('fa-eye-slash');
            document.getElementById('iconk').classList.remove('fa-eye');
        }
        else if (document.getElementById('show_hide_password').getAttribute('type') == 'password') {
            document.getElementById('show_hide_password').setAttribute('type', 'text')
            document.getElementById('iconk').classList.add('fa-eye');
            document.getElementById('iconk').classList.remove('fa-eye-slash');
        }
    }

    loadUser() {

        console.log(this.location.path());
        if (localStorage.getItem('cis_loggedin') == 'yes' &&
            localStorage.getItem('cis_email').length > 0 &&
            localStorage.getItem('cis_usercode').length > 0) {
            this.getUserInfo(localStorage.getItem('cis_email'));
            console.log('login1:', this.location.path());
            if (this.location.path().includes('login')) {
                this.router.navigate(['/cis']);
            }
            else {
                // this.router.navigate([this.location.path()]);
            }
        }
        else {
            if (this.location.path().includes('cis')) {
                localStorage.clear();
                // this.router.navigate(['/login']);
            }
            else {
                // console.log('no-login', this.location.path());
                // this.router.navigate([this.location.path()]);
            }
        }
    }

    ngAfterContentInit() {

        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    onSubmit() {
        this.spinner.show();
        this.accountStatus = '';
        this.invalidLogin = false;
        if (this.loginForm.valid) {
            if (this.loginForm.get('internal').value == 'No') {
                const loginPayload = {
                    username: this.loginForm.get('email').value.toLowerCase(),
                    password: this.loginForm.get('password').value,
                    internal: this.loginForm.get('internal').value,
                }
                this.serviceCall.login(loginPayload).subscribe(data => {
                    const response = data.json();
                    if (response.valid === "true") {
                        if (response.isApproved !== "YES") {
                            this.accountStatus = response.isApproved.toUpperCase();
                            this.spinner.hide();
                        }
                        else if (response.active !== "Active") {
                            this.accountStatus = 'INACTIVE';
                            this.spinner.hide();
                        }
                        else if (response.firstLogin == "Y") {
                            this.spinner.hide();
                            this.getUserInfoForReset(this.loginForm.get('email').value);
                            localStorage.setItem('cis_username', this.loginForm.get('email').value.toLowerCase());
                            localStorage.setItem('cis_email', this.loginForm.get('email').value.toLowerCase());
                            this.router.navigate(['/reset-password']);
                        }
                        else if (response.isApproved !== "YES") {
                            this.accountStatus = response.isApproved;
                            this.spinner.hide();
                        }
                        else if (response.active !== "Active") {
                            this.accountStatus = 'INACTIVE';
                            this.spinner.hide();
                        }
                        else {
                            this.getUserInfo(this.loginForm.get('email').value.toLowerCase());
                            localStorage.setItem('keep', this.loginForm.get('keep').value == true ? 'true' : 'false');
                            localStorage.setItem('cis_username', this.loginForm.get('email').value.toLowerCase());
                            localStorage.setItem('cis_email', this.loginForm.get('email').value);
                            localStorage.setItem('cis_loggedin', 'yes');
                            this.spinner.hide();
                        }
                    }
                    else {
                        this.invalidLogin = true;
                        this.spinner.hide();
                        this.toastrService[this.types[1]]('Invalid Credentials', 'Login Failed', this.opt);
                    }
                },
                    error => {
                        if (error.json().message.includes('User is already Logged in a different location')) {
                            this.spinner.hide();
                            this.toastrService[this.types[1]]('User is already Logged in a different location', 'Login Failed', this.opt);
                        }
                        else {
                            this.toastrService[this.types[1]]('Unknown error while authenicating. Please check your credentials again', 'Login Failed', this.opt);
                            this.spinner.hide();
                        }
                    });
            }
            else if (this.loginForm.get('internal').value == 'Yes') {
                const inLoginPayLoad = {
                    username: this.loginForm.get('email').value.toLowerCase(),
                    password: this.loginForm.get('password').value,
                }
                this.serviceCall.checkADUserExists(inLoginPayLoad).subscribe(data => {

                    const response = data.json();
                    if (response.exists === true) {
                        this.adUserLoginCheck(response.mail);
                    }
                    else {
                        this.invalidLogin = true;
                        this.spinner.hide();
                        this.toastrService[this.types[1]]('Invalid Credentials or User doesnt exist', 'Failed', this.opt);
                    }
                },
                    error => {
                        console.log('error:', error.name);
                        this.toastrService[this.types[1]]('Unknown error while authenicating', 'Login Failed', this.opt);
                        this.spinner.hide();
                    });
            }

        }
        else {
            this.spinner.hide();
            this.hasError = true;
        }
    }

    adUserLoginCheck(email) {

        const input = {
            email: email.toLowerCase()
        };

        this.serviceCall.adUserLoginCheck(input).subscribe(data => {
            this.getInternalUserInfo(email.toLowerCase());
        },
            error => {
                if (error.json().message.includes('User is already Logged in a different location')) {
                    this.toastrService[this.types[1]]('User is already Logged in a different location', 'Login Failed', this.opt);
                }
                else {
                    this.toastrService[this.types[1]]('Unknown error while authenicating', 'Login Failed', this.opt);
                }
                this.spinner.hide();
            });
    }

    getInternalUserInfo(email) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getUserInfoByEmail(email.toLowerCase()).subscribe(data => {
            this.userResponse = data.json();
           
            if (this.userResponse.isApproved !== "YES") {
                this.accountStatus = this.userResponse.isApproved;
                this.spinner.hide();
            }
            else if (this.userResponse.isActive !== "Y") {
                this.accountStatus = 'INACTIVE';
                this.spinner.hide();
            }
            else {
                localStorage.setItem('keep', this.loginForm.get('keep').value == true ? 'true' : 'false');
                localStorage.setItem('cis_userinfo', JSON.stringify(this.userResponse));
                localStorage.setItem('cis_usercode', this.userResponse.userCode);
                localStorage.setItem('cis_username', this.userResponse.userName);
                localStorage.setItem('cis_email', this.userResponse.userName.toLowerCase());
                localStorage.setItem('cis_userid', this.userResponse.userId);
                localStorage.setItem('cis_usertype', this.userResponse.userTypeName);
                localStorage.setItem('cis_loggedin', 'yes');
                localStorage.setItem('cis_userfullname', this.userResponse.firstName + ' ' + this.userResponse.surname);
                this.getInternalUserRolesByEmail(email);
                this.spinner.hide();
            }
        },
            error => {
                this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
                this.spinner.hide();
            });
    }

    onItemChange(internal) {
        this.loginForm.controls['internal'].setValue(internal);
        if (internal == 'Yes') {
            this.phUsername = 'Departmental Username';
            this.phPassword = 'Departmental Password';
        }
        else {
            this.phUsername = 'Email';
            this.phPassword = 'Password';
        }
        
    }

    getUserInfo(email) {

        this.serviceCall.getUserInfoByEmail(email.toLowerCase()).subscribe(data => {
            const response = data.json();
            localStorage.setItem('cis_userinfo', JSON.stringify(response));
            localStorage.setItem('cis_usercode', response.userCode);
            localStorage.setItem('cis_username', response.userName);
            localStorage.setItem('cis_email', response.userName.toLowerCase());
            localStorage.setItem('cis_userid', response.userId);
            localStorage.setItem('cis_usertype', response.userTypeName);
            localStorage.setItem('cis_loggedin', 'yes');
            localStorage.setItem('cis_userfullname', response.firstName + ' ' + response.surname);
            if (response.userTypeName == 'EXTERNAL') {
                localStorage.setItem('cis_selected_rolecode', response.externalUserRoles[0].userRoleCode);
                localStorage.setItem('cis_selected_rolename', response.externalUserRoles[0].userRoleName);
                localStorage.setItem('cis_selected_provincecode', response.externalUserRoles[0].userProvinceCode);
                localStorage.setItem('cis_selected_provincename', response.externalUserRoles[0].userProvinceName);
                localStorage.setItem('cis_selected_externalrolecode', response.externalUserRoles[0].externalRoleCode);
                this.router.navigate(['/cis']);
            }
            else if (response.userTypeName == 'INTERNAL') {
                this.getInternalUserRolesByEmail(response.userName.toLowerCase());
            }

            this.spinner.hide();
        },
            error => {
                console.log('error:', error.status);
                this.spinner.hide();
            });
    }

    getUserInfoForReset(email) {

        this.serviceCall.getUserInfoByEmail(email.toLowerCase()).subscribe(data => {
            const response = data.json();
            localStorage.setItem('cis_userinfo', JSON.stringify(response));
            localStorage.setItem('cis_usercode', response.userCode);
            localStorage.setItem('cis_username', response.userName);
            localStorage.setItem('cis_email', response.userName.toLowerCase());
            localStorage.setItem('cis_userid', response.userId);
            localStorage.setItem('cis_usertype', response.userTypeName);
            localStorage.setItem('cis_loggedin', 'yes');
            if (response.userTypeName == 'EXTERNAL') {
                localStorage.setItem('cis_selected_rolecode', response.externalUserRoles[0].userRoleCode);
                localStorage.setItem('cis_selected_rolename', response.externalUserRoles[0].userRoleName);
                localStorage.setItem('cis_selected_provincecode', response.externalUserRoles[0].userProvinceCode);
                localStorage.setItem('cis_selected_provincename', response.externalUserRoles[0].userProvinceName);
                localStorage.setItem('cis_selected_externalrolecode', response.externalUserRoles[0].externalRoleCode);
            }
            else if (response.userTypeName == 'INTERNAL') {
                this.getInternalUserRolesByEmail(response.userName.toLowerCase());
            }

            this.spinner.hide();
        },
            error => {
                console.log('error:', error.status);
                this.spinner.hide();
            });
    }

    constructor(private location: Location, router: Router, fb: FormBuilder, private spinner: NgxSpinnerService,
        private serviceCall: RestcallService, public toastrService: ToastrService, private _dateFormatPipe: DateComComponent) {
        this.router = router;
        this.loginForm = fb.group({
            'email': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'internal': ['', Validators.compose([Validators.required])],
            'keep': ''
        });

        this.email = this.loginForm.controls['email'];
        this.password = this.loginForm.controls['password'];
        this.hasError = false;
        this.invalidLogin = false;
        this.loadUser();
        let myDate = this._dateFormatPipe.transform(new Date());
        console.log('date:', myDate);
    }

    getInternalUserRolesByEmail(email) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getInternalUserRolesByEmail(email.toLowerCase(), 'Y').subscribe(data => {
            this.internalUserRoles = data.json();
            localStorage.setItem('cis_internalrolesinfo', JSON.stringify(this.internalUserRoles));
            if (this.internalUserRoles.length > 0) {
                localStorage.setItem('cis_selected_roleid', this.internalUserRoles[0].userRoleId);
                localStorage.setItem('cis_selected_rolecode', this.internalUserRoles[0].roleCode);
                localStorage.setItem('cis_selected_rolename', this.internalUserRoles[0].roleName);
                localStorage.setItem('cis_selected_provincecode', this.internalUserRoles[0].provinceCode);
                localStorage.setItem('cis_selected_provincename', this.internalUserRoles[0].provinceName);
                localStorage.setItem('cis_selected_sectioncode', this.internalUserRoles[0].sectionCode);
                localStorage.setItem('cis_selected_sectionname', this.internalUserRoles[0].sectionName);
                localStorage.setItem('cis_selected_internalrolecode', this.internalUserRoles[0].internalRoleCode);
                this.router.navigate(['/cis']);
            }
            else {
                this.accountStatus = 'NO_ACTIVE_ROLES';
            }
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }
}

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}

