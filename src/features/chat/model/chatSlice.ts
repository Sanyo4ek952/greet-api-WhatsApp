import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ReceiveMessageResponse} from "../../../service/baseApi";



type InitialState = {
    myMessage:[{id:number,text:string}]
    theirMessage:ReceiveMessageResponse ,
    phoneNumber: number
    chats: Array<{ phoneNumber: string; lastMessage: string }>
    activeChat: string | null
}
const initialState:InitialState = {
    idInstance: "",
    apiTokenInstance:"",
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
