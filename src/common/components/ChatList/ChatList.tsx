import React from 'react';
import styles from './ChatList.module.scss';

interface Chat {
    chatId: string;
    messages: { id: number; text: string; sender: string }[];
}

interface ChatListProps {
    chats: Chat[];
    activeChat: string | null;
    onSelectChat: (chatId: string) => void;
}

export const ChatList = ({ chats, activeChat, onSelectChat }:ChatListProps) => {
    return (
        <div className={styles.chatList}>
            <h3>Чаты</h3>
            {chats.map((chat, index) => (
                <div
                    key={index}
                    className={`${styles.chatItem} ${activeChat === chat.chatId ? styles.active : ''}`}
                    onClick={() => onSelectChat(chat.chatId)}
                >
                    <div className={styles.phoneNumber}>{chat.chatId}</div>
                    <div className={styles.lastMessage}>{chat.chatId}</div>
                </div>
            ))}
        </div>
    );
};