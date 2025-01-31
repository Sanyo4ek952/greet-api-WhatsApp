import { configureStore } from '@reduxjs/toolkit'
import {authorizedSlice} from "../features/auth/SignIn/model/authSlice";
import {baseApi} from "./baseApi";
import {chatSlice} from "../features/chat/model/chatSlice";

export const store = configureStore({
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        authorized: authorizedSlice.reducer,
        chat: chatSlice.reducer,
    },
})



export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch