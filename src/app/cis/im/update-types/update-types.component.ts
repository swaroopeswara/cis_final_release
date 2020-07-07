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

  gazzetteTypes: any;
  gazzetteForm: FormGroup;
  duplicateGazzetteValue: boolean;

  deliveryMethods: any;
  deliveryMethodForm: FormGroup;
  duplicateDeliveryMethodValue: boolean;

  formatTypes: any;
  formatTypeForm: FormGroup;
  duplicateFormatTypeValue: boolean;

  MediaTypes: any;
  MediaTypeForm: FormGroup;
  duplicateMediaTypeValue: boolean;

  RequestTypes: any;
  RequestTypeForm: FormGroup;
  duplicateRequestTypeValue: boolean;

  RequestKinds: any;
  RequestKindForm: FormGroup;
  duplicateRequestKindValue: boolean;

  public types = ['success', 'error', 'info', 'warning'];
  hasError: boolean;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
    this.gazzetteForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.deliveryMethodForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.RequestTypeForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.formatTypeForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.MediaTypeForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.RequestKindForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ''
    });

    this.hasError = false;
    this.duplicateGazzetteValue = false;
    this.duplicateDeliveryMethodValue = false;
    this.duplicateFormatTypeValue = false;
    this.duplicateMediaTypeValue = false;
    this.duplicateRequestTypeValue = false;
    this.duplicateRequestKindValue = false;
  }

  ngOnInit() {
    // this.getGazzetteTypes();
    this.getDeliveryMethods();
    this.getFormatTypes();
    // this.getMediaTypes();
    this.getRequestTypes();
    // this.getRequestKinds();
  }

  getRequestKinds() {
    this.spinner.show();
    this.serviceCall.getRequestKinds().subscribe(data => {
      this.RequestKinds = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  deleteFormatType(ft) {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    const deleteInput = {
      formatTypeCode: ft.formatTypeCode,
      isDeleted: 'Y'
    };
    this.serviceCall.deleteFormatType(deleteInput).subscribe((data: any) => {
      // const res = data.json();
      this.getFormatTypes();
      this.toastrService[this.types[0]]('Deleted', 'Information', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while deleting. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  deleteDeliveryMethod(dm) {
      const options = this.toastrService.toastrConfig;
      const opt = JSON.parse(JSON.stringify(options));
  
      this.spinner.show();
      const deleteInput = {
        deliveryMethodCode: dm.deliveryMethodCode,
        deliveryMethodName: dm.deliveryMethodName
      };
      this.serviceCall.deleteDeliveryMethod(deleteInput).subscribe((data: any) => {
        const res = data.json();
        if (res.message == 'already in use') {
          this.toastrService[this.types[1]]('The method is already in use. Cannot delete', 'Error', opt);
        }
        else {
          this.getDeliveryMethods();
        }
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Error while deleting. Try again', 'Error', opt);
        this.spinner.hide();
      });
    }

  getRequestTypes() {
    this.spinner.show();
    this.serviceCall.getRequestTypes().subscribe(data => {
      this.RequestTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }


  getMediaTypes() {
    this.spinner.show();
    this.serviceCall.getMediaTypes().subscribe(data => {
      this.MediaTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getFormatTypes() {
    this.spinner.show();
    this.serviceCall.getFormatTypes().subscribe(data => {
      this.formatTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getGazzetteTypes() {
    this.spinner.show();
    this.serviceCall.getGazzetteTypes().subscribe(data => {
      this.gazzetteTypes = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getDeliveryMethods() {
    this.spinner.show();
    this.serviceCall.getDeliveryMethods().subscribe(data => {
      this.deliveryMethods = data.json();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  createGazzetteType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateGazzetteValue = false;

    this.spinner.show();
    this.gazzetteTypes.forEach((type) => {
      if (type.name == this.gazzetteForm.get('name').value.trim()) {
        this.duplicateGazzetteValue = true;
      }
    });

    if (this.gazzetteForm.valid && this.duplicateGazzetteValue == false) {
      const input = {
        name: this.gazzetteForm.get('name').value,
        description: this.gazzetteForm.get('description').value
      };
      this.serviceCall.createGazzetteType(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Gazzette Type', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateGazzetteClosePopup').click();
        this.getGazzetteTypes();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Gazzette mode', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createDeliveryMethod() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateDeliveryMethodValue = false;

    this.spinner.show();
    this.deliveryMethods.forEach((type) => {
      if (type.name == this.deliveryMethodForm.get('name').value.trim()) {
        this.duplicateDeliveryMethodValue = true;
      }
    });

    if (this.deliveryMethodForm.valid && this.duplicateDeliveryMethodValue == false) {
      const input = {
        deliveryMethodName: this.deliveryMethodForm.get('name').value,
        description: this.deliveryMethodForm.get('description').value
      };
      this.serviceCall.createDeliveryMethod(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Delivery Method', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateDeliveryMethodClosePopup').click();
        this.getDeliveryMethods();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Delivery Method', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createFormatType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateFormatTypeValue = false;

    this.spinner.show();
    this.deliveryMethods.forEach((type) => {
      if (type.name == this.formatTypeForm.get('name').value.trim()) {
        this.duplicateFormatTypeValue = true;
      }
    });

    if (this.formatTypeForm.valid && this.duplicateFormatTypeValue == false) {
      const input = {
        formatTypeName: this.formatTypeForm.get('name').value,
        description: this.formatTypeForm.get('description').value
      };
      this.serviceCall.createFormatType(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Format Types', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateFormatTypeClosePopup').click();
        this.getFormatTypes();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Format Type', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createMediaType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateMediaTypeValue = false;

    this.spinner.show();
    this.deliveryMethods.forEach((type) => {
      if (type.name == this.MediaTypeForm.get('name').value.trim()) {
        this.duplicateMediaTypeValue = true;
      }
    });

    if (this.MediaTypeForm.valid && this.duplicateMediaTypeValue == false) {
      const input = {
        name: this.MediaTypeForm.get('name').value,
        description: this.MediaTypeForm.get('description').value
      };
      this.serviceCall.createMediaType(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Format Types', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateMediaTypeClosePopup').click();
        this.getMediaTypes();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Format Type', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createRequestType() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateRequestTypeValue = false;

    this.spinner.show();
    this.deliveryMethods.forEach((type) => {
      if (type.name == this.RequestTypeForm.get('name').value.trim()) {
        this.duplicateRequestTypeValue = true;
      }
    });

    if (this.RequestTypeForm.valid && this.duplicateRequestTypeValue == false) {
      const input = {
        name: this.RequestTypeForm.get('name').value,
        description: this.RequestTypeForm.get('description').value
      };
      this.serviceCall.createRequestType(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Format Types', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateRequestTypeClosePopup').click();
        this.getRequestTypes();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Format Type', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }

  createRequestKind() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.duplicateRequestKindValue = false;

    this.spinner.show();
    this.deliveryMethods.forEach((type) => {
      if (type.name == this.RequestKindForm.get('name').value.trim()) {
        this.duplicateRequestKindValue = true;
      }
    });

    if (this.RequestKindForm.valid && this.duplicateRequestKindValue == false) {
      const input = {
        name: this.RequestKindForm.get('name').value,
        description: this.RequestKindForm.get('description').value
      };
      this.serviceCall.createRequestKind(input).subscribe(data => {
        this.toastrService[this.types[0]]('Created new Format Types', 'Success', opt);
        this.hasError = false;
        document.getElementById('btnCreateRequestKindClosePopup').click();
        this.getRequestKinds();
        this.spinner.hide();
      }, error => {
        this.toastrService[this.types[1]]('Unknown error while creating Format Type', 'Error', opt);
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }
}
