import { configureStore } from "@reduxjs/toolkit";


// Initial state of the URL shortening feature
const initialState = {
    originalUrl: '',
    shortenedUrl: '',
    isLoading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {

        default:
            return state;
    }
};

const store = configureStore({
    reducer: authReducer, // Pass your reducer here
});

export default store;
