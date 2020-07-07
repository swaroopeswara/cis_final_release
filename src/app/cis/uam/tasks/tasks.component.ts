import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { Globals } from 'src/app/services/Apis/globals';
import { Number } from 'core-js';
import { DatePipe } from '@angular/common';
import { DateComComponent } from 'src/app/public/datecom/datecom.component';

@Component({
  selector: 'az-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  allTasks = [];
  allClosedTasks = [];
  personalForm: FormGroup;
  taskDescForm: FormGroup;
  requestForm: FormGroup;
  categoryForm: FormGroup;
  verifyForm: FormGroup;
  fullallTasks = [];
  fullallClosedTasks = [];
  selectedTask: any;
  limits = [10, 25, 50, 100];
  itemCount = 0;
  itemCountClosed = 0;
  itemClosedCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  itemResourceClosed = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  searchText: any;
  searchArrayText: any;
  searchArrayTextClosed: any;
  hasError: boolean;
  userResponse: any = '';
  allExternalroles: any;
  communcationTypes: any;
  sectors: any;
  organizationTypes: any;
  result: any = '';
  userCode: any;
  userName: any;
  allInternalRoles: any;
  newRole: NewRole;
  personalInForm: FormGroup;
  reason: any;
  reason1: any;
  isApproved: any;
  approvedRolesArray: ApprovedInternalUserRole[] = [];
  errorInternal: boolean;
  selectedRequest: any;
  selectedRequestItem = new RequestItem();
  selectedRequestItems: RequestItem[] = [];
  requestSearchResultJson: any = '';
  provinces: any;
  taskDoneUserName: any;


  // Information
  selectedProvince: any = '';
  selectedInfoOfficer: any = '';
  officers: any;
  selectedFlow: any;
  hasInfoManagerError: any;
  infoFinaliseDescription: any;
  targets: any;
  hasCategoryError: boolean;
  categories: any;
  subCategories: any;
  itemIndex: any = 0;
  costType: any = '';
  subCategoryItem: any;
  numberRegexError: any;
  uploadPopFile: any;
  uploadedPop: boolean;
  generatedInvoice: boolean;
  requestTaskButtonText: any = '';
  paymentFile: any;
  dispatchFile: any = '';
  fileSizeLimit: boolean;
  getdoclist: [];
  getReqCodeList: any;
  tasklifecycle: any = '';
  filterFromDate: any;
  filterUsername: any;
  filterToDate: any;
  filterFromDateClosed: any;
  filterToDateClosed: any;
  queryFromDate: any;
  queryToDate: any;
  queryFromDateClosed: any;
  queryToDateClosed: any;
  filterValid: boolean;
  filterValidClosed: boolean;
  isManager: boolean;
  userProvinceCode: any;
  jsonToBeUsed: Item[] = [];
  item: Item;
  ignoreDate: any;
  ignoreDateClosed: any;
  cashierEmailAddress: any;
  invalidCashierEmail: boolean;
  trackingNumber: any = '';
  requestDocuments: any = '';
  paymentConfirmation:any = '';
  invoiceDocs: any = '';
  dispatchDocsList: any = '';
  paymentVerified: boolean;
  description: any = '';
  internalUsersRoles: any;

  @ViewChild('searchText') userInput: ElementRef;

  constructor(private globals: Globals, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService, private _dateFormatPipe: DateComComponent) {

    this.hasError = false;
    this.isManager = false;
    this.errorInternal = false;
    this.hasInfoManagerError = false;
    this.hasCategoryError = false;
    this.numberRegexError = false;
    this.fileSizeLimit = false;
    this.uploadedPop = false;
    this.generatedInvoice = false;
    this.filterValid = false;
    this.filterValidClosed = false;
    this.invalidCashierEmail = false;
    this.paymentVerified = true;
    this.personalForm = this.formBuilder.group({
      'salutation': '',
      'firstname': '',
      'lastname': '',
      'orgtype': '',
      'mobile': '',
      'email': '',
      'telephone': '',
      'addressline1': '',
      'addressline2': '',
      'addressline3': '',
      'zipcode': '',
      'sector': '',
      'communication': '',
      'news': '',
      'events': '',
      'information': ''
    });

    this.personalInForm = this.formBuilder.group({
      'title': '',
      'firstname': '',
      'lastname': '',
      'mobile': '',
      'telephone': '',
      'email': ''
    });

    this.taskDescForm = this.formBuilder.group({
      'taskDescription': ''
    });

    this.requestForm = this.formBuilder.group({
      'userName': '',
      'firstName': '',
      'surName': '',
      'requestTypeName': '',
      'postalAddress1': '',
      'postalAddress2': '',
      'postalAddress3': '',
      'deliveryMethod': '',
      'email': '',
      'formatType': '',
      'popFilePath': '',
      'provinceCode': '',
      'sectionCode': ''
    });

    this.categoryForm = this.formBuilder.group({
      'gazettetype': 'REQUEST',
      'category': ['', Validators.required],
      'subcategory': ['', Validators.required],
      'categorycode': '',
      'subcategorycode': '',
      'fixedRate': '0.00',
      'hourRate': '0.00',
      'halfHourRate': '0.00',
      'quantity': '0',
      'hours': ['0', Validators.required],
      'requestCost': ['0.00', Validators.required],
    });

    this.verifyForm = this.formBuilder.group({
      'verify': false
    });

    this.filterFromDate = this._dateFormatPipe.transformDate(new Date());
    this.filterToDate = this._dateFormatPipe.transformDate(new Date());

    this.filterFromDateClosed = this._dateFormatPipe.transformDate(new Date());
    this.filterToDateClosed = this._dateFormatPipe.transformDate(new Date());
    this.filterUsername = '';

    // this.queryFromDate = this._dateFormatPipe.transform(new Date());
    // this.queryToDate = this._dateFormatPipe.transform(new Date());

    // this.filterFromDate = "2016-08-05";
  }
  ngOnInit() {
    this.getSectors();
    this.getCommuncationTypes();
    this.getOrganizationTypes();
    if (localStorage.getItem('cis_selected_rolecode') !== 'IN033') this.getAllTasksToRespond();
    this.getProvinces();
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    this.selectedFlow = 'flow2';
  }

  downloadFile(role) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const downloadInput =
    {
      userCode: this.userResponse.userCode,
      userName: this.userResponse.userName,
      internalRoleCode: role.internalRoleCode
    };
    this.serviceCall.downloadSignedUserAccess(downloadInput);
    this.spinner.hide();
  }

  public base64toBlob(base64Data: any, contentType: any): object {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  fileDispatchUpload(input2) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    console.log('input.files', input2.files[0]);
    this.fileSizeLimit = false;
    if (input2.files.length) {
      this.dispatchFile = input2.files[0].name;
      const filesplit = this.dispatchFile.split('.');
      console.log('this.dispatchFile', this.dispatchFile);
      const formData = new FormData();
      formData.append('multipleFiles', input2.files[0]);
      formData.append('requestCode', this.selectedTask.taskReferenceCode);
      this.serviceCall.uploadDispatchDocument(formData).subscribe(data => {
        this.getDispatchDocsList();
        this.dispatchFile = '';
        this.spinner.hide();
        const opt = JSON.parse(JSON.stringify(options));
        this.toastrService[this.types[0]]('', 'File Uploaded', opt);
      }, error => {
        this.spinner.hide();
      });
    }
    else {
      this.dispatchFile = '';
      this.spinner.hide();
    }
  }

  updateFromDate(event) {
    this.filterFromDate = event;
  }

  updateFromDateClosed(event) {
    this.filterFromDateClosed = event;
  }

  updateEmailAddress(value) {
    console.log('value', value);
    this.cashierEmailAddress = value;
  }

  ignoreTheDate(event) {
    this.ignoreDate = event;
    this.getAllTasksToRespond();
    this.searchArrayText = '';
  }

  ignoreTheDateClosed(event) {
    this.ignoreDateClosed = event;
    this.getAllTasksToRespondClosed();
    this.searchArrayTextClosed = '';
  }

  updateToDate(event) {
    this.filterToDate = event;
  }

  updateToDateClosed(event) {
    this.filterToDateClosed = event;
  }

  getRequestDocuments(requestCode) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    let k = 0;

    this.spinner.show();
    this.serviceCall.getRequestDocuments(requestCode).subscribe(data => {
      this.getReqCodeList = data.json();
      if (this.getReqCodeList.requestDocuments.length > 0) {
        this.requestDocuments = JSON.parse(this.getReqCodeList.requestDocuments[0]).files;
        console.log('req lenth', this.requestDocuments.length);
      }
      else {
        this.requestDocuments = '';
      }
      if (this.getReqCodeList.paymentConfirmation.length > 0) {
        this.paymentConfirmation = this.getReqCodeList.paymentConfirmation[0];
        console.log('pc lenth', this.paymentConfirmation.length);
      }
      else {
        this.paymentConfirmation = '';
      }
      if (this.getReqCodeList.invoiceDocs.length > 0) {
        this.invoiceDocs = this.getReqCodeList.invoiceDocs[0];
        console.log('i lenth', this.invoiceDocs.length);
      }
      else {
        this.invoiceDocs = '';
      }
      if (this.getReqCodeList.dispatchDocs.length > 0) {
        this.dispatchDocsList = JSON.parse(this.getReqCodeList.dispatchDocs[0]).files;
      }
      else {
        this.dispatchDocsList = '';
      }
      this.spinner.hide();
    },
      error => {
        this.getReqCodeList = [];
        this.spinner.hide();
      });
  }

  downloadDocuments() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    if (this.selectedRequest.documentStoreCode.length > 0) {
      const downloadInput = {
        'documentStoreCode': this.selectedRequest.documentStoreCode
      };
      this.serviceCall.downloadDocuments(downloadInput);
    }
    this.spinner.hide();
}

  getAllTasksToRespond() {
    let dateFrom;
    let dateTo;

    this.filterValid = false;
    let provincecode = localStorage.getItem('cis_selected_provincecode') == 'null' ? '' : localStorage.getItem('cis_selected_provincecode');
    let sectioncode = localStorage.getItem('cis_selected_sectioncode') == 'null' ? '' : localStorage.getItem('cis_selected_sectioncode');
    let rolecode = localStorage.getItem('cis_selected_rolecode') == 'null' ? '' : localStorage.getItem('cis_selected_rolecode');
    let internalrolecode = localStorage.getItem('cis_selected_internalrolecode') == 'null' ? '' : localStorage.getItem('cis_selected_internalrolecode');
    let selectedroleoruser = (localStorage.getItem('cis_selected_rolename').includes('Information Officer') || localStorage.getItem('cis_selected_rolename').includes('Information Scrutinizer')) ? localStorage.getItem('cis_username') : '';
    // let selectedroleoruser = localStorage.getItem('cis_selected_rolename').includes('Information Officer') ? localStorage.getItem('cis_username') : '';
    this.isManager = localStorage.getItem('cis_selected_rolename').includes('Information Manager');
    this.userProvinceCode = localStorage.getItem('cis_selected_provincecode');
    internalrolecode = internalrolecode == 'INROLE0033' ? '' : internalrolecode;
    if (rolecode == 'IN027') {
      rolecode = '';
      internalrolecode = '';
    }

    if (this.ignoreDate) {
      this.queryFromDate = '';
      this.queryToDate = '';
      dateFrom = '';
      dateTo = ''
    }
    else {
      this.queryFromDate = this._dateFormatPipe.transform(this.filterFromDate);
      this.queryToDate = this._dateFormatPipe.transform(this.filterToDate);
      dateFrom = new Date(this.queryFromDate);
      dateTo = new Date(this.queryToDate);
    }

    if (dateTo >= dateFrom) {
      this.getAllTasks('', '', provincecode, sectioncode, internalrolecode, 'Closed', selectedroleoruser, this.queryFromDate, this.queryToDate);
    }
    else {
      this.filterValid = true;
    }
  }

  getAllTasksToRespondClosed() {
    let dateFrom;
    let dateTo;

    this.filterValidClosed = false;
    let provincecode = localStorage.getItem('cis_selected_provincecode') == 'null' ? '' : localStorage.getItem('cis_selected_provincecode');
    let sectioncode = localStorage.getItem('cis_selected_sectioncode') == 'null' ? '' : localStorage.getItem('cis_selected_sectioncode');
    let rolecode = localStorage.getItem('cis_selected_rolecode') == 'null' ? '' : localStorage.getItem('cis_selected_rolecode');
    let internalrolecode = localStorage.getItem('cis_selected_internalrolecode') == 'null' ? '' : localStorage.getItem('cis_selected_internalrolecode');
    let selectedroleoruser = (localStorage.getItem('cis_selected_rolename').includes('Information Officer') || localStorage.getItem('cis_selected_rolename').includes('Information Scrutinizer')) ? localStorage.getItem('cis_username') : '';
    // let selectedroleoruser = localStorage.getItem('cis_selected_rolename').includes('Information Officer') ? localStorage.getItem('cis_username') : '';
    this.isManager = localStorage.getItem('cis_selected_rolename').includes('Information Manager');
    this.userProvinceCode = localStorage.getItem('cis_selected_provincecode');
    internalrolecode = internalrolecode == 'INROLE0033' ? '' : internalrolecode;
    if (rolecode == 'IN027') {
      rolecode = '';
      internalrolecode = '';
    }

    if (this.ignoreDateClosed) {
      this.queryFromDateClosed = '';
      this.queryToDateClosed = '';
      dateFrom = '';
      dateTo = ''
    }
    else {
      this.queryFromDateClosed = this._dateFormatPipe.transform(this.filterFromDateClosed);
      this.queryToDateClosed = this._dateFormatPipe.transform(this.filterToDateClosed);
      dateFrom = new Date(this.queryFromDateClosed);
      dateTo = new Date(this.queryToDateClosed);
    }

    if (dateTo >= dateFrom) {
      this.getAllClosedTasks('Closed', '', provincecode, sectioncode, internalrolecode, '', selectedroleoruser, this.queryFromDateClosed, this.queryToDateClosed);
    }
    else {
      this.filterValidClosed = true;
    }
  }

  deleteDispatchDocument(val) {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));


    const fileInput = {
      'requestCode': this.selectedTask.taskReferenceCode
    }

    this.serviceCall.deleteDispatchDocument(val, fileInput).subscribe(data => {
      this.spinner.hide();
      this.getDispatchDocsList();
      const opt = JSON.parse(JSON.stringify(options));
      this.toastrService[this.types[0]]('', 'File Deleted', opt);
    }, error => {
      this.spinner.hide();
    });
  }

  selectFlow(flow) {
    this.selectedFlow = flow;
  }

  getInternalUserData(provinceCode, sectionCode) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
     
  }

  submitInformationManagerTask() {
    this.hasInfoManagerError = false;
    let scrutinizeUser = '';
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    if (this.selectedFlow == 'flow2' && this.selectedProvince.length > 0) { //move
      let taskInput = {
        'taskId': this.selectedTask.taskId,
        'requestCode': this.selectedTask.taskReferenceCode,
        'provinceCode': this.selectedProvince,
        'sectionCode': 'SECN006',
        'targetSequenceId': this.selectedFlow,
        'userFullName': localStorage.getItem('cis_userfullname'),
        'userCode': this.userCode,
        'userName': this.userName
      };

      this.serviceCall.processUserState(taskInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
        document.getElementById('requestAssignTaskPopup').click();
        this.getAllTasksToRespond();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while closing task', 'Error', opt);
        this.spinner.hide();
      });
    }
    else if (this.selectedFlow == 'flow3' && this.selectedInfoOfficer.length > 0) { //re- assign to officer
      let taskInput = {
        'taskId': this.selectedTask.taskId,
        'requestCode': this.selectedTask.taskReferenceCode,
        'provinceCode': this.selectedTask.taskAllProvinceCode,
        'sectionCode': 'SECN006',
        'targetSequenceId': this.selectedFlow,
        'userFullName': localStorage.getItem('cis_userfullname'),
        'userCode': this.userCode,
        'userName': this.userName,
        'assigneeList': [{
          type: 'User',
          name: this.selectedInfoOfficer.split('=')[1]
        }]
      };
      this.serviceCall.processUserState(taskInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
        document.getElementById('requestAssignTaskPopup').click();
        document.getElementById('requestPopAssignTaskPopup').click();
        this.getAllTasksToRespond();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while closing task', 'Error', opt);
        this.spinner.hide();
      });
    }
    else if (this.selectedFlow == 'flow6') {
      let taskInput = {
        'taskId': this.selectedTask.taskId,
        'requestCode': this.selectedTask.taskReferenceCode,
        'provinceCode': this.selectedTask.taskAllProvinceCode,
        'sectionCode': 'SECN006',
        'targetSequenceId': this.selectedFlow,
        'userFullName': localStorage.getItem('cis_userfullname'),
        'userCode': this.userCode,
        'userName': this.userName
      };
      this.serviceCall.processUserState(taskInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
        document.getElementById('requestPopAssignTaskPopup').click();
        this.getAllTasksToRespond();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while performing task', 'Error', opt);
        this.spinner.hide();
      });
    }
    else if (this.selectedFlow == 'flow7') {

      let taskInput = {
        'taskId': this.selectedTask.taskId,
        'requestCode': this.selectedTask.taskReferenceCode,
        'provinceCode': this.selectedTask.taskAllProvinceCode,
        'sectionCode': 'SECN006',
        'targetDescription': this.description,
        'targetSequenceId': this.selectedFlow,
        'userFullName': localStorage.getItem('cis_userfullname'),
        'userCode': this.userCode,
        'userName': this.userName,
        'assigneeList': [{
          type: 'User',
          name: 'miliswa.kula@drdlr.gov.za'
        }]
      };
      this.serviceCall.processUserState(taskInput).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
        document.getElementById('requestPopAssignTaskPopup').click();
        this.getAllTasksToRespond();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while performing task', 'Error', opt);
        this.spinner.hide();
      });

      // this.serviceCall.getInternalUserData(this.selectedTask.taskAllProvinceCode, 'SECN006').subscribe(data => {
      //   this.internalUsersRoles = data.json();
      //   scrutinizeUser = this.internalUsersRoles.filter(roles => roles.userRoleName === 'Information Scrutinizer')[0].userName;
      //   if (scrutinizeUser !== null || scrutinizeUser.length > 0) {
      //     let taskInput = {
      //       'taskId': this.selectedTask.taskId,
      //       'requestCode': this.selectedTask.taskReferenceCode,
      //       'provinceCode': this.selectedTask.taskAllProvinceCode,
      //       'sectionCode': 'SECN006',
      //       'targetDescription': this.description,
      //       'targetSequenceId': this.selectedFlow,
      //       'userFullName': localStorage.getItem('cis_userfullname'),
      //       'userCode': this.userCode,
      //       'userName': this.userName,
      //       'assigneeList': [{
      //         type: 'User',
      //         name: scrutinizeUser
      //       }]
      //     };
      //     this.serviceCall.processUserState(taskInput).subscribe(data => {
      //       this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
      //       document.getElementById('requestPopAssignTaskPopup').click();
      //       this.getAllTasksToRespond();
      //       this.spinner.hide();
      //     }, error => {
      //       this.toastrService[this.types[1]]('Error while performing task', 'Error', opt);
      //       this.spinner.hide();
      //     });
      //   }
      //   else {
      //     this.toastrService[this.types[1]]('No Information Scrutinizer to assign the task', 'Error', opt);
      //     this.spinner.hide();
      //   }
        
      // }, error => {
      //   this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      //   this.spinner.hide();
      // });
    }
    else {
      this.hasInfoManagerError = true;
      this.spinner.hide();
    }
  }

  descValue(val) {
    this.description = val;
  }

  getOfficersOfMySection() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    let provincecode = localStorage.getItem('cis_selected_provincecode') == 'null' ? this.selectedRequest.provinceCode : localStorage.getItem('cis_selected_provincecode');
    let sectioncode = localStorage.getItem('cis_selected_sectioncode') == 'null' ? this.selectedRequest.sectionCode : localStorage.getItem('cis_selected_sectioncode');
    
    this.serviceCall.getOfficersOfMySection(provincecode, sectioncode).subscribe(data => {
      this.officers = data.json();
      this.spinner.hide();
    },
      error => {
        // this.toastrService[this.types[1]]('Unknown error while retreiving officers', 'Error', opt);
        this.spinner.hide();
      });
  }

  getDispatchDocsList() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getDispatchDocsList(this.selectedTask.taskReferenceCode).subscribe(data => {
      this.getdoclist = data.json();
      console.log('this.getdoclist', this.getdoclist);
      this.spinner.hide();
    },
      error => {
        this.getdoclist = [];
        this.toastrService[this.types[1]]('Unknown error while retreiving docs', 'Error', opt);
        this.spinner.hide();
      });

  }

  getCategories() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getCategories().subscribe(data => {
      this.categories = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getSubCategories() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getSubCostCategoriesByCostCategoryCode(this.categoryForm.get('category').value.split('=')[0]).subscribe(data => {
      this.subCategories = data.json();
      this.categoryForm.controls['subcategory'].setValue('');
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  changeInfoManagerProvince(val) {
    this.selectedProvince = val;
  }

  changeInfoManageToOfficer(val) {
    this.selectedInfoOfficer = val;
  }

  updateCategory() {

    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    console.log('this.categoryForm', this.categoryForm);

    if (this.categoryForm.valid && this.numberRegexError == false) {
      const createItemInput = {
        'requestGazetteType': 'COST_ITEM',
        'requestId': this.selectedRequest.requestId,
        'requestGazette1': this.categoryForm.get('categorycode').value,
        'requestGazette2': this.categoryForm.get('subcategorycode').value,
        'requestCost': this.categoryForm.get('requestCost').value,
        'requestHours': this.costType == 'Hour Rate' ? (this.categoryForm.get('hours').value * 60) : this.costType == 'Half Hour Rate' ? this.categoryForm.get('hours').value : '0',
        'requestCode': this.selectedTask.taskReferenceCode,
        'quantity': this.categoryForm.get('quantity').value,
        'gazetteType1': this.categoryForm.get('category').value,
        'gazetteType2': this.categoryForm.get('subcategory').value
      };
      this.serviceCall.createRequestItem(createItemInput).subscribe(data => {
        document.getElementById('btnAddRequestItemPopupClose').click();
        this.getRequestByRequestCode(this.selectedTask.taskReferenceCode);
        this.toastrService[this.types[0]]('Successfully created Item', 'Done', opt);
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating item', 'Done', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasCategoryError = true;
      this.spinner.hide();
    }
  }

  fileupload(input1) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.uploadPopFile = input1;
    this.paymentFile = input1.files[0].name;
    const filesplit = input1.files[0].name.split('.');
    if (filesplit[filesplit.length - 1] == 'pdf') {
      this.uploadedPop = true;
    }
    else {
      this.uploadPopFile = '';
      this.spinner.hide();
      this.toastrService[this.types[1]]('', 'Allowed: PDF files', opt);
    }
  }

  uploadPaymentConfirmation() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    const formData = new FormData();
    formData.append('file', this.uploadPopFile.files[0]);
    formData.append('taskId', this.selectedTask.taskId);
    formData.append('requestCode', this.selectedRequest.requestCode);
    formData.append('provinceCode', this.selectedTask.taskAllProvinceCode);
    formData.append('sectionCode', this.selectedTask.taskAllOCSectionCode);
    formData.append('targetSequenceId', 'flow5');
    formData.append('userCode', this.userCode);
    formData.append('userName', this.userName);
    formData.append('url', '');
    this.serviceCall.uploadPaymentConfirmation(formData).subscribe(data => {
      document.getElementById('requestPopAssignTaskPopup').click();
      this.toastrService.success('Payment Confirmation Uploaded', 'Done');
      this.getAllTasksToRespond();
      this.paymentFile = '';
      this.uploadPopFile = '';
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while uploading document. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  sendEmailToCashier() {
    const validEmailRegEx = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (validEmailRegEx.test(this.cashierEmailAddress)) {
      this.invalidCashierEmail = false;
      this.sendPopToCashier();
    } else {
      this.invalidCashierEmail = true;
    }
  }

  setRequestTrackingNo() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.setRequestTrackingNo(this.trackingNumber, this.selectedRequest.requestCode).subscribe(data => {
      this.toastrService.success('Submitted', 'Done');
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while saving data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getRequestTrackingNo() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getRequestTrackingNo(this.selectedRequest.requestCode).subscribe(data => {
      this.trackingNumber = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while saving data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  submitTrackingNumber() {
    if (this.trackingNumber.length > 0) {
      this.setRequestTrackingNo();
    } 
  }

  sendPopToCashier() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    const emailnput = {
      requestCode: this.selectedRequest.requestCode,
      emailAddress: this.cashierEmailAddress
    };
    this.serviceCall.sendPopToCashier(emailnput).subscribe(data => {
      this.toastrService[this.types[0]]('POP Sent Successfully', 'Done', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown error while sending POP', 'Done', opt);
      this.spinner.hide();
    });
  }

  sendEmailWithInvoice() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    const emailnput = {
      "processAdditionalInfo": {
        "taskId": this.selectedTask.taskId,
        "requestCode": this.selectedRequest.requestCode,
        "provinceCode": this.selectedTask.taskAllProvinceCode,
        "sectionCode": "SECN006",
        "targetSequenceId": "flow4",
        "userCode": this.userCode,
        "userName": this.userName,
        "url": ""
      }
    };
    this.serviceCall.sendEmailWithInvoice(emailnput, this.selectedRequest.requestCode).subscribe(data => {
      this.toastrService[this.types[0]]('Email Sent Successfully', 'Done', opt);
      document.getElementById('requestPopAssignTaskPopup').click();
      this.getRequestByRequestCode(this.selectedRequest.requestCode);
      this.getAllTasksToRespond();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown error while sending email', 'Done', opt);
      this.spinner.hide();
    });
  }

  downloadInvoice() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    const downloadInput = {
      'requestCode': this.selectedRequest.requestCode
    };
    this.serviceCall.downloadInvoice(downloadInput);
    this.spinner.hide();
  }

  downloadPaymentConfirmation() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    console.log('this.selectedRequest.requestCode', this.selectedRequest.requestCode);

    const downloadInput = {
      'requestCode': this.selectedRequest.requestCode
    };
    this.serviceCall.downloadPop(downloadInput);
    this.spinner.hide();
  }

  deleteRequestItem(itemCode) {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    const deleteInput = {
      'requestCode': this.selectedRequest.requestCode,
      'requestItemCode': itemCode,
    };
    this.serviceCall.deleteRequestItem(deleteInput).subscribe(data => {
      this.toastrService[this.types[0]]('Successfully deleted', 'Done', opt);
      this.getRequestByRequestCode(this.selectedRequest.requestCode);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown error while deleted item', 'Done', opt);
      this.spinner.hide();
    });
  }

  getUserInfoLite(userName) {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.serviceCall.getUserInfoLite(userName).subscribe(data => {
      console.log('data', data);
      const res = data.json();
      this.requestForm.controls['firstName'].setValue(res.firstName);
      this.requestForm.controls['surName'].setValue(res.surName);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown error while getting user information', 'Done', opt);
      this.spinner.hide();
    });
  }

  generateInvoice() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));


    this.serviceCall.getUserInfoLite(this.selectedRequest.userName).subscribe(data => {
      console.log('data', data);
      const res = data.json();
      const generateInvoiceInput = {
        'fullName': res.surName,
        'organization': '',
        'telephone': res.mobileNumber,
        'postalAddress': '',
        'email': this.selectedRequest.userName,
        'mobile': res.mobileNumber,
        'requestNumber': this.selectedRequest.requestCode,
        'requestType': 'BULK',
        'amount': this.selectedRequest.totalAmount
      };
      this.serviceCall.generateInvoice(generateInvoiceInput, this.selectedRequest.requestCode).subscribe(data => {
        this.toastrService[this.types[0]]('Successfully generated Invoice', 'Done', opt);
        this.generatedInvoice = true;
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while generating invoice', 'Done', opt);
        this.spinner.hide();
      });
    }, error => {
      this.toastrService[this.types[1]]('Unknown error while getting user information', 'Done', opt);
      this.spinner.hide();
    });
  }

  selectRequest(request) {
    this.selectedRequest = request;
    this.requestForm.controls['userName'].setValue(this.selectedRequest.userName);
    this.requestForm.controls['requestTypeName'].setValue(this.selectedRequest.requestTypeName);
    this.requestForm.controls['postalAddress1'].setValue(this.selectedRequest.postalAddress1);
    this.requestForm.controls['postalAddress2'].setValue(this.selectedRequest.postalAddress2);
    this.requestForm.controls['postalAddress3'].setValue(this.selectedRequest.postalAddress3);
    this.requestForm.controls['deliveryMethod'].setValue(this.selectedRequest.deliveryMethod);
    this.requestForm.controls['email'].setValue(this.selectedRequest.email);
    this.requestForm.controls['formatType'].setValue(this.selectedRequest.formatType);
    this.requestForm.controls['popFilePath'].setValue(this.selectedRequest.popFilePath);
    this.requestForm.controls['provinceCode'].setValue(this.selectedRequest.provinceCode);
    this.requestForm.controls['sectionCode'].setValue(this.selectedRequest.sectionCode);
    this.selectedRequestItems = request.requestItems;
    for (var i = 0; i < this.selectedRequestItems.length; i++) {
      if (this.selectedRequestItems[i].requestGazetteType == 'REQUEST') {
        this.categoryForm.controls['category'].setValue(this.selectedRequestItems[i].gazetteType1);
        this.categoryForm.controls['subcategory'].setValue(this.selectedRequestItems[i].gazetteType2);
        this.categoryForm.controls['categorycode'].setValue(this.selectedRequestItems[i].requestGazette1);
        this.categoryForm.controls['subcategorycode'].setValue(this.selectedRequestItems[i].requestGazette2);
        this.getCostOfCategory(this.selectedRequestItems[i].gazetteType2);
        break;
      }
    }

    this.generatedInvoice = request.invoiceFilePath == null ? false : true;
    this.getUserInfoLite(this.selectedRequest.userName);
    this.getRequestTrackingNo();
    this.getRequestDocuments(this.selectedRequest.requestCode);
    this.getOfficersOfMySection();
    console.log('selectRequest', this.selectedRequest);
  }

  getCostOfCategory(formatType) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getCostOfCategory(formatType).subscribe(data => {
        var cost = data.json();
        this.setCostForItem(cost[0]);
        this.spinner.hide();
    }, error => {
        this.toastrService[this.types[1]]('Error while getting cost information. Try again', 'Error', opt);
        this.spinner.hide();
    });
}

  setCostForItem(cost) {
    console.log('cost', cost);
    this.subCategoryItem = cost;
    if (cost.fixedRate !== null) {
      this.categoryForm.controls['requestCost'].setValue(cost.fixedRate);
      this.categoryForm.controls['hours'].setValue(0);
      this.categoryForm.controls['quantity'].setValue(1);
      this.costType = 'Fixed Rate';
    }
    if (cost.hourRate !== null) {
      this.categoryForm.controls['requestCost'].setValue(cost.hourRate);
      this.categoryForm.controls['hours'].setValue(1);
      this.costType = 'Hour Rate';
    }
    if (cost.halfHourRate !== null) {
      this.categoryForm.controls['requestCost'].setValue(cost.halfHourRate);
      this.categoryForm.controls['hours'].setValue(30);
      this.costType = 'Half Hour Rate';
    }
  }

  calculateRate(val) {

    this.numberRegexError = false;
    var reg = new RegExp('^[0-9]+$');
    let count = val.target.value;

    if (reg.test(count) == false) {
      this.numberRegexError = true;
    }
    else {
      if (this.costType == 'Half Hour Rate') {
        if ((parseInt(count) % 30) == 0) {
          count = parseInt(count);
        }
        else if ((parseInt(count) % 30) < 30) {
          count = parseInt(count) + (30 - (parseInt(count) % 30));
        }
        this.categoryForm.controls['requestCost'].setValue(parseFloat(((count / 30) * this.subCategoryItem.halfHourRate).toString()).toFixed(2));
      }
      else if (this.costType == 'Hour Rate') {
        this.categoryForm.controls['requestCost'].setValue(parseFloat((count * this.subCategoryItem.hourRate).toString()).toFixed(2));
      }
      else if (this.costType == 'Fixed Rate') {
        this.categoryForm.controls['requestCost'].setValue(parseFloat((count * this.subCategoryItem.fixedRate).toString()).toFixed(2));
      }
    }
  }

  selectItem(index, item) {

    this.selectedRequestItems[index].requestCost = item.requestCost;
    this.selectedRequestItems[index].requestItemCode = item.requestItemCode;
    this.selectedRequestItems[index].requestGazette1 = item.requestGazette1;
    this.selectedRequestItems[index].gazetteType1 = item.gazetteType1;
    this.selectedRequestItems[index].requestGazette2 = item.requestGazette2;
    this.selectedRequestItems[index].gazetteType2 = item.gazetteType2;
    this.selectedRequestItems[index].requestGazetteType = item.requestGazetteType;
    this.selectedRequestItems[index].requestHours = item.requestHours;
    this.selectedRequestItems[index].resultId = item.resultId;
    this.selectedRequestItems[index].resultjson = item.resultJson;
    this.selectedRequestItems[index].searchText = item.searchText;
    this.selectedRequestItems[index].searchType = item.searchType;
    this.selectedRequestItems[index].provinceCode = item.provinceCode;
    this.selectedRequestItems[index].sectionCode = item.sectionCode;

    this.itemIndex = index;
    let obj = JSON.parse(item.resultJson);
    this.requestSearchResultJson = JSON.stringify(obj, undefined, 4);
    // let re = /\"/gi;
    // this.requestSearchResultJson = this.requestSearchResultJson.replace(re, '');
    // re = /\:/gi;
    // this.requestSearchResultJson = this.requestSearchResultJson.replace(re, ' =');
    // re = /\{/gi;
    // this.requestSearchResultJson = this.requestSearchResultJson.replace(re, '');
    // re = /\}/gi;
    // this.requestSearchResultJson = this.requestSearchResultJson.replace(re, '');
    this.convertJson(obj);

    this.selectedRequestItem.requestCost = item.requestCost;
    this.selectedRequestItem.requestItemCode = item.requestItemCode;
    this.selectedRequestItem.requestGazette1 = item.requestGazette1;
    this.selectedRequestItem.gazetteType1 = item.gazetteType1;
    this.selectedRequestItem.requestGazette2 = item.requestGazette2;
    this.selectedRequestItem.gazetteType2 = item.gazetteType2;
    this.selectedRequestItem.requestGazetteType = item.requestGazetteType;
    this.selectedRequestItem.requestHours = item.requestHours;
    this.selectedRequestItem.resultId = item.resultId;
    this.selectedRequestItem.resultjson = item.resultjson;
    this.selectedRequestItem.searchText = item.searchText;
    this.selectedRequestItem.searchType = item.searchType;
    this.selectedRequestItem.provinceCode = item.provinceCode;
    this.selectedRequestItem.sectionCode = item.sectionCode;
    this.categoryForm.controls['category'].setValue('');
  }

  convertJson(resultjson) {
    this.jsonToBeUsed = [];
    for (var type in resultjson) {
      this.item = new Item();
      this.item.key = type;
      this.item.value = resultjson[type];
      this.jsonToBeUsed.push(this.item);
      // console.log('this.type', type);
    }
  }


  getAllTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus, username, fromdate, todate) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus, username, fromdate, todate).subscribe((data: any) => {
      this.allTasks = data.json();
      this.globals.setTaskCount(this.allTasks.length);
      this.fullallTasks = this.allTasks;
      this.itemResource = new DataTableResource(this.allTasks);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.allTasks = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while getting tasks', 'Error', opt);
      this.spinner.hide();
    });
  }

  getAllClosedTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus, username, fromDate, toDate) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getAllTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus, username, fromDate, toDate).subscribe((data: any) => {
      this.allClosedTasks = data.json();
      this.fullallClosedTasks = this.allClosedTasks;
      this.itemResourceClosed = new DataTableResource(this.allClosedTasks);
      this.itemResourceClosed.query({ offset: 0, limit: 10 }).then(quotData => this.allClosedTasks = quotData);
      this.itemResourceClosed.count().then(count => this.itemCountClosed = count);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while getting tasks', 'Error', opt);
      this.spinner.hide();
    });
  }

  // activate(status, role) {

  //   let index = this.approvedRolesArray.findIndex(c => c.internalRoleCode == role.internalRoleCode);

  //   if (index >= 0) {
  //     this.approvedRolesArray[index].userCode = this.userResponse.userCode;
  //     this.approvedRolesArray[index].userName = this.userResponse.userName;
  //     this.approvedRolesArray[index].internalRoleCode = role.internalRoleCode;
  //     this.approvedRolesArray[index].isActive = status;
  //   }
  //   else {
  //     const approvedRole = new ApprovedInternalUserRole();
  //     approvedRole.userCode = this.userResponse.userCode;
  //     approvedRole.userName = this.userResponse.userName;
  //     approvedRole.internalRoleCode = role.internalRoleCode;
  //     approvedRole.isActive = status;
  //     this.approvedRolesArray.push(approvedRole);
  //   }

  //   console.log('arraoles:', this.approvedRolesArray);
  // }

  activate(status, role) {
    this.errorInternal = false;
    let index = this.allInternalRoles.findIndex(c => c.internalRoleCode == role.internalRoleCode);

    if (index >= 0) {
      this.allInternalRoles[index].isActive = status;
      this.allInternalRoles.forEach((value) => {
        if (value.isActive == 'N') {
          this.errorInternal = true;
          return;
        }
      });
    }

    console.log('arraoles:', this.allInternalRoles);
  }

  updateRoles() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    let ret = 'true';
    this.spinner.show();

    console.log('allroles1:', this.allInternalRoles);

    this.allInternalRoles.forEach((value) => {
      console.log('value', value.isActive);
      if (value.isActive == 'N') {
        this.errorInternal = true;
        this.spinner.hide();
        ret = 'false';
        return;
      }
    });

    if (ret == 'true') {
      this.allInternalRoles.forEach((value, index) => {
        if (value.isActive == 'NY') {
          const approveRejectRoleInput = {
            userCode: value.userCode,
            userName: value.userName,
            internalRoleCode: value.internalRoleCode,
            isActive: 'Y'
          };
          this.serviceCall.deactivateUserRole(approveRejectRoleInput).subscribe((data: any) => {
            if (index == this.allInternalRoles.length - 1) {
              this.closeTask();
            }
            this.spinner.hide();
          }, error => {
            this.toastrService[this.types[1]]('Unknown Error while updating', 'Error', opt);
            this.spinner.hide();
          });
        }
        else if (value.isActive == 'NR') {
          let deleteInternalUserRole = new DeleteInternalUserRole();
          deleteInternalUserRole.userCode = value.userCode;
          deleteInternalUserRole.userName = value.userName;
          deleteInternalUserRole.internalRoleCode = value.internalRoleCode;
          this.serviceCall.deleteInternalUserRole(deleteInternalUserRole).subscribe(data => {
            if (index == this.allInternalRoles.length - 1) {
              this.closeTask();
            }
            this.spinner.hide();
          }, error => {
            this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
            this.spinner.hide();
          });
        }
        else {
          if (index == this.allInternalRoles.length - 1) {
            this.closeTask();
          }
        }
      });
    }
    else {
      this.spinner.hide();
    }
  }

  removeRole(role) {

    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    let deleteInternalUserRole = new DeleteInternalUserRole();
    deleteInternalUserRole.userCode = role.userCode;
    deleteInternalUserRole.userName = role.userName;
    deleteInternalUserRole.internalRoleCode = role.internalRoleCode;
    this.serviceCall.deleteInternalUserRole(deleteInternalUserRole).subscribe(data => {
      this.getInternalUserRolesByEmail(role.userName, 'all');
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data1. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getInternalUserRolesByEmail(email, active) {
    this.spinner.show();
    this.serviceCall.getInternalUserRolesByEmail(email, active).subscribe(data => {
      this.allInternalRoles = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.allTasks = quotData);
  }

  reloadItemsClosed(limitsData) {
    this.itemResourceClosed.query(limitsData).then(quotData => this.allClosedTasks = quotData);
  }

  updateFilter(event) {
    this.allTasks = this.fullallTasks;
    const val = event.target.value.toLowerCase();
    const temp = this.allTasks.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.allTasks = temp;
  }

  updateFilterClosed(event) {
    this.allClosedTasks = this.fullallClosedTasks;
    const val = event.target.value.toLowerCase();
    const temp = this.allClosedTasks.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.allClosedTasks = temp;
  }

  downloadRegistrationDocument() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    const downloadInput =
    {
      usercode: this.userResponse.userCode
    };

    this.serviceCall.downloadDocumentation(downloadInput);
    this.spinner.hide();
  }

  approveRejectUser() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    if (this.result.length > 0) {
      this.spinner.show();
      const approveRejectInput =
      {
        usercode: this.userResponse.userCode,
        username: this.userResponse.userName,
        isapproved: this.result,
        rejectionreason: this.reason,
        apprrejusercode: this.userCode,
        apprrejusername: this.userName,
      };
      this.serviceCall.approveRejectUser(approveRejectInput).subscribe(data => {
        this.result = '';
        this.closeTask();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown Error performing task', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  approveRejectExternalUser() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    if (this.result.length > 0) {
      this.spinner.show();

      if (this.result == 'REJECTED') {
        const deleteUserInput =
        {
          usercode: this.userResponse.userCode,
        };
        this.serviceCall.deleteExternalUser(deleteUserInput).subscribe(data => {
          this.result = '';
          this.closeTask();
          this.spinner.hide();
        }, error => {
          this.toastrService[this.types[1]]('Unknown Error performing task', 'Error', opt);
          this.spinner.hide();
        });
      }
      else {
        const approveRejectInput =
        {
          usercode: this.userResponse.userCode,
          username: this.userResponse.userName,
          isapproved: this.result,
          rejectionreason: this.reason,
          apprrejusercode: this.userCode,
          apprrejusername: this.userName,
        };
        this.serviceCall.approveRejectUser(approveRejectInput).subscribe(data => {
          this.result = '';
          this.closeTask();
          this.spinner.hide();
        }, error => {
          this.toastrService[this.types[1]]('Unknown Error performing task', 'Error', opt);
          this.spinner.hide();
        });
      }
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  approveRejectInternalUser() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    if (this.result.length > 0) {
      this.spinner.show();
      const approveRejectInput =
      {
        usercode: this.userResponse.userCode,
        username: this.userResponse.userName,
        isapproved: this.result,
        rejectionreason: this.reason1,
        apprrejusercode: this.userCode,
        apprrejusername: this.userName,
      };
      this.serviceCall.approveRejectUser(approveRejectInput).subscribe(data => {
        this.result = '';
        this.closeTask();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown Error performing task', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  closeTask() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const closeTaskInput =
    {
      taskCode: this.selectedTask.taskCode,
      taskReferenceCode: this.selectedTask.taskReferenceCode,
      taskReferenceType: this.selectedTask.taskReferenceType,
      taskCloseDesc: 'task done',
      taskDoneByUserCode: this.userCode,
      taskDoneByUserName: this.userName
    };
    this.serviceCall.closeTask(closeTaskInput).subscribe(data => {
      const response = data.json();
      if (response.message) {
        this.toastrService[this.types[1]](response.message, response.messageCode, opt);
        this.spinner.hide();
      }
      else {
        this.getAllTasksToRespond();
        document.getElementById('approveRejectPopup').click();
        document.getElementById('approveRejectInternalPopup').click();
        this.toastrService[this.types[0]]('Closed', 'Task', opt);
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  onItemChange(response) {
    this.result = response;
  }

  getExternalUserInfo(task) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.selectTask(task);
    this.serviceCall.getUserInfoByEmail(task.taskReferenceCode).subscribe(data => {
      this.userResponse = data.json();
      this.personalForm.controls['firstname'].setValue(this.userResponse.firstName);
      this.personalForm.controls['lastname'].setValue(this.userResponse.surname);
      this.personalForm.controls['salutation'].setValue(this.userResponse.title);
      this.personalForm.controls['mobile'].setValue(this.userResponse.mobileNo);
      this.personalForm.controls['orgtype'].setValue(this.userResponse.externaluser.organizationtypecode + '=' + this.userResponse.externaluser.organizationtypename);
      this.personalForm.controls['email'].setValue(this.userResponse.email);
      this.personalForm.controls['telephone'].setValue(this.userResponse.telephoneNo);
      this.personalForm.controls['addressline1'].setValue(this.userResponse.externaluser.postaladdressline1);
      this.personalForm.controls['addressline2'].setValue(this.userResponse.externaluser.postaladdressline2);
      this.personalForm.controls['addressline3'].setValue(this.userResponse.externaluser.postaladdressline3);
      this.personalForm.controls['zipcode'].setValue(this.userResponse.externaluser.postalcode);
      this.personalForm.controls['sector'].setValue(this.userResponse.externaluser.sectorcode + '=' + this.userResponse.externaluser.sectorname);
      this.personalForm.controls['communication'].setValue(this.userResponse.externaluser.communicationmodetypecode + '=' + this.userResponse.externaluser.communicationmodetypename);
      this.personalForm.controls['news'].setValue(this.userResponse.externaluser.subscribenews == 'Y' ? true : false);
      this.personalForm.controls['events'].setValue(this.userResponse.externaluser.subscribeevents == 'Y' ? true : false);
      this.personalForm.controls['information'].setValue(this.userResponse.externaluser.subscribenotifications == 'Y' ? true : false);
      this.allExternalroles = this.userResponse.externalUserRoles;
      this.isApproved = this.userResponse.isApproved;
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown Error while extracting details', 'Error', opt);
        this.spinner.hide();
      });
  }

  getTaskTargetFlows(task) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getTaskTargetFlows(task).subscribe(data => {
      this.targets = data.json();
      this.spinner.hide();
    },
      error => {
        // this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
        this.spinner.hide();
      });
  }


  getInternalUserInfo(task) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.selectTask(task);
    this.serviceCall.getUserInfoByEmail(task.taskReferenceCode).subscribe(data => {
      this.userResponse = data.json();
      this.personalInForm.controls['title'].setValue(this.userResponse.title);
      this.personalInForm.controls['firstname'].setValue(this.userResponse.firstName);
      this.personalInForm.controls['lastname'].setValue(this.userResponse.surname);
      this.personalInForm.controls['mobile'].setValue(this.userResponse.mobileNo);
      this.personalInForm.controls['telephone'].setValue(this.userResponse.telephoneNo);
      this.personalInForm.controls['email'].setValue(this.userResponse.email);
      // this.allInternalRoles = this.userResponse.internalUserRoles;
      this.getInternalUserRolesByEmail(task.taskReferenceCode, 'all');
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown error while retreiving user information', 'Error', opt);
        this.spinner.hide();
      });
  }

  selectTask(task) {
    this.selectedTask = task;
  }

  selectRequestTask(task) {
    console.log('task', task);
    
    this.selectedTask = task;
    this.getRequestByRequestCode(task.taskReferenceCode);
    this.getTaskTargetFlows(task.taskId);
    this.getCategories();
    this.getTaskLifeCycle(task.taskReferenceCode);
  }

  getTaskLifeCycle(reqcode) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.verifyForm.controls['verify'].setValue(false);

    this.spinner.show();
    this.serviceCall.getTasksLifeCycle(reqcode).subscribe(data => {
      this.tasklifecycle = data.json();
      for (var i = 0; i < this.tasklifecycle.length; i++) {
        this.taskDescForm.controls['taskDescription'].setValue(this.tasklifecycle[this.tasklifecycle.length - 1].taskCLoseDESC);
        if (this.tasklifecycle[i].taskStatus == 'POPVerified') {
          this.verifyForm.controls['verify'].setValue(true);
        }
        if (this.tasklifecycle[i].taskStatus == 'Scrutinise') {
          this.taskDoneUserName = this.tasklifecycle[i].taskDoneUserName;
        }
      }
      this.spinner.hide();
    },
      error => {
        this.toastrService[this.types[1]]('Unknown error while retreiving tasks information', 'Error', opt);
        this.spinner.hide();
      });
  }

  closeRequest() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    let taskInput = {
      'taskId': this.selectedTask.taskId,
      'requestCode': this.selectedTask.taskReferenceCode,
      'provinceCode': this.selectedTask.taskAllProvinceCode,
      'sectionCode': 'SECN006',
      'targetSequenceId': 'flow8',
      'userFullName': localStorage.getItem('cis_userfullname'),
      'userCode': this.userCode,
      'userName': this.userName
    };

    this.serviceCall.processUserState(taskInput).subscribe(data => {
      // this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
      this.getAllTasksToRespond();
      document.getElementById('dispatchRequestPopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while closing task', 'Error', opt);
      this.spinner.hide();
    });
  }

  rejectRequest() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    
    let taskInput = {
      'taskId': this.selectedTask.taskId,
      'requestCode': this.selectedTask.taskReferenceCode,
      'provinceCode': this.selectedTask.taskAllProvinceCode,
      'sectionCode': 'SECN006',
      'targetSequenceId': 'flow3',
      'userFullName': localStorage.getItem('cis_userfullname'),
      'userCode': this.userCode,
      'userName': this.userName
    };

    this.serviceCall.processUserState(taskInput).subscribe(data => {
      this.toastrService[this.types[0]]('Successfully Rejected the Request', 'Done', opt);
      this.getAllTasksToRespond();
      document.getElementById('dispatchRequestPopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while performing task', 'Error', opt);
      this.spinner.hide();
    });
  }

  acceptRequest() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    
    let taskInput = {
      'taskId': this.selectedTask.taskId,
      'requestCode': this.selectedTask.taskReferenceCode,
      'provinceCode': this.selectedTask.taskAllProvinceCode,
      'sectionCode': 'SECN006',
      'targetSequenceId': 'flow9',
      'userFullName': localStorage.getItem('cis_userfullname'),
      'userCode': this.userCode,
      'userName': this.userName,
      'assigneeList': [{
        type: 'User',
        name: this.taskDoneUserName
      }]
    };

    this.serviceCall.processUserState(taskInput).subscribe(data => {
      this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
      this.getAllTasksToRespond();
      document.getElementById('dispatchRequestPopup').click();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while performing task', 'Error', opt);
      this.spinner.hide();
    });
  }

  dispatchDocs() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const input =
    {
      requestCode: this.selectedTask.taskReferenceCode,
    };
    this.serviceCall.dispatchDocumentSendMail(input).subscribe(data => {
      // const response = data.json();
      this.submitTrackingNumber();
      this.closeRequest();
      this.toastrService[this.types[0]]('Dispatched Successfully', 'Done', opt);
      document.getElementById('dispatchedRequestPopup').click();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  downloadDispatchDocs() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const downloadInput =
    {
      requestCode: this.selectedTask.taskReferenceCode
    };
    this.serviceCall.downloadDispatchDocuments(downloadInput);
    this.spinner.hide();
  }

  getRequestByRequestCode(reqcode) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getRequestByRequestCode(reqcode).subscribe(data => {
      let request = data.json();
      this.selectRequest(request);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while extracting details', 'Error', opt);
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
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getCommuncationTypes() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getCommunicationsTypes().subscribe(data => {
      this.communcationTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while extracting details', 'Error', opt);
      this.spinner.hide();
    });
  }

  getSectors() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getSectors().subscribe(data => {
      this.sectors = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while extracting details', 'Error', opt);
      this.spinner.hide();
    });
  }

  getOrganizationTypes() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getOrganizationTypes().subscribe(data => {
      this.organizationTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Unknown Error while extracting details', 'Error', opt);
      this.spinner.hide();
    });
  }

}

export class NewRole {
  roleId: number;
  sectionId: number;
  provinceId: number;
  roleName: string;
  sectionName: string;
  provinceName: string;
}

export class DeleteInternalUserRole {
  userCode: any;
  userName: any;
  internalRoleCode: any;
}

export class ApprovedInternalUserRole {
  userCode: any;
  userName: any;
  internalRoleCode: any;
  isActive: any;
}

export class RequestItem {
  id: any;
  resultId: any;
  searchType: any;
  searchText: any;
  requestGazetteType: any;
  requestGazette1: any;
  requestGazette2: any;
  requestCost: any;
  requestHours: any;
  resultjson: any;
  gazetteType1: any;
  gazetteType2: any;
  size: any;
  requestItemCode: any;
  provinceCode: any;
  sectionCode: any;
}


export class Item {
  key: string;
  value: string;
}
 // selectItem(item) {
  //   this.selectedRequestItem = item;
  //   let obj = JSON.parse(item.resultJson);
  //   this.requestSearchResultJson = JSON.stringify(obj, undefined, 4);
  //   let re = /\"/gi;
  //   this.requestSearchResultJson = this.requestSearchResultJson.replace(re, '');
  //   re = /\:/gi;
  //   this.requestSearchResultJson = this.requestSearchResultJson.replace(re, ' =');
  //   re = /\{/gi;
  //   this.requestSearchResultJson = this.requestSearchResultJson.replace(re, '');
  //   re = /\}/gi;
  //   this.requestSearchResultJson = this.requestSearchResultJson.replace(re, '');
  // }