import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReceiveMessageResponse } from '../../../service/baseApi';

type Message ={
    id: number;
    text: string;
    sender: 'me' | 'them';
}

type Chat ={
    chatId: string;
    messages:Message[]
}

type InitialState = {
    myMessages: Message[];
    theirMessages: ReceiveMessageResponse[];
    phoneNumber: string;
    chats: Chat[];
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
                state.chats.unshift({ chatId:phoneNumber, messages: [] });

        },
        setActiveChat: (state, action: PayloadAction<string>) => {
            state.activeChat = action.payload;
            state.phoneNumber = action.payload;
            state.myMessages = [];
            state.theirMessages = [];
        },
        sendMessage: (state, action: PayloadAction<{ text: string, phoneNumber: string }>) => {
            const { text, phoneNumber } = action.payload;
            const message: Message = { text, id: Date.now(), sender: 'me' };

            const chatExists = state.chats.find((chat: Chat) => chat.chatId === phoneNumber);

            if (chatExists) {

                state.chats = state.chats.map((chat: Chat) => {
                    if (chat.chatId === phoneNumber) {
                        return { ...chat, messages: [...chat.messages, message] };
                    } else {
                        return chat;
                    }
                });
            } else {

                const newChat: Chat = {
                    chatId: phoneNumber,
                    messages: [message],
                };
                state.chats.push(newChat);
            }
        },
        receiveMessage: (state, action: PayloadAction<ReceiveMessageResponse>) => {
            console.log(action.payload)
       state.theirMessages.push(action.payload);
        },

        deleteMessage: (state, action: PayloadAction<number>) => {
            state.myMessages = state.myMessages.filter(msg => msg.id !== action.payload);
        }
    }
});

export const { setPhoneNumber, addChat, setActiveChat,receiveMessage, sendMessage, deleteMessage } = chatSlice.actions;
export default chatSlice.reducer;
