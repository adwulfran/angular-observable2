import { createActionGroup, props } from '@ngrx/store';
import { Cat } from '../shared/models/cat.model';
export const CatsActions = createActionGroup({
  source: 'Books',
  events: {
    'Create Cats List': props<{ cats: ReadonlyArray<Cat> }>(),
    'Update Cat': props<{ cat: Cat }>(),
    'Remove Book': props<{ cat: Cat }>(),
    'Add Cat': props<{cat: Cat }>(),
  },
});
