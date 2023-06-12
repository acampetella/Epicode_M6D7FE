import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accessKey from "../utilities/accessKey.js";

const initialState = {
  authorsList: [],
  isLoading: false,
  error: "",
  pagination: {
    count: 0,
    currentPage: 1,
    totalPages: 1
  }
};

export const getAuthorsList = createAsyncThunk("authors/getAuthors", async (arr) => {
  try {
    const data = await fetch(
      `${process.env.REACT_APP_SERVER_BASE_URL}/authors?page=${arr[0]}&pageSize=${arr[1]}`, {
        headers: {
          "Auth": accessKey()
        }
      });
    const response = await data.json();
    return response;
  } catch (error) {
    if (error) {
      throw new Error("Errore nella ricezione dei dati");
    }
  }
});

const authorsListSlice = createSlice({
  name: "getAuthorsList",
  initialState,
  reducers: {
    authorsListSetCurrentPage: {
      reducer: (state, action) => {
        state.pagination.currentPage = action.payload;
      },
      prepare: (value) => {
        return { payload: value };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthorsList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuthorsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authorsList = action.payload.authors;
        state.pagination.count = action.payload.count;
        state.pagination.currentPage = action.payload.currentPage;
        state.pagination.totalPages = action.payload.totalPages;
      })
      .addCase(getAuthorsList.rejected, (state) => {
        state.isLoading = false;
        state.error = "Errore nella ricezione dei dati";
      });
  },
});

export const authorsListLoading = (state) => state.authorsListState.isLoading;
export const authorsList = (state) => state.authorsListState.authorsList;
export const authorsListError = (state) => state.authorsListState.error;
export const authorsListPagination = (state) => state.authorsListState.pagination;
export const {authorsListSetCurrentPage} = authorsListSlice.actions;
export default authorsListSlice.reducer;
