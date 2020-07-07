import { ValidationService } from '../../services/Apis/wizard-validation.service';
import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { isDefined } from '@angular/compiler/src/util';

@Component({
    selector: 'az-external-register',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './external-register.component.html',
    styleUrls: ['./external-register.component.scss'],
    providers: [ValidationService]
})
export class ExternalRegisterComponent implements OnInit, AfterContentInit {
    public steps: any[];
    public roleForm: FormGroup;
    public specificRoleForm: FormGroup;
    public personalForm: FormGroup;
    public moredetailsForm: FormGroup;
    public roleFormCompany: FormGroup;
    public details: any = {};
    public showConfirm: boolean;
    exRegisterInput1 = new externalRegister1();
    exRegisterInput2 = new externalRegister2();
    roles: string[];
    practitioners: string[];
    emailExists: boolean;
    options: GlobalConfig;
    hasError: boolean;
    provinces: any;
    organizationTypes: any;
    public types = ['success', 'error', 'info', 'warning'];
    captcha: boolean;
    captchakey: any;
    securityQuestions: any;
    communcationTypes: any;
    public selectProvinces: number[];
    question1: string;
    question2: string;
    question3: string;
    hasQuestionError: boolean;
    noPPNFound: boolean;
    externalUserRole: ExternalRole[] = [];
    sectors: any;
    allExternalroles: any;
    permissionExternalroles: Permissions;
    permissions: any;
    fileSizeLimit: boolean;
    public file: any;
    public fileData: any;
    public fileName: any;
    // @ViewChild('inputfile1') myInputVariable: ElementRef;

    // public firstControlOptions: IMultiSelectOption[];
    public firstControlTexts: IMultiSelectTexts = {
        defaultTitle: 'Select Provinces',
    };
    firstControlModel: number[];

    public firstControlOptions: IMultiSelectOption[] = [
        { id: 'PRV001', name: 'Limpopo' },
        { id: 'PRV002', name: 'Mpumalanga' },
        { id: 'PRV003', name: 'Gauteng' },
        { id: 'PRV004', name: 'North West' },
        { id: 'PRV005', name: 'Free State' },
        { id: 'PRV006', name: 'Kwa Zulu Natal' },
        { id: 'PRV007', name: 'Eastern Cape' },
        { id: 'PRV008', name: 'Northern Cape' },
        { id: 'PRV009', name: 'Western Cape' },
        { id: 'PRV010', name: 'Unknown' }
    ];

    public provincesList: any[] = [
        { id: 'PRV001', name: 'Limpopo' },
        { id: 'PRV002', name: 'Mpumalanga' },
        { id: 'PRV003', name: 'Gauteng' },
        { id: 'PRV004', name: 'North West' },
        { id: 'PRV005', name: 'Free State' },
        { id: 'PRV006', name: 'Kwa Zulu Natal' },
        { id: 'PRV007', name: 'Eastern Cape' },
        { id: 'PRV008', name: 'Northern Cape' },
        { id: 'PRV009', name: 'Western Cape' },
        { id: 'PRV010', name: 'Unknown' }
    ];

