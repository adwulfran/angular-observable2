import { createReducer, on } from '@ngrx/store';

import { CatsActions } from './cats.actions';
import { Cat } from '../shared/models/cat.model';

export const initialState: ReadonlyArray<Cat> = [];

export const catsReducer = createReducer(
    initialState,
    on(CatsActions.createCatsList, (_state, { cats }) => cats),

    on(CatsActions.updateCat, (_state, { cat }) => {
        const copy = [..._state];
        copy[copy.findIndex(x => x._id === cat._id)] = cat;
        return copy;
    }),

    on(CatsActions.addCat, (_state, { cat }) => [..._state, cat]),

    on(CatsActions.removeBook, (state, { cat }) => state.filter((el) => el._id !== cat._id)),
);
