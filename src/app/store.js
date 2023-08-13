import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "../features/book/bookSlice.js";

export const store = configureStore({
    reducer: {
        books: bookReducer,
    },
});