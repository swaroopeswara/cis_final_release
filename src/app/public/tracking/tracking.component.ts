import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
    selector: 'az-tracking',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, AfterContentInit {
    public router: Router;
    public trackingForm: FormGroup;
    public types = ['success', 'error', 'info', 'warning'];
    options: any;
    opt: any;
    hasError: boolean;
    requestCode: any;

    ngAfterContentInit() {
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    constructor(private route: ActivatedRoute, router: Router, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, public toastrService: ToastrService) {
        this.router = router;
        this.trackingForm = formBuilder.group({
            'code': ['', Validators.compose([Validators.required])],
            'status': ''
        });

        this.hasError = false;
    }

    getRequestStatus() {
        this.spinner.show();

        if (this.trackingForm.valid) {
            this.serviceCall.getRequestStatus(this.trackingForm.get('code').value).subscribe(data => {
                console.log('data', data.text());
                if (data.text() == 'Closed') {
                    this.trackingForm.controls['status'].setValue('Dispatched');
                }
                else {
                    this.trackingForm.controls['status'].setValue('In Progress');
                }
                this.spinner.hide();
            }, error => {
                if (error.json().error.includes('Task not found')) {
                    this.trackingForm.controls['status'].setValue('request code not found');
                }
                this.spinner.hide();
            });
        }
        else 
        {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));

        this.route.queryParams.subscribe(params => {
            this.requestCode = params['requestid'];
            if (this.requestCode !== undefined) {
                this.trackingForm.controls['code'].setValue(this.requestCode);
                this.getRequestStatus();
            }            
        });
    }

}
