import React from 'react';
import styles from './Message.module.scss';

interface MessageProps {
    text: string;
    sender: string;
}

export const Message: React.FC<MessageProps> = ({ text, sender }) => {
    return (
        <div className={sender === 'me' ? styles.myMessage : styles.theirMessage}>
            {text}
        </div>
    );
};