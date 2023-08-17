import { Component, OnInit } from '@angular/core';

import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Cat } from '../shared/models/cat.model';
import { BehaviorSubject, Observable, concat, filter, forkJoin, from, map, merge, of, switchMap, tap } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit {

  private _cats$ = new BehaviorSubject<Cat[]>([]);
  readonly cats$ = this._cats$.asObservable();
  private cats: Cat[] = [];

  isLoading = true;
  isEditing = false;

  editCatForm: UntypedFormGroup;
  name = new UntypedFormControl('', Validators.required);
  age = new UntypedFormControl('', Validators.required);
  weight = new UntypedFormControl('', Validators.required);
  _id = new UntypedFormControl('', Validators.required);

  constructor(private catService: CatService,
    private formBuilder: UntypedFormBuilder,
    public toast: ToastComponent) {
    this.editCatForm = this.formBuilder.group({
      _id: this._id,
      name: this.name,
      age: this.age,
      weight: this.weight
    });
  }

  ngOnInit(): void {
    this.catService.getCats().subscribe({
      next: data => {
        this.cats = data;
        this._cats$.next(Object.assign([], this.cats))
      },
      error: error => console.log(error),
      complete: () => this.isLoading = false
    });
  }

  enableEditing(cat: Cat): void {
    this.isEditing = true;
    this.editCatForm.patchValue(cat);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.toast.setMessage('Item editing cancelled.', 'warning');
  }

  editCat(): void {
    const v = this.editCatForm.value;
    this.catService.editCat(v).subscribe({
      next: () => {
        this.isEditing = false;
        this.cats[this.cats.findIndex(x => x._id === v._id)] = v;
        this._cats$.next(Object.assign([], this.cats));
        this.toast.setMessage('Item edited successfully.', 'success');
      },
      error: error => console.log(error)
    });
  }

  deleteCat(cat: Cat): void {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.catService.deleteCat(cat).subscribe({
        next: () => {
          this.cats.forEach((t, i) => {
            if (t._id === cat._id) {
              this.cats.splice(i, 1);
            }
            this._cats$.next(Object.assign([], this.cats));
          });
          this.toast.setMessage('Item deleted successfully.', 'success');
        },
        error: error => console.log(error)
      });
    }
  }

}
