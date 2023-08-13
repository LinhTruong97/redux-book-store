import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import api from "../../app/apiService";

const initialState = {
    books: [],
    readingList: [],
    bookDetail: null,
    status: 'idle'
};



export const getBookDetail = createAsyncThunk(
    'book/getBookDetail',
    async (bookId) => {
        const response = await apiService.get(`/books/${bookId}`);
        return response.data
    }
);

export const addingBook = createAsyncThunk(
    'book/addingBook',
    async (book) => {
        const response = await apiService.post(`/favorites`, book);
        return response.data
    }
);

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async (options) => {
        const { pageNum, limit, query } = options;
        let url = `/books?_page=${pageNum}&_limit=${limit}`;
        if (query) url += `&q=${query}`;
        const response = await api.get(url);
        return response.data;
    });

export const getReadingList = createAsyncThunk(
    'book/getReadingList',
    async () => {
        const response = await apiService.get(`/favorites`);
        return response.data
    }
);

export const removeBook = createAsyncThunk(
    'book/removeBook',
    async (removedBookId) => {
        const response = await apiService.delete(`/favorites/${removedBookId}`);
        return response.data
    }
);



export const bookSlice = createSlice({
    name: "book",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getBookDetail.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getBookDetail.fulfilled, (state, action) => {
                state.status = "idle";
                state.bookDetail = action.payload;
            })
            .addCase(getBookDetail.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                toast.error(action.error.message);
            });

        builder
            .addCase(addingBook.pending, (state) => {
                state.status = "loading"
            })
            .addCase(addingBook.fulfilled, (state) => {
                state.status = "idle";
                toast.success("The book has been added to the reading list!");
            })
            .addCase(addingBook.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                toast.error(action.error.message);
            });

        builder
            .addCase(fetchBooks.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = "idle";
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                toast.error(action.error.message);
            });

        builder
            .addCase(getReadingList.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getReadingList.fulfilled, (state, action) => {
                state.status = "idle";
                state.readingList = action.payload;
            })
            .addCase(getReadingList.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                toast.error(action.error.message);
            });

        builder
            .addCase(removeBook.pending, (state) => {
                state.status = "loading"
            })
            .addCase(removeBook.fulfilled, (state) => {
                state.status = "idle";
                toast.success("The book has been removed");
            })
            .addCase(removeBook.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                toast.error(action.error.message);
            });
    }



})
export default bookSlice.reducer;