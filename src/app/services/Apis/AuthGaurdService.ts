import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class AuthGuardService implements CanActivate {

    userInfo: any;
    internalUserRoles: any;
  
    constructor(private spinner: NgxSpinnerService, private router: Router, private serviceCall: RestcallService) {
        // this.loadUser();
    }

    ngOnInit() {
    }

    loadUser() {
        if (localStorage.getItem('cis_loggedin') == 'yes' &&
            localStorage.getItem('cis_email').length > 0 &&
            localStorage.getItem('cis_usercode').length > 0) {
            this.getUserInfo(localStorage.getItem('cis_email'));
            this.router.navigate(['/cis']);
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (localStorage.getItem('cis_token') == null || localStorage.getItem('cis_username') == null) {
        //     localStorage.setItem('cis_redirect', state.url);
        //     this.router.navigate(['login']);
        //     return false;
        // }

        if (localStorage.getItem('cis_loggedin') == 'yes' &&
            localStorage.getItem('cis_email').length > 0 &&
            localStorage.getItem('cis_usercode').length > 0) {
            // this.getUserInfo(localStorage.getItem('cis_email'));
            // this.router.navigate(['/uam']);
        }
        else {
            localStorage.setItem('cis_redirect', state.url);
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }

    getUserInfo(email) {

        this.serviceCall.getUserInfoByEmail(email).subscribe(data => {
            const response = data.json();
            localStorage.setItem('cis_userinfo', JSON.stringify(response));
            localStorage.setItem('cis_usercode', response.userCode);
            localStorage.setItem('cis_username', response.userName);
            localStorage.setItem('cis_email', response.userName);
            localStorage.setItem('cis_userid', response.userId);
            localStorage.setItem('cis_usertype', response.userTypeName);
            localStorage.setItem('cis_loggedin', 'yes');
            if (response.userTypeName == 'EXTERNAL') {
                localStorage.setItem('cis_selected_rolecode', response.externalUserRoles[0].userRoleCode);
                localStorage.setItem('cis_selected_rolename', response.externalUserRoles[0].userRoleName);
                localStorage.setItem('cis_selected_provincecode', response.externalUserRoles[0].userProvinceCode);
                localStorage.setItem('cis_selected_provincename', response.externalUserRoles[0].userProvinceName);
                localStorage.setItem('cis_selected_externalrolecode', response.externalUserRoles[0].externalRoleCode);
            }
            else if (response.userTypeName == 'INTERNAL') {
                this.getInternalUserRolesByEmail(response.userName);
            }

            this.spinner.hide();
            // this.router.navigate(['/uam']);
        },
            error => {
                console.log('error:', error.status);
                this.spinner.hide();
            });
    }
    getInternalUserRolesByEmail(email) {
        this.spinner.show();
        this.serviceCall.getInternalUserRolesByEmail(email, 'Y').subscribe(data => {
            this.internalUserRoles = data.json();
            if (localStorage.getItem('cis_selected_internalrolecode').length > 0) {
            }
            else {
                localStorage.setItem('cis_internalrolesinfo', JSON.stringify(this.internalUserRoles));
                if (this.internalUserRoles.length > 0) {
                    localStorage.setItem('cis_selected_roleid', this.internalUserRoles[0].userRoleId);
                    localStorage.setItem('cis_selected_rolecode', this.internalUserRoles[0].roleCode);
                    localStorage.setItem('cis_selected_rolename', this.internalUserRoles[0].roleName);
                    localStorage.setItem('cis_selected_provincecode', this.internalUserRoles[0].provinceCode);
                    localStorage.setItem('cis_selected_provincename', this.internalUserRoles[0].provinceName);
                    localStorage.setItem('cis_selected_sectioncode', this.internalUserRoles[0].sectionCode);
                    localStorage.setItem('cis_selected_sectionname', this.internalUserRoles[0].sectionName);
                    localStorage.setItem('cis_selected_internalrolecode', this.internalUserRoles[0].internalRoleCode);
                }
            }
            
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
        });
    }

}