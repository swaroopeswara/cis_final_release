import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { DataTableResource } from 'angular5-data-table';
import { ThrowStmt } from '@angular/compiler';
import { DataTableRowComponent, DataTableComponent } from 'angular5-data-table/datatable.module';
import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'az-search-requests',
    templateUrl: './search-requests.component.html',
    styleUrls: ['./search-requests.component.scss']
})
export class SearchRequestsComponent implements OnInit {
    public steps: any[];
    public numberSearchForm: FormGroup;
    public pdSearchForm: FormGroup;
    public stSearchForm: FormGroup;
    public createDvdCourierForm: FormGroup;
    public categoryForm: FormGroup;
    public createDvdForm: FormGroup;
    public createFtpForm: FormGroup;
    public createRequestForm: FormGroup;
    itemResource = new DataTableResource([]);
    public types = ['success', 'error', 'info', 'warning'];
    hasError: boolean;
    hasPdError: boolean;
    hasPdFarmError: boolean;
    hasStError: boolean;
    provinces: any;
    itemCount = 0;
    itemResourceIn = new DataTableResource([]);
    limits = [10, 25, 50, 100];
    selectedRequests = [];
    configSize: number = 0;
    configMbSize: number = 0;
    selectedSize: number = 0;
    requestTypes: any;
    requestKinds: any;
    mediaTypes: any;
    formatTypes: any;
    deliveryMethods: any;
    hasCrError: boolean;
    hasCdcError: boolean;
    hasCorError: boolean;
    hasClError: boolean;
    categories: any;
    subCategories: any;
    hasCategoryError: boolean;
    requestItem = new RequestItem();
    selectedItem: RequestItem[] = [];
    resultjson: any = '';
    itemIndex: any = 0;
    selectCategoriesError: boolean;
    numberSearchResults = [];
    pdSearchResults: any;
    ftpSiteUrl: any;
    whichSearch: any = '';
    searchInputJson: any;
    bulkrequesttypes: any;
    bulkrequestsubtypes: any;
    requestFile: any = '';
    getdoclist: [];
    fileSizeLimit: boolean;
    savedRequestCode: any;
    gisUrl: any;
    userCode: any;
    userName: any;
    searchProvinceCode: any = '';
    assign: any;
    documentStoreCode: any = '';
    userProvinceCode: any = '';
    officers: any;
    currentRoleCode: any = '';
    selectedInfoOfficer: any = '';
    selectedInfoOfficerUserCode: any = '';
    selectedInfoOfficerUserName: any = '';
    userInfo: any;
    costs: any = '';
    tasklifecycle: any = '';
    majorregions: any;
    erfMonirRegions: any;
    holdingsMinorRegions: any;
    searchParcelType: any;
    jsonToBeUsed: Item[] = [];
    item: Item;
    subCategory: any;
    initiateSearch: boolean;
    selectSubscription: ISubscription;

    searchResults = [
        {
            "id": "1",
            "sgNo": "1/1950",
            "provCode": "6",
            "documentNumber": "1/1950",
            "region": "N0FU0086",
            "parcel": "00000016",
            "portion": "00000",
            "lpi": "N0FU00860000001600000",
            "parcelType": "ERF/LOT",
            "documentType": "GENERAL PLAN",
            "description": "GENERAL PLAN:  AMENDING  IN  N0FU0086 DURBAN NORTH ,FILING NO 1/1950",
            "size": "400",
            "pageNumber": 1,
            "url": "Images15\\161\\10266559.TIF"
        },
        {
            "id": "2",
            "sgNo": "1/1950",
            "provCode": "6",
            "documentNumber": "1/1950",
            "region": "N0FU0086",
            "parcel": "00000016",
            "portion": "00000",
            "lpi": "N0FU00860000001600000",
            "parcelType": "ERF/LOT",
            "documentType": "GENERAL PLAN",
            "description": "GENERAL PLAN:  AMENDING  IN  N0FU0086 DURBAN NORTH ,FILING NO 1/1950",
            "size": "3072",
            "pageNumber": 2,
            "url": "Images15\\161\\10266559.TIF"
        },
        {
            "id": "3",
            "sgNo": "1/1950",
            "provCode": "6",
            "documentNumber": "1/1950",
            "region": "N0FU0086",
            "parcel": "00000016",
            "portion": "00000",
            "lpi": "N0FU00860000001600000",
            "parcelType": "ERF/LOT",
            "documentType": "GENERAL PLAN",
            "description": "GENERAL PLAN:  AMENDING  IN  N0FU0086 DURBAN NORTH ,FILING NO 1/1950",
            "size": "5120",
            "pageNumber": 3,
            "url": "Images15\\161\\10266559.TIF"
        },
        {
            "id": "4",
            "sgNo": "1/1950",
            "provCode": "6",
            "documentNumber": "1/1950",
            "region": "N0FU0086",
            "parcel": "00000016",
            "portion": "00000",
            "lpi": "N0FU00860000001600000",
            "parcelType": "ERF/LOT",
            "documentType": "GENERAL PLAN",
            "description": "GENERAL PLAN:  AMENDING  IN  N0FU0086 DURBAN NORTH ,FILING NO 1/1950",
            "size": "10240",
            "pageNumber": 4,
            "url": "Images15\\161\\10266559.TIF"
        },
        {
            "id": "5",
            "sgNo": "1/1950",
            "provCode": "6",
            "documentNumber": "1/1950",
            "region": "N0FU0086",
            "parcel": "00000016",
            "portion": "00000",
            "lpi": "N0FU00860000001600000",
            "parcelType": "ERF/LOT",
            "documentType": "GENERAL PLAN",
            "description": "GENERAL PLAN:  AMENDING  IN  N0FU0086 DURBAN NORTH ,FILING NO 1/1950",
            "size": "4096",
            "pageNumber": 5,
            "url": "Images15\\161\\10266559.TIF"
        }
    ];

    constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

        this.steps = [
            { name: 'Search Criteria', icon: 'fa-lock', active: true, valid: false, hasError: false },
            { name: 'Requester Information', icon: 'fa-user', active: false, valid: false, hasError: false }
        ]

        this.numberSearchForm = this.formBuilder.group({
            'province': ['', Validators.required],
            'numberType': ['', Validators.required],
            'number': ['', Validators.required],
            'documentType': ''
        });

        this.pdSearchForm = this.formBuilder.group({
            'province': ['', Validators.required],
            'pdType': ['', Validators.required],
            'majorRegion': '',
            'farmNumber': ['', Validators.pattern('^[0-9]+$')],
            'portion': '',
            'farmName': '',
            'minorRegion': '',
            'erfNumber': '',
            'portionNumber': '',
            'holdingNumber': '',
            'lpi': ''
        });

        this.stSearchForm = this.formBuilder.group({
            'province': ['', Validators.required],
            'stType': ['', Validators.required],
            // 'filingNumber': '',
            // 'deedsRegistration': '',
            'sg': '',
            'schemeNumber': '',
            'deedsRegistrationNo': '',
            'sgNo': '',
            'schemeName': '',
            'parcelDescriptionERF': '',
            'parcelDescriptionFarm': '',
            'erfNumber': '',
            'minorRegion': '',
            'portionNumber': '',
            'majorRegion': '',
            'farmNumber': '',
            'portion': '',
            'farmName': ''
        });

        this.createRequestForm = this.formBuilder.group({
            'requestType': ['REQUEST', Validators.required],
            'requestKind': ['BULK', Validators.required],
            'requestTitle': ['REQUEST_001', Validators.required],
            'description': '',
            'postalAddress1': '',
            'postalAddress2': '',
            'postalAddress3': '',
            'postalAddress4': '',
            'deliveryMethod': '',
            'mediaType': '',
            'formatType': ['', Validators.required],
            'email': ''
        });

        this.createDvdForm = this.formBuilder.group({
            'requestType': ['', Validators.required],
            'requestKind': ['BULK', Validators.required],
            'requestTitle': ['REQUEST_001', Validators.required],
            'description': '',
            'deliveryMethod': ['', Validators.required],
            'formatType': ['', Validators.required]
        });

        this.createDvdCourierForm = this.formBuilder.group({
            'requestType': ['', Validators.required],
            'requestKind': ['BULK', Validators.required],
            'requestTitle': ['REQUEST_001', Validators.required],
            'description': '',
            'deliveryMethod': ['', Validators.required],
            'formatType': ['', Validators.required],
            'postalAddress1': ['', Validators.required],
            'postalAddress2': ['', Validators.required],
            'postalAddress3': ''
        });

        this.createFtpForm = this.formBuilder.group({
            'requestType': ['', Validators.required],
            'requestKind': ['BULK', Validators.required],
            'requestTitle': ['REQUEST_001', Validators.required],
            'description': '',
            'formatType': ['', Validators.required],
            'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])]
        });

        this.categoryForm = this.formBuilder.group({
            'gazettetype': 'REQUEST',
            'category': ['', Validators.required],
            'subcategory': ['', Validators.required]
        });

