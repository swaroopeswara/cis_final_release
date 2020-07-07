import { InboxComponent } from './inbox/inbox.component';
import { GeneralConfigComponent } from './general-config/general-config.component';
import { IssueLogsComponent } from './issue-logs/issue-logs.component';
import { TasksComponent } from './tasks/tasks.component';
import { PlsUsersComponent } from './pls-users/pls-users.component';
import { UpdateTypesComponent } from './update-types/update-types.component';
import { MySurveyorsComponent } from './my-surveyors/my-surveyors.component';
import { MyAssistantComponent } from './my-assistants/my-assistants.component';
import { UamReportsComponent } from './uam-reports/uam-reports.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { DataTableModule } from 'angular5-data-table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RolePermissionsComponent } from './roles-permissions/roles-permissions.component';
import { MainComponent } from './main/main.component';
import { MainListComponent } from './main/main-list/main-list.component';
import { MyQueriesComponent } from './my-queries/my-queries.component';
import { NewNotificationComponent } from './new-notification/new-notification.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LogQueryComponent } from './log-query/log-query.component';
import { UamEmailComponent } from './uam-email/uam-email.component';
export const routes1 = [
  // { path: '', component: RfqComponent,breadcrumb:{title: 'RFQ'},  children: [
  //     { path: '', redirectTo: 'rfq', pathMatch: 'full' },       
  //   ]
  // },
  { path:'', redirectTo:'dashboard', pathMatch:'full' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' }  },
  // { path: '', component: ProfileComponent, breadcrumb:{title: 'RFQ2'} }
];

export const routes = [
      { path:'', redirectTo:'dashboard', pathMatch:'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' }  },
      { path: 'mail', loadChildren: './mail/mail.module#MailModule', data: { breadcrumb: 'Main' } },
      // { path: 'form-elements', loadChildren: './form-elements/form-elements.module#FormElementsModule', data: { breadcrumb: 'Form Elements' } },
      { path: 'all-users', component: AllUsersComponent, data: { breadcrumb: 'All Users' }},
      { path: 'uam-reports', component: UamReportsComponent, data: { breadcrumb: 'UAM Reports' }},
      { path: 'my-assistants', component: MyAssistantComponent, data: { breadcrumb: 'My Assistants' }},
      { path: 'my-surveyors', component: MySurveyorsComponent, data: { breadcrumb: 'My Surveyors' }},
      { path: 'pls-users', component: PlsUsersComponent, data: { breadcrumb: 'PLS Users' }},
      { path: 'update-types', component: UpdateTypesComponent, data: { breadcrumb: 'Update Types' }},
      { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Profile' }},
      { path: 'tasks', component: TasksComponent, data: { breadcrumb: 'Tasks' }},
      { path: 'roles-permissions', component: RolePermissionsComponent, data: { breadcrumb: 'Permissions' }},
      { path: 'uam-email', component: UamEmailComponent, data: { breadcrumb: 'Uam Email' }},
      { path: 'inbox', component: TasksComponent, data: { breadcrumb: 'Inbox' }},
      { path: 'general-config', component: GeneralConfigComponent, data: { breadcrumb: 'General Config' }},
      { path: 'issue-log', component: IssueLogsComponent, data: { breadcrumb: 'Issue Logs' }},
      { path: 'log-query', component: LogQueryComponent, data: { breadcrumb: 'Log Query' }},
      { path: 'my-queries', component: MyQueriesComponent, data: { breadcrumb: 'My Queries ' }},
      { path: 'notifications', component: NotificationsComponent, data: { breadcrumb: 'Notifications ' }},
      { path: 'new-notification', component: NewNotificationComponent, data: { breadcrumb: 'New Notification ' }}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    DirectivesModule, 
    RouterModule.forChild(routes),
    NgxDatatableModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    DataTableModule.forRoot()
  ],
  declarations: [
    ProfileComponent,
    AllUsersComponent,
    UamReportsComponent,
    IssueLogsComponent,
    GeneralConfigComponent,
    UamEmailComponent,
    InboxComponent,
    MainComponent,
    MainListComponent,
    TasksComponent,
    RolePermissionsComponent,
    UpdateTypesComponent,
    PlsUsersComponent,
    MySurveyorsComponent,
    MyQueriesComponent,
    NewNotificationComponent,
    NotificationsComponent,
    MyAssistantComponent,
    LogQueryComponent

    // AdDirective
  ],
  providers: [
  ],
  entryComponents: [ ],
  exports: [
    // AddLoadComponent,
  ]
})
export class UamModule { }