    ngOnInit() {
        localStorage.clear();
        this.hasError = false;
        this.spinner.show();
        this.getRoles();
        this.getOrganizationTypes();
        this.getProvinces();
        this.getSecurityQuestions();
        this.getCommuncationTypes();
        this.getSectors();
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    public onChange() {
        console.log(this.roleForm.get('province').value);
    }

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

        this.steps = [
            { name: 'Role Information', icon: 'fa-dot-circle-o ', active: true, valid: false, hasError: false },
            { name: 'Personal Information', icon: 'fa-user', active: false, valid: false, hasError: false },
            { name: 'More Details', icon: 'fa-align-justify', active: false, valid: false, hasError: false }
        ]

        this.captcha = false;
        this.hasQuestionError = false;
        this.noPPNFound = false;
        this.emailExists = false;
        this.captchakey = environment.captchaSiteKey;
        this.roleForm = this.formBuilder.group({
            'role': ['', Validators.required],
            'ppn': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            'nameofpractise': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'companydoc': ['', Validators.compose([Validators.required])],
            'province': ['', Validators.required],
            'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
            'register': ['', Validators.compose([Validators.pattern('^(?:Y)$')])]
        });

        this.roleFormCompany = this.formBuilder.group({
            'role': ['', Validators.required],
            'ppn': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
            'nameofpractise': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'province': ['', Validators.required],
            'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
            'register': ['', Validators.compose([Validators.pattern('^(?:Y)$')])]
        });

        this.specificRoleForm = this.formBuilder.group({
            'role': ['', Validators.required],
            'province': ['', Validators.required],
            'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
            'register': ['', Validators.compose([Validators.pattern('^(?:Y)$')])]
        });

        this.personalForm = this.formBuilder.group({
            'salutation': ['', Validators.required],
            'firstname': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'lastname': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'orgtype': ['', Validators.required],
            'sector': ['', Validators.required],
            'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('^\\+?[0-9]+$')])],
            'email': '',
            'telephone': ['', Validators.compose([Validators.pattern('^[0-9]+$')])],
            'addressline1': ['', Validators.required],
            'addressline2': ['', Validators.required],
            'addressline3': '',
            'zipcode': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]
        });

