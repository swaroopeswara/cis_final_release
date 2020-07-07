import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'az-uam-email',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './uam-email.component.html',
    styleUrls: ['./uam-email.component.scss'],
    providers: [ValidationService]
})
export class UamEmailComponent implements OnInit {

    options: any;
    opt: any;
    public emailContentForm: FormGroup;
    hasError: boolean;
    public types = ['success', 'error', 'info', 'warning'];
    userInfo: any;
    emailTypes: any;
    emailSaved: boolean;
    jsonToBeUsed: Item[] = [];
    item: Item;

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
        this.emailContentForm = formBuilder.group({
            'emailId': ['', Validators.compose([Validators.required])],
            'emailType': ['', Validators.compose([Validators.required])],
            'subject': ['', Validators.compose([Validators.required])],
            'header': ['', Validators.compose([Validators.required])],
            'body': ['', Validators.compose([Validators.required])],
            'footer': ['', Validators.compose([Validators.required])],
            'from': '',
            'params': '',
            'greetingparam': '',
            'bodyparam': '',
            'description': ['', Validators.compose([Validators.required])],
        });

        this.hasError = false;
        this.emailSaved = false;
    }

    updateEmailInfoById(code) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        if (this.emailContentForm.valid) {
            let saveInput = {
                'emailTemplateId': this.emailContentForm.get('emailId').value,
                'subject': this.emailContentForm.get('subject').value,
                'header': this.emailContentForm.get('header').value,
                'body': this.emailContentForm.get('body').value,
                'footer': this.emailContentForm.get('footer').value,
            }
            this.spinner.show();
            this.serviceCall.updateEmailInfoById(saveInput).subscribe(data => {
                this.toastrService[this.types[0]]('Content submitted Successfully', 'Email', opt);
                this.emailSaved = true;
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Technical error while saving email content', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    getEmailInfo() {
        this.spinner.show();
        this.serviceCall.getEmailInfo().subscribe(data => {
            this.emailTypes = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getEmailInfoById(code) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        if (code.length > 0) {
            this.serviceCall.getEmailInfoById(code).subscribe(data => {
                let emailType = data.json();
                this.emailContentForm.controls['emailId'].setValue(emailType.emailTemplateId);
                this.emailContentForm.controls['subject'].setValue(emailType.subject);
                this.emailContentForm.controls['header'].setValue(emailType.header);
                this.emailContentForm.controls['body'].setValue(emailType.body);
                this.emailContentForm.controls['footer'].setValue(emailType.footer);
                this.emailContentForm.controls['from'].setValue(emailType.from);
                this.emailContentForm.controls['description'].setValue(emailType.description);
                this.emailContentForm.controls['params'].setValue(emailType.inputParams);
                if (emailType.inputParams !== null) {
                    let inputParams = JSON.parse(emailType.inputParams);
                    this.emailContentForm.controls['greetingparam'].setValue(inputParams.greeting);
                    this.convertJson(inputParams);
                    console.log('this.jsonToBeUsed', this.jsonToBeUsed);
                }
                else {
                    this.emailContentForm.controls['greetingparam'].setValue('');
                }
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Technical error while getting email content', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.emailContentForm.controls['emailId'].setValue('');
            this.emailContentForm.controls['emailType'].setValue('');
            this.emailContentForm.controls['subject'].setValue('');
            this.emailContentForm.controls['header'].setValue('');
            this.emailContentForm.controls['body'].setValue('');
            this.emailContentForm.controls['footer'].setValue('');
            this.emailContentForm.controls['from'].setValue('');
            this.emailContentForm.controls['description'].setValue('');
            this.spinner.hide();
        }
    }

    convertJson(resultjson) {
        this.jsonToBeUsed = [];
        for (var type in resultjson) {
          this.item = new Item();
          this.item.key = type;
          this.item.value = resultjson[type];
          this.jsonToBeUsed.push(this.item);
        }
      }

    ngOnInit() {
        this.options = this.toastrService.toastrConfig;
        this.opt = JSON.parse(JSON.stringify(this.options));
        this.userInfo = JSON.parse(localStorage.getItem('cis_userinfo'));
        this.getEmailInfo();
    }
}

export class Item {
    key: string;
    value: string;
  }
