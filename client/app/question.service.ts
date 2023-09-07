import { Injectable } from '@angular/core';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { of } from 'rxjs';
import { Cat } from './shared/models/cat.model';

@Injectable()
export class QuestionService {

  // TODO: get from a remote source of question metadata
  getQuestions(cat:Cat) {

    const questions: QuestionBase<string>[] = [
  

      new TextboxQuestion({
        key: 'name',
        label: 'Name',
        value: cat.name,
        order: 2
      }),

      new TextboxQuestion({
        key: 'age',
        label: 'Age',
        value: cat.age?.toString(),
        order: 3
      }),

      new TextboxQuestion({
        key: 'weight',
        label: 'Weight',
        value: cat.weight?.toString(),
        order: 4
      })
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/