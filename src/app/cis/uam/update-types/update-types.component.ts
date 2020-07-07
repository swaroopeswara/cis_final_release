import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { RegexResponse } from 'src/app/services/Apis/RegexResponse';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-update-types',
  templateUrl: './update-types.component.html',
  styleUrls: ['./update-types.component.scss']
})
export class UpdateTypesComponent implements OnInit {

  organizationTypes: any;
  commTypeForm: FormGroup;
  sectorForm: FormGroup;
  orgTypeForm: FormGroup;
  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;
  userId: any;
  provinces: any;
  communcationTypes: any;
  sectors: any;
  duplicateCommValue: boolean;
  duplicateSectorValue: boolean;
  duplicateOrgValue: boolean;
  selectItem: Item;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
    this.commTypeForm = this.formBuilder.group({
      'commname': ['', Validators.required],
      'description': ''
    });

    this.sectorForm = this.formBuilder.group({
      'sectorname': ['', Validators.required],
      'description': ''
    });

    this.orgTypeForm = this.formBuilder.group({
      'orgtypename': ['', Validators.required],
      'description': ''
    });

    this.hasError = false;
    this.duplicateCommValue = false;
    this.duplicateSectorValue = false;
    this.duplicateOrgValue = false;
    this.selectItem = new Item();
  }

  ngOnInit() {
    this.getSectors();
    this.getOrganizationTypes();
    this.getCommuncationTypes();
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

  deleteType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();

    if (this.selectItem.type == 'CT') {
      this.serviceCall.deleteCommunicationMode(this.selectItem.name).subscribe(data => {
        this.toastrService[this.types[0]]('Deleted Communication mode', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnDeleteTypePopup').click();
        this.getCommuncationTypes();
        this.spinner.hide();
      }, error => {
        if ((JSON.parse((<any>error)._body).message == 'Reference exists')) {
          this.toastrService[this.types[1]]('Cannot delete the type. It already in use.', 'Error', opt);
          document.getElementById('btnDeleteTypePopup').click();
        }
        else {
          this.toastrService[this.types[1]]('Unknown error while deleting Communcation mode', 'Error', opt);
        }
        this.spinner.hide();
      });
    }
    else if (this.selectItem.type == 'S') {
      this.serviceCall.deleteSector(this.selectItem.name).subscribe(data => {
        this.toastrService[this.types[0]]('Deleted Sector', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnDeleteTypePopup').click();
        this.getSectors();
        this.spinner.hide();
      }, error => {
        if ((JSON.parse((<any>error)._body).message == 'Reference exists')) {
          this.toastrService[this.types[1]]('Cannot delete the type. It already in use.', 'Error', opt);
          document.getElementById('btnDeleteTypePopup').click();
        }
        else {
          this.toastrService[this.types[1]]('Unknown error while deleting Sector', 'Error', opt);
        }
        this.spinner.hide();
      });
    }
    else if (this.selectItem.type == 'O') {
      this.serviceCall.deleteOrganizationType(this.selectItem.name).subscribe(data => {
        this.toastrService[this.types[0]]('Deleted Organization', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnDeleteTypePopup').click();
        this.getOrganizationTypes();
        this.spinner.hide();
      }, error => {
        if ((JSON.parse((<any>error)._body).message == 'Reference exists')) {
          this.toastrService[this.types[1]]('Cannot delete the type. It already in use.', 'Error', opt);
          document.getElementById('btnDeleteTypePopup').click();
        }
        else {
          this.toastrService[this.types[1]]('Unknown error while deleting Organization', 'Error', opt);
        }
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }
  
  selectType(code, name, type) {
    this.selectItem.code = code;
    this.selectItem.name = name;
    this.selectItem.type = type;
  }

  createCommType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateCommValue = false;

    this.spinner.show();
    this.communcationTypes.forEach((type) => {
      if (type.communicationTypeName == this.commTypeForm.get('commname').value.trim()) {
        this.duplicateCommValue = true;
      }
    });

    if (this.commTypeForm.valid && this.duplicateCommValue == false) {
      const input = {
        communicationTypeName: this.commTypeForm.get('commname').value,
        description: this.commTypeForm.get('description').value
      };
      this.serviceCall.createCommType(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Communication mode', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateCommClosePopup').click();
        this.getCommuncationTypes();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Communcation mode', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
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

  createSector() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateSectorValue = false;

    this.spinner.show();
    this.sectors.forEach((type) => {
      if (type.name == this.sectorForm.get('sectorname').value.trim()) {
        this.duplicateSectorValue = true;
      }
    });

    if (this.sectorForm.valid && this.duplicateSectorValue == false) {
      const input = {
        name: this.sectorForm.get('sectorname').value,
        description: this.sectorForm.get('description').value
      };
      this.serviceCall.createSector(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Sector', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateSectorPopup').click();
        this.getSectors();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Sector', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
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

  createOrgType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateOrgValue = false;

    this.spinner.show();
    this.organizationTypes.forEach((type) => {
      if (type.organizationTypeName == this.orgTypeForm.get('orgtypename').value.trim()) {
        this.duplicateOrgValue = true;
      }
    });

    if (this.orgTypeForm.valid && this.duplicateOrgValue == false) {
      const input = {
        organizationTypeName: this.orgTypeForm.get('orgtypename').value,
        description: this.orgTypeForm.get('description').value
      };
      this.serviceCall.createOrgType(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Organization Type', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateOrgTypePopup').click();
        this.getOrganizationTypes();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Organization Type', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }
}

export class Item {
  code: string;
  name: string;
  type: string;
}