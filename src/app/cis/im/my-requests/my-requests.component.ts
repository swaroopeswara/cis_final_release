import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'az-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {

  selectedRequest: any;
  selectedRequestItem: any;
  selectedRequestItems: any;
  limits = [10, 25, 50, 100];
  requestForm: FormGroup;
  cancelForm: FormGroup;
  itemCount = 0;
  selectedItem = [];
  itemResource = new DataTableResource([]);
  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;
  userResponse: any;
  userCode: any;
  userName: any;
  requests = [];
  fullrequests = [];
  provinces: any;
  selectedProvince: any = '';
  selectedOfficer: any = '';
  officers: any;
  provcode: any;
  filePop: any;
  resultjson: any;
  paymentFile: any;
  uploadPopFile: any;
  uploadedPop: boolean;
  jsonToBeUsed: Item[] = [];
  item: Item;
  currentRequestCode: any = '';
  cancelDescription: any = '';
  isCancelDescription: boolean;
  fileSizeLimit: boolean;
  progress: number = 0;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.requestForm = this.formBuilder.group({
      'userName': '',
      'requestTypeName': '',
      'postalAddress1': '',
      'postalAddress2': '',
      'postalAddress3': '',
      'deliveryMethod': '',
      'email': '',
      'formatType': ''
    });

    this.cancelForm = this.formBuilder.group({
      'cancelDescription': ['', Validators.required]
    });

    this.hasError = false;
    this.uploadedPop = false;
    this.isCancelDescription = false;
    this.fileSizeLimit = false;

  }
  ngOnInit() {
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
    this.provcode = localStorage.getItem('cis_selected_provincecode');
    this.getRequestsOfUser();
    this.getProvinces();
  }

  rowClick(rowEvent) {
    this.selectedItem = [];
    this.selectedItem.push(rowEvent.row.item);
  }

  reloadItems(limitsData) {
    this.itemResource.query(limitsData).then(quotData => this.requests = quotData);
  }

  updateFilter(event) {
    this.requests = this.fullrequests;
    const val = event.target.value.toLowerCase();
    const temp = this.requests.filter(function (d) {
      for (const property in d) {
        if (d.hasOwnProperty(property)) {
          if (d && d[property] && (d[property].toString().toLowerCase().indexOf(val) !== -1)) {
            return true;
          }
        }
      }
    });
    this.requests = temp;
  }

  fileuploadpop(input1) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.fileSizeLimit = false;
    this.uploadPopFile = input1;
    this.paymentFile = input1.files[0].name;
    const filesplit = input1.files[0].name.split('.');
    if (filesplit[filesplit.length - 1] == 'pdf') {
      if (input1.files[0].size > '10485760') {
        this.fileSizeLimit = true;
        this.paymentFile = '';
        this.spinner.hide();
      } else {
        this.uploadedPop = true;
      }
    }
    else {
      this.uploadPopFile = '';
      this.spinner.hide();
      this.toastrService[this.types[1]]('', 'Allowed: PDF files', opt);
    }
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

  uploadUserPaymentConfirmation() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    // this.spinner.show();

    const formData = new FormData();
    formData.append('file', this.uploadPopFile.files[0]);
    formData.append('requestCode', this.selectedRequest.requestCode);
    formData.append('userCode', this.userCode);
    formData.append('userName', this.userName);
    this.serviceCall.uploadUserPaymentConfirmation(formData).subscribe((data: HttpEvent<any>) => {
      switch (data.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          document.getElementById('requestUploadPopPopup').click();
          this.toastrService.success('Payment Confirmation Uploaded', 'Done');
          this.progress = 0;
          this.paymentFile = '';
          this.spinner.hide();
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(data.loaded / data.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          setTimeout(() => {
            this.progress = 0;
            this.spinner.hide();
          }, 15000);
      }
    }, error => {
      if (error.status !== 200) {
        this.toastrService[this.types[1]]('Unknown error while uploading', 'Done', opt);
      }
      this.spinner.hide();
    });
  }

  cancelRequest() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.isCancelDescription = false;

    if (this.cancelForm.valid) {
      const input = {
        requestCode: this.selectedRequest.requestCode,
        description: this.cancelForm.get('cancelDescription').value
      };
      this.serviceCall.cancelRequest(input).subscribe(data => {
        this.getRequestsOfUser();
        this.toastrService[this.types[0]]('Request Cancelled Successfully', 'Done', opt);
        document.getElementById('btnCancelRequestPopup').click();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while cancelling request', 'Done', opt);
        this.spinner.hide();
      });
    }
    else {
      this.isCancelDescription = true;
      this.spinner.hide();
    }
  }


  moveRequest() {

    if (this.selectedProvince.length > 0) {
      document.getElementById('btnMoveRequestPopup').click();
    }
    else {
      this.hasError = true;
    }

  }

  assignRequest() {

    if (this.selectedOfficer.length > 0) {
      document.getElementById('btnAssignRequestPopup').click();
    }
    else {
      this.hasError = true;
    }
  }

  fileupload(input) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    this.fileSizeLimit = false;
    this.filePop = input.files[0].name;
    const filesplit = input.files[0].name.split('.');
    if (filesplit[filesplit.length - 1] == 'pdf') {
      const formData = new FormData();
      formData.append('file', input.files[0]);
      formData.append('requestCode', '');
      formData.append('paymentStatus', 'PAID');
      this.serviceCall.uploadPaymentConfirmation(formData).subscribe(data => {
        document.getElementById('btnUploadPopPopupClose').click();
        this.toastrService.success('POP Uploaded', 'Done');
        this.filePop = '';
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while uploading document. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.filePop = '';
      this.spinner.hide();
      this.toastrService[this.types[1]]('', 'Allowed: PDF files', opt);
    }
  }

  submitPop() {

  }

  getOfficersOfSection(provcode, sectioncode) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    this.serviceCall.getOfficersOfMySection(provcode, sectioncode).subscribe(data => {
      this.officers = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
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

  getRequestsOfUser() {
    this.spinner.show();
    this.serviceCall.getRequestsOfUser('', this.userCode).subscribe((data: any) => {
      this.requests = data.json();
      if (this.requests.length > 0) {
        for (var i = 0; i < this.requests.length; i++) {
          this.requests[i].itemsCount = this.requests[i].requestItems.length;
        }
      }
      this.fullrequests = this.requests;
      this.itemResource = new DataTableResource(this.requests);
      this.itemResource.query({ offset: 0, limit: 10 }).then(quotData => this.requests = quotData);
      this.itemResource.count().then(count => this.itemCount = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  selectRequest(request) {

    this.selectedRequest = request;
    this.currentRequestCode = this.selectedRequest.requestCode;
    this.requestForm.controls['userName'].setValue(this.selectedRequest.userName);
    this.requestForm.controls['requestTypeName'].setValue(this.selectedRequest.requestTypeName);
    this.requestForm.controls['postalAddress1'].setValue(this.selectedRequest.postalAddress1);
    this.requestForm.controls['postalAddress2'].setValue(this.selectedRequest.postalAddress2);
    this.requestForm.controls['postalAddress3'].setValue(this.selectedRequest.postalAddress3);
    this.requestForm.controls['deliveryMethod'].setValue(this.selectedRequest.deliveryMethod);
    this.requestForm.controls['email'].setValue(this.selectedRequest.email);
    this.requestForm.controls['formatType'].setValue(this.selectedRequest.formatType);
    this.selectedRequestItems = request.requestItems;
    console.log('this.selectedRequestItems', this.selectedRequest);
  }

  selectItem(item) {
    this.selectedRequestItem = item;
    let obj = JSON.parse(item.resultJson);
    this.resultjson = JSON.stringify(obj, undefined, 4);
    // let re = /\"/gi;
    // this.resultjson = this.resultjson.replace(re, '');
    // re = /\:/gi;
    // this.resultjson = this.resultjson.replace(re, ' =');
    // re = /\{/gi;
    // this.resultjson = this.resultjson.replace(re, '');
    // re = /\}/gi;
    // this.resultjson = this.resultjson.replace(re, '');
    this.convertJson(obj);
  }
}

export class Item {
  key: string;
  value: string;
}