import { Component, OnInit } from '@angular/core';
import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Cat } from '../shared/models/cat.model';
import { BehaviorSubject, Observable, ReplaySubject, tap } from 'rxjs';
import { QuestionBase } from '../question-base';
import { QuestionService } from '../question.service';
import { Store } from '@ngrx/store';
import { CatsActions } from '../store/cats.actions';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit {

  isLoading = true;
  isEditing = false;
  isAdding = false;

  questions$?: Observable<QuestionBase<any>[]>;
  cats$ = this.store.select('cats');
  $catId = new BehaviorSubject<string | undefined>('');

  constructor(private catService: CatService,
    public toast: ToastComponent,
    public service: QuestionService,
    private store: Store<{ cats: Cat[] }>) { }

  ngOnInit(): void {
    this.catService.getCats().subscribe((cats) => {
      this.store.dispatch(CatsActions.createCatsList({ cats }));
      this.questions$ = this.service.getQuestions({})
      this.isLoading = false;
    }
    );
  }

  enableEditing(cat: Cat): void {
    console.log('yo')
    this.$catId.next(cat._id)
    this.questions$ = this.service.getQuestions(cat);
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.toast.setMessage('Item editing cancelled.', 'warning');
  }


  public editCat(cat: Cat) {
    this.catService.editCat({ ...cat, _id: this.$catId.getValue() }).subscribe({
      next: () => {
        this.store.dispatch(CatsActions.updateCat({ cat: { ...cat, _id: this.$catId.getValue() } }));
        this.isEditing = false;
        this.toast.setMessage('Item edited successfully.', 'success');
      },
      error: error => console.log(error)
    });
  }

  addCat(cat: Cat): void {
    this.catService.addCat(cat).subscribe({
      next: (res) => {
        this.store.dispatch(CatsActions.addCat({ cat: { ...res } }));
        this.toast.setMessage('Item added successfully.', 'success');
      },
      error: error => console.log(error)
    });
  }

  deleteCat(cat: Cat): void {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.catService.deleteCat(cat).subscribe({
        next: () => {
          this.store.dispatch(CatsActions.removeBook({ cat }))
          /*
          this.cats.forEach((t, i) => {
            if (t._id === cat._id) {
              this.cats.splice(i, 1);
            }
            this._cats$.next(Object.assign([], this.cats));
          });
          this.toast.setMessage('Item deleted successfully.', 'success');
        */},
        error: error => console.log(error)
      });
    }
  }

  enableAdding(): void {
    this.isAdding = true;
    this.questions$ = this.service.getQuestions({})
  }

  cancelAdding(): void {
    this.isAdding = false;
  }
}