        this.hasError = false;
        this.hasPdError = false;
        this.hasStError = false;
        this.hasCrError = false;
        this.hasCdcError = false;
        this.hasCorError = false;
        this.hasClError = false;
        this.hasCategoryError = false;
        this.selectCategoriesError = false;
        this.hasPdFarmError = false;
        this.fileSizeLimit = false;
        this.initiateSearch = false;
        // this.whichSearch = 'no';
    }

    ngOnInit() {
        this.currentRoleCode = localStorage.getItem('cis_selected_rolecode');
        this.assign = 'Assign';

        console.log('numberSearchResults size', this.numberSearchResults.length);
        // this.numberSearchResults = this.searchResults;
        this.getProvinces();
        this.getPropertyByName('SINGLE_REQUEST_SIZE');
        this.getPropertyByName('GIS_URL');
        this.getRequestTypes();
        this.getRequestKinds();
        this.getMediaTypes();
        this.getFormatTypes();
        this.getDeliveryMethods();
        this.getCategories();
        this.getRequestBulkTypes();
        this.getOfficersOfMySection();
        // this.itemResourceIn = new DataTableResource(this.searchResults);
        // this.itemResourceIn.count().then(count => this.itemCount = 1);
        // this.itemResourceIn.query({ offset: 0, limit: 10 }).then(quotData => this.searchResults = quotData);
        this.userCode = localStorage.getItem('cis_usercode');
        this.userName = localStorage.getItem('cis_username');
        this.userInfo = JSON.parse(localStorage.getItem('cis_userinfo'));
        this.userProvinceCode = localStorage.getItem('cis_selected_provincecode');
        console.log('userProvinceCode:', this.userProvinceCode);
    }

    getOfficersOfMySection() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        let provincecode = localStorage.getItem('cis_selected_provincecode') == 'null' ? '' : localStorage.getItem('cis_selected_provincecode');
        let sectioncode = localStorage.getItem('cis_selected_sectioncode') == 'null' ? '' : localStorage.getItem('cis_selected_sectioncode');

        this.spinner.show();
        this.serviceCall.getOfficersOfMySection(provincecode, sectioncode).subscribe(data => {
            this.officers = data.json();
            this.spinner.hide();
        },
            error => {
                // this.toastrService[this.types[1]]('Unknown error while retreiving officers', 'Error', opt);
                this.spinner.hide();
            });
    }

    getRequestTypes() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getRequestTypes().subscribe(data => {
            this.requestTypes = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting request types. Try again', 'Error', opt);
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
            this.toastrService[this.types[1]]('Error while getting categories. Try again', 'Error', opt);
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
            this.toastrService[this.types[1]]('Error while getting sub categories. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    selectSubCategory() {

        this.subCategory = this.subCategories.filter(
            cat => cat.costSubCategoryCode === this.categoryForm.get('subcategory').value.split('=')[0]);
        console.log('this.subCategory', this.subCategory);

    }

    selectItem(index, item) {

        console.log('item', item);
        this.selectedItem[index].requestCost = item.requestCost;
        this.selectedItem[index].requestGazette1 = item.requestGazette1;
        this.selectedItem[index].requestGazette1Name = item.requestGazette1Name;
        this.selectedItem[index].requestGazette2 = item.requestGazette2;
        this.selectedItem[index].requestGazette2Name = item.requestGazette2Name;
        this.selectedItem[index].requestGazetteType = item.requestGazetteType;
        this.selectedItem[index].requestHours = item.requestHours;
        this.selectedItem[index].resultId = item.resultId;
        this.selectedItem[index].resultjson = item.resultjson;
        this.selectedItem[index].searchText = item.searchText;
        this.selectedItem[index].searchType = item.searchType;
        this.selectedItem[index].ftpSiteUrl = item.ftpSiteUrl;

        // this.resultjson = item.resultjson;
        this.itemIndex = index;
        let obj = JSON.parse(item.resultjson);
        this.resultjson = JSON.stringify(obj, undefined, 4);
        // console.log('this.resultjson', this.resultjson);
        // let re = /\"/gi;
        // this.resultjson = this.resultjson.replace(re, '');
        // re = /\:/gi;
        // this.resultjson = this.resultjson.replace(re, ' =');
        // re = /\{/gi;
        // this.resultjson = this.resultjson.replace(re, '');
        // re = /\}/gi;
        // this.resultjson = this.resultjson.replace(re, '');
        this.convertJson(obj);

        this.requestItem.requestCost = item.requestCost;
        this.requestItem.requestGazette1 = item.requestGazette1;
        this.requestItem.requestGazette1Name = item.requestGazette1Name;
        this.requestItem.requestGazette2 = item.requestGazette2;
        this.requestItem.requestGazette2Name = item.requestGazette2Name;
        this.requestItem.requestGazetteType = item.requestGazetteType;
        this.requestItem.requestHours = item.requestHours;
        this.requestItem.resultId = item.resultId;
        this.requestItem.resultjson = item.resultjson;
        this.requestItem.searchText = item.searchText;
        this.requestItem.searchType = item.searchType;
        // this.categoryForm.controls['category'].setValue('');
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


    selectSelectedRequestItem(index, item) {

        console.log('selected request item', item);
        var selectedRequestItem = new RequestDisplayItem();
        selectedRequestItem.description = item.description;
        selectedRequestItem.documentNumber = item.documentNumber;
        selectedRequestItem.documentType = item.documentType;
        selectedRequestItem.lpi = item.lpi;
        selectedRequestItem.pageNumber = item.pageNumber;
        selectedRequestItem.parcel = item.parcel;
        selectedRequestItem.parcelType = item.parcelType;
        selectedRequestItem.portion = item.portion;
        selectedRequestItem.province = item.province;
        selectedRequestItem.region = item.region;
        selectedRequestItem.sgNo = item.sgNo;

        let obj = JSON.parse(JSON.stringify(item));
        this.resultjson = JSON.stringify(obj, undefined, 4);
        console.log('this.resultjson1', this.resultjson);
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

    updateCategory() {

        this.hasCategoryError = false;
        if (this.categoryForm.valid) {
            this.selectedItem[this.itemIndex].requestGazette1 = this.categoryForm.get('category').value.split('=')[0];
            this.selectedItem[this.itemIndex].requestGazette1Name = this.categoryForm.get('category').value.split('=')[1];
            this.selectedItem[this.itemIndex].requestGazette2 = this.categoryForm.get('subcategory').value.split('=')[0];
            this.selectedItem[this.itemIndex].requestGazette2Name = this.categoryForm.get('subcategory').value.split('=')[1];
            this.requestItem.requestGazette1 = this.categoryForm.get('category').value.split('=')[0];
            this.requestItem.requestGazette1Name = this.categoryForm.get('category').value.split('=')[1];
            this.requestItem.requestGazette2 = this.categoryForm.get('subcategory').value.split('=')[0];
            this.requestItem.requestGazette2Name = this.categoryForm.get('subcategory').value.split('=')[1];
            document.getElementById('btnAddRolePopupClose').click();
        }
        else {
            this.hasCategoryError = true;
        }
        console.log('selectedItem', this.selectedItem);
    }


    createNewRequestForm() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        let items = [];
        this.selectCategoriesError = false;
        this.spinner.show();
        let type = '';

        for (var i = 0; i < this.selectedItem.length; i++) {
            if (this.selectedItem[i].requestGazette1 !== undefined) {

                if (this.selectedItem[i].requestGazette1 === 'S0001') {
                    type = 'SEARCH';
                }
                else {
                    type = 'REQUEST';
                }

                items[i] = {
                    'resultId': this.selectedItem[i].resultId,
                    'searchType': this.selectedItem[i].searchType,
                    'searchText': this.selectedItem[i].searchText,
                    'requestGazetteType': type,
                    'requestGazette1': this.selectedItem[i].requestGazette1,
                    'gazetteType1': this.selectedItem[i].requestGazette1Name,
                    'requestGazette2': this.selectedItem[i].requestGazette2,
                    'gazetteType2': this.selectedItem[i].requestGazette2Name,
                    'requestCost': '0.00',
                    'requestHours': this.selectedItem[i].requestHours,
                    'resultJson': this.selectedItem[i].resultjson,
                    'ftpSiteUrl': this.selectedItem[i].ftpSiteUrl
                };
            }
            else {
                this.selectCategoriesError = true;
            }
        }

        console.log('items', items);
        if (this.selectCategoriesError === false) {

            if (this.searchProvinceCode === this.userProvinceCode && this.currentRoleCode == 'IN014') {
                this.selectedInfoOfficer = this.userName;
                this.selectedInfoOfficerUserCode = this.userCode;
                this.selectedInfoOfficerUserName = this.userName;
            }

            const createRequestInput = {
                'userCode': localStorage.getItem('cis_usercode'),
                'userFullName': localStorage.getItem('cis_userfullname'),
                'provinceCode': this.searchProvinceCode, //FIXME, get the province code from the search 
                'userName': localStorage.getItem('cis_username'),
                // 'requestTypeCode': '',
                'requestTypeName': this.selectedItem[0].requestGazette1Name,
                // 'requestKindCode': '',
                'requestKindName': 'BULK',
                'requestTitle': this.createRequestForm.get('requestTitle').value,
                'organisation': '',
                'sectionCode': 'SECN006',
                'description': this.createRequestForm.get('description').value,
                'postalAddress1': this.createRequestForm.get('postalAddress1').value,
                'postalAddress2': this.createRequestForm.get('postalAddress2').value,
                'postalAddress3': this.createRequestForm.get('postalAddress3').value,
                'postalAddress4': this.createRequestForm.get('postalAddress4').value,
                'deliveryMethod': this.createRequestForm.get('deliveryMethod').value == null || this.createRequestForm.get('deliveryMethod').value == '' ? this.createRequestForm.get('formatType').value : this.createRequestForm.get('deliveryMethod').value,
                'email': this.createRequestForm.get('email').value.length > 0 ? this.createRequestForm.get('email').value : localStorage.getItem('cis_username'),
                'mediaType': '',
                'formatType': this.createRequestForm.get('formatType').value,
                'paymentCurrency': 'ZAR',
                'totalPaymentAmount': '0.00',
                'totalPayment': '0.00',
                'totalAmount': '0.00',
                'invoiceNumber': '',
                'invoiceFilePath': '',
                'referenceNumber': '',
                'modifiedUserCode': '',
                'isActive': 'Y',
                'isDeleted': 'N',
                'sequenceRequest': this.assign,
                'documentStoreCode': this.documentStoreCode,
                'internalCapturer': this.selectedInfoOfficer.length > 0 ? true : false,
                'assigneeInfoManager': this.currentRoleCode == 'IN013' ? this.userName : '',
                'assigneeInfoOfficer': this.selectedInfoOfficerUserCode.length > 0 ? this.selectedInfoOfficerUserName : '',
                'capturerCode': this.selectedInfoOfficerUserCode.length > 0 ? this.selectedInfoOfficerUserCode : '',
                'capturerName': this.selectedInfoOfficer.length > 0 ? this.userName : '',
                'capturerFullName': this.userInfo.firstName + ' ' + this.userInfo.surname,
                // 'requestDate': '2019-04-20',
                // 'deletedDate': '2019-04-20',
                // 'modifiedDate': null,
                'requestItems': items
            };

            this.serviceCall.createRequest(createRequestInput).subscribe(data => {
                const res = data.json();
                this.toastrService[this.types[0]]('Successfully sent request ' + res.requestCode, 'Done', opt);
                this.savedRequestCode = res.requestCode;
                document.getElementById('createNewRequestPopup').click();
                this.numberSearchResults = [];
                this.selectedItem = [];
                this.selectedRequests = [];
                this.whichSearch = '';
                this.selectedInfoOfficer = '';
                this.selectedInfoOfficerUserCode = '';
                this.selectedInfoOfficerUserName = '';
                // this.categoryForm.controls['category'].setValue('');
                // this.categoryForm.controls['subcategory'].setValue('');
                // this.numberSearchForm.controls['province'].setValue('');
                // this.pdSearchForm.controls['province'].setValue('');
                // this.stSearchForm.controls['province'].setValue('');
                this.createRequestItem(res.requestId, res.requestCode);
                if (this.createRequestForm.get('formatType').value === 'Electronic(FTP)') {
                    this.getRequestItemsFilesSendFTP(res.requestCode);
                }
                else if (this.createRequestForm.get('formatType').value === 'Electronic(Email)') {
                    this.getRequestItemsFilesSendEmail(res.requestCode);
                }
                {
                    this.selectedSize = 0;
                }
                this.createRequestForm.controls['formatType'].setValue('');
                // document.getElementById('uploadRequestDocModal').click();
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Error while saving request', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.spinner.hide();
        }
    }

    createRequestItem(requestId, requestCode) {

        this.spinner.show();
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        if (this.subCategory[0].fixedRate !== null) {
            const createItemInput = {
                'requestGazetteType': 'COST_ITEM',
                'requestId': requestId,
                'requestGazette1': this.categoryForm.get('category').value.split('=')[0],
                'requestGazette2': this.categoryForm.get('subcategory').value.split('=')[0],
                'requestCost': this.subCategory[0].fixedRate,
                'requestHours': null,
                'requestCode': requestCode,
                'quantity': null,
                'gazetteType1': this.categoryForm.get('category').value.split('=')[1],
                'gazetteType2': this.categoryForm.get('subcategory').value.split('=')[1]
            };
            this.serviceCall.createRequestItem(createItemInput).subscribe(data => {
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Unknown error while creating item', 'Done', opt);
                this.spinner.hide();
            });
        }
        else {
            this.spinner.hide();
        }
    }

    changeInfoManageToOfficer(val) {
        this.selectedInfoOfficerUserCode = val.split('=')[0];
        this.selectedInfoOfficerUserName = val.split('=')[1];
        this.selectedInfoOfficer = val;
    }

    getRequestItemsFilesSendEmail(requestCode) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        const input =
        {
            requestCode: requestCode,
        };
        this.serviceCall.getRequestItemsFilesSendEmail(input).subscribe(data => {
            // const response = data.json();
            // this.getTaskLifeCycle(requestCode);
            if (this.selectedSize <= this.configMbSize) {
                this.toastrService[this.types[0]]('Dispatched Request Successfully', 'Done', opt);
            }
            this.selectedSize = 0;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    getRequestItemsFilesSendFTP(requestCode) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        const input =
        {
            requestCode: requestCode,
        };
        this.serviceCall.getRequestItemsFilesSendFTP(input).subscribe(data => {
            // const response = data.json();
            // this.getTaskLifeCycle(requestCode);
            if (this.selectedSize <= this.configMbSize) {
                this.toastrService[this.types[0]]('Dispatched Request Successfully', 'Done', opt);
            }
            this.selectedSize = 0;
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

   
    getTaskLifeCycle(reqcode) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getTasksLifeCycle(reqcode).subscribe(data => {
            this.tasklifecycle = data.json();
            this.closeRequest();
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
            'taskId': this.tasklifecycle[0].taskId,
            'requestCode': this.tasklifecycle[0].taskReferenceCode,
            'provinceCode': this.tasklifecycle[0].taskAllProvinceCode,
            'sectionCode': 'SECN006',
            'targetSequenceId': 'flow8',
            'userFullName': localStorage.getItem('cis_userfullname'),
            'userCode': this.userCode,
            'userName': this.userName
        };

        this.serviceCall.processUserState(taskInput).subscribe(data => {
            // this.toastrService[this.types[0]]('Successfully Submitted', 'Done', opt);
            document.getElementById('dispatchRequestPopup').click();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while closing task', 'Error', opt);
            this.spinner.hide();
        });
    }

    fileRequestUpload(input) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.fileSizeLimit = false;

        if (input.files.length && input.files[0].name.length <= 60) {
            this.requestFile = input.files[0].name;
            const filesplit = this.requestFile.split('.');
            if (input.files[0].size > '10485760') {
                this.fileSizeLimit = true;
                this.requestFile = '';
                this.spinner.hide();
            } else {
                const formData = new FormData();
                formData.append('multipleFiles', input.files[0]);
                formData.append('documentStoreCode', this.documentStoreCode);
                this.serviceCall.uploadDocumentFile(formData).subscribe(data => {
                    this.documentStoreCode = data.json().documentStoreCode;
                    this.getDocstoreDocsList(this.documentStoreCode);
                    this.requestFile = '';
                    this.spinner.hide();
                    const opt = JSON.parse(JSON.stringify(options));
                    this.toastrService[this.types[0]]('', 'File Uploaded', opt);
                }, error => {
                    this.spinner.hide();
                });
            }
        }
        else {
            this.fileSizeLimit = true;
            this.requestFile = '';
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

    selectProvince(provCode) {
        this.selectedItem = [];
        this.whichSearch = '';
        this.searchProvinceCode = provCode;
        this.numberSearchForm.controls['province'].setValue(provCode);
        this.pdSearchForm.controls['province'].setValue(provCode);
        this.stSearchForm.controls['province'].setValue(provCode);

        this.numberSearchForm.controls['numberType'].setValue(''); //no
        this.numberSearchForm.controls['number'].setValue(''); //no
        this.pdSearchForm.controls['pdType'].setValue(''); //pd
        this.pdSearchForm.controls['majorRegion'].setValue(''); //pd
        this.pdSearchForm.controls['farmNumber'].setValue(''); //pd
        this.pdSearchForm.controls['portion'].setValue(''); //pd
        this.pdSearchForm.controls['minorRegion'].setValue(''); //pd
        this.pdSearchForm.controls['erfNumber'].setValue(''); //pd
        this.pdSearchForm.controls['portionNumber'].setValue(''); //pd
        this.pdSearchForm.controls['holdingNumber'].setValue(''); //pd
        this.pdSearchForm.controls['lpi'].setValue(''); //pd
        this.stSearchForm.controls['stType'].setValue(''); //st
        this.stSearchForm.controls['schemeNumber'].setValue(''); //st
        this.stSearchForm.controls['deedsRegistrationNo'].setValue(''); //st
        this.stSearchForm.controls['sgNo'].setValue(''); //st
        this.stSearchForm.controls['schemeName'].setValue(''); //st
        this.stSearchForm.controls['minorRegion'].setValue(''); //st
        this.stSearchForm.controls['erfNumber'].setValue(''); //st
        this.stSearchForm.controls['portionNumber'].setValue(''); //st
        this.stSearchForm.controls['majorRegion'].setValue(''); //st
        this.stSearchForm.controls['farmNumber'].setValue(''); //st

        console.log('provCode', provCode);
    }

    selectParcelType(code) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));


        if (this.pdSearchForm.get('pdType').value == 'FARM') {
            this.spinner.show();
            this.serviceCall.getRegistrationDivision(this.searchProvinceCode.substr(this.searchProvinceCode.length - 1)).subscribe(data => {
                this.majorregions = data.json();
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Error while getting administrative districts. Try again', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.pdSearchForm.get('pdType').value == 'ERF/LOT') {
            this.spinner.show();
            this.serviceCall.getTownShipName(this.searchProvinceCode.substr(this.searchProvinceCode.length - 1)).subscribe(data => {
                this.erfMonirRegions = data.json();
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Error while getting township names. Try again', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.pdSearchForm.get('pdType').value == 'HOLDING') {
            this.spinner.show();
            this.serviceCall.getTownShipName(this.searchProvinceCode.substr(this.searchProvinceCode.length - 1)).subscribe(data => {
                this.holdingsMinorRegions = data.json();
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Error while getting township names. Try again', 'Error', opt);
                this.spinner.hide();
            });
        }

    }

    selectStParcelType(code) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));


        if (this.stSearchForm.get('stType').value == 'ParcelFarm') {
            this.spinner.show();
            this.serviceCall.getPortionRegistrationDivision(this.searchProvinceCode.substr(this.searchProvinceCode.length - 1)).subscribe(data => {
                this.majorregions = data.json();
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Error while getting administrative districts. Try again', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.stSearchForm.get('stType').value == 'ParcelERF') {
            this.spinner.show();
            this.serviceCall.getPortionTownShipName(this.searchProvinceCode.substr(this.searchProvinceCode.length - 1)).subscribe(data => {
                this.erfMonirRegions = data.json();
                this.spinner.hide();
            }, error => {
                this.toastrService[this.types[1]]('Error while getting township names. Try again', 'Error', opt);
                this.spinner.hide();
            });
        }
    }

    getExternalUserRequestDocsList() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getExternalUserRequestDocsList(this.savedRequestCode).subscribe(data => {
            this.getdoclist = data.json();
            this.spinner.hide();
        },
            error => {
                this.getdoclist = [];
                // this.toastrService[this.types[1]]('Unknown error while retreiving docs', 'Error', opt);
                this.spinner.hide();
            });
    }

    showMap(lpi) {
        window.open(this.gisUrl + lpi, "_blank", "toolbar,scrollbars,resizable,top=150,left=150,width=600,height=600");
    }

    deleteExternalUserRequestDocument(val) {
        this.spinner.show();
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        const fileInput = {
            'requestCode': this.savedRequestCode
        }

        this.serviceCall.deleteExternalUserRequestDocument(val, fileInput).subscribe(data => {
            this.spinner.hide();
            this.getExternalUserRequestDocsList();
            const opt = JSON.parse(JSON.stringify(options));
            this.toastrService[this.types[0]]('', 'File Deleted', opt);
        }, error => {
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

    createNewRequest() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();

        if (this.createRequestForm.get('formatType').value === 'Electronic(DVD)' ||
            this.createRequestForm.get('formatType').value === 'Electronic(HDD)' ||
            this.createRequestForm.get('formatType').value === 'Electronic(CD)' ||
            this.createRequestForm.get('formatType').value === 'Hard Copy (Laminated)' ||
            this.createRequestForm.get('formatType').value === 'Hard Copy' ||
            this.createRequestForm.get('formatType').value === 'Print Copy') {

            if (this.createRequestForm.get('deliveryMethod').value === 'Courier') {
                this.createDvdCourierForm.controls['requestType'].setValue(this.createRequestForm.get('requestType').value);
                this.createDvdCourierForm.controls['description'].setValue(this.createRequestForm.get('description').value);
                this.createDvdCourierForm.controls['deliveryMethod'].setValue(this.createRequestForm.get('deliveryMethod').value);
                this.createDvdCourierForm.controls['formatType'].setValue(this.createRequestForm.get('formatType').value);
                this.createDvdCourierForm.controls['postalAddress1'].setValue(this.createRequestForm.get('postalAddress1').value);
                this.createDvdCourierForm.controls['postalAddress2'].setValue(this.createRequestForm.get('postalAddress2').value);
                this.createDvdCourierForm.controls['postalAddress3'].setValue(this.createRequestForm.get('postalAddress3').value);

                if (this.createDvdCourierForm.valid) {
                    // this.toastrService[this.types[0]]('courier valid', 'Success', opt);
                    this.createNewRequestForm();
                }
                else {
                    this.hasCdcError = true;
                    this.spinner.hide();
                }
            }
            else {
                this.createDvdForm.controls['requestType'].setValue(this.createRequestForm.get('requestType').value);
                this.createDvdForm.controls['description'].setValue(this.createRequestForm.get('description').value);
                this.createDvdForm.controls['deliveryMethod'].setValue(this.createRequestForm.get('deliveryMethod').value);
                this.createDvdForm.controls['formatType'].setValue(this.createRequestForm.get('formatType').value);

                if (this.createDvdForm.valid) {
                    // this.toastrService[this.types[0]]('collection valid', 'Success', opt);
                    this.createNewRequestForm();
                }
                else {
                    this.hasClError = true;
                    this.spinner.hide();
                }
            }
        }
        else if (this.createRequestForm.get('formatType').value === 'Electronic(FTP)' ||
            this.createRequestForm.get('formatType').value === 'Electronic(Email)') {
            this.createFtpForm.controls['requestType'].setValue(this.createRequestForm.get('requestType').value);
            this.createFtpForm.controls['description'].setValue(this.createRequestForm.get('description').value);
            this.createFtpForm.controls['formatType'].setValue(this.createRequestForm.get('formatType').value);
            this.createFtpForm.controls['email'].setValue(this.createRequestForm.get('email').value);

            console.log('createFtpForm', this.createFtpForm);

            if (this.createFtpForm.valid) {
                // this.toastrService[this.types[0]]('ftp valid', 'Success', opt);
                this.createNewRequestForm();
            }
            else {
                this.hasCorError = true;
                this.spinner.hide();
            }
        }
        else {
            this.hasCrError = true;
            this.spinner.hide();
        }
    }

    downloadDocuments() {
        this.spinner.show();
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        const downloadInput = {
            'documentStoreCode': this.documentStoreCode
        };
        this.serviceCall.downloadDocuments(downloadInput);
        this.spinner.hide();
    }

    selectFormatType() {
        this.createRequestForm.controls['deliveryMethod'].reset();
        console.log('userName', this.userName);
        if (this.createRequestForm.get('formatType').value === 'Electronic(CD)') {
            this.getCostOfCategory('CD');
        }
        else if (this.createRequestForm.get('formatType').value === 'Electronic(DVD)') {
            this.getCostOfCategory('DVD');
        }
        else if (this.createRequestForm.get('formatType').value === 'Hard Copy (Laminated)') {
            this.getCostOfCategory('For every square metre or portion thereof:  38 microns thickness');
        }
        else if (this.createRequestForm.get('formatType').value === 'Electronic(FTP)') {
            this.assign = 'finalize';
            this.costs = null;
        }
        else if (this.createRequestForm.get('formatType').value === 'Electronic(Email)') {
            this.assign = 'finalize';
            this.costs = null;
        }
        else {
            this.costs = null;
        }
        this.createRequestForm.controls['email'].setValue(this.userName);
    }

    getCostOfCategory(formatType) {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getCostOfCategory(formatType).subscribe(data => {
            var cost = data.json();
            this.costs = cost[0];
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting cost information. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getRequestKinds() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getRequestKinds().subscribe(data => {
            this.requestKinds = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting request kinds. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getMediaTypes() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getMediaTypes().subscribe(data => {
            this.mediaTypes = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting media types. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getFormatTypes() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getFormatTypes().subscribe(data => {
            this.formatTypes = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting format types. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getDeliveryMethods() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getDeliveryMethods().subscribe(data => {
            this.deliveryMethods = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting delivery methods. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getRequestBulkTypes() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getBulkRequestTypes().subscribe(data => {
            this.bulkrequesttypes = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting request bulk types. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getRequestBulkSubTypes() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getBulkRequestSubTypesByTypeCode(this.categoryForm.get('category').value.split('=')[0]).subscribe(data => {
            this.bulkrequestsubtypes = data.json();
            console.log('bulkrequestsubtypes', this.bulkrequestsubtypes);
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting bulk sub types. Try again', 'Error', opt);
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

    getAdminDistricts() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.spinner.show();
        this.serviceCall.getProvinces().subscribe(data => {
            this.majorregions = data.json();
            this.spinner.hide();
        }, error => {
            this.toastrService[this.types[1]]('Error while getting administrative districts. Try again', 'Error', opt);
            this.spinner.hide();
        });
    }

    getPropertyByName(propName) {
        this.spinner.show();
        this.serviceCall.getPropertyValueByName(propName).subscribe((data: any) => {
            const res = data.json();
            if (res[0].keyName == 'GIS_URL') {
                this.gisUrl = res[0].keyValue;
            }
            else if (res[0].keyName == 'SINGLE_REQUEST_SIZE') {
                this.configSize = res[0].keyValue;
            }

            this.configMbSize = (this.configSize / 1024);
            console.log('configSize1', this.configMbSize);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

    filterSearch() {
        let i = 0;
        let gisRecord: string[];

        for (var result of this.numberSearchResults) {

            gisRecord = this.giss.filter(
                gis => gis === result.lpi);

            if (gisRecord.length > 0) {
                this.numberSearchResults[i].hasGis = "true";
            }
            else {
                this.numberSearchResults[i].hasGis = "false";
            }
            i++;
        }
    }

    searchNumber() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));

        this.hasError = false;
        this.spinner.show();
        this.initiateSearch = true;
        
        if (this.selectSubscription && !this.selectSubscription.closed) {
            this.selectSubscription.unsubscribe();
        }
        
        if (this.numberSearchForm.valid) {

            let provcode = this.numberSearchForm.get('province').value.substr(this.numberSearchForm.get('province').value.length - 1);
            if (this.numberSearchForm.get('numberType').value == 'SG') {
                this.whichSearch = 'no';
                this.serviceCall.searchByNumberProvinceCode(this.numberSearchForm.get('number').value, provcode).subscribe((data: any) => {
                    this.initiateSearch = false;
                    this.numberSearchResults = data.json();
                    this.filterSearch();
                    this.itemCount = this.numberSearchResults.length;
                    // this.itemResourceIn = new DataTableResource(this.numberSearchResults);
                    // this.itemResourceIn.query({ offset: 0, limit: 10 }).then(quotData => this.numberSearchResults = quotData);
                    // this.itemResourceIn.count().then(count => this.itemCount = count);
                    this.searchInputJson = {
                        'search': 'Number Search-SG',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    if (this.itemCount == 0) {
                        document.getElementById('noDataError').click();
                    }
                    this.updateSearchResults();
                    this.spinner.hide();
                }, error => {
                    this.numberSearchResults = [];
                    this.itemCount = 0;
                    this.searchInputJson = {
                        'search': 'Number Search-SG',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                    this.spinner.hide();
                });
            }
            else if (this.numberSearchForm.get('numberType').value == 'Compilation') {
                this.whichSearch = 'no';
                this.serviceCall.searchByCompilationNumberProvinceCode(this.numberSearchForm.get('number').value, provcode).subscribe((data: any) => {
                    this.numberSearchResults = data.json();
                    this.filterSearch();
                    this.itemCount = this.numberSearchResults.length;
                    this.searchInputJson = {
                        'search': 'Number Search-Compilation',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    if (this.itemCount == 0) {
                        document.getElementById('noDataError').click();
                    }
                    this.updateSearchResults();
                    this.spinner.hide();
                }, error => {
                    this.numberSearchResults = [];
                    this.itemCount = 0;
                    this.searchInputJson = {
                        'search': 'Number Search-Compilation',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                    this.spinner.hide();
                });
            }
            else if (this.numberSearchForm.get('numberType').value == 'Filing') {
                this.whichSearch = 'no';
                this.serviceCall.searchByFilingNumberProvinceCode(this.numberSearchForm.get('number').value, provcode).subscribe((data: any) => {
                    this.numberSearchResults = data.json();
                    this.filterSearch();
                    this.itemCount = this.numberSearchResults.length;
                    this.searchInputJson = {
                        'search': 'Number Search-Filing',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    if (this.itemCount == 0) {
                        document.getElementById('noDataError').click();
                    }
                    this.updateSearchResults();
                    this.spinner.hide();
                }, error => {
                    this.numberSearchResults = [];
                    this.itemCount = 0;
                    this.searchInputJson = {
                        'search': 'Number Search-Filing',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                    this.spinner.hide();
                });
            }
            else if (this.numberSearchForm.get('numberType').value == 'SurveyRecord') {
                this.whichSearch = 'no';
                this.serviceCall.searchBySurveySGNumberProvinceCode(this.numberSearchForm.get('number').value, provcode).subscribe((data: any) => {
                    this.numberSearchResults = data.json();
                    this.filterSearch();
                    this.itemCount = this.numberSearchResults.length;
                    this.searchInputJson = {
                        'search': 'Number Search-SurveyRecord',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    if (this.itemCount == 0) {
                        document.getElementById('noDataError').click();
                    }
                    this.updateSearchResults();
                    this.spinner.hide();
                }, error => {
                    this.numberSearchResults = [];
                    this.itemCount = 0;
                    this.searchInputJson = {
                        'search': 'Number Search-SurveyRecord',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                    this.spinner.hide();
                });
            }
            else if (this.numberSearchForm.get('numberType').value == 'DeedsRegistration') {
                this.whichSearch = 'no';
                this.serviceCall.searchByDeedsNumberProvinceCode(this.numberSearchForm.get('number').value, provcode).subscribe((data: any) => {
                    this.numberSearchResults = data.json();
                    this.filterSearch();
                    this.itemCount = this.numberSearchResults.length;
                    this.searchInputJson = {
                        'search': 'Number Search-DeedsRegistration',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    if (this.itemCount == 0) {
                        document.getElementById('noDataError').click();
                    }
                    this.updateSearchResults();
                    this.spinner.hide();
                }, error => {
                    this.numberSearchResults = [];
                    this.itemCount = 0;
                    this.searchInputJson = {
                        'search': 'Number Search-DeedsRegistration',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                    this.spinner.hide();
                });
            }
            else if (this.numberSearchForm.get('numberType').value == 'Lease') {
                this.whichSearch = 'no';
                this.serviceCall.searchByLeaseNumberProvinceCode(this.numberSearchForm.get('number').value, provcode).subscribe((data: any) => {
                    this.numberSearchResults = data.json();
                    this.filterSearch();
                    this.itemCount = this.numberSearchResults.length;
                    this.searchInputJson = {
                        'search': 'Number Search-Lease',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    if (this.itemCount == 0) {
                        document.getElementById('noDataError').click();
                    }
                    this.updateSearchResults();
                    this.spinner.hide();
                }, error => {
                    this.numberSearchResults = [];
                    this.itemCount = 0;
                    this.searchInputJson = {
                        'search': 'Number Search-Lease',
                        'provinceCode': provcode,
                        'number': this.numberSearchForm.get('number').value
                    };
                    this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                    this.spinner.hide();
                });
            }
        }
        else {
            this.hasError = true;
            this.spinner.hide();
        }
    }

    updateSearchResults() {
        let i = 0;

        for (var result of this.numberSearchResults) {
            this.numberSearchResults[i].mbSize = (result.fileSize / 1024).toString();
            if (parseInt(result.fileSize) <= this.configSize) {
                this.numberSearchResults[i].showDownload = 'true';
            }
            else {
                this.numberSearchResults[i].showDownload = 'false';
            }
            i++;
        }
    }

    viewResult(ftpSiteUrl) {
        this.ftpSiteUrl = ftpSiteUrl;
    }

    loadSelectedRequests() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.selectedItem = [];

        if (this.whichSearch !== '' && this.categoryForm.get('subcategory').value.length !== 0 && this.selectedRequests.length > 0) {

            if (this.selectedSize <= this.configMbSize) {
                for (var i = 0; i < this.selectedRequests.length; i++) {
                    this.selectedItem[i] = new RequestItem();
                    this.selectedItem[i].id = this.selectedRequests[i].id;
                    this.selectedItem[i].requestGazette1 = this.categoryForm.get('category').value.split('=')[0];
                    this.selectedItem[i].requestGazette1Name = this.categoryForm.get('category').value.split('=')[1];
                    this.selectedItem[i].requestGazette2 = this.categoryForm.get('subcategory').value.split('=')[0];
                    this.selectedItem[i].requestGazette2Name = this.categoryForm.get('subcategory').value.split('=')[1];
                    this.selectedItem[i].resultjson = JSON.stringify(this.selectedRequests[i]);
                    this.selectedItem[i].ftpSiteUrl = this.selectedRequests[i].ftpSiteUrl;
                }
                let ri = new RequestItem();
    
                ri.resultjson = JSON.stringify(this.searchInputJson);
                ri.requestGazette1 = 'S0001';
                ri.requestGazette1Name = 'Search Texts';
                ri.requestGazette2 = 'S0002';
                ri.requestGazette2Name = 'Search Texts';
                this.selectedItem[this.selectedItem.length] = ri;
                document.getElementById('btnSubmitRequest').click();
            }
            else {
                document.getElementById('btnSubmitRequestValidation').click();
            }
        }
        else {
            this.toastrService[this.types[1]]('Select categories and requests to Submits', 'Error', opt);
        }
    }

    loadSelectedRequestsConfirm() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();
        this.selectedItem = [];

        for (var i = 0; i < this.selectedRequests.length; i++) {
            this.selectedItem[i] = new RequestItem();
            this.selectedItem[i].id = this.selectedRequests[i].id;
            this.selectedItem[i].requestGazette1 = this.categoryForm.get('category').value.split('=')[0];
            this.selectedItem[i].requestGazette1Name = this.categoryForm.get('category').value.split('=')[1];
            this.selectedItem[i].requestGazette2 = this.categoryForm.get('subcategory').value.split('=')[0];
            this.selectedItem[i].requestGazette2Name = this.categoryForm.get('subcategory').value.split('=')[1];
            this.selectedItem[i].resultjson = JSON.stringify(this.selectedRequests[i]);
            this.selectedItem[i].ftpSiteUrl = this.selectedRequests[i].ftpSiteUrl;
        }
        let ri = new RequestItem();

        ri.resultjson = JSON.stringify(this.searchInputJson);
        ri.requestGazette1 = 'S0001';
        ri.requestGazette1Name = 'Search Texts';
        ri.requestGazette2 = 'S0002';
        ri.requestGazette2Name = 'Search Texts';
        this.selectedItem[this.selectedItem.length] = ri;
        document.getElementById('btnSubmitRequestValidationPopup').click();
        document.getElementById('btnSubmitRequest').click();
        
        this.spinner.hide();
    }

    rowSelect(item, target, event) {
        if (target.checked) {
            let selRequests = this.selectedRequests.filter(request => request.id === item.id);
            if (selRequests.length == 0) {
                this.selectedRequests.push(item);
            }
        }
        else {
            this.selectedRequests.forEach((item1, index) => {
                if (item1.id === item.id) {
                    this.selectedRequests.splice(index, 1);
                }
            });
        }

        for(var i = 0; i < this.selectedRequests.length; i++) {
            this.selectedSize = this.selectedSize + parseFloat(Number(this.selectedRequests[i].fileSize).toFixed(2));
        }
        this.selectedSize = (this.selectedSize) / 1024;
        this.selectedSize = parseFloat(Number(this.selectedSize).toFixed(2));

        console.log('selectedSize', this.selectedSize);
    }

    rowClick(rowEvent) {

        // let selected;
        // this.selectSubscription = rowEvent.row.selectedChange.subscribe(row => {
        //     selected = row;
        //     if (selected == true) {
        //         let selRequests = this.selectedRequests.filter(request => request.id === rowEvent.row.item.id);
        //         if (selRequests.length == 0) {
        //             this.selectedRequests.push(rowEvent.row.item);
        //         }
        //     }
        //     else if (selected === false) {
        //         this.selectedRequests.forEach((item, index) => {
        //             if (item.id === rowEvent.row.item.id) {
        //                 this.selectedRequests.splice(index, 1);
        //             }
        //         });
        //     }
        // });

    // this.selectedItem = [];
    // if (typeof rowEvent._selected !== "undefined") {
    //     console.log('row._selected', rowEvent.row._selected)
    // }
    // else if (rowEvent.row.selected == false) {
    //     this.selectedRequests.push(rowEvent.row.item);
    // }
    // else if (rowEvent.row.selected === true) {
    //     this.selectedRequests.forEach((item, index) => {
    //         if (item.id === rowEvent.row.item.id) {
    //             this.selectedRequests.splice(index, 1);
    //         }
    //     });
    // }

    // for(var i = 0; i < this.selectedRequests.length; i++) {
    //     this.selectedSize = this.selectedSize + parseFloat(Number(this.selectedRequests[i].fileSize).toFixed(2));
    // }
    // this.selectedSize = (this.selectedSize) / 1024;
    // this.selectedSize = parseFloat(Number(this.selectedSize).toFixed(2));
    // if (this.selectSubscription && !this.selectSubscription.closed) {
    //     this.selectSubscription.unsubscribe();
    // }
}

removeRequestItem(itemselected) {
    this.selectedRequests.forEach((item, index) => {
        if (item.id === itemselected.id) {
            this.selectedRequests.splice(index, 1);
        }
    });
}

reloadItems(limitsData) {
    this.itemResourceIn.query(limitsData).then(quotData => this.numberSearchResults = quotData);
}

test(event) {
    console.log('event');
}

searchPd() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    let i = 0;

    this.hasPdFarmError = false;
    this.spinner.show();

    if (this.selectSubscription && !this.selectSubscription.closed) {
        this.selectSubscription.unsubscribe();
    }

    if (this.pdSearchForm.valid) {
        let provcode = this.pdSearchForm.get('province').value.substr(this.pdSearchForm.get('province').value.length - 1);
        if (this.pdSearchForm.get('pdType').value == 'FARM' && this.pdSearchForm.get('majorRegion').value.length > 0
            && this.pdSearchForm.get('farmNumber').value.length > 0 && this.pdSearchForm.get('farmNumber').hasError('pattern') == false) {
            this.whichSearch = 'pd';
            let farmNumber = this.pad(this.pdSearchForm.get('farmNumber').value, 8);
            let portion = this.pad(this.pdSearchForm.get('portion').value, 5);
            this.serviceCall.searchParcelByFarm(this.pdSearchForm.get('pdType').value, provcode, this.pdSearchForm.get('majorRegion').value, farmNumber, portion, this.pdSearchForm.get('farmName').value).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-Farm',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('majorRegion').value,
                    'farmNumber': this.pdSearchForm.get('farmNumber').value,
                    'portion': this.pdSearchForm.get('portion').value,
                    'farmName': this.pdSearchForm.get('farmName').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-Farm',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('majorRegion').value,
                    'farmNumber': this.pdSearchForm.get('farmNumber').value,
                    'portion': this.pdSearchForm.get('portion').value,
                    'farmName': this.pdSearchForm.get('farmName').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.pdSearchForm.get('pdType').value == 'ERF/LOT' && this.pdSearchForm.get('minorRegion').value.length > 0
            && this.pdSearchForm.get('erfNumber').value.length > 0) {
            this.whichSearch = 'pd';
            let erfNumber = this.pad(this.pdSearchForm.get('erfNumber').value, 8);
            let portionNumber = this.pad(this.pdSearchForm.get('portionNumber').value, 5);
            this.serviceCall.searchParcelByERF(this.pdSearchForm.get('pdType').value, provcode, this.pdSearchForm.get('minorRegion').value, erfNumber, portionNumber).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-ERF',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('minorRegion').value,
                    'farmNumber': this.pdSearchForm.get('erfNumber').value,
                    'portion': this.pdSearchForm.get('portion').value,
                    'farmName': this.pdSearchForm.get('portionNumber').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-ERF',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('minorRegion').value,
                    'farmNumber': this.pdSearchForm.get('erfNumber').value,
                    'portion': this.pdSearchForm.get('portion').value,
                    'farmName': this.pdSearchForm.get('portionNumber').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.pdSearchForm.get('pdType').value == 'HOLDING' && this.pdSearchForm.get('minorRegion').value.length > 0
            && this.pdSearchForm.get('holdingNumber').value.length > 0) {
            this.whichSearch = 'pd';
            let holdingNumber = this.pad(this.pdSearchForm.get('holdingNumber').value, 8);
            let portionNumber = this.pad(this.pdSearchForm.get('portionNumber').value, 5);
            this.serviceCall.searchParcelByHoldings(this.pdSearchForm.get('pdType').value, provcode, this.pdSearchForm.get('minorRegion').value, holdingNumber, portionNumber).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-Holdings',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('minorRegion').value,
                    'farmNumber': this.pdSearchForm.get('holdingNumber').value,
                    'portion': this.pdSearchForm.get('portionNumber').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-Holdings',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('minorRegion').value,
                    'farmNumber': this.pdSearchForm.get('holdingNumber').value,
                    'portion': this.pdSearchForm.get('portionNumber').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.pdSearchForm.get('pdType').value == 'LPI' && this.pdSearchForm.get('lpi').value.length > 0) {
            this.whichSearch = 'pd';
            this.serviceCall.searchParcelByLPI(provcode, this.pdSearchForm.get('lpi').value).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;

                if (this.numberSearchResults.length > 0) {
                    if (this.numberSearchResults[0].parcel == 'FARM') {
                        this.searchParcelType = 'FARM';
                    }
                    else if (this.numberSearchResults[0].parcel == 'ERF/LOT') {
                        this.searchParcelType = 'ERF/LOT';
                    }
                    else if (this.numberSearchResults[0].parcel == 'HOLDING') {
                        this.searchParcelType = 'HOLDING';
                    }
                }
                this.searchInputJson = {
                    'search': 'Parcel Description Search-LPI',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('lpi').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Parcel Description Search-LPI',
                    'provinceCode': provcode,
                    'majorRegion': this.pdSearchForm.get('lpi').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasPdFarmError = true;
            this.spinner.hide();
        }
    }
    else {
        this.hasPdFarmError = true;
        this.spinner.hide();
    }
}

searchSt() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.hasStError = false;
    this.spinner.show();

    if (this.selectSubscription && !this.selectSubscription.closed) {
        this.selectSubscription.unsubscribe();
    }

    console.log('this.stSearchForm', this.stSearchForm);
    if (this.stSearchForm.valid) {
        let provcode = this.stSearchForm.get('province').value.substr(this.stSearchForm.get('province').value.length - 1);
        if (this.stSearchForm.get('stType').value == 'SchemeNumber' && this.stSearchForm.get('schemeNumber').value.length > 0) {
            this.whichSearch = 'st';
            this.serviceCall.searchSectionalPortionByTitle(provcode, this.stSearchForm.get('schemeNumber').value.toUpperCase(), '', '', '').subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-SchemeNumber',
                    'provinceCode': provcode,
                    'schemeNumber': this.stSearchForm.get('schemeNumber').value,
                    'schemeName': this.stSearchForm.get('schemeName').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-SchemeNumber',
                    'provinceCode': provcode,
                    'schemeNumber': this.stSearchForm.get('schemeNumber').value,
                    'schemeName': this.stSearchForm.get('schemeName').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.stSearchForm.get('stType').value == 'DeedsRegistrationNo' && this.stSearchForm.get('deedsRegistrationNo').value.length > 0) {
            this.whichSearch = 'st';
            this.serviceCall.searchSectionalPortionByTitle(provcode, '', '', '', this.stSearchForm.get('deedsRegistrationNo').value.toUpperCase()).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-DeedsRegistrationNo',
                    'provinceCode': provcode,
                    'deedsRegistrationNo': this.stSearchForm.get('deedsRegistrationNo').value,
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-DeedsRegistrationNo',
                    'provinceCode': provcode,
                    'deedsRegistrationNo': this.stSearchForm.get('deedsRegistrationNo').value,
                };
                this.toastrService[this.types[1]]('Unknown error while searching', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.stSearchForm.get('stType').value == 'SGNo' && this.stSearchForm.get('sgNo').value.length > 0) {
            this.whichSearch = 'st';
            this.serviceCall.searchSectionalPortionByTitle(provcode, '', '', this.stSearchForm.get('sgNo').value.toUpperCase(), '').subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-SGNo',
                    'provinceCode': provcode,
                    'SGNo': this.stSearchForm.get('sgNo').value,
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-SGNo',
                    'provinceCode': provcode,
                    'SGNo': this.stSearchForm.get('sgNo').value,
                };
                this.toastrService[this.types[1]]('Unknown error while searching', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.stSearchForm.get('stType').value == 'SchemeName' && this.stSearchForm.get('schemeName').value.length > 0) {
            this.whichSearch = 'st';
            this.serviceCall.searchSectionalPortionByTitle(provcode, '', this.stSearchForm.get('schemeName').value.toUpperCase(), '', '').subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-SchemeName',
                    'provinceCode': provcode,
                    'schemeNumber': this.stSearchForm.get('schemeNumber').value,
                    'schemeName': this.stSearchForm.get('schemeName').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-SchemeName',
                    'provinceCode': provcode,
                    'schemeNumber': this.stSearchForm.get('schemeNumber').value,
                    'schemeName': this.stSearchForm.get('schemeName').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.stSearchForm.get('stType').value == 'ParcelERF' && this.stSearchForm.get('minorRegion').value.length > 0 && this.stSearchForm.get('erfNumber').value.length > 0) {
            this.whichSearch = 'st';
            let erfNumber = this.pad(this.stSearchForm.get('erfNumber').value, 8);
            let portionNumber = this.pad(this.stSearchForm.get('portionNumber').value, 5);
            this.serviceCall.searchSectionalPortionByERF(provcode, this.stSearchForm.get('minorRegion').value, erfNumber, portionNumber).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-ParcelERF',
                    'provinceCode': provcode,
                    'minorRegion': this.stSearchForm.get('minorRegion').value,
                    'erfNumber': erfNumber,
                    'portionNumber': this.stSearchForm.get('portionNumber').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-ParcelERF',
                    'provinceCode': provcode,
                    'minorRegion': this.stSearchForm.get('minorRegion').value,
                    'erfNumber': erfNumber,
                    'portionNumber': this.stSearchForm.get('portionNumber').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching', 'Error', opt);
                this.spinner.hide();
            });
        }
        else if (this.stSearchForm.get('stType').value == 'ParcelFarm' && this.stSearchForm.get('majorRegion').value.length > 0
            && this.stSearchForm.get('farmNumber').value.length > 0) {
            this.whichSearch = 'st';
            let farmNumber = this.pad(this.stSearchForm.get('farmNumber').value, 8);
            let portionNumber = this.pad(this.stSearchForm.get('portionNumber').value, 5);
            this.serviceCall.searchSectionalPortionByFarm(provcode, this.stSearchForm.get('majorRegion').value, farmNumber, portionNumber).subscribe((data: any) => {
                this.numberSearchResults = data.json();
                this.filterSearch();
                this.itemCount = this.numberSearchResults.length;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-ParcelFarm',
                    'provinceCode': provcode,
                    'farmNumber': farmNumber,
                    'portionNumber': this.stSearchForm.get('portionNumber').value,
                    'majorRegion': this.stSearchForm.get('majorRegion').value
                };
                if (this.itemCount == 0) {
                    document.getElementById('noDataError').click();
                }
                this.updateSearchResults();
                this.spinner.hide();
            }, error => {
                this.numberSearchResults = [];
                this.itemCount = 0;
                this.searchInputJson = {
                    'search': 'Sectional Title Search-ParcelFarm',
                    'provinceCode': provcode,
                    'farmNumber': farmNumber,
                    'portionNumber': this.stSearchForm.get('portionNumber').value,
                    'majorRegion': this.stSearchForm.get('majorRegion').value
                };
                this.toastrService[this.types[1]]('Unknown error while searching for number', 'Error', opt);
                this.spinner.hide();
            });
        }
        else {
            this.hasStError = true;
            this.spinner.hide();
        }
    }
    else {
        this.hasStError = true;
        this.spinner.hide();
    }
}

pad(num: number, size: number): string {
    let s = num + "";
    if (s.length > 0) {
        while (s.length < size) {
            s = "0" + s;
        }
    }

    // if (s == '00000000') {
    //     s = '';
    // }
    return s;
}
resetStForm() {
    this.stSearchForm.reset();
}

resetPdForm() {
    this.pdSearchForm.reset();
}

resetNumberForm() {
    this.numberSearchForm.reset();
}

searchByNumberProvinceCode() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.hasStError = true;
    this.spinner.show();

    if (this.stSearchForm.valid) {
        this.toastrService[this.types[0]]('Success', 'Error', opt);
    }
    else {
        this.spinner.hide();
    }
}

//     searchByNumberProvinceCode: 'searchByNumberProvinceCode?sGNumber=',
//   searchByCompilationNumberProvinceCode: 'searchByCompilationNumberProvinceCode?compilationNumber=',
//   searchByFilingNumberProvinceCode: 'searchByFilingNumberProvinceCode?fillingNumber=',
//   searchBySurveySGNumberProvinceCode: 'searchBySurveySGNumberProvinceCode?sGNumber=',
//   searchByDeedsNumberProvinceCode: 'searchByDeedsNumberProvinceCode?deedNumber=',
//   searchByLeaseNumberProvinceCode: 'searchByLeaseNumberProvinceCode?leaseNumber=',
//   searchParcelByFarm: 'searchParcelByFarm?farm=',
//   searchParcelByERF: 'searchParcelByERF?provinceCode=',
//   searchParcelByHoldings: 'searchParcelByHoldings?provinceCode=',
//   searchParcelByLPI: 'searchParcelByLPI?provinceCode=',

giss: string[] = ["F00300000000065400000",
    "F00300000000065400000",
    "F00300080000129000001",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300110000025700000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300080000002700000",
    "F03600000000057300002",
    "F00300000000174600000",
    "F00300000000174600000",
    "F00500000000077300000",
    "F00500000000077300000",
    "F00300030001396000001",
    "F00300780000010000001",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F01200000000010600000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "T0KS00110000257100000",
    "T0KS00110000257100000",
    "T0KS00030000031300001",
    "T0LR00000000045700031",
    "T0LT00000000053400111",
    "T0LS00010000034300000",
    "T0LS00010000028100001",
    "T0LS00010000021200000",
    "T0KS00110000256800000",
    "T0KS00110000256800000",
    "T0KS00110000257100000",
    "T0KS00110000257100000",
    "T0LT00000000003100023",
    "T0LS00000000024400000",
    "T0LS00000000024400000",
    "T0LT00000000062800000",
    "T0LT00000000062800000",
    "T0MS00000000078200004",
    "T0LT00000000073200003",
    "T0KS00000000020100000",
    "T0KS00000000020100000",
    "T0LT00000000023000003",
    "T0KR00000000046700161",
    "F01200000000010600000",
    "F01200000000010600000",
    "F01200000000010600000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "T0KS00030000457700001",
    "T0KS00110000256800000",
    "T0KS00110000256800000",
    "T0KS00110000253900000",
    "T0LU00010000217900001",
    "T0LT00000000062800000",
    "T0LT00000000062800000",
    "T0KS00000000020100000",
    "T0KS00000000020100000",
    "T0MS00000000081100000",
    "T0JS00000000005300241",
    "T0JS00000000002600051",
    "T0JS00000000002600051",
    "T0JS00000000003200009",
    "T0JS00000000003200009",
    "T0JS00000000005300284",
    "T0JS00000000005300284",
    "T0JS00000000002600051",
    "T0JS00000000002600051",
    "T0LS00140000164400000",
    "T0JS00000000005300241",
    "T0JS00000000005300241",
    "T0KR00000000074000000",
    "T0KR00000000074000000",
    "T0KR00000000074000000",
    "T0KR00000000074000000",
    "T0KR00000000082400000",
    "T0KR00000000082400000",
    "T0JS00160000077200123",
    "T0LS00000000024400000",
    "T0LS00000000024400000",
    "T0JS00160000076600000",
    "T0LR00000000045700032",
    "T0JS00300000001800000",
    "T0JS00000000030900048",
    "T0JS00000000030900048",
    "T0JT00000000008200030",
    "T0JU00000000000900036",
    "T0JS00000000033800001",
    "T0JT00000000061800023",
    "T0HT00050000015800000",
    "T0HT00000000008400000",
    "T0HT00000000008400000",
    "T0JS00290000186800000",
    "T0HT00000000008400000",
    "T0HT00000000008400000",
    "T0HU00000000005700000",
    "T0HU00000000005700000",
    "T0JS00230000065200004",
    "T0HT00050000010900000",
    "T0IS00210000328200000",
    "T0HT00050000001700000",
    "T0IR05590000031800000",
    "T0JS00280000025600000",
    "T0IS00170000010700001",
    "T0IS00120000215100000",
    "T0IS00030000149100000",
    "T0HT00050000012900002",
    "T0HT00050000044100000",
    "T0IR01710000016800000",
    "T0HT00050000012400001",
    "T0HS00040000049900000",
    "T0KU00000000021200017",
    "T0JT00080000536100000",
    "T0JU00000000002600065",
    "T0IR00330000181200041",
    "T0JU00410000006600002",
    "T0HS00020000000800000",
    "T0JT00120000032300000",
    "T0IS00000000082700000",
    "T0IS00000000082700000",
    "T0MS00000000081100000",
    "T0JR00000000017900029",
    "T0KP00000000016200002",
    "T0KR00000000045000036",
    "T0KS00000000041900000",
    "T0KS00000000041900000",
    "T0KQ00000000031700000",
    "T0JS00000000005300284",
    "T0JS00000000005300284",
    "T0JS00000000003200009",
    "T0JS00000000003200009",
    "T0JS00000000005300241",
    "T0KS00000000003200003",
    "T0MS00000000081100000",
    "T0MS00000000081100000",
    "T0KS00000000041900000",
    "T0KS00000000041900000",
    "T0KR00000000082400000",
    "T0KR00000000082400000",
    "T0KQ00000000002000001",
    "T0JQ00000000030000002",
    "T0JQ00000000094200000",
    "T0JQ00000000094200000",
    "T0JQ00000000030400159",
    "T0IP00140000121200001",
    "T0JQ00000000030400264",
    "T0JQ00000000030400261",
    "T0JQ00000000029900013",
    "T0IP00260000078700011",
    "T0IP00190000145700000",
    "T0IP00190000145700000",
    "T0IQ00000000042400046",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "T0IS00000000082700000",
    "T0IS00000000082700000",
    "T0JS00000000028700102",
    "T0IS00190000770300001",
    "T0JS00000000030900048",
    "T0JS00000000030900048",
    "T0JU00170000053100000",
    "T0IR00330000068300001",
    "T0JS00000000121700000",
    "T0IS00000000057200000",
    "T0IS00000000057200000",
    "T0IS00000000057200000",
    "T0IS00000000057200000",
    "T0HU00000000005700000",
    "T0HU00000000005700000",
    "T0IS00000000013700000",
    "T0IS00000000013700000",
    "T0IP00190000145700000",
    "T0IP00190000145700000",
    "T0IS00000000013700000",
    "T0IS00000000013700000",
    "T0IP00480000005900000",
    "T0IQ00000000042801189",
    "T0JQ00000000044600141",
    "T0JQ00000000094200000",
    "T0JQ00000000094200000",
    "T0IP00000000043500018",
    "T0IQ03050000103200004",
    "T0IM00000000038500000",
    "T0IP00160000042500000",
    "T0IN00000000036000000",
    "T0IN00000000036000000",
    "T0IN00000000036000000",
    "T0IN00000000036000000",
    "T0JQ00270000047500003",
    "T0JQ00270000047500001",
    "T0JQ00270000039200004",
    "T0JQ00270000064800003",
    "T0HO00220000049600000",
    "T0HO00190000136300007",
    "T0HO00080000005100000",
    "T0HO00170000028800000",
    "T0HO00020000054300001",
    "T0JP00000000016800004",
    "T0HO00130000043400000",
    "T0HO00130000029500001",
    "T0HO00000000005200000",
    "T0HO00000000005200000",
    "T0HO00000000032700006",
    "T0HO00000000005200000",
    "T0HO00000000005200000",
    "T0HP00010000053800008",
    "T0IP00110000045800000",
    "T0IQ00000000041000001",
    "T0IP00000000043800051",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C01600010000038000000",
    "C01600070009772100000",
    "C01600520000073900000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C01600020000770300000",
    "C01600070000133000000",
    "C01600070015377900000",
    "C01600110000606100000",
    "C01600190001343500000",
    "C01600590000225100000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C01600340003782900000",
    "C02700010000223600000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C04600000000081800000",
    "C04600000000081800000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C05900160000018600000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02300040002119200000",
    "C03400140000315700000",
    "C04000040000064200000",
    "C05900090000306100000",
    "C05900090000214600000",
    "C10600010000009400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900390000275700000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02300040001583800000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700090000071900000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C00900000000005400004",
    "C05100070000418600000",
    "C05100070000418600000",
    "C01600070015775800000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C05800050000497400000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C07800080000015300000",
    "C01600070009329000000",
    "C01600170001401900000",
    "C01600130001117400000",
    "C01600420001631500000",
    "C01600020003971300000",
    "C05100070000418600000",
    "C05100070000418600000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C08500040001229400000",
    "C01600070012539800000",
    "C01600810000006800000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C04600000000081800000",
    "C04600000000081800000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C01300210000016000000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C01600020001120600000",
    "C01600340003512500000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C05500000000058500060",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C00900000000026000002",
    "C01400000000003500168",
    "C04300000000013600002",
    "C05800000000008200002",
    "C07300000000017300008",
    "C05200000000003200009",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C07800000000019100000",
    "C07800000000019100000",
    "C05500000000112900025",
    "C07800000000019100000",
    "C07800000000019100000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "C02700020000046400000",
    "F00300000000065400000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F02400040000340600000",
    "F03900000000005700000",
    "F03900000000005700000",
    "F03900000000005700000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300800000001200000",
    "F00300800000001200000",
    "F00300800000001200000",
    "F00300800000001200000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F03500000000066800000",
    "F03500000000066800000",
    "F03500000000066800000",
    "F03500000000066800000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000254100010",
    "F03900000000005700000",
    "F03900000000005700000",
    "F03900000000005700000",
    "F00500000000077300000",
    "F00500000000077300000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "T0JR02300000183300000",
    "T0JR02790000008900000",
    "T0JR02420000072800001",
    "T0IR01140000509200000",
    "T0JR00040000000200000",
    "T0JR00040000005200001",
    "T0IR00000000047800378",
    "T0IR00000000002900021",
    "T0IR00000000002900022",
    "T0IR00000000002900024",
    "T0JR00000000032400186",
    "T0JR00000000037500749",
    "T0IR00000000003000372",
    "T0IR00000000003000373",
    "T0IR00000000047800019",
    "T0IQ07140000039700020",
    "T0IQ07140000083700073",
    "T0IQ07140000083600063",
    "T0JR02510000219700000",
    "F01300000000007100000",
    "F01300000000034000000",
    "F01300000000034000000",
    "F01200000000058700000",
    "F01200000000058700000",
    "F01700000000002200000",
    "F01700000000002200000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C08300020000210300000",
    "C10600010000009300000",
    "C08400000000010100007",
    "C08400000000010100007",
    "C08400000000010100007",
    "C08400000000010100007",
    "C10000000000008800000",
    "C10000000000008800000",
    "C07600110000003700000",
    "T0IR05420000087100000",
    "T0JR04950000442100000",
    "T0JR00530000135100000",
    "T0IR06930000012400001",
    "T0IR05630000042100001",
    "T0IR02920000054100002",
    "T0JR00000000037400428",
    "T0IQ01290000087700002",
    "T0IR00610000014200000",
    "T0IR00000000047800376",
    "T0IR00000000002900016",
    "T0IR00000000008500409",
    "T0IQ00150000065500000",
    "T0IQ00000000019300099",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "T0IR00000000008500397",
    "T0MS00000000052500000",
    "T0MS00000000052500000",
    "T0MS00000000052500000",
    "T0MS00000000052500000",
    "T0HP00000000008200085",
    "T0JR00000000038300015",
    "T0JS00000000002400048",
    "T0JS00000000002400048",
    "F02600000000049200000",
    "F02600000000049200000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "T0JS00000000002400048",
    "T0JS00000000002400048",
    "T0HT00050000043800001",
    "F01500000000186100000",
    "F01500000000186100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C05900000000002500338",
    "C00800000000034300031",
    "C02300330000109000000",
    "C09000000000006300000",
    "C09000000000006300000",
    "C09000000000006300000",
    "C09000000000006300000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "F01500000000186100000",
    "F01500000000186100000",
    "T0JR00000000038300242",
    "T0IP00250000021200000",
    "T0JT00200000003000011",
    "C05900160000334100000",
    "T0IQ00640000071100366",
    "F00300000000065400000",
    "F00300000000065400000",
    "F02500000000036100009",
    "F02500000000027700001",
    "F03200000000020600000",
    "F03200000000020600000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "N0FT00000000129900000",
    "N0FU01750000239200000",
    "N0FT02480000005100019",
    "N0FT00490000017900012",
    "N0GT01180000161800000",
    "N0GV03180000043700009",
    "N0GT00260000542700000",
    "N0GT00260000524000000",
    "N0ET02520000024400002",
    "N0ET02520000024400001",
    "N0ES00000001854100000",
    "N0ES00000001854100000",
    "N0FT02960000014100000",
    "N0FU00850001164000000",
    "N0GT01170000143000003",
    "N0FT00890000073900001",
    "N0GS00000000211800005",
    "F00100000000179500000",
    "F00100000000001700000",
    "F00100000000001700000",
    "F00100000000179500000",
    "F00200000000016800000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C03800010000237700000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "N0ET00000000637100149",
    "N0FS00000000138900096",
    "N0FS00000000138900138",
    "N0FS00000000138900087",
    "N0FS00000000138900087",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "N0ET00000001448200000",
    "N0ET00000000455000000",
    "N0ET00000000455000000",
    "N0ET00000000455000000",
    "N0ET00000000455000000",
    "F00200000000016800000",
    "F00300000000111100018",
    "F00300000000111100018",
    "F01200000000058700000",
    "F01200000000058700000",
    "F02500000000021400006",
    "F01300000000007100000",
    "F01300000000007100000",
    "F00100000000166300003",
    "F00300000000231200014",
    "F01300000000010300000",
    "F01300000000010300000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C03800010000237600000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "N0ET00000001352300000",
    "N0ET00000001352300000",
    "N0FT00000000095700106",
    "N0FT00000000095701316",
    "N0ET00000001352400000",
    "N0ET00000001352400000",
    "N0FT00000001515200179",
    "N0FU00000000156000761",
    "N0FT02580000188700134",
    "N0FT02580000029900149",
    "F00300000000174600000",
    "F00300000000174600000",
    "F01700000000002200000",
    "F01700000000002200000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C05900340000125600000",
    "C05900340000125600000",
    "N0GT00000001390500000",
    "N0GT00000001390500000",
    "N0FT00000001406100000",
    "N0FT00000001406100000",
    "N0ET00000001352400000",
    "N0ET00000001352400000",
    "N0GV04210000533300058",
    "N0FU00000000093100523",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900100000053600000",
    "C07600110001973900000",
    "C10600010000009900000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C10000000000008800000",
    "C10000000000008800000",
    "C09300010000477300000",
    "C05900000000002500362",
    "C11000010000091200000",
    "C11000010000091200000",
    "N0GU00000001572800001",
    "N0FT00000001406100000",
    "N0FT00000001406100000",
    "N0ET00000001352300000",
    "N0ET00000001352300000",
    "N0FT00000000146500044",
    "N0FT00000000146500044",
    "N0FT00000000146500044",
    "N0FT00000000146500044",
    "N0FT00000000098200057",
    "N0ET00000001139200000",
    "N0ET00000001139200000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F03200000000020600000",
    "F03200000000020600000",
    "F02600000000049200000",
    "F02600000000049200000",
    "F00300000000283300000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900370000083700000",
    "C00200000000008900003",
    "C00300000000017600000",
    "C00300000000017600000",
    "C03400060000139400000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "N0ES00000001854100000",
    "N0ES00000001854100000",
    "N0ET00000001139200000",
    "N0ET00000001139200000",
    "N0FU00000000695500001",
    "N0GS00000000118500004",
    "N0GT00000001390500000",
    "N0GT00000001390500000",
    "N0FS00000000138900087",
    "N0FS00000000138900087",
    "F00300030000177000004",
    "F00300030002070300000",
    "F00300030002640800015",
    "F00300080000002100000",
    "F00300080000011500000",
    "F00300080000000200001",
    "F00300000000283300000",
    "F03900000000005700000",
    "F03900000000005700000",
    "F03900000000005700000",
    "F02200000000066200007",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "C03500000000004000002",
    "C02300000000079900047",
    "C02500000000007400001",
    "C07600000000011500051",
    "C03400000000070700013",
    "C00300000000017600000",
    "C00300000000017600000",
    "C02200000000052300022",
    "C02200000000052300022",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "F01300010000009700000",
    "F01300010000035100000",
    "F01300010000078000000",
    "F02200070000023700000",
    "F02500010000230600000",
    "F02500010000237700000",
    "F02500010000149900000",
    "F02500010000004600001",
    "F02500010000103000001",
    "F03500080000553300000",
    "F04200050000050900000",
    "F04300020000046600000",
    "F04300020000046400000",
    "F04000050000003200001",
    "F00300090005852400000",
    "F01600020000139000000",
    "F00600000000061500001",
    "F00300000000111100018",
    "F00300000000111100018",
    "F00600010000072900000",
    "F00300860000001800002",
    "F00300650000005900000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C06200010001178600000",
    "C06200010001178600000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "F00300860000001700000",
    "F00100000000179500000",
    "F00100000000179500000",
    "F00200000000016800000",
    "F00200000000016800000",
    "F00300000000065400000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F01500000000013100000",
    "F00400000000043500003",
    "F01300000000034000000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C02300040001583800000",
    "C02300040007296200000",
    "C02300040007652600000",
    "C02300040007652500000",
    "C07600000000044400007",
    "C02200000000052300022",
    "C02200000000052300022",
    "C10000000000008800000",
    "C10000000000008800000",
    "N0HU00000001835400000",
    "N0ET00000000384000067",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "N0FS00000001292000000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F01300000000034000000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C06200010001178600000",
    "C06200010001178600000",
    "C00200000000025300021",
    "C07600000000011300059",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "N0FU03510000242600238",
    "N0ET03530000015500000",
    "N0ET03590000038500001",
    "N0ET04030000161300000",
    "N0FT00310000036900001",
    "N0FT01250000045800002",
    "N0FT04420000006900000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "C11000010000091200000",
    "T0IQ01150000012300004",
    "T0IQ01270000011700000",
    "T0IQ02000000017100013",
    "T0IQ02000000207000001",
    "T0JR03080000115500001",
    "T0IQ02760000339000012",
    "T0IQ04670000457200000",
    "T0IQ00600000092500001",
    "T0IQ05120000055400016",
    "T0IQ05230000029900001",
    "T0IQ06790000055400000",
    "T0IQ01460000121600000",
    "F00300000000065400000",
    "F00100000000001700000",
    "F00100000000001700000",
    "F00300000000283300000",
    "F00300000000283300000",
    "F01300000000010300000",
    "F01300000000010300000",
    "F01300000000007100000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "F00300000000065400000",
    "C02300040001583800000",
    "C02300040001583800000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "C05900340000125600000",
    "T0IR02760000009600000",
    "T0JR00000000070200028",
    "T0IR07090000086700000",
    "T0IR08190000000700000",
    "T0IR08190000000700001",
    "T0JR00550000198000000",
    "T0JR00700000049600002",
    "T0JR00700000049700003",
    "T0JR00000000037100427",
    "T0JR00000000060800120",
    "T0IR02070000148800007",
    "T0IR06260000008500001",
    "T0JR00450000022600002",
    "T0JR01990000065800001"
];

}

export class RequestItem {
    id: any;
    resultId: any;
    searchType: any;
    searchText: any;
    requestGazetteType: any;
    requestGazette1: any;
    requestGazette1Name: any;
    requestGazette2: any;
    requestGazette2Name: any;
    requestCost: any;
    requestHours: any;
    resultjson: any;
    size: any;
    ftpSiteUrl: any;
}

export class RequestDisplayItem {
    description: any;
    documentNumber: any;
    documentType: any;
    fileSize: any;
    ftpSiteUrl: any;
    id: any;
    lpi: any;
    pageNumber: any;
    parcel: any;
    parcelType: any;
    portion: any;
    provCode: any;
    province: any;
    region: any;
    sgNo: any;
    url: any;
}

export class Item {
    key: string;
    value: string;
}