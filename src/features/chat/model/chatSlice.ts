import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReceiveMessageResponse } from '../../../service/baseApi';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
}

interface Chat {
    phoneNumber: string;
    lastMessage: string;
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
            if (!state.chats.some(chat => chat.phoneNumber === phoneNumber)) {
                state.chats.push({ phoneNumber, lastMessage: '' });
            }
        },
        setActiveChat: (state, action: PayloadAction<string>) => {
            state.activeChat = action.payload;
            state.phoneNumber = action.payload;
            state.myMessages = [];
            state.theirMessages = [];
        },
        sendMessage: (state, action: PayloadAction<{ text: string }>) => {
            if (state.activeChat) {
                state.myMessages.push({ id: Date.now(), text: action.payload.text, sender: 'me' });
                const chat = state.chats.find(chat => chat.phoneNumber === state.activeChat);
                if (chat) {
                    chat.lastMessage = action.payload.text;
                }
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
