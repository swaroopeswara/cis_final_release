import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
    selector: 'az-log-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './log-query.component.html',
    styleUrls: ['./log-query.component.scss']
})
export class LogQueryComponent implements OnInit, AfterContentInit {
    public router: Router;
    public queryForm: FormGroup;
    public types = ['success', 'error', 'info', 'warning'];
    options: any;
    opt: any;
    hasError: boolean;

    ngAfterContentInit() {
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    constructor(router: Router, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, public toastrService: ToastrService) {
        this.router = router;
        this.queryForm = formBuilder.group({
            'fullName': ['', Validators.compose([Validators.required])],
            'email': ['', Validators.compose([Validators.required, Validators.minLength(4), ValidationService.emailValidator])],
            'issueType': ['', Validators.compose([Validators.required])],
            'description': ['', Validators.compose([Validators.required])],
            'other': ''
        });

        this.hasError = false;
    }

    saveIssueLog() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        if (this.queryForm.valid && this.queryForm.get('issueType').value !== 'Other') {
            let saveInput = {
                'fullName': this.queryForm.get('fullName').value,
                'email': this.queryForm.get('email').value,
                'issueType': this.queryForm.get('issueType').value,
                'description': this.queryForm.get('description').value,
                'issueStatus': 'OPEN',
                'userType': 'EXTERNAL',
                'role': '',
                'province': '',
                'resolvedBy': ''
            }
            this.spinner.show();
            this.serviceCall.saveIssueLog(saveInput).subscribe(data => {
                this.toastrService[this.types[0]]('Query sent Successfully to Admin', 'Issue', opt);
                window.open("http://10.1.15.216/CIS-Portal/","_self")
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Technical error while saving query', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.queryForm.valid && this.queryForm.get('issueType').value == 'Other' && this.queryForm.get('other').value.trim().length > 0) {
            let saveInput = {
                'fullName': this.queryForm.get('fullName').value,
                'email': this.queryForm.get('email').value,
                'issueType': this.queryForm.get('other').value,
                'description': this.queryForm.get('description').value,
                'issueStatus': 'OPEN',
                'userType': 'EXTERNAL',
                'role': '',
                'province': '',
                'resolvedBy': ''
            }
            this.spinner.show();
            this.serviceCall.saveIssueLog(saveInput).subscribe(data => {
                this.toastrService[this.types[0]]('Query sent Successfully to Admin', 'Issue', opt);
                // this.router.navigate(['/login']);
                window.open("http://10.1.15.216/CIS-Portal/","_self")
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Technical error while saving query', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));
    }

}
