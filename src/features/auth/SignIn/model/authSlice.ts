import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Authorized} from "../ui/SignIn";


type InitialState = {
    idInstance: string  ,
    apiTokenInstance:string ,
    isAuthorized: boolean
}
const initialState:InitialState = {
    idInstance: '',
    apiTokenInstance:"",
    isAuthorized: false
}


export const authorizedSlice = createSlice({
    name: 'authorized',
    initialState: initialState,
    reducers: {
        setAuthorized(state, action: PayloadAction<Authorized>) {
            const {idInstance,apiTokenInstance }=action.payload;
           return  {...state, isAuthorized: true, idInstance, apiTokenInstance }
        },

    },
})

export const { setAuthorized } = authorizedSlice.actions
