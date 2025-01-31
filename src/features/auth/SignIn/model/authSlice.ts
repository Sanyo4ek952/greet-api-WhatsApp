import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Authorized} from "../ui/SignIn";


type InitialState = {
    idInstance: string |null,
    apiTokenInstance:string |null,
    isAuthorized: boolean
}
const initialState:InitialState = {
    idInstance: null,
    apiTokenInstance:null,
    isAuthorized: false
}


export const authorizedSlice = createSlice({
    name: 'todos',
    initialState: initialState,
    reducers: {
        setAuthorized(state, action: PayloadAction<Authorized>) {
            const {idInstance,apiTokenInstance }=action.payload;
           return  {...state, isAuthorized: true, idInstance, apiTokenInstance }
        },

    },
})

export const { setAuthorized } = authorizedSlice.actions
