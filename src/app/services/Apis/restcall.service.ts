import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { timeout, catchError } from 'rxjs/operators';
import { Headers, Http, HttpModule, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ApiResponse } from './ApiResponse';
import { saveAs } from 'file-saver';
import { time } from 'd3';
import { TimeoutError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare const jQuery: any;

@Injectable()
export class RestcallService {
  username: any;
  password: any;
  headers: any;
  headerDetail: any;
  options: any;
  opt: any;
  
  public types = ['success', 'error', 'info', 'warning'];
  constructor(private _http: Http, private httpClient: HttpClient) {
   }

  checkADUserExists(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'LOGIN');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', data.username);
    return this._http.post(environment.uamBaseUrl + environment.checkADUserExists, data, { headers: this.headers })
      // .pipe(timeout(2000), 
      //   catchError((error) => { 
      //     this.toastrService[this.types[1]]('timeout error', 'Login Failed', this.opt); 
      //     return null;
      //   }))
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getExternalRoles(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_EXTERNAL_ROLES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getExternalRoles, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getInternalRoles(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_INTERNAL_ROLES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getInternalRoles, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getOrganizationTypes(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ORG_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getOrganizationTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getSectors(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_SECTORS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getSectors, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getCommunicationsTypes(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_COMMUNICATION_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getCommunicationTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getProvinces(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_PROVINCES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getProvinces, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getSecurityQuestions(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_SECURITY_QUESTIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getSecurityQuestions, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getUserInfoByEmail(email): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_USER_INFO_BY_EMAIL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getUserInfoByEmail + email, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  registerExternalUser(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'REGISTER_EXTERNAL_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.registerExternalUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  checkUserExist(email): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CHECK_USER_EXIST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.checkUserExist + email, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  validatePlsUser(plscode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'VALIDATE_PLS_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.validatePlsUser + plscode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  registerInternalUser(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'REGISTER_INTERNAL_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.registerInternalUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getSections(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_SECTIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getSections, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  registerInternalUserRole(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'REGISTER_INTERNAL_USER_ROLE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.registerInternalUserRole, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  uploadSignedUserAccess(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.uamBaseUrl + environment.uploadSignedUserAccess, data, { headers: null });
  }

  deleteInternalUserRole(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_INTERNAL_USER_ROLE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deleteInternalUserRole, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  submitInternalUserForApproval(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SUBMIT_INTERNAL_USER_FOR_APPROVAL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.submitInternalUserForApproval, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getInternalUserRolesByEmail(email, active): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_INTERNAL_USER_ROLES_BY_EMAIL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getInternalUserRolesByEmail + email + '&isActive=' + active, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  login(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'LOGIN');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', data.username);
    return this._http.post(environment.uamBaseUrl + environment.login, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  updatePassword(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_PASSWORD');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.updatePassword, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  updateSecurityQuestions(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_SECURITY_QUESTIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.updateSecurityQuestions, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllInternalUsers() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_INTERNAL_ROLES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getAllInternalUsers, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllExternalUsers() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_EXTERNAL_ROLES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getAllExternalUsers, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllInternalUsersByProvinceCode(code, rolecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_INTERNAL_USERS_BY_PROVINCE_CODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getAllInternalUsersByProvinceCode + code + '&roleCode=' + rolecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllExternalUsersByProvinceCode(code, rolecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_EXTERNAL_USERS_BY_PROVINCE_CODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getAllExternalUsersByProvinceCode + code + '&roleCode=' + rolecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deactivateUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DEACTIVATE_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deactivateUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deactivateUserRole(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DEACTIVATE_USER_ROLE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deactivateUserRole, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteExternalUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_EXTERNAL_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deleteExternalUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getMyAssistants(code) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_MY_ASSISTANTS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getMyAssistants + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getMySurveyors(code) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_MY_SURVEYORS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getMySurveyors + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteAssistant(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_ASSISTANT');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deleteAssistant, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  updateExternalUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_EXTERNAL_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.updateExternalUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllPlsUsers() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_PLS_USERS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getAllPlsUsers, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  updateInternalUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_INTERNAL_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.updateInternalUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createSector(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_SECTOR');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.createSector, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createCommType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_COMM_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.createCommType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createOrgType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_ORG_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.createOrgType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createSection(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_SECTION');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.createSection, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus, username, fromdate, todate) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_TASKS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    //let params = '?taskStatus=' + status + '&taskType=' + type + '&taskAllProvinceCode=' + provincecode + '&taskAllOCSectionCode=' + sectioncode + '&taskAllOCRoleCode=' + rolecode + '&omitTaskStatus=' + omitTaskStatus;
    let params = '?taskStatus=' + status + '&taskType=' + type + '&taskAllProvinceCode=' + provincecode + '&taskAllOCSectionCode=' + sectioncode + '&taskAllOCRoleCode=' + '&omitTaskStatus=' + omitTaskStatus + '&userName=' + username  + '&fromDate=' + fromdate  + '&toDate=' + todate;
    return this._http.get(environment.uamBaseUrl + environment.getAllTasks + params, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  updateAccessRights(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_ACCESS_RIGHTS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.updateAccessRights, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getUserSecurityQuestions(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_USER_SECURITY_QUESTIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.getUserSecurityQuestions, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  checkUserSecurityQuestions(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CHECK_USER_SECURITY_QUESTIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.checkUserSecurityQuestions, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  resetPassword(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'RESET_PASSWORD');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.resetPassword, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRolesBySectionsAndProvince(sectioncode, provincecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ROLES_BY_SECTIONS_AND_PROVINCE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getRolesBySectionsAndProvince + sectioncode + '&provinceCode=' + provincecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  registerPlsUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'REGISTER_PLS_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.registerPlsUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  updatePlsUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_PLS_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.updatePlsUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  registerNewExternalRole(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'REGISTER_NEW_EXTERNAL_ROLE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.registerNewExternalRole, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getExternalRolesByRoleCode(rolecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_EXTERNAL_ROLES_BY_ROLE_CODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getExternalRolesByRoleCode + rolecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getMenuOfUser(rolecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_MENU_OF_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getMenuOfUser + rolecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createTask(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_TASK');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.createTask, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  closeTask(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CLOSE_TASK');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.closeTask, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  approveRejectUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'APPROVE_REJECT_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.approveRejectUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  downloadSignedUserAccess(data) {
    return this._http.post(environment.uamBaseUrl + environment.downloadSignedUserAccess, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Signed_Access_Doc.pdf';
          saveAs(blob, filename);
        }
      );
  }

  getInternalRolesByRoleCode(rolecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_EXTERNAL_ROLES_BY_ROLE_CODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getInternalRolesByRoleCode + rolecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getDashboardRights(rolecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_DASHBOARD_RIGHTS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getDashboardRights + rolecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  setDashboardRights(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SET_DASHBOARD_RIGHTS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.setDashboardRights, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getUserRegisteredCounts() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_USER_REGISTERED_COUNTS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getUserRegisteredCounts, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  userLogReport(data): any {
    return this._http.post(environment.uamBaseUrl + environment.userLogReport, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          return new Blob([res.blob()], { type: 'application/pdf' });
        }
      );
  }

  userLogReport1(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.uamBaseUrl + environment.userLogReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  userSummaryReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.uamBaseUrl + environment.userSummaryReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  quarterlyUpdatedUserReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.uamBaseUrl + environment.quarterlyUpdatedUserReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  quarterlyDeletedUserReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.uamBaseUrl + environment.quarterlyDeletedUserReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  issueLogUpdateStatus(id, data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'ISSUE_LOG_UPDATE_STATUS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.issueLogUpdateStatus + id, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getIssueLogStatus(id) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ISSUE_LOG_STATUS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getIssueLogStatus + '/' + id, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getAllIssueLogs() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_ALL_ISSUE_LOGS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getAllIssueLogs, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  saveIssueLog(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SAVE_ISSUE_LOG');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.saveIssueLog, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  uploadDocumentationForExternalUsers(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.uamBaseUrl + environment.uploadDocumentationForExternalUsers, data, { headers: null });
  }

  downloadDocumentation(data) {
    return this._http.post(environment.uamBaseUrl + environment.downloadDocumentation, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Registration_Docs.zip';
          saveAs(blob, filename);
        }
      );
  }

  getPpNumber(ppno) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CHECK_USER_BY_PPNO');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getPpNumber + ppno, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getMyIssues(username) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_MY_ISSUES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getMyIssues + username, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getNotifications() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_NOTIFICATIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getNotifications, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  saveNotification(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SAVE_ISSUE_LOG');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.saveNotification, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getNotificationTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_NOTIFICATION_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getNotificationUserTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  // IM

  getCostCategories() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_COST_CATEGORIES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getCostCategories, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getPropertyValueByName(propName) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_PROPERTYVALUE_BY_NAME');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getPropertyValueByName + propName, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getSubCostCategoriesByCostCategoryCode(code) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_SUBCATEGORIES_BY_CATEGORYCODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getSubCostCategoriesByCostCategoryCode + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  sendEmailWithInvoice(data, reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEND_EMAIL_WITH_INVOICE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.sendEmailWithInvoice + reqcode, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  setPropertyValueByName(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SET_PROPERTY_BY_NAME');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.setPropertyValueByName, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createCategory(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_CATEGORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createCategory, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createSubCategory(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_SUBCATEGORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createSubCategory, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  updateCostSubCategory(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_SUBCATEGORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.updateCostSubCategory, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createRequestKind(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_REQUEST_KIND');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createRequestKind, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createRequestType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_REQUEST_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createRequestType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createMediaType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_MEDIA_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createMediaType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createFormatType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_FORMAT_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createFormatType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createDeliveryMethod(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_DELIVERY_METHOD');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createDeliveryMethod, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createGazzetteType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_GAZZETTE_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createGazzetteType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createRequest(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_REQUEST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createRequest, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  createRequestItem(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_REQUEST_ITEM');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createRequestItem, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  deleteRequestItem(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_REQUEST_ITEM');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deleteRequestItem, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  uploadPaymentConfirmation(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.imBaseUrl + environment.uploadPaymentConfirmation, data, { headers: null });
  }
  generateInvoice(data, reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GENERATE_INVOICE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.generateInvoice + reqcode, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  // downloadPaymentConfirmation(data) {
  //   this.headers = new Headers();
  //   this.headers.append('Content-Type', 'application/json');
  //   this.headers.append('Accept', 'application/json');
  //   this.headers.append('operation', 'DOWNLOAD_PAYMENT_CONFIRMATION');
  //   this.headers.append('usercode', localStorage.getItem('cis_usercode'));
  //   this.headers.append('username', localStorage.getItem('cis_username'));
  //   return this._http.post(environment.imBaseUrl + environment.downloadPaymentConfirmation, data, { headers: this.headers })
  //     .map((res: Response) => res)
  //     .catch((error: any) => ErrorObservable.create(error));
  // }

  downloadPop(data) {
    return this._http.post(environment.imBaseUrl + environment.downloadPop, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Payment Confirmation.pdf';
          saveAs(blob, filename);
        }
      );
  }

  downloadInvoice(data) {
    return this._http.post(environment.imBaseUrl + environment.downloadInvoice, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Invoice.pdf';
          saveAs(blob, filename);
        }
      );
  }

  getRequestsOfUser(provcode, usercode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUESTS_BY_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestsOfUser + provcode + '&userCode=' + usercode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getAllRequests(provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUESTS_BY_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestsOfUser + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getRequestItemsOfRequest() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUEST_ITEMS_OF_REQUEST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestItemsOfRequest, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getCategories() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_CATEGORIES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getCategories, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getSubCategiesByCategoryCode() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_SUBCATEGORIES_BY_CATEGORYCODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getSubCategiesByCategoryCode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getRequestTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUEST_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getRequestKinds() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUEST_KINDS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestKinds, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getMediaTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_MEDIA_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getMediaTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getFormatTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_FORMAT_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getFormatTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getDeliveryMethods() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_DELIVERY_METHODS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getDeliveryMethods, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  getGazzetteTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_GAZZETTE_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getGazzetteTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  //search
  searchByNumberProvinceCode(sgno, provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_BY_SGNUMBER_PROVINCECODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchByNumberProvinceCode + sgno + '&provinceCode=' + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchByCompilationNumberProvinceCode(compno, provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_BY_COMPILNO_PROVINCECODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchByCompilationNumberProvinceCode + compno + '&provinceCode=' + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchByFilingNumberProvinceCode(filno, provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_BY_FILINGNO_PROVINCECODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchByFilingNumberProvinceCode + filno + '&provinceCode=' + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchBySurveySGNumberProvinceCode(sursgno, provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_BY_SURVEYSGNO_PROVINCECODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchBySurveySGNumberProvinceCode + sursgno + '&provinceCode=' + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchByDeedsNumberProvinceCode(deedsno, provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_BY_DEEDSNO_PROVINCECODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchByDeedsNumberProvinceCode + deedsno + '&provinceCode=' + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchByLeaseNumberProvinceCode(leasno, provcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_BY_LEASENO_PROVINCECODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchByLeaseNumberProvinceCode + leasno + '&provinceCode=' + provcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchParcelByFarm(farm, provinceCode, majorRegion, farmNumber, portion, farmName) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_PARCEL_BY_FARM');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchParcelByFarm + provinceCode +
      '&parcelType=' + farm +
      '&registrationDivision=' + majorRegion +
      '&farmNumber=' + farmNumber +
      '&portionNumber=' + portion, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchParcelByERF(erf, provinceCode, minorRegion, erfNumber, portionNumber) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_PARCEL_BY_ERF');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));

    // provinceCode=3&parcelType=HOLDING&townShipName=CYNTHIA VALE AGRICULTURAL HOLDINGS&erfNumber=00000019&portionNumber=00001

    return this._http.get(environment.imSearchBaseUrl + environment.searchParcelByERF + provinceCode +
      '&parcelType=' + erf +
      '&townShipName=' + minorRegion +
      '&erfNumber=' + erfNumber +
      '&portionNumber=' + portionNumber, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchParcelByHoldings(holding, provinceCode, minorRegion, holdingNumber, portionNumber) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_PARCEL_BY_HOLDINGS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));

    // provinceCode=1&parcelType=ERF/LOT&townShipName=THABAZIMBI&holdingNumber=00001454&portionNumber=00000

    return this._http.get(environment.imSearchBaseUrl + environment.searchParcelByHoldings + provinceCode +
      '&parcelType=' + holding +
      '&townShipName=' + minorRegion +
      '&holdingNumber=' + holdingNumber +
      '&portionNumber=' + portionNumber, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchParcelByLPI(provinceCode, lpi) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_PARCEL_BY_LPI');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchParcelByLPI + provinceCode +
      '&lpiCode=' + lpi, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchSectionalPortionByTitle(provinceCode, scNumber, scName, sgNumber, deedsRegistrationNumber) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_SECTIONAL_TITLE_PORTION_BY_SCHEME');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchSectionalPortionByTitle + scNumber +
      '&provinceCode=' + provinceCode +
      '&deedsRegistrationNumber=' + deedsRegistrationNumber + 
      '&sgNumber=' + sgNumber + 
      '&schemeName=' + scName, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchSectionalPortionByFarm(provinceCode, registrationDivision, farmNumber, portionNumber) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_SECTIONAL_TITLE_PORTION_BY_FARM');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchSectionalPortionByFarm + registrationDivision +
      '&farmNumber=' + farmNumber +
      '&portionNumber=' + portionNumber +
      '&sprovinceCode=' + provinceCode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  searchSectionalPortionByERF(provinceCode, townShipName, erfNumber, portionNumber) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEARCH_SECTIONAL_TITLE_PORTION_BY_ERF');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.searchSectionalPortionByERF + townShipName +
      '&erfNumber=' + erfNumber +
      '&provinceCode=' + provinceCode +
      '&portionNumber=' + portionNumber, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  // getOfficersOfSection(provcode, sectioncode) {
  //   this.headers = new Headers();
  //   this.headers.append('Content-Type', 'application/json');
  //   this.headers.append('Accept', 'application/json');
  //   this.headers.append('operation', 'GET_OFFICERS_OF_SECTION');
  //   this.headers.append('usercode', localStorage.getItem('cis_usercode'));
  //   this.headers.append('username', localStorage.getItem('cis_username'));
  //   return this._http.get(environment.imSearchBaseUrl + environment.searchParcelByLPI + provcode +
  //     '&lpi=' + sectioncode, { headers: this.headers })
  //     .map((res: Response) => res)
  //     .catch((error: any) => ErrorObservable.create(error));
  // }

  deactivateSubCategory(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DEACTIVATE_COST_SUBCATEGORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deactivateSubCategory, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getTaskTargetFlows(taskId) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_TARGET_FLOWS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getTaskTargetFlows + taskId, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestByRequestCode(reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUEST_BY_CODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestByRequestCode + reqcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getOfficersOfMySection(provcode, seccode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUEST_BY_CODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getOfficersOfMySection + provcode + '&sectionCode=' + seccode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  processUserState(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'PROCESS_USER_STATE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.processUserState, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getUserInfoLite(email) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_USERINFO_LITE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getUserInfoLite + email, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getBulkRequestSubTypesByTypeCode(typecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_BULK_REQUEST_SUBTYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getBulkRequestSubTypesByTypeCode + typecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getBulkRequestTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_BULK_REQUEST_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getBulkRequestTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createBulkRequestType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_BULK_REQUEST_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createBulkRequestType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createBulkSubType(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_BULK_REQUEST_SUBTYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createBulkSubType, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  uploadDispatchDocument(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.imBaseUrl + environment.uploadDispatchDocument, data, { headers: null });
  }

  deleteDispatchDocument(docname, data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_DISPATCH_DOCUMENT');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deleteDispatchDocument + docname, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getDispatchDocsList(reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_DISPATCH_DOCS_LIST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getDispatchDocsList + reqcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getTasksLifeCycle(reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_TASKS_LIFECYCLE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getTasksLifeCycle + reqcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  downloadDispatchDocuments(data) {
    return this._http.post(environment.imBaseUrl + environment.downloadDispatchDocuments, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Dispatched Docs.zip';
          saveAs(blob, filename);
        }
      );
  }

  uploadExternalUserRequestDocument(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.imBaseUrl + environment.uploadExternalUserRequestDocument, data, { headers: null });
  }

  deleteExternalUserRequestDocument(docname, data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_EXTERNAL_USER_REQUEST_DOCUMENT');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deleteExternalUserRequestDocument + docname, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getExternalUserRequestDocsList(reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_EXTERNAL_USER_REQUEST_SUBMIT_DOCS_LIST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getExternalUserRequestDocsList + reqcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestStatus(reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_TRACKING_STATUS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestStatus + reqcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestsPaidInfoByProvince(provcode, period) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUESTS_PAID_INFO_BY_PROVINCE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestsPaidInfoByProvince + provcode +
      '&period=' + period, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createBusinessRuleHistory(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_BUSINESS_RULE_HISTORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imReportBaseUrl + environment.createBusinessRuleHistory, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getProductivityReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.imReportBaseUrl + environment.productionReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  getNotificationReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.imReportBaseUrl + environment.notificationReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  getOverriddenBusinessRulesReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.imReportBaseUrl + environment.overriddenBusinessRulesReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  getUserProductivityReport(data): any {
    const options = { responseType: ResponseContentType.Blob };
    return this._http.post(environment.imReportBaseUrl + environment.userProductionReport, data, options).map(
      (res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }

  dispatchDocumentSendMail(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DISPATCH_DOCUMENT_SEND_EMAIL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.dispatchDocumentSendMail, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
  
  deactivateInternalUserRole(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DEACTIVATE_INTERNAL_USER_ROLE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deactivateUserRole, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }


  downloadNotificationDocs(data) {
    return this._http.post(environment.uamBaseUrl + environment.downloadNotificationDocs, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'Notification Docs.zip';
          saveAs(blob, filename);
        }
      );
  }

  uploadNotificationDoc(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.uamBaseUrl + environment.uploadNotificationDoc, data, { headers: null });
  }

  deleteNotificationDoc(docname, data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_NOTIFICATION_DOC');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deleteNotificationDoc + docname, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getNotificationDocsList(reqcode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_NOTIFICATION_DOCS_LIST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getNotificationDocsList + reqcode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  uploadUserPaymentConfirmation(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this.httpClient.post(environment.imBaseUrl + environment.uploadUserPaymentConfirmation, data, {
      reportProgress: true,
      observe: 'events' });
    // return this._http.post(environment.imBaseUrl + environment.uploadUserPaymentConfirmation, data, { headers: null });
  }

  getNotificationSubTypes() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_TRACKING_STATUS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getNotificationSubTypes, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  downloadDocuments(data) {
    return this._http.post(environment.uamBaseUrl + environment.downloadDocuments, data, { responseType: ResponseContentType.Blob })
      .subscribe(
        (res: any) => {
          let blob = res.blob();
          let filename = 'docs.zip';
          saveAs(blob, filename);
        }
      );
  }

  getDocumentList(docstorecode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_DOCSTORE_LIST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.uamBaseUrl + environment.getDocumentList + docstorecode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteDocument(docname, data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_DOCSTORE_DOCUMENT');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.deleteDocument + docname, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  uploadDocumentFile(data): any {
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'multipart/form-data');
    return this._http.post(environment.uamBaseUrl + environment.uploadDocumentFile, data, { headers: null });
  }

  getUamDesignations(): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_DESIGNATIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getUamDesignations, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  createUamDesignation(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CREATE_DESIGNATION');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.createUamDesignation, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteUamDesignation(designationCode): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_DESIGNATION');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.deleteUamDesignation + designationCode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteDeliveryMethod(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_DELIVERY_METHOD');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deleteDeliveryMethod, data, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  logoutUser(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'LOGOUT_USER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', data.username);
    return this._http.post(environment.uamBaseUrl + environment.logoutUser, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getCostOfCategory(subCategoryName): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_COST_OF_CATEGORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getCostOfCategory + subCategoryName, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  adUserLoginCheck(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'LOGIN_CHECK');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', data.username);
    return this._http.post(environment.uamBaseUrl + environment.adUserLoginCheck, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestItemsFilesSendEmail(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUESTITEMS_SENDEMAIL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', data.username);
    return this._http.post(environment.imBaseUrl + environment.getRequestItemsFilesSendEmail, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestItemsFilesSendFTP(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUESTITEMS_FTP_SENDEMAIL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', data.username);
    return this._http.post(environment.imBaseUrl + environment.getRequestItemsFilesSendFTP, data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRegistrationDivision(code): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REGISTRATION_DIVISIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.getRegistrationDivision + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getTownShipName(code): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_TOWNSHIP_NAMES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.getTownShipName + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getPortionRegistrationDivision(code): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_PORTION_REGISTRATION_DIVISIONS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.getPortionRegistrationDivision + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getPortionTownShipName(code): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_PORTION_TOWNSHIP_NAMES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.getPortionTownShipName + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteFormatType(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_FORMAT_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deleteFormatType, data, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  deactivateCategory(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DEACTIVATE_COST_CATEGORY');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.deactivateCategory, data, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  getInvoiceAmountDetails(provinceCode, fromDate, toDate) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_INVOICE_AMOUNTS');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imSearchBaseUrl + environment.getInvoiceAmountDetails + provinceCode + '&fromDate=' + fromDate + '&toDate=' + toDate, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  sendPopToCashier(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEND_POP_TO_CASHIER');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.sendPopToCashier, data, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  setRequestTrackingNo(trackingNo, requestCode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SET_TRACKING_NO');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.put(environment.imBaseUrl + environment.setRequestTrackingNo + trackingNo + '&requestCode=' + requestCode, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestTrackingNo(requestCode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_TRACKING_NO');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestTrackingNo + requestCode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getRequestDocuments(requestCode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_REQUEST_DOCS_LIST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getRequestDocuments + requestCode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  cancelRequest(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'CANCEL_REQUEST');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.imBaseUrl + environment.cancelRequest, data, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  updateEmailInfoById(data) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'UPDATE_EMAIL_CONTENT');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.put(environment.imBaseUrl + environment.updateEmailInfoById , data, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  getEmailInfo() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_EMAIL_TYPES');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getEmailInfo, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getEmailInfoById(code) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_EMAIL_TYPE_BY_ID');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getEmailInfoById + code, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  getInternalUserData(provinceCode, sectionCode) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'GET_INTERNAL_USER_DATA');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.get(environment.imBaseUrl + environment.getInternalUserData + provinceCode + '&sectionCode=' + sectionCode, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  sendPasswordToEmail(email) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'SEND_PASSWORD_TO_EMAIL');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.post(environment.uamBaseUrl + environment.sendPasswordToEmail + email, null, { headers: this.headers })
    .map((res: Response) => res)
    .catch((error: any) => ErrorObservable.create(error));
  }

  deleteCommunicationMode(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_COMMUNICATION_MODE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.delete(environment.uamBaseUrl + environment.deleteCommunicationType + data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteSector(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_SECTOR');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.delete(environment.uamBaseUrl + environment.deleteSector + data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }

  deleteOrganizationType(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('operation', 'DELETE_ORGANIZATION_TYPE');
    this.headers.append('usercode', localStorage.getItem('cis_usercode'));
    this.headers.append('username', localStorage.getItem('cis_username'));
    return this._http.delete(environment.uamBaseUrl + environment.deleteOrgnization + data, { headers: this.headers })
      .map((res: Response) => res)
      .catch((error: any) => ErrorObservable.create(error));
  }
}



/* ---------------- GET
 getInternalUsersOfProvince() {
    console.log('getiontnerla');
    this.spinner.show();
    this.serviceCall.getAllInternalUsersByProvinceCode(this.inProvinceCode).subscribe((data: any) => {
      this.internalUsers = data.json();
      this.fullInternalUsers = this.internalUsers;
      this.itemResourceIn = new DataTableResource(this.internalUsers);
      this.itemResourceIn.query({ offset: 0, limit: 10 }).then(quotData => this.internalUsers = quotData);
      this.itemResourceIn.count().then(count => this.itemCountIn = count);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }
*/

/* -------------------- POST
 saveProfile() {
    this.spinner.show();
    const options = this.toastrService.toastrConfig;
    const opt = JSON.parse(JSON.stringify(options));

    if (this.personalForm.valid) {
      const updateExternalUserInput = {
        userCode: this.selectUser.userCode,
        firstName: this.personalForm.get('firstname').value,
        userTypeCode: 'UST002',
        userTypeName: 'EXTERNAL',
        title: this.personalForm.get('salutation').value,
        userName: this.selectUser.userName,
        surname: this.personalForm.get('lastname').value,
        mobileNo: this.personalForm.get('mobile').value,
        telephoneNo: this.personalForm.get('telephone').value,
        externaluser: {
          organizationtypecode: this.personalForm.get('orgtype').value.split('=')[0],
          organizationtypename: this.personalForm.get('orgtype').value.split('=')[1],
          sectorCode: this.personalForm.get('sector').value.split('=')[0],
          sectorName: this.personalForm.get('sector').value.split('=')[1],
          postaladdressline1: this.personalForm.get('addressline1').value,
          postaladdressline2: this.personalForm.get('addressline2').value,
          postaladdressline3: this.personalForm.get('addressline3').value,
          postalcode: this.personalForm.get('zipcode').value,
          communicationmodetypecode: this.personalForm.get('communication').value.split('=')[0],
          communicationmodetypename: this.personalForm.get('communication').value.split('=')[1],
          subscribenotifications: this.personalForm.get('information').value == true ? 'Y' : 'N',
          subscribeevents: this.personalForm.get('events').value == true ? 'Y' : 'N',
          subscribenews: this.personalForm.get('news').value == true ? 'Y' : 'N'
        }
      };
      this.serviceCall.updateExternalUser(updateExternalUserInput).subscribe(data => {
        document.getElementById('saveProfilePopup').click();
        this.toastrService[this.types[0]]('Successfully Updated', 'Done', opt);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
    }
    else {
      this.hasError = true;
      this.spinner.hide();
    }
  }
*/