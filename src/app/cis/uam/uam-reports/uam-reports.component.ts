import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'az-uam-reports',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './uam-reports.component.html',
    styleUrls: ['./uam-reports.component.scss'],
    providers: [ValidationService]
})
export class UamReportsComponent implements OnInit {
    public steps: any[];
    public requestForm: FormGroup;
    public itemForm: FormGroup;
    quarterlyUpdatedUserReportForm: FormGroup;
    public detailsForm: FormGroup;
    quarterlyDeletedUserReportForm: FormGroup;
    userReportForm: FormGroup;
    userSummaryForm: FormGroup;
    public details: any = {};
    public showConfirm: boolean;
    provinces: any;
    hasNumberError: boolean;
    dataAvailable: boolean;
    requestItem: BulkItem[] = [];
    hasItemError: boolean;
    hasSummaryError: boolean;
    public types = ['success', 'error', 'info', 'warning'];
    organizationTypes: any;
    sections: any;
    sectors: any;
    hasQuReportError: boolean;
    hasQdReportError: boolean;

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

        this.steps = [
            { name: 'Search Criteria', icon: 'fa-lock', active: true, valid: false, hasError: false },
            { name: 'Requester Information', icon: 'fa-user', active: false, valid: false, hasError: false }
        ]

        this.userReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'userType': ['', Validators.required]
        });

        this.userSummaryForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'province': '',
            'sector': '',
            'organization': '',
            'section': '',
            'userType': ['', Validators.required]
        });

        this.quarterlyUpdatedUserReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'userType': ['', Validators.required]
        });

        this.quarterlyDeletedUserReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'userType': ['', Validators.required]
        });

        this.itemForm = this.formBuilder.group({
            'searchText': ['', Validators.required],
            'category': ['', Validators.required],
            'subCategory': ['', Validators.required]
        });

        this.hasNumberError = false;
        this.dataAvailable = false;
        this.hasItemError = false;
        this.hasSummaryError = false;
        this.hasQuReportError = false;
        this.hasQdReportError = false;
    }

    getUserReport() {

        this.spinner.show();
        if (this.userReportForm.valid) {
            const userReportInput = {
                fromDate: this.userReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.userReportForm.get('toDate').value + 'T00:00:00.000-0000',
                userType: this.userReportForm.get('userType').value == 'All' ? '' : this.userReportForm.get('userType').value
            }
            this.serviceCall.userLogReport1(userReportInput).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasItemError = true;
            this.spinner.hide();
        }
    }

    getUserSummaryReport() {

        this.spinner.show();
        if (this.userSummaryForm.valid) {
            const userSummaryReportInput = {
                fromDate: this.userSummaryForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.userSummaryForm.get('toDate').value + 'T00:00:00.000-0000',
                province: this.userSummaryForm.get('province').value.length == 0 ? null : this.userSummaryForm.get('province').value,
                sector: this.userSummaryForm.get('sector').value.length == 0 ? null : this.userSummaryForm.get('sector').value,
                organisation: this.userSummaryForm.get('organization').value.length == 0 ? null : this.userSummaryForm.get('organization').value,
                section: this.userSummaryForm.get('section').value.length == 0 ? null : this.userSummaryForm.get('section').value,
                userType: this.userSummaryForm.get('userType').value,
            }
            this.serviceCall.userSummaryReport(userSummaryReportInput).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasSummaryError = true;
            this.spinner.hide();
        }
    }

    getQuarterlyUpdatedUserReport() {

        this.spinner.show();
        if (this.quarterlyUpdatedUserReportForm.valid) {
            const quarterlyUpdatedUserReportInput = {
                fromDate: this.quarterlyUpdatedUserReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.quarterlyUpdatedUserReportForm.get('toDate').value + 'T00:00:00.000-0000',
                userType: this.quarterlyUpdatedUserReportForm.get('userType').value,
            }
            this.serviceCall.quarterlyUpdatedUserReport(quarterlyUpdatedUserReportInput).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasQuReportError = true;
            this.spinner.hide();
        }
    }

    getQuarterlyDeletedUserReport() {

        this.spinner.show();
        if (this.quarterlyDeletedUserReportForm.valid) {
            const quarterlyDeletedUserReportInput = {
                fromDate: this.quarterlyDeletedUserReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.quarterlyDeletedUserReportForm.get('toDate').value + 'T00:00:00.000-0000',
                userType: this.quarterlyDeletedUserReportForm.get('userType').value,
            }
            this.serviceCall.quarterlyDeletedUserReport(quarterlyDeletedUserReportInput).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasQdReportError = true;
            this.spinner.hide();
        }
    }

    ngOnInit() {
        this.getProvinces();
        this.getOrganizationTypes();
        this.getSectors();
        this.getSections();
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

    getSectors() {

        this.spinner.show();
        this.serviceCall.getSectors().subscribe(data => {
            this.sectors = data.json();
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

    // removeItem(val) {
    //     this.requestItem.forEach((item, index) => {
    //         if (val == item) this.requestItem.splice(index, 1);
    //     });
    //     this.searchCriteriaForm.get('itemCount').setValue(this.requestItem.length);
    // }

    // createNewItem() {

    //     this.hasItemError = true;
    //     if (this.itemForm.valid) {
    //         let item = new BulkItem();
    //         item.category = this.itemForm.get('category').value;
    //         item.subCategory = this.itemForm.get('subCategory').value;
    //         this.requestItem.push(item);
    //         this.searchCriteriaForm.get('itemCount').setValue(this.requestItem.length);
    //         document.getElementById('btnItemPopupClose').click();
    //         this.numberForm.get('availability').setValue('');
    //     }
    // }

    getProvinces() {
        this.spinner.show();
        this.serviceCall.getProvinces().subscribe(data => {
            this.provinces = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
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

        console.log('this.requestForm', this.requestForm);
        this.requestForm.get('deliveryMethod').setValue('Email');
        if (this.requestForm.valid) {
            this.toastrService[this.types[0]]('Submitted Request', 'Done', opt);
            this.router.navigate(['/cis/dashboard']);
        }
    }


}

export class BulkItem {

    category: number;
    subCategory: any;

}
