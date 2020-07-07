import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'az-log-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './log-query.component.html',
    styleUrls: ['./log-query.component.scss'],
    providers: [ValidationService]
})
export class LogQueryComponent implements OnInit {

    options: any;
    opt: any;
    public queryForm: FormGroup;
    hasError: boolean;
    public types = ['success', 'error', 'info', 'warning'];
    userInfo: any;

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
        this.queryForm = formBuilder.group({
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
                'fullName':  this.userInfo.surname,
                'email': localStorage.getItem('cis_email'),
                'description': this.queryForm.get('description').value,
                'issueType': this.queryForm.get('issueType').value,
                'issueStatus': 'OPEN',
                'userType': localStorage.getItem('cis_usertype'),
                'role': localStorage.getItem('cis_selected_rolecode'),
                'province': localStorage.getItem('cis_selected_provincecode'),
                'resolvedBy': ''
            }
            this.spinner.show();
            this.serviceCall.saveIssueLog(saveInput).subscribe(data => {
                this.toastrService[this.types[0]]('Query sent Successfully to Admin', 'Issue', opt);
                this.router.navigate(['/cis/uam/my-queries']);
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Technical error while saving query', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.queryForm.valid && this.queryForm.get('issueType').value == 'Other' && this.queryForm.get('other').value.trim().length > 0) {
            let saveInput = { 
                'fullName':  this.userInfo.surname,
                'email': localStorage.getItem('cis_email'),
                'description': this.queryForm.get('description').value,
                'issueType': this.queryForm.get('other').value,
                'issueStatus': 'OPEN',
                'userType': localStorage.getItem('cis_usertype'),
                'role': localStorage.getItem('cis_selected_rolecode'),
                'province': localStorage.getItem('cis_selected_provincecode'),
                'resolvedBy': ''
            }
            this.spinner.show();
            this.serviceCall.saveIssueLog(saveInput).subscribe(data => {
                this.toastrService[this.types[0]]('Query sent Successfully to Admin', 'Issue', opt);
                this.router.navigate(['/cis/uam/my-queries']);
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
        this.userInfo = JSON.parse(localStorage.getItem('cis_userinfo'));
    }
}
