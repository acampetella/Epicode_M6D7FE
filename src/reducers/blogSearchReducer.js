import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    term: ''
};

const blogSearchSlice = createSlice({
    name: 'blogSearchSetTerm',
    initialState,
    reducers: {
        blogSearchSetTerm: {
            reducer: (state, action) => {
                state.term = action.payload
            },
            prepare: (text) => {
                return {payload: text}
            }
        }
    }
});

export const blogSearchTerm = (state) => state.blogSearchState.term;
export const {blogSearchSetTerm} = blogSearchSlice.actions;
export default blogSearchSlice.reducer;