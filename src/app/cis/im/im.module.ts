import { ImConfigComponent } from './im-config/im-config.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UpdateTypesComponent } from './update-types/update-types.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SearchRequestsComponent } from './search-requests/search-requests.component';
import { DataTableModule } from 'angular5-data-table';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { ImReportsComponent } from './im-reports/im-reports.component';

export const routes = [
  { path: '', redirectTo: 'search-requests', pathMatch: 'full'},
  { path: 'search-requests', component: SearchRequestsComponent, data: { breadcrumb: 'Search Requests' } },
  { path: 'update-types', component: UpdateTypesComponent, data: { breadcrumb: 'Update Types' } },
  { path: 'im-config', component: ImConfigComponent, data: { breadcrumb: 'Config' } },
  { path: 'im-reports', component: ImReportsComponent, data: { breadcrumb: 'Reports' } },
  { path: 'my-requests', component: MyRequestsComponent, data: { breadcrumb: 'Requests' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    DirectivesModule,    
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    NgxDatatableModule,
    DataTableModule.forRoot()
  ],
  declarations: [
    UpdateTypesComponent,
    ImConfigComponent,
    SearchRequestsComponent,
    MyRequestsComponent,
    ImReportsComponent
  ]
})
export class ImModule { }
