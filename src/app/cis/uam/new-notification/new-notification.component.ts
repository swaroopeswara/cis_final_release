import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'az-new-notification',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './new-notification.component.html',
    styleUrls: ['./new-notification.component.scss'],
    providers: [ValidationService]
})
export class NewNotificationComponent implements OnInit {

    options: any;
    opt: any;
    public notificationForm: FormGroup;
    hasError: boolean;
    public types = ['success', 'error', 'info', 'warning'];
    userInfo: any;
    notificationsusertypes: any;
    notificationssubtypes: any;
    provinces: any;
    notificationFile: any = '';
    fileSizeLimit: boolean;
    getdoclist: [];
    documentStoreCode: any = '';

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
        this.notificationForm = formBuilder.group({
            'type': ['', Validators.compose([Validators.required])],
            'notificationtype': ['', Validators.compose([Validators.required])],
            'notificationsubtype': '',
            'subject': ['', Validators.compose([Validators.required])],
            'body': ['', Validators.compose([Validators.required])],
            'regards': ['', Validators.compose([Validators.required])],
            'province': ['', Validators.compose([Validators.required])]
        });

        this.hasError = false;
        this.fileSizeLimit = false;
    }

    getNotificationsUserTypes() {
        this.spinner.show();
        this.serviceCall.getNotificationTypes().subscribe((data: any) => {
            this.notificationsusertypes = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getNotificationsSubTypes() {
        this.spinner.show();
        this.serviceCall.getNotificationSubTypes().subscribe((data: any) => {
            this.notificationssubtypes = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
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
            this.toastrService[this.types[1]]('Error while getting provinces. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }


    saveNotification() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        if (this.notificationForm.valid) {
            let saveInput = {
                'notificationType': this.notificationForm.get('type').value,
                'subject': this.notificationForm.get('subject').value,
                'body': this.notificationForm.get('body').value,
                'regards': this.notificationForm.get('regards').value,
                'notificationuserTypes': this.notificationForm.get('notificationtype').value,
                'documentStoreCode': this.documentStoreCode,
                'province': this.notificationForm.get('province').value,
                'notificationsubtype': this.notificationForm.get('notificationsubtype').value,
                'notificationStatus': 'OPEN',
                'createdByUserName': localStorage.getItem('cis_username')
            };
            this.spinner.show();
            this.serviceCall.saveNotification(saveInput).subscribe(data => {
                this.toastrService[this.types[0]]('Notification sent Successfully', 'Issue', opt);
                this.router.navigate(['/cis/uam/notifications']);
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Technical error while sending notification', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    fileRequestUpload(input) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.fileSizeLimit = false;
        if (input.files.length) {
            this.notificationFile = input.files[0].name;
            const filesplit = this.notificationFile.split('.');
            if (input.files[0].size > '10485760') {
                this.fileSizeLimit = true;
                this.notificationFile = '';
                this.spinner.hide();
            } else {
                const formData = new FormData();
                formData.append('multipleFiles', input.files[0]);
                formData.append('documentStoreCode', this.documentStoreCode);
                this.serviceCall.uploadDocumentFile(formData).subscribe(data => {
                    this.documentStoreCode = data.json().documentStoreCode;
                    this.getDocstoreDocsList(data.json().documentStoreCode);
                    this.notificationFile = '';
                    this.spinner.hide();
                    const opt = JSON.parse(JSON.stringify(options));
                    this.toastrService[this.types[0]]('', 'File Uploaded', opt);
                }, error => {
                    this.spinner.hide();
                });
            }
        }
        else {
            this.notificationFile = '';
            this.spinner.hide();
        }
    }

    getDocstoreDocsList(docstorecode) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getDocumentList(docstorecode).subscribe(data => {
            this.getdoclist = data.json();
            this.spinner.hide();
        },
            error => {
                this.getdoclist = [];
                this.spinner.hide();
            });
    }

    deleteDocument(val) {
        this.spinner.show();
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        const fileInput = {
            'documentStoreCode': this.documentStoreCode
        }

        this.serviceCall.deleteDocument(val, fileInput).subscribe(data => {
            this.spinner.hide();
            this.getDocstoreDocsList(this.documentStoreCode);
            const opt = JSON.parse(JSON.stringify(options));
            this.toastrService[this.types[0]]('', 'File Deleted', opt);
        }, error => {
            this.spinner.hide();
        });
    }

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));
        this.getNotificationsUserTypes();
        this.getNotificationsSubTypes();
        this.getProvinces();
        this.userInfo = JSON.parse(localStorage.getItem('cis_userinfo'));
    }
}
