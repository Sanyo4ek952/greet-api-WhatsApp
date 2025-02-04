import React from 'react';
import styles from './ChatWindow.module.scss';
import {Message} from "../Message/Message";
import {MessageInput} from "../ChatInput/MessageInput";
import {useAppSelector} from "../../../../common/utils/storeHook";


export const ChatWindow = () => {
    const {
        chats,
        activeChat,
    } = useAppSelector(state => state.chat);

    const openChat = chats.filter(chat => chat.chatId === activeChat)[0]

    return (
        <div className={styles.chatWindow}>
            <div className={styles.messages}>

                {openChat?.messages?.length == 0 ? "Сообщений нет": openChat?.messages?.map((message) => (
                    <Message key={message.id} text={message.text} sender={message.sender}/>
                ))}
            </div>
            <MessageInput />

        </div>
    );
};