import { GridRowsProp, GridColDef } from '@material-ui/data-grid';
import { createReducer, createAction, combineReducers } from '@reduxjs/toolkit'

const initialState = {
    rows: [] as GridRowsProp,
    columns: [] as GridColDef[],
}

export const SET_COLUMNS = createAction<GridColDef[]>('setColumns')
export const SET_ROWS = createAction<GridRowsProp>('setRows')

const reducer = createReducer(initialState, {
    [SET_COLUMNS.type]: (state, action) => {
        const { payload } = action
        state.columns.splice(0, state.columns.length)
        state.columns = payload
    },
    [SET_ROWS.type]: (state, action) => {
        const { payload } = action
        state.rows = payload
    }
})
export const rootReducer = combineReducers({
    reducer: reducer
})
export type RootState = ReturnType<typeof rootReducer>;

export default reducer;