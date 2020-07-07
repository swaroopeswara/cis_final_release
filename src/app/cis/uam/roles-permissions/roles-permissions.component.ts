import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { RegexResponse } from 'src/app/services/Apis/RegexResponse';
import { ValidationService } from 'src/app/services/Apis/wizard-validation.service';

@Component({
  selector: 'az-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolePermissionsComponent implements OnInit {

  public types = ['success', 'error', 'info', 'warning'];
  userCode: any;
  userName: any;
  userType: any;
  accessRightForm: FormGroup;
  accessInternalRightForm: FormGroup;
  dashboardInternalWidgetsForm: FormGroup;
  allExternalroles: any;
  permissionExternalroles = [];
  uamRights = new UamExternalAccessRights();
  uamDashboardRights = new UamInternalDashboardRights();
  uamInternalRights = new UamInternalAccessRights();
  allInternalRoles: any;
  permissions: any;
  roles: any;
  internalroles: any;
  role: any = '';
  internalRole: any = '';
  inPermissions: any;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private serviceCall: RestcallService, private router: Router, public toastrService: ToastrService) {
    this.accessRightForm = this.formBuilder.group({
      'canRegister': '',
      'canUpdatepassword': '',
      'canResetpassword': '',
      'canVerifyprofregistration': '',
      'canUserproductivityreport': '',
      'canUserreport': ''
    });

    this.accessInternalRightForm = this.formBuilder.group({
      'canRegister': '',
      'canGrantaccess': '',
      'canAddadditionalroles': '',
      'canVerifyprofregistration': '',
      'canUserproductivityreport': '',
      'canUserreport': ''
    });

    this.dashboardInternalWidgetsForm= this.formBuilder.group({
      'monthlyCount': '',
      'weeklyCount': ''
    });
  }
  
  updateInternalAccessRights() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();

    const rightsJson = {
      rights: {
        internalrole: {
          uam: {
            register: this.accessInternalRightForm.get('canRegister').value == true ? 'Y' : 'N',
            grantaccess: this.accessInternalRightForm.get('canGrantaccess').value == true ? 'Y' : 'N',
            addadditionalroles: this.accessInternalRightForm.get('canAddadditionalroles').value == true ? 'Y' : 'N',
            verifyprofregistration: this.accessInternalRightForm.get('canVerifyprofregistration').value == true ? 'Y' : 'N',
            reports: {
              userproductivityreport: this.accessInternalRightForm.get('canUserproductivityreport').value == true ? 'Y' : 'N',
              userreport: this.accessInternalRightForm.get('canUserreport').value == true ? 'Y' : 'N',
            }
          }
        }
      }
    };
    const updateAccessRightsInput = {
      usertype: 'Internal',
      roles: [
        {
          rolecode: this.internalRole
        }
      ],
      accessrightjson: JSON.stringify(rightsJson)
    }
    console.log('access:', updateAccessRightsInput);
    // this.spinner.hide();
    this.serviceCall.updateAccessRights(updateAccessRightsInput).subscribe(data => {
      this.toastrService[this.types[0]]('Permission Updated Successfully', 'Done', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating access rights. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  updateAccessRights() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();

    const rightsJson = {
      rights: {
        externalrole: {
          uam: {
            register: this.accessRightForm.get('canRegister').value == true ? 'Y' : 'N',
            updatepassword: this.accessRightForm.get('canUpdatepassword').value == true ? 'Y' : 'N',
            resetpassword: this.accessRightForm.get('canResetpassword').value == true ? 'Y' : 'N',
            verifyprofregistration: this.accessRightForm.get('canVerifyprofregistration').value == true ? 'Y' : 'N',
            reports: {
              userproductivityreport: this.accessRightForm.get('canUserproductivityreport').value == true ? 'Y' : 'N',
              userreport: this.accessRightForm.get('canUserreport').value == true ? 'Y' : 'N',
            }
          }
        }
      }
    };
    const updateAccessRightsInput = {
      usertype: 'External',
      roles: [
        {
          rolecode: this.role
        }
      ],
      accessrightjson: JSON.stringify(rightsJson)
    }
    console.log('access:', updateAccessRightsInput);
    // this.spinner.hide();
    this.serviceCall.updateAccessRights(updateAccessRightsInput).subscribe(data => {
      this.toastrService[this.types[0]]('Permission Updated Successfully', 'Done', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating access rights. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  updateDashboardRights() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    this.spinner.show();
    
    const rightsJson = {
      dashboard: {
        internalrole: {
          uam: {
            weeklycount: this.dashboardInternalWidgetsForm.get('weeklyCount').value == true ? 'Y' : 'N',
            monthlycount: this.dashboardInternalWidgetsForm.get('monthlyCount').value == true ? 'Y' : 'N'
          }
        }
      }
    };
    const updateAccessRightsInput = {
      usertype: 'Internal',
      roles: [
        {
          rolecode: this.internalRole
        }
      ],
      dashboardrightjson: JSON.stringify(rightsJson)
    }
    console.log('access:', updateAccessRightsInput);
    // this.spinner.hide();
    this.serviceCall.setDashboardRights(updateAccessRightsInput).subscribe(data => {
      this.toastrService[this.types[0]]('Permission Updated Successfully', 'Done', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating dashboard rights. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  ngOnInit() {
    // this.getExternalRoles();
    this.getRoles();
    this.getInternalRoles();
    // this.getExternalRoles();
    // this.getExternalRolesByRoleCode();
  }

  changeRole() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    if (this.role) {
      this.serviceCall.getExternalRolesByRoleCode(this.role).subscribe((data: any) => {
        this.permissions = data.json();
        this.uamRights.register = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.register;
        this.accessRightForm.controls['canRegister'].setValue(this.uamRights.register == 'Y' ? true : false);
        this.uamRights.updatepassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.updatepassword;
        this.accessRightForm.controls['canUpdatepassword'].setValue(this.uamRights.updatepassword == 'Y' ? true : false);
        this.uamRights.resetpassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.resetpassword;
        this.accessRightForm.controls['canResetpassword'].setValue(this.uamRights.resetpassword == 'Y' ? true : false);
        this.uamRights.verifyprofregistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
        this.accessRightForm.controls['canVerifyprofregistration'].setValue(this.uamRights.verifyprofregistration == 'Y' ? true : false);
        this.uamRights.userproductivityreport = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports.userproductivityreport;
        this.accessRightForm.controls['canUserproductivityreport'].setValue(this.uamRights.userproductivityreport == 'Y' ? true : false);
        this.uamRights.userreport = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports.userreport;
        this.accessRightForm.controls['canUserreport'].setValue(this.uamRights.userreport == 'Y' ? true : false);
        console.log('uamRights:', this.uamRights);
        this.spinner.hide();
      },
        error => {
          this.toastrService[this.types[1]]('Error while extracting access rights data. Try again', 'Error', opt);
          this.spinner.hide();
        });
    }
    else {
      this.spinner.hide();
    }
  }

  changeDashboardRole() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();
    console.log('internalRole', this.internalRole);
    if (this.internalRole) {
      this.serviceCall.getDashboardRights(this.internalRole).subscribe((data: any) => {
        this.permissions = data.json();
        this.uamDashboardRights.monthlyCount = this.permissions.dashboard.internalrole.uam.monthlycount;
        this.dashboardInternalWidgetsForm.controls['monthlyCount'].setValue(this.uamDashboardRights.monthlyCount == 'Y' ? true : false);
        this.uamDashboardRights.weeklyCount = this.permissions.dashboard.internalrole.uam.weeklycount;
        this.dashboardInternalWidgetsForm.controls['weeklyCount'].setValue(this.uamDashboardRights.weeklyCount == 'Y' ? true : false);
        this.spinner.hide();
      },
        error => {
          this.toastrService[this.types[1]]('Error while extracting dashboard rights data. Try again', 'Error', opt);
          this.spinner.hide();
        });
    }
    else {
      this.spinner.hide();
    }
  }

  changeInternalRole() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));
    this.spinner.show();

    console.log('ths.role', this.internalRole);
    if (this.internalRole) {
      this.serviceCall.getInternalRolesByRoleCode(this.internalRole).subscribe((data: any) => {
        this.inPermissions = data.json();
        this.uamInternalRights.register = JSON.parse(this.inPermissions[0].accessRightJson).rights.internalrole.uam.register;
        this.accessInternalRightForm.controls['canRegister'].setValue(this.uamInternalRights.register == 'Y' ? true : false);
        this.uamInternalRights.grantaccess = JSON.parse(this.inPermissions[0].accessRightJson).rights.internalrole.uam.grantaccess;
        this.accessInternalRightForm.controls['canGrantaccess'].setValue(this.uamInternalRights.grantaccess == 'Y' ? true : false);
        this.uamInternalRights.addadditionalroles = JSON.parse(this.inPermissions[0].accessRightJson).rights.internalrole.uam.addadditionalroles;
        this.accessInternalRightForm.controls['canAddadditionalroles'].setValue(this.uamInternalRights.addadditionalroles == 'Y' ? true : false);
        this.uamInternalRights.verifyprofregistration = JSON.parse(this.inPermissions[0].accessRightJson).rights.internalrole.uam.verifyprofregistration;
        this.accessInternalRightForm.controls['canVerifyprofregistration'].setValue(this.uamInternalRights.verifyprofregistration == 'Y' ? true : false);
        this.uamInternalRights.userproductivityreport = JSON.parse(this.inPermissions[0].accessRightJson).rights.internalrole.uam.reports.userproductivityreport;
        this.accessInternalRightForm.controls['canUserproductivityreport'].setValue(this.uamInternalRights.userproductivityreport == 'Y' ? true : false);
        this.uamInternalRights.userreport = JSON.parse(this.inPermissions[0].accessRightJson).rights.internalrole.uam.reports.userreport;
        this.accessInternalRightForm.controls['canUserreport'].setValue(this.uamInternalRights.userreport == 'Y' ? true : false);
        console.log('uamInternalRights:', this.uamInternalRights);
        this.spinner.hide();
      },
        error => {
          this.toastrService[this.types[1]]('Error while extracting access rights data. Try again', 'Error', opt);
          this.spinner.hide();
        });
    }
    else {
      this.spinner.hide();
    }
  }

  getExternalRolesByRoleCode(value) {

    this.spinner.show();
    this.serviceCall.getExternalRolesByRoleCode(value).subscribe((data: any) => {
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
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

  getExternalRoles() {
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    let i: number;
    i = 0;

    this.spinner.show();
    this.serviceCall.getExternalRoles().subscribe((data: any) => {
      this.allExternalroles = data.json();
      this.allExternalroles.forEach((externalRole) => {
        this.serviceCall.getExternalRolesByRoleCode(externalRole.rolecode).subscribe((data: any) => {
          this.permissions = data.json();
          this.permissionExternalroles[i] = externalRole;
          this.permissionExternalroles[i].register = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.register;
          this.permissionExternalroles[i].updatepassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.updatepassword;
          this.permissionExternalroles[i].resetpassword = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.resetpassword;
          this.permissionExternalroles[i].verifyprofregistration = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.verifyprofregistration;
          this.permissionExternalroles[i].reports = JSON.parse(this.permissions[0].accessRightJson).rights.externalrole.uam.reports;
          i = i + 1;
        },
          error => {
            this.toastrService[this.types[1]]('Error while extracting data. Try again', 'Error', opt);
            this.spinner.hide();
          });
      });
      console.log('this.permissionExternalroles', this.permissionExternalroles);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while extracting data. Try again', 'Error', opt);
      this.spinner.hide();
    });
  }

  changeRegister(event, permission, index) {
    console.log(event.target.checked);
    console.log('permission', permission);
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    let register = event.target.checked == true ? 'Y' : 'N';

    this.spinner.show();
    const updateAccessRightsInput = {
      usertype: 'External',
      roles: [
        {
          rolecode: permission.rolecode
        }
      ],
      accessrightjson: "{ \"rights\": { \"internalrole\": { \"uam\": { \"register\":" + "\"" + register + "\"" + ", \"grantaccess\": \"N\", \"addadditionalroles\": \"N\", \"verifyprofregistration\": \"N\", \"reports\": { \"userproductivityreport\": \"N\", \"userreport\": \"Y\" } } } } }"
    };

    this.serviceCall.updateAccessRights(updateAccessRightsInput).subscribe(data => {
      this.toastrService[this.types[0]]('Successfully Updated', 'Done', opt);
      this.spinner.hide();
    }, error => {
      this.toastrService[this.types[1]]('Error while updating access rights. Try again', 'Error', opt);
      this.spinner.hide();
    });

  }

  getInternalRoles() {
    this.spinner.show();
    this.serviceCall.getInternalRoles().subscribe((data: any) => {
      this.allInternalRoles = data.json();
      this.spinner.hide();
    }, error => {
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

export class UamExternalAccessRights {
  register: any;
  updatepassword: any;
  resetpassword: any;
  verifyprofregistration: any;
  userproductivityreport: any;
  userreport: any;
}

export class UamInternalDashboardRights {
  monthlyCount: any;
  weeklyCount: any;
}


export class UamInternalAccessRights {
  register: any;
  grantaccess: any;
  addadditionalroles: any;
  verifyprofregistration: any;
  userproductivityreport: any;
  userreport: any;
}
