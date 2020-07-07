import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { RegexResponse } from 'src/app/services/Apis/RegexResponse';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-im-config',
  templateUrl: './im-config.component.html',
  styleUrls: ['./im-config.component.scss']
})
export class ImConfigComponent implements OnInit {
  mbForm: FormGroup;
  tlForm: FormGroup;
  hasError: boolean;
  public types = ['success', 'error', 'info', 'warning'];
  nationalRole: any;

  categories: any;
  categoryForm: FormGroup;
  duplicateCategoryValue: boolean;

  subCategories: any;
  subCategoryForm: FormGroup;
  dueForm: FormGroup;
  editSubCategoryForm: FormGroup;
  duplicateSubCategoryValue: boolean;

  categorycode: any;
  categoryname: any;
  category: any = '';
  subCategory: any;
  atleastOneRateError: boolean;
  userCode: any;
  userName: any;
  selectedSubCategory: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {

    this.mbForm = this.formBuilder.group({
      'size': ['', Validators.required],
      'description': ['', Validators.required]
    });

    this.dueForm = this.formBuilder.group({
      'days': ['', Validators.required],
      'description': ['', Validators.required]
    });

    this.categoryForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.subCategoryForm = this.formBuilder.group({
      'costSubCategoryName': ['', Validators.required],
      'description': '',
      'fixedRate': ['', Validators.compose([Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
      'hourRate': ['', Validators.compose([Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
      'halfHourRate': ['', Validators.compose([Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
    });

    this.editSubCategoryForm = this.formBuilder.group({
      'costSubCategoryName': ['', Validators.required],
      'costSubCategoryCode': '',
      'description': '',
      'fixedRate': ['', Validators.compose([Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
      'hourRate': ['', Validators.compose([Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
      'halfHourRate': ['', Validators.compose([Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
    });

    this.tlForm = this.formBuilder.group({
      'timelapse': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      'pretimelapse': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      'description': ['', Validators.required],
    });

    this.hasError = false;
    this.duplicateCategoryValue = false;
    this.duplicateSubCategoryValue = false;
    this.atleastOneRateError = false;
  }


  ngOnInit() {
    this.getPropertyByName('SINGLE_REQUEST_SIZE');
    this.getPropertyByName('cis.lapsedtime');
    this.getPropertyByName('cis.prelapsedtime');
    this.getPropertyByName('PREFORMA_DUE_DATE');
    this.getCategories();
    this.userCode = localStorage.getItem('cis_usercode');
    this.userName = localStorage.getItem('cis_username');
  }

  getPropertyByName(propName) {
    this.serviceCall.getPropertyValueByName(propName).subscribe((data: any) => {
      const res = data.json();
      if (propName == 'SINGLE_REQUEST_SIZE') {
        this.mbForm.controls['size'].setValue(parseInt(res[0].keyValue) / 1024);
      }
      else if (propName == 'cis.lapsedtime') {
        this.tlForm.controls['timelapse'].setValue(res[0].keyValue);
      }
      else if (propName == 'cis.prelapsedtime') {
        this.tlForm.controls['pretimelapse'].setValue(res[0].keyValue);
      }
      else if (propName == 'PREFORMA_DUE_DATE') {
        this.dueForm.controls['days'].setValue(res[0].keyValue);
      }
    }, error => {
      
    });
  }

  selectItem(cat) {
    this.selectedSubCategory = cat;
    this.editSubCategoryForm.controls['costSubCategoryName'].setValue(cat.costSubCategoryName);
    this.editSubCategoryForm.controls['fixedRate'].setValue(cat.fixedRate == null ? '' : cat.fixedRate);
    this.editSubCategoryForm.controls['hourRate'].setValue(cat.hourRate == null ? '' : cat.hourRate);
    this.editSubCategoryForm.controls['halfHourRate'].setValue(cat.halfHourRate == null ? '' : cat.halfHourRate);
    this.editSubCategoryForm.controls['description'].setValue('');
    this.editSubCategoryForm.controls['costSubCategoryCode'].setValue(cat.costSubCategoryCode);
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

  deactivateCategory() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deleteInput = {
      categoryCode: this.category.split('=')[0],
    };
    this.serviceCall.deactivateCategory(deleteInput).subscribe((data: any) => {
      const res = data.json();
      this.getCategories();
      this.subCategories = null;
      this.toastrService[this.types[0]]('Deleted', 'Information', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while deleting. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  getSubCategories() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.categorycode = this.category.split('=')[0];
    this.categoryname = this.category.split('=')[1];

    this.spinner.show();
    this.serviceCall.getSubCostCategoriesByCostCategoryCode(this.categorycode).subscribe(data => {
      this.subCategories = data.json();
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while getting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  setRequestSizeValue() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    if (this.mbForm.valid) {
      this.setPropertyValueByName('SINGLE_REQUEST_SIZE', parseInt(this.mbForm.get('size').value) * 1024, this.mbForm.get('description').value)
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  setTimeLapseValues() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    if (this.tlForm.valid) {
      this.setPropertyValueByName('cis.lapsedtime', this.tlForm.get('timelapse').value, this.tlForm.get('description').value)
      this.setPropertyValueByName('cis.prelapsedtime', this.tlForm.get('pretimelapse').value, this.tlForm.get('description').value)
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }

  }

  
  setDueDays() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    if (this.dueForm.valid) {
      this.setPropertyValueByName('PREFORMA_DUE_DATE', this.dueForm.get('days').value, this.dueForm.get('description').value)
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }

  }

  setPropertyValueByName(propName, propValue, description) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    const input = {
      keyName: propName,
      keyValue: propValue,
      isEditable: 'Y'
    };

    this.serviceCall.setPropertyValueByName(input).subscribe((data: any) => {
      const res = data.json();
      this.createBusinessRuleHistory(propName, description);
      this.toastrService[this.types[0]]('Updated', 'Success', opt);
    }, error => {
      this.toastrService[this.types[1]]('Unknown error while updating', 'Error', opt);
    });
  }

  createCategory() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateCategoryValue = false;

    this.spinner.show();
    this.categories.forEach((type) => {
      if (type.name == this.categoryForm.get('name').value.trim()) {
        this.duplicateCategoryValue = true;
      }
    });

    if (this.categoryForm.valid && this.duplicateCategoryValue == false) {
      const input = {
        'categoryName': this.categoryForm.get('name').value,
        'description': this.categoryForm.get('description').value,
        'isActive': 'Y',
        'isDeleted': 'N'
      };
      this.serviceCall.createCategory(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Category', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateCategoryClosePopup').click();
        this.getCategories();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating category', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  editSubCategory() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateSubCategoryValue = false;
    this.atleastOneRateError = false;
    this.hasError = false;
    this.spinner.show();

    if (this.editSubCategoryForm.valid &&
      (this.editSubCategoryForm.get('fixedRate').value.length > 0 || this.editSubCategoryForm.get('hourRate').value.length > 0 || this.editSubCategoryForm.get('halfHourRate').value.length > 0)) {
      const input = {
        'costSubCategoryCode': this.editSubCategoryForm.get('costSubCategoryCode').value,
        'costSubCategoryName': this.editSubCategoryForm.get('costSubCategoryName').value,
        'description': this.editSubCategoryForm.get('description').value,
        'fixedRate': this.editSubCategoryForm.get('fixedRate').value,
        'hourRate': this.editSubCategoryForm.get('hourRate').value,
        'halfHourRate': this.editSubCategoryForm.get('halfHourRate').value,
      };
      this.serviceCall.updateCostSubCategory(input).subscribe(data => {
        this.toastrService[this.types[0]]('Updated Sub Category', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnEditSubCategoryClosePopup').click();
        this.getSubCategories();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while updating sub category', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.atleastOneRateError = true;
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createSubCategory() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateSubCategoryValue = false;
    this.atleastOneRateError = false;
    this.hasError = false;

    this.spinner.show();

    if (this.subCategoryForm.valid) {
      this.subCategories.forEach((type) => {
        if (type.name == this.subCategoryForm.get('costSubCategoryName').value.trim()) {
          this.duplicateSubCategoryValue = true;
        }
      });
    }
    else {
      this.spinner.hide();
    }

    console.log('this.subCategoryForm.valid', this.subCategoryForm);
    if (this.subCategoryForm.valid && this.duplicateSubCategoryValue == false &&
      (this.subCategoryForm.get('fixedRate').value.length > 0 || this.subCategoryForm.get('hourRate').value.length > 0 || this.subCategoryForm.get('halfHourRate').value.length > 0)) {
      const input = {
        'costCategoryCode': this.categorycode,
        'costCategoryName': this.categoryname,
        'costSubCategoryName': this.subCategoryForm.get('costSubCategoryName').value,
        'description': this.subCategoryForm.get('description').value,
        'fixedRate': this.subCategoryForm.get('fixedRate').value,
        'hourRate': this.subCategoryForm.get('hourRate').value,
        'halfHourRate': this.subCategoryForm.get('halfHourRate').value,
        'isActive': 'Y',
        'isDeleted': 'N'
      };
      this.serviceCall.createSubCategory(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Sub Category', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateSubCategoryClosePopup').click();
        this.getSubCategories();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating sub category', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.atleastOneRateError = true;
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createBusinessRuleHistory(propVal, description) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let currentDate = yyyy + '-' + mm + '-' + dd;

    this.spinner.show();
    const createInput =
    {
      referenceNumber: propVal, //'SINGLE_REQUEST_SIZE',    
      category: '',
      subCategory: '',
      province: 'National',
      officer: '',
      userName: this.userName,
      businessRule: propVal, //'SINGLE_REQUEST_SIZE',
      dateReceived: currentDate,
      overrideDate: currentDate,
      overrideReason: description, //this.mbForm.get('description').value
    };
    this.serviceCall.createBusinessRuleHistory(createInput).subscribe((data: any) => {
      this.mbForm.controls['description'].setValue('');
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  deactivateSubCategory(val) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deactivateInput = {
      costSubCategoryCode: val.costSubCategoryCode,
    };
    this.serviceCall.deactivateSubCategory(deactivateInput).subscribe((data: any) => {
      this.getSubCategories();
      this.toastrService[this.types[0]]('Deleted', 'Information', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }
}
