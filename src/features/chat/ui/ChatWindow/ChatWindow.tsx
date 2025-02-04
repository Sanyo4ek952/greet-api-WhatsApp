import React from 'react';
import styles from './ChatWindow.module.scss';
import {Message} from "../Message/Message";
import {MessageInput} from "../ChatInput/MessageInput";

type ChatWindowProps = {
    messages: { id: number; text: string; sender: string }[];
}

export const ChatWindow = (
    {
        messages,
    }: ChatWindowProps) => {
    return (
        <div className={styles.chatWindow}>
            <div className={styles.messages}>
                {messages?.map((message) => (
                    <Message key={message.id} text={message.text} sender={message.sender}/>
                ))}
            </div>
            <MessageInput />

        </div>
    );
};