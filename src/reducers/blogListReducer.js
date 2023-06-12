import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import accessKey from "../utilities/accessKey.js";

const initialState = {
  postsList: [],
  isLoading: false,
  error: "",
  pagination: {
    count: 0,
    currentPage: 1,
    totalPages: 1
  },
};

export const getPostsList = createAsyncThunk("posts/getPosts", async (arr) => {
  try {
    const data = await fetch(
      `${process.env.REACT_APP_SERVER_BASE_URL}/blogPosts?page=${arr[0]}&pageSize=${arr[1]}&title=${arr[2]}`, {
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

const blogListSlice = createSlice({
  name: "getBlogList",
  initialState,
  reducers: {
    blogListSetCurrentPage: {
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
      .addCase(getPostsList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postsList = action.payload.posts;
        state.pagination.count = action.payload.count;
        state.pagination.currentPage = action.payload.currentPage;
        state.pagination.totalPages = action.payload.totalPages;
      })
      .addCase(getPostsList.rejected, (state) => {
        state.isLoading = false;
        state.error = "Errore nella ricezione dei dati";
      });
  },
});

export const blogListLoading = (state) => state.blogListState.isLoading;
export const postsList = (state) => state.blogListState.postsList;
export const blogListError = (state) => state.blogListState.error;
export const blogListPagination = (state) => state.blogListState.pagination;
export const {blogListSetCurrentPage} = blogListSlice.actions;
export default blogListSlice.reducer;