        this.moredetailsForm = this.formBuilder.group({
            'communication': ['', Validators.required],
            'alternativeemail': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
            'secq1': ['', Validators.compose([Validators.required])],
            'ans1': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'secq2': ['', Validators.compose([Validators.required])],
            'ans2': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'secq3': ['', Validators.compose([Validators.required])],
            'ans3': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'news': '',
            'events': '',
            'information': '',
            'tc': [false, Validators.requiredTrue]
        });
    }

    getRoles() {

        this.spinner.show();
        this.serviceCall.getExternalRoles().subscribe(data => {
            this.roles = data.json();
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

    selectQuestion() {
        this.hasQuestionError = false; 
        this.question1 = this.moredetailsForm.get('secq1').value;
        this.question2 = this.moredetailsForm.get('secq2').value;
        this.question3 = this.moredetailsForm.get('secq3').value;
        //this.hasQuestionError = this.question1 != "" ? true : this.question1 != "" ? true : this.question2 == "" ? true : false;
        if ((typeof this.question1 != 'undefined' && this.question1 != "")) {
            this.hasQuestionError = this.question1 == this.question2 ? true : this.question1 == this.question3 ? true : false;
        }
        if ((typeof this.question2 != 'undefined' && this.question2 != "" && this.hasQuestionError == false)) {
            this.hasQuestionError = this.question2 == this.question3 ? true : this.question1 == this.question2 ? true : false;
        }
        if ((typeof this.question3 != 'undefined' && this.question3 != "" && this.hasQuestionError == false)) {
            this.hasQuestionError = this.question1 == this.question3 ? true : this.question2 == this.question3 ? true : false;
        }

        /*if((typeof this.question1!='undefined' && this.question1!="") && (typeof this.question2!='undefined' && this.question2!="") && (typeof this.question1!='undefined' && this.question1!="")){
           console.log("this question1 empty");
            this.hasQuestionError = this.question1 == this.question2 ? true : this.question1 == this.question3 ? true : this.question2 == this.question3 ? true : false;
        }*/

    }

    getSecurityQuestions() {
        this.spinner.show();
        this.serviceCall.getSecurityQuestions().subscribe(data => {
            this.securityQuestions = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getCommuncationTypes() {
        this.spinner.show();
        this.serviceCall.getCommunicationsTypes().subscribe(data => {
            this.communcationTypes = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
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

    getPractitionersDetails() {
        this.spinner.show();
        this.serviceCall.getOrganizationTypes().subscribe(data => {
            this.organizationTypes = data;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getProvinces() {
        let obj;
        this.spinner.show();
        this.serviceCall.getProvinces().subscribe(data => {
            this.provinces = data.json();
            // this.firstControlOptions = data.json();
            // for (let entry of provs) {
            //     obj = {
            //         'id': entry.code,
            //         'name': entry.name,
            //     }
            //     console.log('entry:', obj);
            //     this.firstControlOptions.push(obj);
            // }
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    doRegister() {

        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.loadMoreDetails();
        const registerInput = {
            'externaluser': this.exRegisterInput1,
            'externalUserRoles': this.externalUserRole,
            userTypeCode: this.exRegisterInput2.userTypeCode,
            userTypeName: this.exRegisterInput2.userTypeName,
            title: this.exRegisterInput2.title,
            firstName: this.exRegisterInput2.firstName,
            userName: this.exRegisterInput2.email.toLowerCase(),
            surname: this.exRegisterInput2.surname,
            mobileNo: this.exRegisterInput2.mobileNo,
            telephoneNo: this.exRegisterInput2.telephoneNo,
            email: this.exRegisterInput2.email.toLowerCase(),
            isApproved: this.exRegisterInput2.isApproved,
            rejectionReason: '',
            isApprejuserCode: '',
            isApprejuserName: '',
            isApprejDate: '',
            mainRoleCode: this.roleForm.get('role').value.split('=')[0],
            mainRoleName: this.roleForm.get('role').value.split('=')[1]
        };
        this.serviceCall.registerExternalUser(registerInput).subscribe(data => {
            const response = data.json();
            if (response.message) {
                const options = this.toastrService.toastrConfig;
                const opt = JSON.parse(JSON.stringify(options));
                this.toastrService[this.types[1]](response.message, response.messageCode, opt);
                this.spinner.hide();
            }
            else {
                if (this.exRegisterInput2.isApproved !== 'YES') {
                    if (this.roleForm.get('role').value.split('=')[0] == 'EX010' || 
                            this.roleForm.get('role').value.split('=')[0] == 'EX002') {
                        this.uploadDocument(response.userCode);
                    }
                    this.createTask(response.userName);
                    this.toastrService[this.types[0]]('Thank you and Submitted for Approval', 'Registration', opt);
                }
                else {
                    this.toastrService[this.types[0]]('Successfully Registered', 'Registration', opt);
                }

                this.router.navigate(['/login']);
            }
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Technical Error. Try again', 'Error', opt);
            this.spinner.hide();
        });

    }

    uploadDocument(userCode) {
        const formData = new FormData();
        formData.append('multipleFiles', this.fileData);
        formData.append('userCode', userCode);

        this.serviceCall.uploadDocumentationForExternalUsers(formData).subscribe(data => {
            const response = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    createTask(userName) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        const createTaskInput =
        {
            taskType: 'EXTERNAL_USER_PENDING_APPROVAL',
            taskReferenceCode: userName,
            taskReferenceType: 'USER',
            taskOpenDesc: 'external user registration',
            taskAllProvinceCode: this.externalUserRole[0].userProvinceCode,
            taskAllOCSectionCode: '',
            taskAllOCRoleCode: this.roleForm.get('role').value.split('=')[0],
            taskStatus: 'OPEN'
        };
        this.serviceCall.createTask(createTaskInput).subscribe(data => {
            const response = data.json();
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    trimSpace(k){
        var l="\r\n\t "; //you can add more chars here.
        if (l.indexOf(k[0])>-1) {
            return this.trimSpace(k.substr(1,k.length));
        } else if (l.indexOf(k[k.length-1])>-1) {
            return this.trimSpace(k.substr(0,k.length-1));
        } else {
            return k;
        }
    }

    public next() {
        this.spinner.show();
        this.noPPNFound = false;
        let roleForm = this.roleForm;
        let specificRoleForm = this.specificRoleForm;
        let roleFormCompany = this.roleFormCompany;
        let personalForm = this.personalForm;
        let moredetailsForm = this.moredetailsForm;
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        let toastrService = this.toastrService;

        if (this.steps[this.steps.length - 1].active)
            return false;

        this.steps.some((step, index, steps) => {
            if (index < steps.length - 1) {
                if (step.active) {
                    if (step.name == 'Role Information') {
                        if (roleForm.get('role').value.length == 0) {
                            step.hasError = true;
                            this.spinner.hide();
                            return;
                        }
                        if (roleForm.get('role').value.split('=')[0] == 'EX010' || roleForm.get('role').value.split('=')[0] == 'EX002') {
                            if (roleForm.valid) {
                                this.serviceCall.checkUserExist(this.roleForm.get('email').value.toLowerCase()).subscribe(data => {
                                    const result = data.json();
                                    if (result.exists == 'false') {
                                        this.serviceCall.getExternalRolesByRoleCode(roleForm.get('role').value.split('=')[0]).subscribe((data: any) => {
                                            this.permissions = data.json();
                                            this.permissionExternalroles = new Permissions();
                                            this.permissionExternalroles.verifyProfessionalRegistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
                                            if (this.permissionExternalroles.verifyProfessionalRegistration == 'Y') {
                                                let prefixT =  roleForm.get('role').value.split('=')[0] == 'EX002' ? 'PRaRCHT ' : 'GPR LS ';
                                                this.serviceCall.validatePlsUser(prefixT + this.trimSpace(roleForm.get('ppn').value)).subscribe(data => {
                                                    const responseValidatePlsUser = data.json();
                                                    if (responseValidatePlsUser.message == 'PlsUser does not exist') {
                                                        this.noPPNFound = true;
                                                        toastrService[this.types[1]]('Pls User doesnt exists with this ppn no', 'Error', opt);
                                                        step.hasError = true;
                                                        this.spinner.hide();
                                                    }
                                                    else if (responseValidatePlsUser.plscode == (prefixT + this.trimSpace(roleForm.get('ppn').value))) {
                                                        this.serviceCall.getPpNumber(prefixT + this.trimSpace(roleForm.get('ppn').value)).subscribe(data => {
                                                            const respp = data.json();
                                                            if (respp.exists == 'true') {
                                                                toastrService[this.types[1]]('User already registered with this PPN number', 'Error', opt);
                                                            }
                                                            else {
                                                                this.loadRoles(prefixT + this.trimSpace(roleForm.get('ppn').value), roleForm.get('nameofpractise').value);
                                                                step.active = false;
                                                                step.valid = true;
                                                                steps[index + 1].active = true;
                                                                this.spinner.hide();
                                                                return true;
                                                            }
                                                            this.spinner.hide();
                                                        }, error => {
                                                            this.spinner.hide();
                                                        });
                                                    }
                                                    else {
                                                        toastrService[this.types[1]]('Unknown Error. Try again', 'Error', opt);
                                                    }
                                                },
                                                    error => {
                                                        toastrService[this.types[1]]('Technical Error. Try again', 'Error', opt);
                                                        this.spinner.hide();
                                                    });
                                            }
                                            else {
                                                this.loadRoles(this.trimSpace(roleForm.get('ppn').value), roleForm.get('nameofpractise').value);
                                                step.active = false;
                                                step.valid = true;
                                                steps[index + 1].active = true;
                                                this.spinner.hide();
                                                return true;
                                            }
                                        },
                                            error => {
                                                toastrService[this.types[1]]('Unknown error while checking permissions', 'Error', opt);
                                            });


                                    }
                                    else {
                                        step.hasError = true;
                                        this.emailExists = true;
                                        toastrService[this.types[1]]('Account already exists with this email', 'Error', opt);
                                        this.spinner.hide();
                                    }
                                },
                                    error => {
                                        toastrService[this.types[1]]('Technical Error. Try again', 'Error', opt);
                                        this.spinner.hide();
                                        console.log(error);
                                    });
                            }
                            else {
                                step.hasError = true;
                                this.spinner.hide();
                            }
                        }
                        else if (roleForm.get('role').value.split('=')[0] == 'EX011') {
                            roleFormCompany.controls['role'].setValue(roleForm.get('role').value);
                            roleFormCompany.controls['province'].setValue(roleForm.get('province').value);
                            roleFormCompany.controls['ppn'].setValue(roleForm.get('ppn').value);
                            roleFormCompany.controls['nameofpractise'].setValue(roleForm.get('nameofpractise').value);
                            roleFormCompany.controls['province'].setValue(roleForm.get('province').value);
                            roleFormCompany.controls['email'].setValue(roleForm.get('email').value.toLowerCase());
                            roleFormCompany.controls['register'].setValue(roleForm.get('register').value);
                            console.log(roleFormCompany);
                            if (roleFormCompany.valid) {
                                this.serviceCall.checkUserExist(roleFormCompany.get('email').value.toLowerCase()).subscribe(data => {
                                    const result = data.json();
                                    if (result.exists == 'false') {
                                        this.serviceCall.getExternalRolesByRoleCode(roleFormCompany.get('role').value.split('=')[0]).subscribe((data: any) => {
                                            this.permissions = data.json();
                                            this.permissionExternalroles = new Permissions();
                                            this.permissionExternalroles.verifyProfessionalRegistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
                                            if (this.permissionExternalroles.verifyProfessionalRegistration == 'Y') {
                                                let prefixT =  roleFormCompany.get('role').value.split('=')[0] == 'EX002' ? 'PRaRCHT ' : 'GPR LS ';
                                                this.serviceCall.validatePlsUser(prefixT + this.trimSpace(roleFormCompany.get('ppn').value)).subscribe(data => {
                                                    const responseValidatePlsUser = data.json();
                                                    if (responseValidatePlsUser.message == 'PlsUser does not exist') {
                                                        this.noPPNFound = true;
                                                        toastrService[this.types[1]]('Pls User doesnt exists with this ppn no', 'Error', opt);
                                                        step.hasError = true;
                                                        this.spinner.hide();
                                                    }
                                                    else if (responseValidatePlsUser.plscode == (prefixT + this.trimSpace(roleFormCompany.get('ppn').value))) {
                                                        this.serviceCall.getPpNumber(prefixT + this.trimSpace(roleForm.get('ppn').value)).subscribe(data => {
                                                            const respp = data.json();
                                                            if (respp.exists == 'true') {
                                                                this.roleForm.controls['nameofpractise'].setValue(respp.practiseName);
                                                                this.loadRoles(prefixT + this.trimSpace(roleForm.get('ppn').value), roleForm.get('nameofpractise').value);
                                                                step.active = false;
                                                                step.valid = true;
                                                                steps[index + 1].active = true;
                                                                this.spinner.hide();
                                                                return true;
                                                            }
                                                            else {
                                                                toastrService[this.types[1]]('Surveyor not registered with this PPN number', 'Error', opt);
                                                            }
                                                            this.spinner.hide();
                                                        }, error => {
                                                            this.spinner.hide();
                                                        });
                                                    }
                                                    else {
                                                        toastrService[this.types[1]]('Unknown Error. Try again', 'Error', opt);
                                                    }
                                                },
                                                    error => {
                                                        toastrService[this.types[1]]('Technical Error. Try again', 'Error', opt);
                                                        this.spinner.hide();
                                                    });
                                            }
                                            else {
                                                this.loadRoles(roleFormCompany.get('ppn').value, roleFormCompany.get('nameofpractise').value);
                                                step.active = false;
                                                step.valid = true;
                                                steps[index + 1].active = true;
                                                this.spinner.hide();
                                                return true;
                                            }
                                        },
                                            error => {
                                                toastrService[this.types[1]]('Unknown error while checking permissions', 'Error', opt);
                                            });


                                    }
                                    else {
                                        step.hasError = true;
                                        this.emailExists = true;
                                        toastrService[this.types[1]]('Account already exists with this email', 'Error', opt);
                                        this.spinner.hide();
                                    }
                                },
                                    error => {
                                        toastrService[this.types[1]]('Technical Error. Try again', 'Error', opt);
                                        this.spinner.hide();
                                        console.log(error);
                                    });
                            }
                            else {
                                step.hasError = true;
                                this.spinner.hide();
                            }
                        }
                        else {
                            specificRoleForm.controls['role'].setValue(roleForm.get('role').value);
                            specificRoleForm.controls['province'].setValue(roleForm.get('province').value);
                            specificRoleForm.controls['email'].setValue(roleForm.get('email').value.toLowerCase());
                            if (specificRoleForm.valid) {
                                this.serviceCall.checkUserExist(this.roleForm.get('email').value.toLowerCase()).subscribe(data => {
                                    const result = data.json();
                                    console.log('result:', result.exists);
                                    if (result.exists == 'false') {
                                        this.loadRoles('', '');
                                        step.active = false;
                                        step.valid = true;
                                        steps[index + 1].active = true;
                                        this.spinner.hide();
                                        return true;
                                    }
                                    else {
                                        step.hasError = true;
                                        this.emailExists = true;
                                        toastrService[this.types[1]]('Account already exists with this email', 'Error', opt);
                                        this.spinner.hide();
                                    }
                                },
                                    error => {
                                        toastrService[this.types[1]]('Technical Error. Try again', 'Error', opt);
                                        this.spinner.hide();
                                        console.log(error);
                                    });
                            }
                            else {
                                step.hasError = true;
                                this.spinner.hide();
                            }
                        }
                    }
                    if (step.name == 'Personal Information') {
                        console.log('province:', personalForm)
                        if (personalForm.valid) {
                            this.loadPersonalInfo();
                            step.active = false;
                            step.valid = true;
                            steps[index + 1].active = true;
                            this.spinner.hide();
                            return true;
                        }
                        else {
                            step.hasError = true;
                            this.spinner.hide();
                        }
                    }
                    if (step.name == 'More Details') {
                        if (moredetailsForm.valid) {
                            toastrService[this.types[0]]('Successfully Registered', 'Registration', opt);
                            this.spinner.hide();
                            return true;
                        }
                        else {
                            step.hasError = true;
                            this.spinner.hide();
                        }
                    }
                }
            }
        });
    }

    resolved(captchaResponse: string) {
        this.captcha = true;
    }

    changeRole(target) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        console.log('target1:', this.roleForm.get('role').value.split('=')[0]);
        console.log('target2:', this.roleForm.get('role').value.split('=')[1]);
        console.log('target3:', this.roleForm.get('role').value.split('=')[2])

        this.serviceCall.getExternalRolesByRoleCode(this.roleForm.get('role').value.split('=')[0]).subscribe((data: any) => {
            this.permissions = data.json();
            this.permissionExternalroles = new Permissions();

            this.permissionExternalroles.register = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.register;
            this.roleForm.controls['register'].setValue(this.permissionExternalroles.register);
            this.specificRoleForm.controls['register'].setValue(this.permissionExternalroles.register);
            this.permissionExternalroles.updatePassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.updatepassword;
            this.permissionExternalroles.resetPassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.resetpassword;
            this.permissionExternalroles.verifyProfessionalRegistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
            this.permissionExternalroles.reports = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports;
            this.spinner.hide();
            // console.log('this.permissionExternalroles', this.permissionExternalroles);
        },
            error => {
                this.toastrService[this.types[1]]('Error while extracting data. Try again', 'Error', opt);
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

    changeTC() {
        console.log('agree',this.moredetailsForm.get('tc').value );
    }

    loadPersonalInfo() {
        this.exRegisterInput2.title = this.personalForm.get('salutation').value;
        this.exRegisterInput2.firstName = this.personalForm.get('firstname').value;
        this.exRegisterInput2.surname = this.personalForm.get('lastname').value;
        this.exRegisterInput2.mobileNo = this.personalForm.get('mobile').value;
        this.exRegisterInput2.telephoneNo = this.personalForm.get('telephone').value;
        this.exRegisterInput1.organizationtypecode = this.personalForm.get('orgtype').value.split('=')[0];
        this.exRegisterInput1.organizationtypename = this.personalForm.get('orgtype').value.split('=')[1];
        this.exRegisterInput1.postaladdressline1 = this.personalForm.get('addressline1').value;
        this.exRegisterInput1.postaladdressline2 = this.personalForm.get('addressline2').value;
        this.exRegisterInput1.postaladdressline3 = this.personalForm.get('addressline3').value;
        this.exRegisterInput1.postalcode = this.personalForm.get('zipcode').value;
        this.exRegisterInput1.sectorcode = this.personalForm.get('sector').value.split('=')[0];
        this.exRegisterInput1.sectorname = this.personalForm.get('sector').value.split('=')[1];
        console.log('this.loadPersonalInfo:', this.exRegisterInput1);
    }

    loadMoreDetails() {
        this.exRegisterInput1.communicationmodetypecode = this.moredetailsForm.get('communication').value.split('=')[0];
        this.exRegisterInput1.communicationmodetypename = this.moredetailsForm.get('communication').value.split('=')[1];
        this.exRegisterInput1.alternativeemail = this.moredetailsForm.get('alternativeemail').value == 'tester@tester.co.za' ? '' : this.moredetailsForm.get('alternativeemail').value;
        this.exRegisterInput1.securityquestiontypecode1 = this.moredetailsForm.get('secq1').value.split('=')[0];
        this.exRegisterInput1.securityquestiontypecode2 = this.moredetailsForm.get('secq2').value.split('=')[0];
        this.exRegisterInput1.securityquestiontypecode3 = this.moredetailsForm.get('secq3').value.split('=')[0];
        this.exRegisterInput1.securityquestion1 = this.moredetailsForm.get('secq1').value.split('=')[1];
        this.exRegisterInput1.securityquestion2 = this.moredetailsForm.get('secq2').value.split('=')[1];
        this.exRegisterInput1.securityquestion3 = this.moredetailsForm.get('secq3').value.split('=')[1];
        this.exRegisterInput1.securityanswer1 = this.moredetailsForm.get('ans1').value;
        this.exRegisterInput1.securityanswer2 = this.moredetailsForm.get('ans2').value;
        this.exRegisterInput1.securityanswer3 = this.moredetailsForm.get('ans3').value;
        this.exRegisterInput1.subscribeevents = this.moredetailsForm.get('events').value == true ? 'Y' : 'N';
        this.exRegisterInput1.subscribenews = this.moredetailsForm.get('news').value == true ? 'Y' : 'N';
        this.exRegisterInput1.subscribenotifications = this.moredetailsForm.get('information').value == true ? 'Y' : 'N';
        // this.exRegisterInput1.subscribenotifications = this.moredetailsForm.get('tc').value == true ? 'Y' : 'N'
        // console.log('this.loadMoreDetails:', this.exRegisterInput1);
    }

    loadRoles(ppno, praticename) {
        let province = this.roleForm.get('province').value;
        let tRole;
        this.exRegisterInput1.ppno = ppno;
        this.exRegisterInput1.practicename = praticename;
        this.exRegisterInput2.userTypeCode = 'UST002';
        this.exRegisterInput2.userTypeName = 'EXTERNAL';
        this.exRegisterInput2.email = this.roleForm.get('email').value.toLowerCase();
        this.exRegisterInput2.isApprejuserCode = '';
        this.exRegisterInput2.isApprejuserName = '';
        this.exRegisterInput2.isApprejDate = '';
        if (this.roleForm.get('role').value.split('=')[2] == 'Y') {
            if (this.roleForm.get('role').value.split('=')[0] == 'EX011') {
                this.exRegisterInput2.isApproved = 'WAITING';
            }
            else {
                this.exRegisterInput2.isApproved = 'PENDING';
            }
        }
        else {
            this.exRegisterInput2.isApproved = 'YES';
        }

        this.externalUserRole = [];
        // for (let province of provinces) {
        // let provincename = this.provincesList.filter(paramProv => paramProv.id === province);
        tRole = new ExternalRole();
        // tRole.userRoleCode = this.roleForm.get('role').value.split('=')[0];
        // tRole.userRoleName = this.roleForm.get('role').value.split('=')[1];
        tRole.userProvinceCode = this.roleForm.get('province').value.split('=')[0];
        tRole.userProvinceName = this.roleForm.get('province').value.split('=')[1];
        this.externalUserRole.push(tRole);
        // }
    }

    selectFile(inputfile1) {
        if (inputfile1.files.length) {
            this.roleForm.controls['companydoc'].setValue(inputfile1.files[0].name);
            this.fileName = inputfile1.files[0].name;
            this.fileData = inputfile1.files[0];
        }
    }
    // fileupload(input) {
    //     // console.log('input:', input.files);
    //     this.spinner.show();
    //     this.fileSizeLimit = false;
    //     if (input.files.length) {
    //         this.file = input.files[0].name;
    //         const filesplit = this.file.split('.');
    //         if (filesplit[1] == 'pdf' || filesplit[1] == 'doc' || filesplit[1] == 'docx') {
    //             if (input.files[0].size > '10485760') {
    //                 this.fileSizeLimit = true;
    //                 this.file = '';
    //                 this.myInputVariable.nativeElement.value = '';
    //                 this.spinner.hide();
    //             } else {
    //                 const formData = new FormData();
    //                 formData.append('file', input.files[0]);
    //                 formData.append('I4gQuotationCode', this.generateQuoteSaveReq.saveReq.Quotation.I4gQuotationCode);
    //                 formData.append('I4gRfqCode', this.generateQuoteSaveReq.saveReq.Quotation.I4GRfqCode);
    //                 formData.append('I4gCompanyCode', this.generateQuoteSaveReq.saveReq.Quotation.I4gCompanyCode);
    //                 formData.append('FileName', input.files[0].name);

    //                 this.sellerRFQService.formuploaders('uploadQuotationSupportingDocuments', formData).subscribe(data => {
    //                     // this.getuploadFiles();
    //                     this.file = '';
    //                     this.myInputVariable.nativeElement.value = '';
    //                     this.spinner.hide();
    //                     const opt = JSON.parse(JSON.stringify(this.options));
    //                     this.toastrService[this.types[0]]('', 'File Uploaded', opt);
    //                     this.getQuotationDocsList();
    //                 }, error => {
    //                     this.spinner.hide();
    //                 });
    //             }
    //         } else {
    //             this.file = '';
    //             this.myInputVariable.nativeElement.value = '';
    //             this.spinner.hide();
    //             const opt = JSON.parse(JSON.stringify(this.options));
    //             this.toastrService[this.types[1]]('', 'Allowed: PDF, DOC, DOCX files', opt);
    //             // this.alertfailure('You can upload only PDF, DOC, DOCX files. Another file type is not supported. Please try again.');
    //         }
    //     }
    //     else {
    //         this.spinner.hide();
    //     }
    // }

    confirm() {

        if (this.moredetailsForm.get('communication').value.split('=')[1] === 'Alternative Email') {
            if (this.moredetailsForm.valid && this.hasQuestionError == false) {
                this.doRegister();
            }
            else {
                this.hasError = true;
            }
        }
        else {
            this.moredetailsForm.controls['alternativeemail'].setValue('tester@tester.co.za');
            if (this.moredetailsForm.valid && this.hasQuestionError == false) {
                this.doRegister();
            }
            else {
                this.moredetailsForm.controls['alternativeemail'].setValue('');
                this.hasError = true;
            }
        }

        // this.steps.forEach(step => step.valid = true);
    }

}

export class externalRegister1 {
    organizationtypecode: any;
    organizationtypename: any;
    ppno: any;
    practicename: any;
    postaladdressline1: any;
    postaladdressline2: any;
    postaladdressline3: any;
    postalcode: any;
    communicationmodetypecode: any;
    communicationmodetypename: any;
    alternativeemail: any;
    securityquestiontypecode1: any;
    securityquestion1: any;
    securityanswer1: any;
    securityquestiontypecode2: any;
    securityquestion2: any;
    securityanswer2: any;
    securityquestiontypecode3: any;
    securityquestion3: any;
    securityanswer3: any;
    subscribenews: any;
    subscribenotifications: any;
    subscribeevents: any;
    sectorcode: any;
    sectorname: any;
}

export class externalRegister2 {
    userTypeCode: any;
    userTypeName: any;
    password: any;
    title: any;
    firstName: any;
    userName: any;
    surname: any;
    mobileNo: any;
    telephoneNo: any;
    email: any;
    isApproved: any;
    rejectionReason: any;
    isApprejuserCode: any;
    isApprejuserName: any;
    isApprejDate: any;
    mainRoleCode: any;
    mainRoleName: any;
}

export class ExternalUserRole {
    externalUserRoles: ExternalRole[] = [];
}

export class ExternalRole {
    // userRoleCode: any;
    // userRoleName: any;
    userProvinceCode: any;
    userProvinceName: any;
}

export class Permissions {
    register: any;
    updatePassword: any;
    resetPassword: any;
    verifyProfessionalRegistration: any;
    reports: any;
}