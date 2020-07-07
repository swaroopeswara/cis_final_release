import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {MessagesService} from './messages.service';
import { RestcallService } from 'src/app/services/Apis/restcall.service';
import { Globals } from 'src/app/services/Apis/globals';
import { DateComComponent } from 'src/app/public/datecom/datecom.component';

@Component({
    selector: 'az-messages',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./messages.component.scss'],
    templateUrl: './messages.component.html',
    providers: [MessagesService]
})

export class MessagesComponent implements OnInit {     
    public messages:Array<Object>;
    public notifications:Array<Object>;
    public tasks:Array<Object>;
    public tasksCount: any;
    filterFromDate: any;
    filterToDate: any;
    queryFromDate: any;
    queryToDate: any;

    constructor (private globals: Globals, private serviceCall: RestcallService, private _messagesService:MessagesService, private _dateFormatPipe: DateComComponent){

        this.filterFromDate = this._dateFormatPipe.transformDate(new Date());
        this.filterToDate = this._dateFormatPipe.transformDate(new Date());
        console.log('filterFromDate', this.filterFromDate);
        
        this.messages = _messagesService.getMessages();
        this.notifications = _messagesService.getNotifications();
        this.tasks = _messagesService.getTasks();
        this.getAllTasksToRespond();

        this.globals.taskCount.subscribe(data => {
            this.tasksCount = data;
          });    
        
    }

    getAllTasksToRespond() {
        let provincecode = localStorage.getItem('cis_selected_provincecode') == 'null' ? '' : localStorage.getItem('cis_selected_provincecode');
        let sectioncode = localStorage.getItem('cis_selected_sectioncode') == 'null' ? '' : localStorage.getItem('cis_selected_sectioncode');
        let rolecode = localStorage.getItem('cis_selected_rolecode') == 'null' ? '' : localStorage.getItem('cis_selected_rolecode');
        let internalrolecode = localStorage.getItem('cis_selected_internalrolecode') == 'null' ? '' : localStorage.getItem('cis_selected_internalrolecode');
        internalrolecode = internalrolecode == 'INROLE0033' ? '' : internalrolecode;
        this.queryFromDate = this._dateFormatPipe.transform(this.filterFromDate);
        this.queryToDate = this._dateFormatPipe.transform(this.filterToDate);

        console.log('queryFromDate', this.queryFromDate);

        this.getAllTasks('', '', provincecode, sectioncode, internalrolecode, 'Closed');
        // this.getAllTasks('', '', provincecode, sectioncode, '', 'Closed');
    }

    getAllTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus) {
        this.serviceCall.getAllTasks(status, type, provincecode, sectioncode, rolecode, omitTaskStatus, '', this.queryFromDate, this.queryToDate).subscribe((data: any) => {
            const allTasks = data.json();
            this.tasksCount = allTasks.length;
        }, error => {
        });
    }

    ngOnInit() {
       
    }

}