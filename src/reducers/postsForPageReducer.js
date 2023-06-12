import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postsForPage: "3"
};

const postsForPageSlice = createSlice({
    name: 'PostForPage',
    initialState,
    reducers: {
        postsForPageSetValue: {
            reducer: (state, action) => {
                state.postsForPage = action.payload
            },
            prepare: (value) => {
                return {payload: value}
            }
        }
    }
});

export const postsForPage = (state) => state.postsForPageState.postsForPage;
export const {postsForPageSetValue} = postsForPageSlice.actions;
export default postsForPageSlice.reducer;