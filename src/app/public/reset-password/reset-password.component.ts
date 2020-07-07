import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'az-reset-password',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, AfterContentInit {
    public router: Router;
    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    public token: AbstractControl;
    public confirmPassword: AbstractControl;
    submitted = false;
    public message: String;
    errors = [];
    public types = ['success', 'error', 'info', 'warning'];
    options: any;
    opt: any;

    ngAfterContentInit() {
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    constructor(router: Router, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
        private serviceCall: RestcallService, public toastrService: ToastrService) {
        this.router = router;
        this.form = formBuilder.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(4), emailValidator])],
            'confirmPassword': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(8),
            Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')])]
        });
    }


    onSubmitResetForm() {
        this.submitted = true;
        this.spinner.show();
        if (this.form.invalid || this.form.get('password').value !== this.form.get('confirmPassword').value) {
            this.spinner.hide();
            return;
        }

        const payload = {
            type: 'reset',
            usercode: localStorage.getItem('cis_usercode'),
            username: this.form.get('email').value,
            oldpassword: '',
            newpassword: this.form.get('password').value,
            firstlogin: 'N'
        }
        this.serviceCall.updatePassword(payload).subscribe(data => {
            this.toastrService[this.types[0]]('Reset Password Successfully', 'Done', this.opt);
            this.spinner.show();
            this.router.navigate(['/login']);
        },
        error => {
            this.toastrService[this.types[1]]('Unknown error while updating password', 'Error', this.opt);
            this.spinner.show();
        });

    }

    showHidePassword1() {

        console.log('atrr:', document.getElementById('show_hide_password1').getAttribute('type'));
        if (document.getElementById('show_hide_password1').getAttribute('type') == 'text') {
            document.getElementById('show_hide_password1').setAttribute('type', 'password')
            document.getElementById('iconk1').classList.add('fa-eye-slash');
            document.getElementById('iconk1').classList.remove('fa-eye');
        }
        else if (document.getElementById('show_hide_password1').getAttribute('type') == 'password') {
            document.getElementById('show_hide_password1').setAttribute('type', 'text')
            document.getElementById('iconk1').classList.add('fa-eye');
            document.getElementById('iconk1').classList.remove('fa-eye-slash');
        }
    }

    showHidePassword2() {

        console.log('atrr:', document.getElementById('show_hide_password2').getAttribute('type'));
        if (document.getElementById('show_hide_password2').getAttribute('type') == 'text') {
            document.getElementById('show_hide_password2').setAttribute('type', 'password')
            document.getElementById('iconk2').classList.add('fa-eye-slash');
            document.getElementById('iconk2').classList.remove('fa-eye');
        }
        else if (document.getElementById('show_hide_password2').getAttribute('type') == 'password') {
            document.getElementById('show_hide_password2').setAttribute('type', 'text')
            document.getElementById('iconk2').classList.add('fa-eye');
            document.getElementById('iconk2').classList.remove('fa-eye-slash');
        }
    }

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));
        this.spinner.show();
        this.form.controls['email'].setValue(localStorage.getItem('cis_email'));
        // this.form = this.formBuilder.group({
        //     'email': ['', Validators.compose([Validators.required,Validators.minLength(4), emailValidator])],
        //     'confirmPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        //     'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        // });
    }

}

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}
