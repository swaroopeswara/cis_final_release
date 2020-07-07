import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { MainService } from '../main.service';
import { AppState } from "../../../../app.state";

@Component({
    selector: 'az-main-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './main-list.component.html'
})
export class MainListComponent implements OnInit {
    public type: string;
    public isAllSelected: boolean;
    public searchText: string;

    constructor(private service: MainService,
        private route: ActivatedRoute,
        public router: Router,
        private state: AppState) {

    }

    ngOnInit() {
    }
}
