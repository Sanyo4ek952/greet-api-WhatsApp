import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ReceiveMessageResponse} from '../../../service/baseApi';

export type Message = {
    id: number;
    text: string;
    sender: 'me' | 'them';
}

export type ChatType = {
    chatId: string;
    messages: Message[]
}

export type ReceiveMessageResponse1 = {
    chatId: string;
    messages: Message
}

type InitialState = {
    myMessages: Message[];
    theirMessages: ReceiveMessageResponse[];
    phoneNumber: string;
    chats: ChatType[];
    activeChat: string | null;
};

const initialState: InitialState = {
    myMessages: [],
    theirMessages: [],
    phoneNumber: '',
    chats: [],
    activeChat: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setPhoneNumber: (state, action: PayloadAction<string>) => {
            state.phoneNumber = action.payload;
        },
        addChat: (state, action: PayloadAction<string>) => {
            const phoneNumber = action.payload;
            const chatExists = state.chats.find((chat: ChatType) => chat.chatId === phoneNumber);
            if(chatExists){
                return
            }else{

                state.chats.unshift({chatId: phoneNumber, messages: []});
            }


        },
        setActiveChat: (state, action: PayloadAction<string>) => {
            state.activeChat = action.payload;
            state.phoneNumber = action.payload;
            state.myMessages = [];
            state.theirMessages = [];
        },
        sendMessage: (state, action: PayloadAction<{ text: string, phoneNumber: string }>) => {
            const {text, phoneNumber} = action.payload;
            const message: Message = {text, id: Date.now(), sender: 'me'};

            const chatExists = state.chats.find((chat: ChatType) => chat.chatId === phoneNumber);

            if (chatExists) {

                state.chats = state.chats.map((chat: ChatType) => {
                    if (chat.chatId === phoneNumber) {
                        return {...chat, messages: [...chat.messages, message]};
                    } else {
                        return chat;
                    }
                });
            } else {

                const newChat: ChatType = {
                    chatId: phoneNumber,
                    messages: [message],
                };
                state.chats.push(newChat);
            }
        },
        receiveMessage: (state, action: PayloadAction<ReceiveMessageResponse1>) => {
            const chatExists = state.chats.find((chat: ChatType) => chat.chatId === action.payload.chatId);
            if (chatExists) {

                state.chats = state.chats.map((chat: ChatType) => {
                    if (chat.chatId === action.payload.chatId) {
                        return {...chat, messages: [...chat.messages, action.payload.messages]};
                    } else {
                        return chat;
                    }
                });
            } else {

                const newChat: ChatType = {
                    chatId: action.payload.chatId,
                    messages: [action.payload.messages],
                }
                state.chats.push(newChat);
            }

        },

    }
});

export const {setPhoneNumber, addChat, setActiveChat, receiveMessage, sendMessage} = chatSlice.actions;
