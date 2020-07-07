import { Observable } from 'rxjs/Observable';
// globals.ts
import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs';

@Injectable()
export class Globals {
    // role: string = 'test';
    public menuItems = new BehaviorSubject<Array<any>>(null);
    public taskCount = new BehaviorSubject<any>(null);
    public dashboardJson = new BehaviorSubject<any>(null);

    public setMenu(tMenuItems) {
        this.menuItems.next(tMenuItems);
    }

    public setTaskCount(count) {
        this.taskCount.next(count);
    }

    public setDashboard(rights) {
        this.dashboardJson.next(rights);
    }
  }