import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'az-im-reports',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './im-reports.component.html',
    styleUrls: ['./im-reports.component.scss'],
    providers: [ValidationService]
})
export class ImReportsComponent implements OnInit {
    public steps: any[];
    productivityReportForm: FormGroup;
    notificationReportForm: FormGroup;
    overrideReportForm: FormGroup;
    userProductivityReportForm: FormGroup;
    public details: any = {};
    public showConfirm: boolean;
    provinces: any;
    dataAvailable: boolean;
    public types = ['success', 'error', 'info', 'warning'];
    organizationTypes: any;
    sections: any;
    sectors: any;
    hasPReportError: boolean;
    hasNReportError: boolean;
    hasOReportError: boolean;
    hasUReportError: boolean;
    options: any;
    opt: any;

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

        this.steps = [
            { name: 'Search Criteria', icon: 'fa-lock', active: true, valid: false, hasError: false },
            { name: 'Requester Information', icon: 'fa-user', active: false, valid: false, hasError: false }
        ]

        this.productivityReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'province': '',
            'sector': '',
            'organisation': '',
            'section': '',
            'category': '',
            'taskStatus': '',
            'officer': '',
        });

        this.userProductivityReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'province': '',
            'sector': '',
            'organisation': '',
            'section': '',
            'category': '',
            'taskStatus': '',
            'officer': ''
        });

        this.notificationReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'province': '',
            'section': '',
            'userType': '',
            'taskStatus': '',
            'category': '',
        });

        this.overrideReportForm = this.formBuilder.group({
            'fromDate': ['', Validators.required],
            'toDate': ['', Validators.required],
            'province': '',
            'admin': ''
        });

        this.hasPReportError = false;
        this.dataAvailable = false;
        this.hasOReportError = false;
        this.hasNReportError = false;
        this.hasUReportError = false;
    }

    getProductivityReport() {

        this.spinner.show();
        console.log('this.productivityReportForm', this.productivityReportForm);
        if (this.productivityReportForm.valid) {
            const input =
            {
                fromDate: this.productivityReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.productivityReportForm.get('toDate').value + 'T00:00:00.000-0000',
                province: this.productivityReportForm.get('province').value.split('=')[0],//name
                provinceCode: this.productivityReportForm.get('province').value.split('=')[1],//Code
                sector: this.productivityReportForm.get('sector').value, //name
                organisation: this.productivityReportForm.get('organisation').value,
                section: this.productivityReportForm.get('section').value.split('=')[0], //name
                sectionCode: this.productivityReportForm.get('section').value.split('=')[1], //code
                category: this.productivityReportForm.get('category').value,
                taskStatus: this.productivityReportForm.get('taskStatus').value,
                officer: this.productivityReportForm.get('officer').value
            };

            this.serviceCall.getProductivityReport(input).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasPReportError = true;
            this.spinner.hide();
        }
    }

    getNotificationReport() {

        this.spinner.show();
        console.log('this.notificationReportForm', this.notificationReportForm.get('province').value.split('=')[0]);

        let provinceCode = this.notificationReportForm.get('province').value.split('=')[0];
        let province = this.notificationReportForm.get('province').value.split('=')[1];
        let sectionCode = this.notificationReportForm.get('section').value.split('=')[0];
        let section = this.notificationReportForm.get('section').value.split('=')[1];

        if (this.notificationReportForm.valid) {
            const input =
            {
                fromDate: this.notificationReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.notificationReportForm.get('toDate').value + 'T00:00:00.000-0000',
                province: province,
                provinceCode: provinceCode,
                section: section,
                sectionCode: sectionCode,
                organisation: this.notificationReportForm.get('organisation'),
                userType: this.notificationReportForm.get('userType').value,
                category: this.notificationReportForm.get('category').value,
                taskStatus: this.notificationReportForm.get('taskStatus').value
            };
            this.serviceCall.getNotificationReport(input).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasNReportError = true;
            this.spinner.hide();
        }
    }

    getOverrideBusinessRulesReport() {

        this.spinner.show();
        console.log('this.overrideReportForm', this.overrideReportForm);
        if (this.overrideReportForm.valid) {
            const input =
            {
                fromDate: this.overrideReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.overrideReportForm.get('toDate').value + 'T00:00:00.000-0000',
                province: this.overrideReportForm.get('province').value.split('=')[1],
                admin: this.overrideReportForm.get('admin').value
            };
            this.serviceCall.getOverriddenBusinessRulesReport(input).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            });
        }
        else {
            this.hasOReportError = true;
            this.spinner.hide();
        }
    }

    getUserProductivityReport() {

        this.spinner.show();
        console.log('this.userProductivityReportForm', this.userProductivityReportForm);
        if (this.userProductivityReportForm.valid) {
            const input =
            {
                fromDate: this.userProductivityReportForm.get('fromDate').value + 'T00:00:00.000-0000',
                toDate: this.userProductivityReportForm.get('toDate').value + 'T00:00:00.000-0000',
                province: this.userProductivityReportForm.get('province').value.split('=')[1],
                provinceCode: this.userProductivityReportForm.get('province').value.split('=')[0],//Code
                sector: this.userProductivityReportForm.get('sector').value,
                organisation: this.userProductivityReportForm.get('organisation').value,
                section: this.userProductivityReportForm.get('section').value.split('=')[1],
                sectionCode: this.userProductivityReportForm.get('section').value.split('=')[0], //code
                category: this.userProductivityReportForm.get('category').value,
                taskStatus: this.userProductivityReportForm.get('taskStatus').value,
                officer: this.userProductivityReportForm.get('officer').value
            };

            this.serviceCall.getUserProductivityReport(input).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                this.spinner.hide();
                window.open(fileURL, '_blank');
            },
            error => {
                this.toastrService[this.types[1]]('Error while generating report', 'Failed', this.opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasUReportError = true;
            this.spinner.hide();
        }
    }

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));

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
}
