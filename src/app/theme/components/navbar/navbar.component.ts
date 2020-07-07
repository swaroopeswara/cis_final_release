import { Component, ViewEncapsulation, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { AppState } from '../../../app.state';
import { SidebarService } from '../sidebar/sidebar.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Globals } from 'src/app/services/Apis/globals';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'az-navbar',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [SidebarService]
})

export class NavbarComponent implements OnInit {
    public menuItems: Array<any>;
    public isMenuCollapsed: boolean = false;
    fullName: any;
    roleForm: FormGroup;
    userInfo: any;
    roleList: Role[] = [];
    selectedRole: any;
    userType: any;
    public types = ['success', 'error', 'info', 'warning'];

    constructor(private globals: Globals, private apiService: RestcallService, private formBuilder: FormBuilder, private router: Router, private _state: AppState, private _sidebarService: SidebarService, public toastrService: ToastrService, private spinner: NgxSpinnerService,private serviceCall: RestcallService) {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });

        this.roleForm = this.formBuilder.group({
            'globalrolecode': ''
        });

        this.userInfo = JSON.parse(localStorage.getItem('cis_userinfo'));
        // this.fullName = this.userInfo.firstName + ' ' + this.userInfo.surname;
        this.fullName = this.userInfo.firstName;
        this.userType = localStorage.getItem('cis_usertype');

        if (localStorage.getItem('cis_usertype') === 'INTERNAL') {
            this.consolidateInternalRoles();
        }
    }

    public ngOnInit(): void {
        // this.globals.currentMenu.subscribe(menuItems => this.menuItems = menuItems);
        
    }

    public validateDeliveryTypes() {

        //rest of your code here
    }

    loadProvinceUser(role) {
        let item73 = this.roleList.filter(function (item) {
            return item.internalRoleCode === role;
        })[0];
        
        localStorage.setItem('cis_selected_rolecode', item73.roleCode);
        localStorage.setItem('cis_selected_rolename', item73.roleName);
        localStorage.setItem('cis_selected_provincecode', item73.provinceCode);
        localStorage.setItem('cis_selected_provincename', item73.provinceName);
        localStorage.setItem('cis_selected_sectioncode', item73.sectionCode);
        localStorage.setItem('cis_selected_sectionname', item73.sectionName);
        localStorage.setItem('cis_selected_internalrolecode', item73.internalRoleCode);
        
        this.apiService.getMenuOfUser(localStorage.getItem('cis_selected_rolecode')).subscribe(data => {
            const memulistobj = JSON.parse((<any>data)._body);
            this.globals.setMenu(memulistobj.Menu.MainItem);
        }, error => {
            console.log(error);
        });

        this.apiService.getDashboardRights(item73.roleCode).subscribe(data => {
            const dashboardJson = data.json();
            this.globals.setDashboard(dashboardJson);
          }, error => {
            console.log(error);
          });
        this.router.navigate(['/cis']);
    }

    consolidateInternalRoles() {
        this.roleList = [];
        let tRole = new Role();

        this.userInfo.internalUserRoles.forEach((externalRole) => {
            if (externalRole.isActive == 'Y') {
                let tRole = new Role();
                tRole.roleCode = externalRole.roleCode;
                tRole.roleName = externalRole.roleName;
                tRole.sectionCode = externalRole.sectionCode;
                tRole.sectionName = externalRole.sectionName;
                tRole.provinceCode = externalRole.provinceCode;
                tRole.provinceName = externalRole.provinceName;
                tRole.internalRoleCode = externalRole.internalRoleCode;
                this.roleList.push(tRole);
                if (localStorage.getItem('cis_selected_internalrolecode').length > 0) {
                    console.log('cis_selected_internalrolecode', localStorage.getItem('cis_selected_internalrolecode'));
                    this.roleForm.controls['globalrolecode'].setValue(localStorage.getItem('cis_selected_internalrolecode'));
                }
                else {
                    this.roleForm.controls['globalrolecode'].setValue(this.roleList[0].internalRoleCode);
                }
            }
        });

        // console.log('roleList', this.roleList);
    }

    public closeSubMenus() {
        /* when using <az-sidebar> instead of <az-menu> uncomment this line */
        // this._sidebarService.closeAllSubMenus();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    }

    logout() {
        localStorage.clear();
        this.logoutUser();
        this.router.navigate(['/login']);
    }

    logoutUser() {
        const options = this.toastrService.toastrConfig;
        const opt = JSON.parse(JSON.stringify(options));
        this.spinner.show();
    
          const input = {
            usercode: this.userInfo.userCode
          };
          this.serviceCall.logoutUser(input).subscribe(data => {
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          });
      
      }
}

export class Role {
    roleCode: any;
    roleName: any;
    sectionCode: any;
    sectionName: any;
    provinceCode: any;
    provinceName: any;
    internalRoleCode: any;
}