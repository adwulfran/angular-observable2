import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Cat } from '../shared/models/cat.model';

@Injectable()
export class CatDataService {
    private _cats$ = new BehaviorSubject<Cat[]>([]);
    readonly cats$ = this._cats$.asObservable();
    private cats: Cat[] = [];

    constructor(private http: HttpClient) { }

    create(cats: Cat[]): void {
        this.cats = cats;
        this._cats$.next(Object.assign([], this.cats))
    }

    update(cat: Cat): void {
        console.log(cat._id)
        this.cats[this.cats.findIndex(x => x._id === cat._id)] = cat;
        this._cats$.next(Object.assign([], this.cats));
    }

    add(cat: Cat): void {
        this.cats.push(cat);
        this._cats$.next(Object.assign([], this.cats));
    }
 

}
