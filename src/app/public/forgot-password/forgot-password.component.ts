import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService } from 'ngx-toastr';
import { WizardValidationService } from '../internal-register/wizard-validation.service';
import { SecurityQuestion } from 'src/app/services/Apis/SecurityQuestion';

@Component({
    selector: 'az-forgot-password',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    public router: Router;
    public forgotPasswordUsername: FormGroup;
    public forgotPasswordEmail: FormGroup;
    public forgotPasswordMaster: FormGroup;
    public questionForm: FormGroup;
    public email: AbstractControl;
    notebooks: SecurityQuestion[] = [];
    public password: AbstractControl;
    hasError: boolean;
    questions: string[];
    public types = ['success', 'error', 'info', 'warning'];
    options: any;
    opt: any;
    hasQuestionError: boolean;
    userName: any;
    getSecurityQuestions: any;
    userResponse: any;

    ngOnInit() {
    }

    constructor(router: Router, private fb: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, public toastrService: ToastrService) {
        this.router = router;

        this.forgotPasswordMaster = fb.group({
            'email': ['', Validators.compose([Validators.required, WizardValidationService.emailValidator])]
        });

        this.questionForm = fb.group({
            'question1': ['', Validators.compose([Validators.required])],
            'answer1': ['', Validators.compose([Validators.required])],
            'question2': ['', Validators.compose([Validators.required])],
            'answer2': ['', Validators.compose([Validators.required])],
            'question3': ['', Validators.compose([Validators.required])],
            'answer3': ['', Validators.compose([Validators.required])],
        });

        this.forgotPasswordEmail = fb.group({
            'email': ['', Validators.compose([Validators.required, WizardValidationService.emailValidator])],
        });
        this.hasError = false;
        this.hasQuestionError = false;
        // this.forgotPasswordMaster.controls['email'].setValue(localStorage.getItem('cis_email'));
    }

    getUserInfo() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        if (this.forgotPasswordEmail.valid) {
            this.serviceCall.getUserInfoByEmail(this.forgotPasswordEmail.get('email').value).subscribe(data => {
                this.userResponse = data.json();
                if (this.userResponse.firstLogin == 'N') {
                    this.router.navigate(['reset-password']);
                }
                else {
                    this.sendPasswordToEmail(this.forgotPasswordEmail.get('email').value);
                }
                this.spinner.hide();
            },
            error => {
                this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    sendPasswordToEmail(email) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        this.serviceCall.sendPasswordToEmail(email).subscribe(data => {
            document.getElementById('securityquestion1').click();
            this.toastrService[this.types[0]]('Password send to your email', 'Success', opt);
            this.spinner.hide();
        },
        error => {
            this.toastrService[this.types[1]]('Technical error. Error while sending email with password', 'Error', opt);
            this.spinner.hide();
        });
    }

    onSubmit() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        if (this.forgotPasswordEmail.valid) {
            const getSecurityQuestionsInput = {
                email: this.forgotPasswordEmail.get('email').value
            }
            this.serviceCall.getUserSecurityQuestions(getSecurityQuestionsInput).subscribe(data => {
                this.getSecurityQuestions = data.json();
                if (this.getSecurityQuestions.usercode !== null) {
                    localStorage.setItem('cis_usercode', this.getSecurityQuestions.usercode);
                    this.questionForm.controls['question1'].setValue(this.getSecurityQuestions.question[0].que);
                    this.questionForm.controls['question2'].setValue(this.getSecurityQuestions.question[1].que);
                    this.questionForm.controls['question3'].setValue(this.getSecurityQuestions.question[2].que);
                    this.spinner.hide();
                    document.getElementById('securityQuestionOpenPopup').click();
                }
                else {
                    this.toastrService[this.types[1]]('User not found', 'Error', opt);
                    this.spinner.hide();
                }
                // this.router.navigate(['reset-password']);
            },
                error => {
                    this.toastrService[this.types[1]]('Technical error. Please try again', 'Error', opt);
                    this.spinner.hide();
                });
        }
        else {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    setRadio(e) {
        console.log('setRadio', e);
        this.forgotPasswordMaster.controls['option1'].setValue(e);
    }

    onQuestionUpdate() {
        this.hasQuestionError = false;
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        const checkSecurityQuestions = {
            email: this.forgotPasswordEmail.get('email').value,
            question: [
                { "code": this.getSecurityQuestions.question[0].code, "que": this.getSecurityQuestions.question[0].que, "ans": this.questionForm.get('answer1').value },
                { "code": this.getSecurityQuestions.question[1].code, "que": this.getSecurityQuestions.question[1].que, "ans": this.questionForm.get('answer2').value },
                { "code": this.getSecurityQuestions.question[2].code, "que": this.getSecurityQuestions.question[2].que, "ans": this.questionForm.get('answer3').value }
            ]
        }
        this.serviceCall.checkUserSecurityQuestions(checkSecurityQuestions).subscribe(data => {
            if (data.json().message === 'true') {
                localStorage.clear();
                localStorage.setItem('cis_usercode', this.getSecurityQuestions.usercode);
                localStorage.setItem('cis_email', this.forgotPasswordEmail.controls['email'].value);
                this.getUserInfo();
            }
            else {
                this.hasQuestionError = true;
                this.spinner.hide();
            }
        },
            error => {
                this.toastrService[this.types[1]]('Technical error. Please try again', 'Error', opt);
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
